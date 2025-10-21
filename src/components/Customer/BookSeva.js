"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import CustomerLayout from "../../components/Customer/CustomerLayout";
import { useCustomerAuth } from "../../contexts/CustomerAuthContext";
import { getTempleServicesList } from "../../services/templeServices";
import {
  extractDisabledDatesFromBookings,
  getServiceBookings,
  processBooking,
} from "../../services/customerServices";
import { toast } from "react-toastify";
import SevaCategories from "./SevaCategories";
import ServiceList from "./ServiceList";
import AvailabilityCalendarModal from "./CustomerModal/AvailabilityCalendarModal";
import VariationModal from "./CustomerModal/VariationModal";

const HeaderSection = styled(motion.div)`
  background: linear-gradient(145deg, rgb(212, 175, 55), rgb(196, 69, 54));
  border-radius: 1.5rem;
  padding: 2rem;
  color: white;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 200px;
    height: 200px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    transform: translate(50%, -50%);
  }

  .header-content {
    position: relative;
    z-index: 1;
  }

  .back-button {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.75rem;
    cursor: pointer;
    font-weight: 600;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
    }
  }

  .title {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
  }

  .temple-name {
    font-size: 1.3rem;
    opacity: 0.9;
    font-weight: 500;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;

    .title {
      font-size: 2rem;
    }

    .temple-name {
      font-size: 1.1rem;
    }
  }
`;

const StepCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1.25rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
`;

const BackLink = styled.button`
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  color: #374151;
  padding: 0.55rem 0.9rem;
  border-radius: 0.6rem;
  font-weight: 700;
  cursor: pointer;
  margin-bottom: 0.75rem;
