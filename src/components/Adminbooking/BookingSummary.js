// components/AdminServices/BookingSummary.js
import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { processBooking } from "../../services/customerServices";
import { toAPIDate } from "../Customer/BookSeva";
import { getCustomerList } from "../../services/templeServices";
import { toast } from "react-toastify";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const SummaryContainer = styled.div`
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
  padding: 40px;
  border-radius: 28px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
  border: 2px solid #e5e7eb;
  margin-bottom: 32px;
  position: relative;
  overflow: hidden;
  animation: ${fadeIn} 0.6s ease-out;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: linear-gradient(
      90deg,
      #3b82f6,
      #8b5cf6,
      #ec4899,
      #f59e0b,
      #3b82f6
    );
    background-size: 200% 100%;
    animation: ${shimmer} 3s linear infinite;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 36px;
`;

const SummaryTitle = styled.h2`
  color: #1f2937;
  font-size: 32px;
  font-weight: 800;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #1f2937 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 15px;
  margin: 0;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SummarySection = styled.div`
  padding: 28px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 20px;
  border: 2px solid #e5e7eb;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${(props) =>
      props.$gradient || "linear-gradient(90deg, #3b82f6, #8b5cf6)"};
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 35px rgba(59, 130, 246, 0.15);
    border-color: #3b82f6;
  }
`;

const SectionTitle = styled.h3`
  color: #1f2937;
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 10px;

  &::before {
    content: "${(props) => props.$icon || "📄"}";
    font-size: 22px;
  }
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  padding: 12px;
  background: white;
  border-radius: 10px;
  border: 1px solid #f1f5f9;
  transition: all 0.2s ease;

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    border-color: #3b82f6;
    transform: translateX(4px);
  }
`;

const DetailLabel = styled.span`
  color: #6b7280;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: "${(props) => props.$icon || "•"}";
    font-size: 16px;
  }
`;

const DetailValue = styled.span`
  color: #1f2937;
  font-size: 15px;
  font-weight: 700;
`;

const PriceValue = styled(DetailValue)`
  color: #059669;
  font-size: 22px;
  display: flex;
  align-items: center;
  gap: 4px;

  &::before {
    content: "₹";
    font-size: 18px;
  }
`;

const CustomerSection = styled.div`
  margin-bottom: 32px;
  padding: 28px;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-radius: 20px;
  border: 2px solid #93c5fd;
`;

const CustomerSelectWrapper = styled.div`
  position: relative;
  margin-top: 16px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 16px 20px 16px 50px;
  border: 2px solid #e5e7eb;
  border-radius: 14px;
  font-size: 15px;
  background: white;
  transition: all 0.3s ease;
  font-weight: 500;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  color: #6b7280;
`;

const CustomerList = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  max-height: 280px;
  overflow-y: auto;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 14px;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  animation: ${fadeIn} 0.2s ease-out;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;

    &:hover {
      background: #94a3b8;
    }
  }
`;

const CustomerOption = styled.div`
  padding: 14px 18px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  gap: 4px;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    transform: translateX(4px);
  }

  &.selected {
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    font-weight: 600;
  }
`;

const CustomerName = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: #1f2937;
`;

const CustomerDetails = styled.div`
  font-size: 13px;
  color: #6b7280;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const CustomerBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;

  &::before {
    content: "${(props) => props.$icon || "•"}";
    font-size: 14px;
  }
`;

const SelectedCustomerDisplay = styled.div`
  padding: 16px;
  background: white;
  border-radius: 12px;
  border: 2px solid #3b82f6;
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ClearButton = styled.button`
  padding: 6px 12px;
  background: #fee2e2;
  color: #dc2626;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #fecaca;
    transform: scale(1.05);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 16px;
  justify-content: flex-end;
`;

const ConfirmButton = styled.button`
  padding: 16px 40px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
  display: flex;
  align-items: center;
  gap: 10px;

  &::before {
    content: "✓";
    font-size: 20px;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(16, 185, 129, 0.4);
    animation: ${pulse} 1s ease-in-out infinite;
  }

  &:disabled {
    background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    animation: none;
  }
`;

const CancelButton = styled.button`
  padding: 16px 40px;
  background: white;
  color: #374151;
  border: 2px solid #e5e7eb;
  border-radius: 14px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #f3f4f6;
    border-color: #d1d5db;
    transform: translateY(-2px);
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
  margin-right: 8px;
`;

const ErrorText = styled.div`
  color: #dc2626;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border: 2px solid #fecaca;
  border-radius: 12px;
  padding: 14px 18px;
  text-align: center;
  margin-bottom: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &::before {
    content: "⚠️";
    font-size: 18px;
  }
`;

