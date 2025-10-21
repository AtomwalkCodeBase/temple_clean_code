"use client";

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCalendar,
  FiX,
  FiFilter,
  FiDollarSign,
  FiInfo,
  FiEye,
  FiXCircle,
} from "react-icons/fi";
import { MdQrCode2, MdTempleHindu } from "react-icons/md";
import {
  getBookingList,
  processBooking,
} from "../../services/customerServices";
import { useCustomerAuth } from "../../contexts/CustomerAuthContext";
import CustomerLayout from "../../components/Customer/CustomerLayout";

import { toast } from "react-toastify";
import ConfirmationModal from "./CustomerModal/ConfirmationModal";

// Styled Components
const BookingsContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
`;

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

  .title {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
  }

  .subtitle {
    font-size: 1.2rem;
    opacity: 0.9;
    font-weight: 500;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;

    .title {
      font-size: 2rem;
    }

    .subtitle {
      font-size: 1rem;
    }
  }
`;

const SuccessMessage = styled(motion.div)`
  background: linear-gradient(135deg, #d1fae5, #a7f3d0);
  color: #065f46;
  padding: 1.5rem;
  border-radius: 1rem;
  text-align: center;
  margin-bottom: 2rem;
  border: 1px solid #6ee7b7;
  font-weight: 600;
  font-size: 1.1rem;
`;

const FilterSection = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;

  .filter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;

    .filter-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: #1f2937;
      display: flex;
      align-items: center;
      gap: 0.5rem;

      .icon {
        color: #667eea;
      }
    }
  }

  .filter-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .filter-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    label {
      font-weight: 600;
      color: #374151;
      font-size: 0.9rem;
    }

    input,
    select {
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 0.9rem;
      transition: all 0.2s ease;

      &:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }
    }
  }
`;

const BookingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const BookingCard = styled(motion.div)`
  background: white;
  border-radius: 1.5rem;
  padding: 1.5rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${(props) => {
      switch (props.status) {
        case "B":
          return "#3b82f6";
        case "C":
          return "#10b981";
        case "X":
          return "#ef4444";
        default:
          return "#6b7280";
      }
    }};
  }
`;

const BookingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const BookingRef = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
`;

const StatusBadge = styled.span`
  padding: 0.4rem 0.8rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &.booked {
    background: linear-gradient(135deg, #dbeafe, #bfdbfe);
    color: #1e40af;
  }

  &.completed {
    background: linear-gradient(135deg, #d1fae5, #a7f3d0);
    color: #065f46;
  }

  &.cancelled {
    background: linear-gradient(135deg, #fee2e2, #fecaca);
    color: #dc2626;
  }
`;