`;

const categories = [
  { code: "HALL", label: "Hall Booking" },
  { code: "PUJA", label: "Puja Booking in Temple" },
  { code: "EVENT", label: "Temple Events" },
  { code: "ACCOMMODATION", label: "Accommodation" },
  { code: "EXT_PUJA", label: "Puja Booking @Home/External Place" },
];

// Helper to test if a service belongs to a category by its type string
function serviceMatchesCategory(service, code) {
  const t = String(
    service.service_type_str || service.service_type || ""
  ).toUpperCase();
  switch (code) {
    case "HALL":
      return t.includes("HALL");
    case "PUJA":
      return t.includes("PUJA") || t.includes("POOJA");
    case "EVENT":
      return t.includes("EVENT");
    case "ACCOMMODATION":
      return (
        t.includes("ACCOMMODATION") || t.includes("ROOM") || t.includes("STAY")
      );
    case "EXT_PUJA":
      return t.includes("EXT") || t.includes("HOME") || t.includes("EXTERNAL");
    default:
      return false;
  }
}

// Convert YYYY-MM-DD to DD-MMM-YYYY for API, e.g., 2025-08-28 -> 28-AUG-2025
export function toAPIDate(dateKey) {
  const [y, m, d] = dateKey.split("-").map((v) => Number.parseInt(v, 10));
  const dt = new Date(y, m - 1, d);
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  const day = String(dt.getDate()).padStart(2, "0");
  return `${day}-${months[dt.getMonth()]}-${dt.getFullYear()}`;
}

export default function BookSeva() {
  const { templeId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { customerData } = useCustomerAuth();

  const temple = location.state?.temple;
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Step state
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [chosenService, setChosenService] = useState(null);
  const [chosenVariation, setChosenVariation] = useState(null);
  console.log(chosenVariation, "chosenService");
  // Modals
  const [variationOpen, setVariationOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [disabledDateKeys, setDisabledDateKeys] = useState(new Set());

  useEffect(() => {
    if (templeId) loadServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templeId]);

  const loadServices = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getTempleServicesList(templeId);
      const filteredServices = response.filter(
        (service) => !templeId || service.temple_id === templeId
      );
      setAllServices(filteredServices || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load services.");
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = useMemo(() => {
    if (!selectedCategory) return [];
    return (allServices || []).filter((svc) =>
      serviceMatchesCategory(svc, selectedCategory)
    );
  }, [allServices, selectedCategory]);

  const handleBack = () => navigate("/customer-temples");

  const onSelectCategory = (code) => {
    setSelectedCategory(code);
    setChosenService(null);
    setChosenVariation(null);
  };

  const onBookService = async (service) => {
    setChosenService(service);
    const variations = service?.service_variation_list || [];
    if (variations.length > 0) {
      setVariationOpen(true);
    } else {
      setChosenVariation(null);
      await loadDisabledDates(service.service_id);
      setCalendarOpen(true);
    }
  };

  const onSelectVariation = async (variationOrNull) => {
    setVariationOpen(false);
    setChosenVariation(variationOrNull || null);
    if (!chosenService) return;
    await loadDisabledDates(chosenService.service_id, variationOrNull);
    setCalendarOpen(true);
  };

  const loadDisabledDates = async (serviceId, variationOrNull) => {
    const starttime = variationOrNull?.start_time;
    const endtime = variationOrNull?.end_time;
    try {
      const bookings = await getServiceBookings(1, "user");
      const filteredServices = bookings.filter(
        (service) =>
          !serviceId || service?.service_data?.service_id === serviceId
      );
      setDisabledDateKeys(
        extractDisabledDatesFromBookings(
          selectedCategory !== "HALL" ? [] : filteredServices,
          starttime,
          endtime
        )
      );
    } catch (e) {
      console.warn(
        "Could not fetch booked dates, proceeding without disabled dates."
      );
      setDisabledDateKeys(new Set());
    }
  };

  const onConfirmDate = async (dateKey) => {
    if (!chosenService) return;
    setCalendarOpen(false);
    try {
      const booking = {
        booking_data: {
          cust_ref_code: customerData.custRefCode,
          call_mode: "ADD_BOOKING",
          service_id: chosenService.service_id,
          // IMPORTANT: include service_variation_id for API
          service_variation_id:
            chosenVariation?.id || chosenVariation?.variation_id || null,
          booking_date: toAPIDate(dateKey),
          end_date: toAPIDate(dateKey),
          start_time: chosenVariation?.start_time || "",
          end_time: chosenVariation?.end_time || "",
          notes: "",
          quantity: chosenVariation?.max_participant || 1,
          duration: Number.parseInt(
            chosenService.duration_minutes || chosenService.duration || 60,
            10
          ),
          unit_price: Number.parseFloat(
            (parseFloat(chosenVariation?.base_price) || 0) +
              (parseFloat(chosenVariation?.pricing_rule_data?.week_day_price) ||
                0) +
              (parseFloat(chosenVariation?.pricing_rule_data?.time_price) ||
                0) +
              (parseFloat(chosenVariation?.pricing_rule_data?.date_price) || 0)
          ),
        },
      };

      await processBooking(booking);

      navigate("/customer-bookings", {
        state: {
          message: "🎉 Booking confirmed successfully!",
          booking: booking.booking_data,
        },
      });
    } catch (err) {
      toast.error(
        err?.message || "Failed to confirm booking. Please try again."
      );
    }
  };

  return (
    <CustomerLayout>
      <BackLink onClick={handleBack}>← Back to Temples</BackLink>

      <HeaderSection
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="title">
          Book Seva {temple?.name ? `— ${temple.name}` : ""}
        </div>
        <div className="sub">Follow the steps to complete your booking</div>
      </HeaderSection>

      {error && (
        <div
          style={{
            background: "linear-gradient(135deg, #fee2e2, #fecaca)",
            color: "#dc2626",
            padding: "0.9rem 1rem",
            borderRadius: "0.75rem",
            border: "1px solid #fca5a5",
            marginBottom: "1rem",
            fontWeight: 700,
          }}
        >
          {error}
        </div>
      )}

      <StepCard>
        {!selectedCategory ? (
          <SevaCategories
            allServices={allServices}
            categories={categories}
            onSelect={onSelectCategory}
          />
        ) : (
          <div style={{ display: "grid", gap: "1rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ fontWeight: 800, color: "#111827" }}>
                Services —{" "}
                {categories.find((c) => c.code === selectedCategory)?.label}
              </div>
              <button
                onClick={() => setSelectedCategory(null)}
                style={{
                  background: "#f3f4f6",
                  border: "1px solid #e5e7eb",
                  color: "#374151",
                  padding: "0.5rem 0.8rem",
                  borderRadius: "0.6rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Change Category
              </button>
            </div>

            {loading ? (
              <div
                style={{
                  textAlign: "center",
                  color: "#6b7280",
                  padding: "2rem",
                }}
              >
                Loading services...
              </div>
            ) : (
              <ServiceList services={filteredServices} onBook={onBookService} />
            )}
          </div>
        )}
      </StepCard>
      <VariationModal
        open={variationOpen}
        service={chosenService}
        onClose={() => setVariationOpen(false)}
        onSelect={onSelectVariation}
      />

      <AvailabilityCalendarModal
        open={calendarOpen}
        disabledDateKeys={disabledDateKeys}
        onClose={() => setCalendarOpen(false)}
        onConfirm={onConfirmDate}
      />
    </CustomerLayout>
  );
}