const BookingSummary = ({
  service,
  variation,
  selectedDate,
  onBookingComplete,
  onCancel,
}) => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getCustomerList();
        setCustomers(data);
        setFilteredCustomers(data);
      } catch (err) {
        console.error("Error fetching customers:", err);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    const filtered = customers.filter((customer) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        customer.name?.toLowerCase().includes(searchLower) ||
        customer.mobile_number?.includes(searchQuery) ||
        customer.email_id?.toLowerCase().includes(searchLower)
      );
    });
    setFilteredCustomers(filtered);
  }, [searchQuery, customers]);

  const calculateTotalPrice = () => {
    const basePrice = parseFloat(variation.base_price) || 0;
    const weekDayPrice =
      parseFloat(variation.pricing_rule_data?.week_day_price) || 0;
    const timePrice = parseFloat(variation.pricing_rule_data?.time_price) || 0;
    const datePrice = parseFloat(variation.pricing_rule_data?.date_price) || 0;

    return basePrice + weekDayPrice + timePrice + datePrice;
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowDropdown(true);
  };

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setSearchQuery(customer.name);
    setShowDropdown(false);
  };

  const handleClearCustomer = () => {
    setSelectedCustomer(null);
    setSearchQuery("");
  };

  const handleConfirmBooking = async () => {
    if (!selectedCustomer) {
      setError("Please select a customer");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const bookingData = {
        booking_data: {
          cust_ref_code: selectedCustomer.cust_ref_code,
          call_mode: "ADD_BOOKING",
          service_id: service.service_id,
          service_variation_id: variation.id,
          booking_date: toAPIDate(selectedDate),
          end_date: toAPIDate(selectedDate),
          start_time: variation.start_time,
          end_time: variation.end_time,
          notes: "",
          quantity: variation.max_participant || 1,
          duration: parseInt(
            service.duration_minutes || service.duration || 60,
            10
          ),
          unit_price: calculateTotalPrice(),
        },
      };

      await processBooking(bookingData);
      onBookingComplete();
      toast.success("Booking confirmed successfully!");
    } catch (err) {
      setError("Failed to process booking. Please try again.");
      console.error("Booking error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SummaryContainer>
      <Header>
        <SummaryTitle> Complete Your Booking</SummaryTitle>
        <Subtitle>Review your booking details and select a customer</Subtitle>
      </Header>

      <SummaryGrid>
        <SummarySection $gradient="linear-gradient(90deg, #3b82f6, #8b5cf6)">
          <SectionTitle $icon="🎯">Service Details</SectionTitle>
          <DetailRow>
            <DetailLabel $icon="📝">Service Name</DetailLabel>
            <DetailValue>{service.name}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel $icon="⚡">Service Type</DetailLabel>
            <DetailValue>
              {service.service_type_str || service.service_type}
            </DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel $icon="👥">Capacity</DetailLabel>
            <DetailValue>{service.capacity} people</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel $icon="⏱️">Duration</DetailLabel>
            <DetailValue>
              {service.duration_minutes
                ? `${service.duration_minutes} minutes`
                : "Flexible"}
            </DetailValue>
          </DetailRow>
        </SummarySection>

        <SummarySection $gradient="linear-gradient(90deg, #ec4899, #f59e0b)">
          <SectionTitle $icon="📅">Booking Details</SectionTitle>
          <DetailRow>
            <DetailLabel $icon="💎">Variation</DetailLabel>
            <DetailValue>{variation.pricing_type_str}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel $icon="📆">Date</DetailLabel>
            <DetailValue>
              {new Date(selectedDate).toLocaleDateString("en-IN", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel $icon="🕐">Time</DetailLabel>
            <DetailValue>
              {variation.start_time} - {variation.end_time}
            </DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel $icon="👤">Participants</DetailLabel>
            <DetailValue>{variation.max_participant || 1}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel $icon="💰">Total Price</DetailLabel>
            <PriceValue>{calculateTotalPrice()}</PriceValue>
          </DetailRow>
        </SummarySection>
      </SummaryGrid>

      <CustomerSection>
        <SectionTitle $icon="👤">Select Customer</SectionTitle>
        <CustomerSelectWrapper>
          <SearchIcon>🔍</SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search by name, mobile or email..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setShowDropdown(true)}
          />
          {showDropdown && filteredCustomers.length > 0 && (
            <CustomerList>
              {filteredCustomers.map((customer) => (
                <CustomerOption
                  key={customer.cust_ref_code}
                  onClick={() => handleSelectCustomer(customer)}
                  className={
                    selectedCustomer?.cust_ref_code === customer.cust_ref_code
                      ? "selected"
                      : ""
                  }
                >
                  <CustomerName>{customer.name}</CustomerName>
                  <CustomerDetails>
                    <CustomerBadge $icon="📱">
                      {customer.mobile_number}
                    </CustomerBadge>
                    <CustomerBadge $icon="📧">
                      {customer.email_id}
                    </CustomerBadge>
                  </CustomerDetails>
                </CustomerOption>
              ))}
            </CustomerList>
          )}
        </CustomerSelectWrapper>

        {selectedCustomer && (
          <SelectedCustomerDisplay>
            <div>
              <CustomerName>{selectedCustomer.name}</CustomerName>
              <CustomerDetails>
                <CustomerBadge $icon="📱">
                  {selectedCustomer.mobile_number}
                </CustomerBadge>
                <CustomerBadge $icon="📧">
                  {selectedCustomer.email_id}
                </CustomerBadge>
              </CustomerDetails>
            </div>
            <ClearButton onClick={handleClearCustomer}>Clear</ClearButton>
          </SelectedCustomerDisplay>
        )}
      </CustomerSection>

      {error && <ErrorText>{error}</ErrorText>}

      <ActionButtons>
        <CancelButton onClick={onCancel} disabled={loading}>
          Cancel
        </CancelButton>
        <ConfirmButton
          onClick={handleConfirmBooking}
          disabled={loading || !selectedCustomer}
        >
          {loading && <LoadingSpinner />}
          {loading ? "Processing..." : "Confirm Booking"}
        </ConfirmButton>
      </ActionButtons>
    </SummaryContainer>
  );
};

export default BookingSummary;