const ServiceImage = styled(motion.div)`
  height: 200px;
  border-radius: 0.75rem;
  overflow: hidden;
  margin-bottom: 1rem;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

const ServiceInfo = styled.div`
  margin-bottom: 1rem;

  .service-name {
    font-size: 1.1rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .icon {
      color: #667eea;
      font-size: 1.2rem;
    }
  }

  .temple-name {
    color: #6b7280;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }
`;

const BookingDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const DetailCard = styled.div`
  background: #f8fafc;
  border-radius: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;

  .detail-title {
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.25rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.8rem;

    .icon {
      color: #667eea;
      font-size: 0.8rem;
    }
  }

  .detail-content {
    font-size: 0.8rem;
    color: #6b7280;
  }

  .detail-value {
    font-weight: 600;
    color: #1f2937;
  }
`;

const QRCodeSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem 0;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.75rem;
  border: 1px dashed #e5e7eb;

  h4 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    font-size: 0.9rem;
    color: #374151;
  }
`;

const QRImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: contain;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 8px;
  background: white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
`;

const QRPlaceholder = styled.div`
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 8px;
  color: #95a5a6;
  font-style: italic;
  text-align: center;
  padding: 15px;
  font-size: 0.8rem;
`;

const CardActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
`;

const ViewDetailsButton = styled(motion.button)`
  background: transparent;
  color: #667eea;
  border: 1px solid #667eea;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: #667eea;
    color: white;
  }
`;

const BookingActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled(motion.button)`
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.75rem;
  cursor: pointer;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  transition: all 0.3s ease;

  &.cancel {
    background: linear-gradient(135deg, #fee2e2, #fecaca);
    color: #dc2626;

    &:hover {
      background: linear-gradient(135deg, #fecaca, #fca5a5);
      transform: translateY(-2px);
    }
  }

  &.complete {
    background: linear-gradient(135deg, #d1fae5, #a7f3d0);
    color: #065f46;

    &:hover {
      background: linear-gradient(135deg, #a7f3d0, #6ee7b7);
      transform: translateY(-2px);
    }
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: #6b7280;

  .spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #e5e7eb;
    border-top: 4px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .text {
    font-size: 1.1rem;
    font-weight: 600;
  }
`;

const ErrorMessage = styled(motion.div)`
  background: linear-gradient(135deg, #fee2e2, #fecaca);
  color: #dc2626;
  padding: 1.5rem;
  border-radius: 1rem;
  text-align: center;
  margin: 2rem auto;
  max-width: 500px;
  border: 1px solid #fca5a5;
  font-weight: 600;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem;
  color: #6b7280;

  .icon {
    font-size: 5rem;
    margin-bottom: 2rem;
    opacity: 0.5;
  }

  .title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: #374151;
  }

  .subtitle {
    font-size: 1rem;
    max-width: 400px;
    margin: 0 auto 2rem;
  }

  .cta-button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-weight: 700;
    padding: 1rem 2rem;
    border-radius: 0.75rem;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
    }
  }
`;

// Modal Components
const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContainer = styled(motion.div)`
  background: white;
  border-radius: 1.5rem;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
  border-radius: 1.5rem 1.5rem 0 0;

  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0;
  }

  .close-btn {
    background: #f3f4f6;
    border: none;
    border-radius: 50%;
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: #e5e7eb;
    }
  }
`;

const ModalContent = styled.div`
  padding: 1.5rem;
`;

const ModalSection = styled.div`
  margin-bottom: 2rem;

  h3 {
    font-size: 1.1rem;
    font-weight: 700;
    color: #374151;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const ModalGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const ModalDetailItem = styled.div`
  background: #f9fafb;
  border-radius: 0.75rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;

  .label {
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }

  .value {
    color: #1f2937;
    font-size: 1rem;
  }
`;

const CustomerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    dateFrom: "",
    dateTo: "",
  });
  const [visibleQRCode, setVisibleQRCode] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { customerData } = useCustomerAuth();
  const successMessage = location.state?.message;

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [bookings, filters]);

  const loadBookings = async () => {
    const data = customerData?.custRefCode;
    try {
      setLoading(true);
      const response = await getBookingList(data);
      setBookings(response);
    } catch (err) {
      setError("Failed to load bookings. Please try again.");
      console.error("Error loading bookings:", err);
    } finally {
      setLoading(false);
    }
  };
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    refCode: null,
    action: null,
  });

  // Function to open confirmation modal
  const openConfirmationModal = (refCode, action) => {
    setConfirmationModal({
      isOpen: true,
      refCode,
      action,
    });
  };

  // Function to close confirmation modal
  const closeConfirmationModal = () => {
    setConfirmationModal({
      isOpen: false,
      refCode: null,
      action: null,
    });
  };

  // Handle actual booking action after confirmation
  const handleConfirmedAction = async () => {
    const { refCode, action } = confirmationModal;

    if (action === "cancel") {
      try {
        await handleBookingAction(refCode, "cancel");
        // Show success message
        toast.success("Booking cancelled successfully!");
      } catch (error) {
        console.error("Error cancelling booking:", error);
        toast.error("Failed to cancel booking. Please try again.");
      } finally {
        setActionLoading(null);
      }
    }

    closeConfirmationModal();
  };
  const applyFilters = () => {
    let filtered = bookings;

    if (filters.search) {
      filtered = filtered.filter(
        (booking) =>
          booking.service_data?.name
            ?.toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          booking.ref_code
            ?.toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          booking.customer_data?.name
            ?.toLowerCase()
            .includes(filters.search.toLowerCase())
      );
    }

    if (filters.status) {
      filtered = filtered.filter(
        (booking) => booking.status === filters.status
      );
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(
        (booking) => booking.booking_date >= filters.dateFrom
      );
    }

    if (filters.dateTo) {
      filtered = filtered.filter(
        (booking) => booking.booking_date <= filters.dateTo
      );
    }

    setFilteredBookings(filtered.reverse()); // Show latest bookings first
  };

  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value,
    });
  };
  // Set filter from URL query param (e.g., /customer-bookings?status=A)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlStatus = params.get("status");
    const serchcode = params.get("refcode");
    if (urlStatus) {
      handleFilterChange("status", urlStatus);
    } else if (serchcode) {
      handleFilterChange("search", serchcode);
    }
  }, [location.search]);

  const handleBookingAction = async (bookingRefCode, action) => {
    setActionLoading(bookingRefCode);
    setError("");

    try {
      const bookingData = {
        booking_data: {
          cust_ref_code: customerData.custRefCode,
          call_mode: action.toUpperCase(),
          booking_ref_code: bookingRefCode,
          remarks: `Booking ${action.toLowerCase()}d by customer`,
        },
      };

      await processBooking(bookingData);
      await loadBookings(); // Reload bookings
    } catch (err) {
      setError(err.message || `Failed to ${action.toLowerCase()} booking.`);
    } finally {
      setActionLoading("");
    }
  };

  const openModal = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };
  // Function to toggle QR code for a specific booking
  const toggleQRCode = (refCode) => {
    setVisibleQRCode(visibleQRCode === refCode ? null : refCode);
  };

  // Function to close QR code
  const closeQRCode = () => {
    setVisibleQRCode(null);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const getStatusText = (status) => {
    switch (status?.toUpperCase()) {
      case "B":
        return "Booked";
      case "C":
        return "Completed";
      case "X":
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toUpperCase()) {
      case "B":
        return "booked";
      case "C":
        return "completed";
      case "X":
        return "cancelled";
      default:
        return "booked";
    }
  };

  const formatPrice = (price) => {
    return `₹${parseFloat(price).toFixed(2)}`;
  };

  const calculateTotal = (booking) => {
    return parseFloat(booking.unit_price) * booking.quantity;
  };

  if (loading) {
    return (
      <CustomerLayout>
        <LoadingContainer>
          <div className="spinner"></div>
          <div className="text">Loading your bookings...</div>
        </LoadingContainer>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <BookingsContainer>
        <HeaderSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="header-content">
            <div className="title">📋 My Bookings</div>
            <div className="subtitle">
              Manage and track your spiritual journey
            </div>
          </div>
        </HeaderSection>

        <AnimatePresence>
          {successMessage && (
            <SuccessMessage
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {successMessage}
            </SuccessMessage>
          )}
        </AnimatePresence>

        {error && (
          <ErrorMessage
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {error}
          </ErrorMessage>
        )}

        <FilterSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="filter-header">
            <div className="filter-title">
              <FiFilter className="icon" />
              Filter Bookings
            </div>
          </div>
          <div className="filter-grid">
            <div className="filter-item">
              <label>Search</label>
              <input
                type="text"
                placeholder="Search by service, booking ID, or name..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>
            <div className="filter-item">
              <label>Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <option value="">All Status</option>
                <option value="B">Booked</option>
                <option value="C">Completed</option>
                <option value="X">Cancelled</option>
              </select>
            </div>
          </div>
        </FilterSection>

        {filteredBookings.length === 0 ? (
          <EmptyState>
            <div className="icon">🙏</div>
            <div className="title">
              {bookings.length === 0
                ? "No Bookings Yet"
                : "No Bookings Match Your Filters"}
            </div>
            <div className="subtitle">
              {bookings.length === 0
                ? "Start your spiritual journey by booking a seva at your favorite temple"
                : "Try adjusting your filters to see more bookings"}
            </div>
            {bookings.length === 0 && (
              <button
                className="cta-button"
                onClick={() => navigate("/customer-temples")}
              >
                Book Your First Seva
              </button>
            )}
          </EmptyState>
        ) : (
          <BookingsGrid>
            {filteredBookings.map((booking, index) => (
              <BookingCard
                key={booking.ref_code}
                status={booking.status}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <BookingHeader>
                  <BookingRef>{booking.ref_code}</BookingRef>
                  <StatusBadge className={getStatusClass(booking.status)}>
                    {getStatusText(booking.status)}
                  </StatusBadge>
                </BookingHeader>

                {booking.service_data?.image && (
                  <ServiceImage onClick={() => openModal(booking)}>
                    <img
                      src={booking.service_data.image}
                      alt={booking.service_data.name}
                    />
                  </ServiceImage>
                )}

                <ServiceInfo>
                  <div className="service-name">
                    <MdTempleHindu className="icon" />
                    {booking.service_data?.name || "Service"}
                  </div>
                  <div className="temple-name">
                    {booking.service_data?.temple_name}
                  </div>
                </ServiceInfo>

                <BookingDetails>
                  <DetailCard>
                    <div className="detail-title">
                      <FiCalendar className="icon" />
                      Date & Time
                    </div>
                    <div className="detail-content">
                      <div className="detail-value">{booking.booking_date}</div>
                      <div>
                        {booking.start_time} - {booking.end_time}
                      </div>
                    </div>
                  </DetailCard>

                  <DetailCard>
                    <div className="detail-title">
                      <FiDollarSign className="icon" />
                      Price of {booking.quantity} quantity
                    </div>
                    <div className="detail-content">
                      <div className="detail-value">
                        {formatPrice(booking.unit_price)}
                      </div>
                    </div>
                  </DetailCard>
                </BookingDetails>

                {visibleQRCode === booking.ref_code && (
                  <QRCodeSection>
                    <h4>
                      <MdQrCode2 /> Booking QR Code
                      <button onClick={closeQRCode}>×</button>
                    </h4>
                    {booking.status === "B" && booking.qr_image ? (
                      <QRImage src={booking.qr_image} alt="Booking QR Code" />
                    ) : (
                      <QRPlaceholder>
                        {booking.status === "B"
                          ? "QR Code will be available soon"
                          : "QR Code not available"}
                      </QRPlaceholder>
                    )}
                  </QRCodeSection>
                )}

                <CardActions>
                  <ViewDetailsButton
                    onClick={() => openModal(booking)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiEye /> View Details
                  </ViewDetailsButton>
                  <ViewDetailsButton
                    onClick={() => toggleQRCode(booking.ref_code)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiEye />
                    {visibleQRCode === booking.ref_code ? "Hide" : "View"} QR
                    Code
                  </ViewDetailsButton>
                  {booking.status?.toUpperCase() === "B" && (
                    <BookingActions>
                      <ActionButton
                        className="cancel"
                        onClick={() =>
                          openConfirmationModal(booking.ref_code, "cancel")
                        }
                        disabled={actionLoading === booking.ref_code}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FiX />
                        {actionLoading === booking.ref_code ? "..." : "Cancel"}
                      </ActionButton>
                    </BookingActions>
                  )}
                </CardActions>
              </BookingCard>
            ))}
          </BookingsGrid>
        )}

        {/* Modal for detailed view */}
        <AnimatePresence>
          {isModalOpen && selectedBooking && (
            <ModalOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            >
              <ModalContainer
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <ModalHeader>
                  <h2>Booking Details</h2>
                  <button className="close-btn" onClick={closeModal}>
                    <FiXCircle size={20} />
                  </button>
                </ModalHeader>

                <ModalContent>
                  <ModalSection>
                    <h3>
                      <FiInfo /> Service Information
                    </h3>
                    <ModalGrid>
                      <ModalDetailItem>
                        <div className="label">Service Name</div>
                        <div className="value">
                          {selectedBooking.service_data?.name}
                        </div>
                      </ModalDetailItem>
                      <ModalDetailItem>
                        <div className="label">Temple</div>
                        <div className="value">
                          {selectedBooking.service_data?.temple_name}
                        </div>
                      </ModalDetailItem>
                      <ModalDetailItem>
                        <div className="label">Service Type</div>
                        <div className="value">
                          {selectedBooking.service_data?.service_type_str}
                        </div>
                      </ModalDetailItem>
                      <ModalDetailItem>
                        <div className="label">Capacity</div>
                        <div className="value">
                          {selectedBooking.service_data?.capacity} people
                        </div>
                      </ModalDetailItem>
                    </ModalGrid>
                  </ModalSection>

                  <ModalSection>
                    <h3>
                      <FiCalendar /> Booking Information
                    </h3>
                    <ModalGrid>
                      <ModalDetailItem>
                        <div className="label">Booking Reference</div>
                        <div className="value">{selectedBooking.ref_code}</div>
                      </ModalDetailItem>
                      <ModalDetailItem>
                        <div className="label">Booking Date</div>
                        <div className="value">
                          {selectedBooking.booking_date}
                        </div>
                      </ModalDetailItem>
                      <ModalDetailItem>
                        <div className="label">Time Slot</div>
                        <div className="value">
                          {selectedBooking.start_time} -{" "}
                          {selectedBooking.end_time}
                        </div>
                      </ModalDetailItem>
                      <ModalDetailItem>
                        <div className="label">Status</div>
                        <div className="value">
                          <StatusBadge
                            className={getStatusClass(selectedBooking.status)}
                          >
                            {getStatusText(selectedBooking.status)}
                          </StatusBadge>
                        </div>
                      </ModalDetailItem>
                    </ModalGrid>
                  </ModalSection>

                  <ModalSection>
                    <h3>
                      <FiDollarSign /> Pricing Details
                    </h3>
                    <ModalGrid>
                      <ModalDetailItem>
                        <div className="label">Total Price</div>
                        <div className="value">
                          {formatPrice(selectedBooking.unit_price)}
                        </div>
                      </ModalDetailItem>
                      <ModalDetailItem>
                        <div className="label">Quantity</div>
                        <div className="value">{selectedBooking.quantity}</div>
                      </ModalDetailItem>
                      <ModalDetailItem>
                        <div className="label">Total Amount</div>
                        <div className="value">
                          {formatPrice(calculateTotal(selectedBooking))}
                        </div>
                      </ModalDetailItem>
                      {selectedBooking.service_variation_data && (
                        <ModalDetailItem>
                          <div className="label">Service Variation</div>
                          <div className="value">
                            {
                              selectedBooking.service_variation_data
                                .pricing_type_str
                            }
                          </div>
                        </ModalDetailItem>
                      )}
                    </ModalGrid>
                  </ModalSection>

                  {selectedBooking.service_data && (
                    <ModalSection>
                      <h3>
                        <FiInfo /> Policies
                      </h3>
                      <ModalGrid>
                        {selectedBooking.service_data.adv_policy_data && (
                          <ModalDetailItem>
                            <div className="label">Advance Payment Policy</div>
                            <div className="value">
                              {
                                selectedBooking.service_data.adv_policy_data
                                  .percent
                              }
                              % (Min ₹
                              {
                                selectedBooking.service_data.adv_policy_data
                                  .min_amount
                              }
                              )
                            </div>
                          </ModalDetailItem>
                        )}
                        {selectedBooking.service_data.refund_policy_data && (
                          <ModalDetailItem>
                            <div className="label">Refund Policy</div>
                            <div className="value">
                              {
                                selectedBooking.service_data.refund_policy_data
                                  .name
                              }
                            </div>
                          </ModalDetailItem>
                        )}
                        {selectedBooking.service_data.pricing_rule_data && (
                          <ModalDetailItem>
                            <div className="label">Pricing Rule</div>
                            <div className="value">
                              {
                                selectedBooking.service_data.pricing_rule_data
                                  .name
                              }
                            </div>
                          </ModalDetailItem>
                        )}
                      </ModalGrid>
                    </ModalSection>
                  )}

                  <ModalSection>
                    <h3>
                      <MdQrCode2 /> QR Code
                    </h3>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      {selectedBooking.status === "B" &&
                      selectedBooking.qr_image ? (
                        <QRImage
                          src={selectedBooking.qr_image}
                          alt="Booking QR Code"
                          style={{ width: "200px", height: "200px" }}
                        />
                      ) : (
                        <QRPlaceholder
                          style={{ width: "200px", height: "200px" }}
                        >
                          {selectedBooking.status === "B"
                            ? "QR Code will be available soon"
                            : "QR Code not available"}
                        </QRPlaceholder>
                      )}
                    </div>
                  </ModalSection>
                </ModalContent>
              </ModalContainer>
            </ModalOverlay>
          )}
        </AnimatePresence>
      </BookingsContainer>
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={closeConfirmationModal}
        onConfirm={handleConfirmedAction}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmText="Yes, Cancel Booking"
        cancelText="No, Keep Booking"
      />
    </CustomerLayout>
  );
};

export default CustomerBookings;
