"use client";

import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import { IndianRupee } from "lucide-react";
import { toAPIDate } from "../../../services/serviceUtils";
import { useEffect, useState } from "react";
import { getAdminBookingList } from "../../../services/templeServices";

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: grid;
  place-items: center;
  z-index: 1000;
  padding: 1rem;
`;

const Modal = styled(motion.div)`
  background: white;
  width: min(750px, 100%);
  max-height: 85vh;
  border-radius: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  overflow: hidden;
  position: relative;
  overflow-y: scroll;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea, #764ba2, #f093fb, #f5576c);
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e5e7eb;
  font-weight: 800;
  color: #111827;
`;

const Body = styled.div`
  padding: 1rem 1.25rem;
  display: grid;
  gap: 0.75rem;
`;

const VariationCard = styled(motion.button)`
  text-align: left;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 0.9rem;
  background: #fafafa;
  cursor: pointer;
  display: grid;
  gap: 0.15rem;

  .title {
    font-weight: 700;
    color: #111827;
  }
  .meta {
    color: #6b7280;
    font-size: 0.9rem;
  }
  .price {
    color: #059669;
    font-weight: 800;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }
`;

const Footer = styled.div`
  padding: 1rem 1.25rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

const CloseButton = styled.button`
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  color: #374151;
  padding: 0.6rem 0.9rem;
  border-radius: 0.6rem;
  font-weight: 700;
  cursor: pointer;
`;

