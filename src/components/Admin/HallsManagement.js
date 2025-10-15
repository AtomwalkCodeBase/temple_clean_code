import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import HallForm from "../../components/Admin/HallForm";
import HallsOverview from "../../components/Admin/HallsOverview";
import AddonsNotification from "../../components/Admin/AddonsNotification";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getTempleServicesList,
  getAdminBookingList,
} from "../../services/templeServices";
import { getCurrentTempleId } from "../../services/serviceUtils";
import {
  Calendar,
  TrendingUp,
  Search,
  X,
  Edit,
  Trash2,
  ChevronDown,
} from "lucide-react";

// Styled Components
const PageContainer = styled.div`
  background: #f8fafc;
  min-height: 100vh;
  padding: 8px 16px 16px;
`;
const Container = styled.div`
  max-width: 1920px;
  margin: 0 auto;
`;

const Tabs = styled.div`
  display: flex;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  margin: 0 0 20px 0;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  max-width: 360px;
`;

const Tab = styled.button`
  flex: 1;
  padding: 12px 18px;
  background: ${(props) => (props.$active ? "#0056d6" : "transparent")};
  color: ${(props) => (props.$active ? "#ffffff" : "#64748b")};
  border: none;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  position: relative;

  &:hover {
    background: ${(props) => (props.$active ? "#0056d6" : "#f8fafc")};
    color: ${(props) => (props.$active ? "#ffffff" : "#374151")};
  }
  &:first-child {
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }
  &:last-child {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }
`;

const ContentCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 16px;
  }
  .card-title {
    color: #0f172a;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.025em;
  }
`;

const Toolbar = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchInput = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;

  @media (max-width: 768px) {
    max-width: 100%;
  }

  input {
    padding: 12px 16px 12px 44px;
    border: 1px solid #d1d5db;
    border-radius: 10px;
    font-size: 14px;
    width: 100%;
    background: #f9fafb;
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      background: #ffffff;
    }
  }

  svg {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  margin-top: 16px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 1000px;

  th {
    text-align: left;
    padding: 16px 12px;
    background: #f8fafc;
    color: #64748b;
    font-weight: 600;
    font-size: 12px;
    border-bottom: 1px solid #e2e8f0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    white-space: nowrap;
  }

  td {
    padding: 16px 12px;
    border-bottom: 1px solid #e2e8f0;
    color: #374151;
    font-size: 14px;
    vertical-align: middle;
  }
  tr:last-child td {
    border-bottom: none;
  }
  tr:hover {
    background: #f8fafc;
  }
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f8fafc;
    color: #374151;
    border-color: #d1d5db;
  }
  &.delete:hover {
    background: #fee2e2;
    color: #dc2626;
    border-color: #fecaca;
  }
`;

const SortSelect = styled.div`
  position: relative;

  select {
    padding: 10px 36px 10px 12px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    background: #ffffff;
    color: #374151;
    font-size: 14px;
    cursor: pointer;
    appearance: none;
    min-width: 180px;

    &:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
  }

  svg {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #6b7280;
    pointer-events: none;
  }
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;

  ${(props) => {
    switch (props.$status) {
      case "BOOKED":
        return `background: #dcfce7; color: #16a34a; border: 1px solid #bbf7d0;`;
      case "CANCELLED":
        return `background: #fee2e2; color: #dc2626; border: 1px solid #fecaca;`;
      default:
        return `background: #fffbeb; color: #b45309; border: 1px solid #fde68a;`;
    }
  }}
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #6b7280;
  text-align: center;

  svg {
    margin-bottom: 16px;
    color: #d1d5db;
  }
  h3 {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 8px 0;
    color: #374151;
  }
  p {
    margin: 0;
    font-size: 14px;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
`;

const ModalContent = styled.div`
  background: transparent;
  border-radius: 14px;
  box-shadow: none;
  overflow: visible;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  z-index: 10;
  color: #6b7280;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: #374151;
  }
`;

const DeleteConfirmationModal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  padding: 20px;
`;

const DeleteConfirmationContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);

  h3 {
    margin: 0 0 16px 0;
    color: #374151;
    font-size: 18px;
    font-weight: 600;
  }
  p {
    margin: 0 0 24px 0;
    color: #6b7280;
    line-height: 1.5;
  }

  .actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;

    button {
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;

      &.cancel {
        background: #f3f4f6;
        color: #374151;
        border: 1px solid #e5e7eb;
        &:hover {
          background: #e5e7eb;
        }
      }

      &.confirm {
        background: #dc2626;
        color: white;
        border: none;
        &:hover {
          background: #b91c1c;
        }
      }
    }
  }
`;

// Main Component
const HallsManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showHallWizard, setShowHallWizard] = useState(false);
  const [showPujaWizard, setShowPujaWizard] = useState(false);
  const [editService, setEditService] = useState(null);
  const [hallServices, setHallServices] = useState([]);
  const [hallServicesLoading, setHallServicesLoading] = useState(false);
  const [newHallServiceId, setNewHallServiceId] = useState(null);
  const [showAddonsNotification, setShowAddonsNotification] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [ordering, setOrdering] = useState("-booking_date");
  const [serviceFilter, setServiceFilter] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const templeId = getCurrentTempleId() || null;

  // Determine which service type to manage based on query param; default to HALL
  const queryParams = new URLSearchParams(location.search);
  const serviceType = (queryParams.get("service") || "HALL").toUpperCase();

  useEffect(() => {
    // Check for new hall creation and tab changes
    const params = new URLSearchParams(location.search);
    const newHallId = params.get("new_hall");
    const tabParam = params.get("tab");

    if (newHallId) {
      setNewHallServiceId(newHallId);
      setShowAddonsNotification(true);
      params.delete("new_hall");
      navigate({ pathname: location.pathname, search: params.toString() });
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
    }

    if (
      tabParam &&
      ["overview", "bookings", "halls", "customers"].includes(tabParam)
    ) {
      setActiveTab(tabParam);
      if (tabParam === "overview")
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.search, navigate, location.pathname]);

  // Scroll to top whenever notification is shown
  useEffect(() => {
    if (showAddonsNotification) {
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 200);
    }
  }, [showAddonsNotification]);

  // Fetch services from API and keep only selected service_type
  const fetchHallServices = async () => {
    setHallServicesLoading(true);
    try {
      const resp = await getTempleServicesList();
      const list = Array.isArray(resp)
        ? resp
        : Array.isArray(resp?.data)
        ? resp.data
        : Array.isArray(resp?.results)
        ? resp.results
        : Array.isArray(resp?.services)
        ? resp.services
        : [];
      const expected = String(serviceType || "").toUpperCase();
      const typeMatches = (svc) => {
        const raw = (svc?.service_type || "").toString().toUpperCase();
        if (raw === "PUJA" || raw === "HALL" || raw === "EVENT")
          return raw === expected;
        const str = (svc?.service_type_str || "").toString().toUpperCase();
        if (expected === "PUJA") return str.includes("PUJA");
        if (expected === "EVENT") return str.includes("EVENT");
        return str.includes("HALL");
      };
      const hallsOnly = list
        .filter(typeMatches)
        .filter(
          (service) =>
            !templeId || String(service?.temple_id) === String(templeId)
        );
      // Preserve current gallery order; append any new services to the end
      setHallServices((prev) => {
        const getKey = (s) =>
          String(s?.service_id ?? s?.id ?? s?.name ?? "").trim();
        const indexOfPrev = new Map();
        prev.forEach((item, idx) => indexOfPrev.set(getKey(item), idx));

        const fetched = [...hallsOnly];
        // Stable sort: items seen before keep their relative order; new ones go to the end
        fetched.sort((a, b) => {
          const ka = getKey(a);
          const kb = getKey(b);
          const ia = indexOfPrev.has(ka)
            ? indexOfPrev.get(ka)
            : Number.POSITIVE_INFINITY;
          const ib = indexOfPrev.has(kb)
            ? indexOfPrev.get(kb)
            : Number.POSITIVE_INFINITY;
          if (ia === ib) return 0; // keep fetched relative order for equally new/unknown items
          return ia - ib;
        });
        return fetched;
      });
    } catch (e) {
      setHallServices([]);
    } finally {
      setHallServicesLoading(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHallServices();
  }, [serviceType]);

  // Fetch bookings for current temple and service type
  const fetchBookings = async () => {
    setBookingsLoading(true);
    try {
      const params = { temple_id: templeId };
      if (serviceType) params.service_type = serviceType;
      if (ordering) params.ordering = ordering;
      const resp = await getAdminBookingList(params);
      const list = Array.isArray(resp)
        ? resp
        : Array.isArray(resp?.data)
        ? resp.data
        : Array.isArray(resp?.results)
        ? resp.results
        : [];

      // Filter by service type client-side
      const expected = serviceType.toUpperCase();
      const normalizeType = (svc) => {
        const typeRaw = (svc?.service_type || "").toString().toUpperCase();
        if (typeRaw === "PUJA" || typeRaw === "HALL" || typeRaw === "EVENT")
          return typeRaw;
        const typeStr = (svc?.service_type_str || "").toString().toUpperCase();
        if (typeStr.includes("PUJA")) return "PUJA";
        if (typeStr.includes("HALL")) return "HALL";
        if (typeStr.includes("EVENT")) return "EVENT";
        return "";
      };

      let filtered = list.filter(
        (b) => normalizeType(b?.service_data) === expected
      );
      if (templeId)
        filtered = filtered.filter(
          (b) => (b?.service_data?.temple_id || "") === templeId
        );

      // Client-side sorting by date
      filtered.sort((a, b) => {
        const dateA = parseBookingDate(a?.booking_date);
        const dateB = parseBookingDate(b?.booking_date);

        if (ordering === "booking_date") {
          return dateA - dateB; // Oldest first
        } else {
          return dateB - dateA; // Newest first (default)
        }
      });

      setBookings(filtered);
    } catch (e) {
      setBookings([]);
    } finally {
      setBookingsLoading(false);
    }
  };

  // Helper function to parse booking date (DD-MM-YYYY format)
  const parseBookingDate = (dateStr) => {
    if (!dateStr) return new Date(0);
    const [dd, mm, yyyy] = String(dateStr).split("-");
    return new Date(parseInt(yyyy, 10), parseInt(mm, 10) - 1, parseInt(dd, 10));
  };

  useEffect(() => {
    if (activeTab === "bookings") fetchBookings();
  }, [activeTab, serviceType, ordering]);

  // Set up global handler for Add New Hall button in header
  useEffect(() => {
    window.addNewHallHandler = () => {
      setEditService(null);
      setShowHallWizard(true);
    };
    window.addNewPujaHandler = () => {
      setEditService(null);
      setShowPujaWizard(true);
    };
    window.addNewEventHandler = () => {
      setEditService(null);
      setShowHallWizard(true);
    };

    return () => {
      delete window.addNewHallHandler;
      delete window.addNewPujaHandler;
      delete window.addNewEventHandler;
    };
  }, []);

  // Stats based on live halls
  const hallStats = useMemo(() => {
    const total = hallServices.length;
    const active = hallServices.filter((h) => h.is_active).length;
    const basePrices = hallServices
      .map((h) => parseFloat(h.base_price))
      .filter((v) => !Number.isNaN(v));
    const avgBase = basePrices.length
      ? Math.round(basePrices.reduce((a, b) => a + b, 0) / basePrices.length)
      : 0;
    return { total, active, avgBase };
  }, [hallServices]);

  // Helper function to format date
  const formatDate = (ddmmyyyy) => {
    if (!ddmmyyyy) return "";
    const [dd, mm, yyyy] = String(ddmmyyyy).split("-");
    const date = new Date(
      parseInt(yyyy, 10),
      parseInt(mm, 10) - 1,
      parseInt(dd, 10)
    );
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
      })
      .replace(/\./g, "");
  };

  // Handle sorting change
  const handleSortChange = (e) => setOrdering(e.target.value);

  // Handle delete booking
  const handleDeleteBooking = (booking) => setDeleteConfirmation(booking);

  // Confirm delete booking
  const confirmDeleteBooking = async () => {
    if (!deleteConfirmation) return;
    try {
      console.log("Deleting booking:", deleteConfirmation.ref_code);
      await fetchBookings();
    } catch (error) {
      console.error("Failed to delete booking:", error);
    } finally {
      setDeleteConfirmation(null);
    }
  };

  const handleEdit = (service) => {
    try {
      if (service?._inlineUpdate === true) {
        setHallServices((prev) =>
          prev.map((h) =>
            h.service_id === service.service_id
              ? { ...h, ...service, _inlineUpdate: undefined }
              : h
          )
        );
        return;
      }
      setEditService(service || null);
      setShowHallWizard(true);
    } catch {}
  };

  if (loading) {
    return (
      <PageContainer>
        <Container>
          <div
            style={{ padding: "60px", textAlign: "center", color: "#64748b" }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                margin: "0 auto 16px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              H
            </div>
            <div style={{ fontSize: "18px", fontWeight: "500" }}>
              Loading halls...
            </div>
          </div>
        </Container>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Container>
        <Tabs>
          <Tab
            $active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
          >
            <TrendingUp size={18} /> Overview
          </Tab>
          <Tab
            $active={activeTab === "bookings"}
            onClick={() => setActiveTab("bookings")}
          >
            <Calendar size={18} /> Bookings
          </Tab>
        </Tabs>

        {activeTab === "overview" && (
          <>
            {showAddonsNotification && (
              <AddonsNotification
                serviceId={newHallServiceId}
                onClose={() => setShowAddonsNotification(false)}
                onSkip={() => setShowAddonsNotification(false)}
              />
            )}
            <HallsOverview
              hallStats={hallStats}
              hallServices={hallServices}
              hallServicesLoading={hallServicesLoading}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onEditHall={handleEdit}
              serviceType={serviceType}
            />
          </>
        )}

        {activeTab === "bookings" && (
          <ContentCard>
            <div className="card-header">
              <div className="card-title">
                {serviceType === "PUJA"
                  ? "Puja Services Bookings"
                  : serviceType === "EVENT"
                  ? "Event Services Bookings"
                  : "Hall Services Bookings"}
              </div>
            </div>

            <Toolbar>
              <SearchInput>
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </SearchInput>

              {/* Service name filter */}
              <SortSelect>
                <select
                  value={serviceFilter}
                  onChange={(e) => setServiceFilter(e.target.value)}
                >
                  <option value="">All Services</option>
                  {Array.from(
                    new Set(
                      (bookings || [])
                        .map((b) => String(b?.service_data?.name || "").trim())
                        .filter(Boolean)
                    )
                  )
                    .sort((a, b) => a.localeCompare(b))
                    .map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                </select>
                <ChevronDown size={16} />
              </SortSelect>

              <SortSelect>
                <select value={ordering} onChange={handleSortChange}>
                  <option value="-booking_date">Recent Bookings</option>
                  <option value="booking_date">old Bookings</option>
                </select>
                <ChevronDown size={16} />
              </SortSelect>
            </Toolbar>

            <TableContainer>
              <Table style={{ minWidth: 820 }}>
                <thead>
                  <tr>
                    <th style={{ width: "120px" }}>Booking Ref</th>
                    <th style={{ width: "110px" }}>Date</th>
                    <th style={{ width: "110px" }}>Time</th>
                    <th style={{ width: "200px" }}>Customer</th>
                    <th style={{ width: "220px" }}>Service</th>
                    <th style={{ width: "110px" }}>Status</th>
                    <th style={{ width: "120px" }}>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length > 0 ? (
                    bookings
                      .filter((b) => {
                        const ref = (b?.ref_code || "").toLowerCase();
                        const cust = (
                          b?.customer_data?.name || ""
                        ).toLowerCase();
                        const phone = (
                          b?.customer_data?.mobile_number || ""
                        ).toLowerCase();
                        const svc = (b?.service_data?.name || "").toLowerCase();
                        const temple = (
                          b?.service_data?.temple_name || ""
                        ).toLowerCase();
                        const q = searchQuery.toLowerCase();
                        const matchesSearch = [
                          ref,
                          cust,
                          phone,
                          svc,
                          temple,
                        ].some((x) => x.includes(q));
                        const matchesService =
                          !serviceFilter ||
                          String(b?.service_data?.name || "").trim() ===
                            serviceFilter;
                        return matchesSearch && matchesService;
                      })
                      .map((b, idx) => {
                        const time = `${(b?.start_time || "").slice(0, 5)}–${(
                          b?.end_time || ""
                        ).slice(0, 5)}`;
                        const status = b?.status_display || "";
                        const priceText = `₹${parseFloat(
                          b?.unit_price || 0
                        ).toLocaleString("en-IN")}`;

                        return (
                          <tr key={b?.ref_code || idx}>
                            <td style={{ fontWeight: "600" }}>{b?.ref_code}</td>
                            <td>{formatDate(b?.booking_date)}</td>
                            <td>{time}</td>
                            <td>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <span style={{ fontWeight: "500" }}>
                                  {b?.customer_data?.name || ""}
                                </span>
                                <span
                                  style={{ fontSize: "12px", color: "#6b7280" }}
                                >
                                  {b?.customer_data?.mobile_number || ""}
                                </span>
                              </div>
                            </td>
                            <td>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <span style={{ fontWeight: "500" }}>
                                  {b?.service_data?.name || ""}
                                </span>
                                <span
                                  style={{ fontSize: "12px", color: "#6b7280" }}
                                >
                                  {b?.service_data?.temple_name || ""}
                                </span>
                              </div>
                            </td>
                            <td>
                              <StatusBadge $status={status}>
                                {status}
                              </StatusBadge>
                            </td>
                            <td style={{ fontWeight: "600" }}>{priceText}</td>
                          </tr>
                        );
                      })
                  ) : (
                    <tr>
                      <td colSpan={7}>
                        <EmptyState>
                          <Calendar size={48} />
                          <h3>No bookings found</h3>
                          <p>
                            {bookingsLoading
                              ? "Loading bookings..."
                              : `No ${
                                  serviceType === "PUJA"
                                    ? "puja"
                                    : serviceType === "EVENT"
                                    ? "event"
                                    : "hall"
                                } bookings found for the selected criteria.`}
                          </p>
                        </EmptyState>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </TableContainer>
          </ContentCard>
        )}

        {showAddonsNotification && activeTab !== "overview" && (
          <AddonsNotification
            serviceId={newHallServiceId}
            onClose={() => setShowAddonsNotification(false)}
            onSkip={() => setShowAddonsNotification(false)}
          />
        )}

        {(showHallWizard || showPujaWizard) && (
          <ModalOverlay>
            <ModalContent>
              <div
                style={{
                  flex: 1,
                  minHeight: 0,
                  display: "flex",
                  overflow: "hidden",
                  padding: 0,
                  background: "transparent",
                }}
              >
                <HallForm
                  editService={editService}
                  onCancel={() => {
                    setShowHallWizard(false);
                    setShowPujaWizard(false);
                    setEditService(null);
                  }}
                  serviceType={serviceType}
                  onInlineUpdate={async (payload) => {
                    try {
                      if (
                        payload &&
                        typeof payload === "object" &&
                        payload._inlineInsert
                      ) {
                        setHallServices((prev) => {
                          const exists = prev.some(
                            (h) => h.service_id === payload.service_id
                          );
                          if (exists) return prev;
                          // Append new creation at the end so it appears last in the gallery
                          return [...prev, payload];
                        });
                        return;
                      }
                      await fetchHallServices();
                    } catch {}
                  }}
                  onSuccess={async (serviceId) => {
                    setShowHallWizard(false);
                    setShowPujaWizard(false);
                    setEditService(null);
                    try {
                      await fetchHallServices();
                    } catch {}
                  }}
                />
              </div>
            </ModalContent>
          </ModalOverlay>
        )}

        {deleteConfirmation && (
          <DeleteConfirmationModal>
            <DeleteConfirmationContent>
              <h3>Delete Booking</h3>
              <p>
                Are you sure you want to delete booking{" "}
                <strong>{deleteConfirmation.ref_code}</strong>? This action
                cannot be undone.
              </p>
              <div className="actions">
                <button
                  className="cancel"
                  onClick={() => setDeleteConfirmation(null)}
                >
                  Cancel
                </button>
                <button className="confirm" onClick={confirmDeleteBooking}>
                  Delete
                </button>
              </div>
            </DeleteConfirmationContent>
          </DeleteConfirmationModal>
        )}
      </Container>
    </PageContainer>
  );
};

export default HallsManagement;