export default function VariationModal({
  open,
  service,
  onClose,
  onSelect,
  selectateddate,
}) {
  console.log(service, "service");
  const variations = service?.service_variation_list || [];
  const serviceId = service?.service_id || 1;
  const capacity = service?.capacity || "";
  const service_type = service?.service_type || "";
  const [bookingList, setBookingList] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchBookingData = async () => {
      if (open && selectateddate) {
        setLoading(true);
        try {
          const bookings = await getAdminBookingList({
            booking_date: toAPIDate(selectateddate || ""),
          });
          // Filter only bookings with status "B"
          const confirmedBookings =
            bookings?.filter((booking) => booking.status === "B") || [];
          setBookingList(confirmedBookings);
        } catch (error) {
          console.error("Error fetching booking data:", error);
          setBookingList([]);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBookingData();
  }, [open, selectateddate]);
  function timeToMinutes(timeStr) {
    if (!timeStr) return null;
    const [h, m, s] = timeStr.split(":").map((n) => parseInt(n, 10));
    return h * 60 + m + (s ? s / 60 : 0);
  }

  // Check if a variation is already booked
  const isVariationBooked = (variation) => {
    if (service_type == "EVENT") {
      const sameVariationBookings = bookingList.filter(
        (booking) => booking?.service_data?.service_id === serviceId
      );
      // Calculate total quantity already booked
      const totalBookedQty = sameVariationBookings.reduce(
        (sum, booking) => sum + (booking.quantity || 0),
        0
      );
      // Compare with event capacity
      const eventCapacity = capacity;
      return totalBookedQty + variation.max_participant >= eventCapacity;
    } else {
      if (!bookingList.length) return false;
      return bookingList.some((booking) => {
        const isSameVariation =
          booking.service_variation_data?.id === variation.id;

        const bookingStart = timeToMinutes(booking.start_time);
        const bookingEnd = timeToMinutes(booking.end_time);
        const variationStart = timeToMinutes(variation.start_time);
        const variationEnd = timeToMinutes(variation.end_time);
        // Check for overlap in time ranges
        const isOverlapping =
          bookingStart <= variationEnd && bookingEnd >= variationStart;

        // Return true if same variation OR overlapping time slot
        return isSameVariation || isOverlapping;
      });
    }
  };

  // Check if variation is at max capacity for the day
  const getBookedCountForVariation = (variation) => {
    if (!bookingList.length) return 0;

    return bookingList.filter((booking) => {
      const isSameService = booking.service === service.service_id;
      const isSameVariation =
        booking.service_variation_data?.id === variation.id;
      const bookingStart = booking.start_time;
      const bookingEnd = booking.end_time;
      const variationStart = variation.start_time;
      const variationEnd = variation.end_time;

      return (
        isSameService &&
        isSameVariation &&
        bookingStart === variationStart &&
        bookingEnd === variationEnd
      );
    }).length;
  };

  const isVariationAtMaxCapacity = (variation) => {
    const bookedCount = getBookedCountForVariation(variation);
    return variation.max_no_per_day && bookedCount >= variation.max_no_per_day;
  };

  return (
    <AnimatePresence>
      {open && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <Modal
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Header>
              <div>Select a Variation</div>
              <button
                aria-label="Close"
                onClick={onClose}
                style={{
                  background: "transparent",
                  border: 0,
                  cursor: "pointer",
                  color: "#6b7280",
                  fontSize: "1.25rem",
                }}
              >
                <FiX />
              </button>
            </Header>
            <Body>
              {loading ? (
                <div
                  style={{
                    padding: "2rem",
                    textAlign: "center",
                    color: "#6b7280",
                  }}
                >
                  Checking availability...
                </div>
              ) : variations.length === 0 ? (
                <div
                  style={{
                    padding: "1rem",
                    background: "#f9fafb",
                    border: "1px dashed #e5e7eb",
                    borderRadius: "0.75rem",
                    color: "#6b7280",
                  }}
                >
                  No variations available. Continue with base price.
                </div>
              ) : (
                variations.map((v, idx) => {
                  const isBooked = isVariationBooked(v);
                  const isAtMaxCapacity = isVariationAtMaxCapacity(v);
                  const bookedCount = getBookedCountForVariation(v);
                  const isDisabled = isBooked;

                  return (
                    <VariationCard
                      key={idx}
                      whileHover={!isDisabled ? { scale: 1.01 } : {}}
                      whileTap={!isDisabled ? { scale: 0.98 } : {}}
                      onClick={() => !isDisabled && onSelect(v)}
                      style={{
                        opacity: isDisabled ? 0.6 : 1,
                        cursor: isDisabled ? "not-allowed" : "pointer",
                        background: isDisabled ? "#f3f4f6" : "white",
                        position: "relative",
                      }}
                    >
                      {isDisabled && (
                        <div
                          style={{
                            position: "absolute",
                            top: "8px",
                            right: "8px",
                            background: "#ef4444",
                            color: "white",
                            padding: "2px 8px",
                            borderRadius: "4px",
                            fontSize: "0.75rem",
                            fontWeight: "bold",
                          }}
                        >
                          {isBooked ? "BOOKED" : "FULL"}
                        </div>
                      )}

                      <div className="title">
                        {v.pricing_type_str || "Variation"}
                        {isDisabled && (
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: "#ef4444",
                              marginTop: "4px",
                            }}
                          >
                            {isBooked
                              ? "This slot is already booked"
                              : `Fully booked (${bookedCount}/${v.max_no_per_day})`}
                          </div>
                        )}
                      </div>
                      <div className="meta">
                        {v.start_time} - {v.end_time}
                        {!isDisabled && v.max_no_per_day && (
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: "#6b7280",
                              marginTop: "2px",
                            }}
                          >
                            Available: {v.max_no_per_day - bookedCount}/
                            {v.max_no_per_day}
                          </div>
                        )}
                      </div>
                      <div className="price">
                        <IndianRupee size={14} />{" "}
                        {(
                          (parseFloat(v.base_price) || 0) +
                          (parseFloat(v.pricing_rule_data?.week_day_price) ||
                            0) +
                          (parseFloat(v.pricing_rule_data?.time_price) || 0) +
                          (parseFloat(v.pricing_rule_data?.date_price) || 0)
                        ).toLocaleString()}
                      </div>
                    </VariationCard>
                  );
                })
              )}
            </Body>
            <Footer>
              <CloseButton onClick={onClose}>Close</CloseButton>
              {variations.length === 0 && (
                <CloseButton onClick={() => onSelect(null)}>
                  Continue
                </CloseButton>
              )}
            </Footer>
          </Modal>
        </Overlay>
      )}
    </AnimatePresence>
  );
}
