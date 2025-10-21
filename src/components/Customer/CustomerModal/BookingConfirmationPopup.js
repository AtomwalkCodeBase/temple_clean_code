import React, { useState, useMemo } from "react";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
`;

const PopupContainer = styled.div`
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    max-width: 95%;
    border-radius: 20px;
  }
`;

const Header = styled.div`
  padding: 32px 32px 24px;
  border-bottom: 2px solid #f8f9fa;
  background: linear-gradient(145deg, rgb(212, 175, 55), rgb(196, 69, 54));
  color: white;
  border-radius: 24px 24px 0 0;

  @media (max-width: 768px) {
    padding: 24px 20px 20px;
    border-radius: 20px 20px 0 0;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: rotate(90deg);
  }
`;

const HeaderTitle = styled.h2`
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 8px;
`;

const HeaderSubtitle = styled.p`
  margin: 0;
  font-size: 1rem;
  opacity: 0.9;
`;

const Content = styled.div`
  padding: 32px;

  @media (max-width: 768px) {
    padding: 24px 20px;
  }
`;

const Section = styled.div`
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 20px;
  padding-bottom: 8px;
  border-bottom: 2px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ServiceSummaryCard = styled.div`
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
  border-radius: 16px;
  padding: 24px;
  border: 2px solid #e8eaff;
`;

const ServiceName = styled.h4`
  font-size: 1.4rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
`;

const TempleName = styled.p`
  color: #667eea;
  font-weight: 600;
  margin-bottom: 16px;
  font-size: 1.1rem;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`;

const DetailLabel = styled.span`
  font-weight: 600;
  color: #666;
  font-size: 0.95rem;
`;

const DetailValue = styled.span`
  font-weight: 700;
  color: #1a1a1a;
  font-size: 0.95rem;
`;

const VariationDetails = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  border: 2px solid #e8eaff;
  margin-top: 16px;
`;

const VariationTitle = styled.h5`
  font-size: 1.1rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 12px;
`;

const TimeSlot = styled.div`
  background: #f8f9ff;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 12px;
  border-left: 4px solid #667eea;
`;

const PricingBreakdown = styled.div`
  background: #fff;
  border-radius: 16px;
  border: 2px solid #e8f5e8;
  overflow: hidden;
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }

  &.total {
    background: linear-gradient(135deg, #e8f5e8 0%, #f0f9f0 100%);
    font-weight: 700;
    font-size: 1.1rem;
    color: #2e7d32;
  }

  &.advance {
    background: #fff3e0;
    color: #f57c00;
    font-weight: 600;
  }
`;

const PaymentSection = styled.div`
  background: #f8f9fa;
  border-radius: 16px;
  padding: 24px;
  border: 2px solid #e9ecef;
`;

const PaymentMethod = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
`;

const PaymentOption = styled.button`
  flex: 1;
  padding: 16px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;

  &.active {
    border-color: #667eea;
    background: #f8f9ff;
    color: #667eea;
  }

  &:hover {
    border-color: #667eea;
    background: #f8f9ff;
  }
`;

const PolicyInfo = styled.div`
  background: #e3f2fd;
  border-radius: 12px;
  padding: 16px;
  border-left: 4px solid #2196f3;
  margin-top: 20px;
`;

const PolicyTitle = styled.h6`
  font-weight: 700;
  color: #1976d2;
  margin-bottom: 8px;
  font-size: 0.95rem;
`;

const PolicyText = styled.p`
  font-size: 0.85rem;
  color: #1565c0;
  margin: 0;
  line-height: 1.4;
`;

const Actions = styled.div`
  display: flex;
  gap: 16px;
  padding: 24px 32px;
  border-top: 2px solid #f8f9fa;
  background: #fafbfc;

  @media (max-width: 768px) {
    padding: 20px;
    flex-direction: column;
  }
`;

const Button = styled.button`
  flex: 1;
  padding: 16px 24px;
  border-radius: 12px;
  border: none;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &.primary {
    background: linear-gradient(145deg, rgb(212, 175, 55), rgb(196, 69, 54));
    color: white;

    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #5a67d8 0%, #6b4e9d 100%);
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  &.secondary {
    background: white;
    color: #666;
    border: 2px solid #e9ecef;

    &:hover {
      background: #f8f9fa;
      border-color: #dee2e6;
    }
  }
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const BookingConfirmationPopup = ({
  booking,
  onConfirm,
  onCancel,
  isLoading,
  variationId,
  bookingDate,
}) => {
  const [paymentMethod, setPaymentMethod] = useState("card");

  // Find the selected variation
  const selectedVariation = useMemo(() => {
    if (!booking.service_variation_list || !variationId) return null;
    return booking.service_variation_list.find((v) => v.id === variationId);
  }, [booking.service_variation_list, variationId]);

  // Calculate pricing
  const pricing = useMemo(() => {
    const basePrice = selectedVariation
      ? parseFloat(selectedVariation.base_price)
      : parseFloat(booking.base_price || 0);

    // Apply pricing rules if available
    let finalPrice = basePrice;
    if (selectedVariation?.pricing_rule_data) {
      const rule = selectedVariation.pricing_rule_data;
      if (rule.week_day_price && parseFloat(rule.week_day_price) > 0) {
        finalPrice += parseFloat(rule.week_day_price);
      }
      if (rule.time_price && parseFloat(rule.time_price) > 0) {
        finalPrice += parseFloat(rule.time_price);
      }
    }

    const advancePercent = booking.adv_policy_data
      ? parseFloat(booking.adv_policy_data.percent)
      : 0;
    const advanceAmount = (finalPrice * advancePercent) / 100;
    const remainingAmount = finalPrice - advanceAmount;

    return {
      basePrice,
      finalPrice,
      advancePercent,
      advanceAmount,
      remainingAmount,
    };
  }, [selectedVariation, booking]);

  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Overlay onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <PopupContainer>
        <Header>
          <CloseButton onClick={onCancel}>×</CloseButton>
          <HeaderTitle>Booking Confirmation</HeaderTitle>
          <HeaderSubtitle>Please review your booking details</HeaderSubtitle>
        </Header>

        <Content>
          {/* Order Summary */}
          <Section>
            <SectionTitle>📋 Order Summary</SectionTitle>
            <ServiceSummaryCard>
              <ServiceName>{booking.name}</ServiceName>
              <TempleName>🏛️ {booking.temple_name}</TempleName>

              <DetailRow>
                <DetailLabel>Service Type</DetailLabel>
                <DetailValue>{booking.service_type_str}</DetailValue>
              </DetailRow>

              <DetailRow>
                <DetailLabel>Booking Date</DetailLabel>
                <DetailValue>{formatDate(bookingDate)}</DetailValue>
              </DetailRow>

              <DetailRow>
                <DetailLabel>Capacity</DetailLabel>
                <DetailValue>{booking.capacity} people</DetailValue>
              </DetailRow>

              {booking.duration_minutes > 0 && (
                <DetailRow>
                  <DetailLabel>Duration</DetailLabel>
                  <DetailValue>
                    {Math.floor(booking.duration_minutes / 60)}h{" "}
                    {booking.duration_minutes % 60}m
                  </DetailValue>
                </DetailRow>
              )}

              {selectedVariation && (
                <VariationDetails>
                  <VariationTitle>
                    {selectedVariation.pricing_type_str} Booking
                  </VariationTitle>
                  {selectedVariation.start_time &&
                    selectedVariation.end_time && (
                      <TimeSlot>
                        <DetailLabel>Time Slot: </DetailLabel>
                        <DetailValue>
                          {formatTime(selectedVariation.start_time)} -{" "}
                          {formatTime(selectedVariation.end_time)}
                        </DetailValue>
                      </TimeSlot>
                    )}
                  <DetailRow>
                    <DetailLabel>Max Participants</DetailLabel>
                    <DetailValue>
                      {selectedVariation.max_participant}
                    </DetailValue>
                  </DetailRow>
                </VariationDetails>
              )}
            </ServiceSummaryCard>
          </Section>

          {/* Pricing Breakdown */}
          <Section>
            <SectionTitle>💰 Pricing Details</SectionTitle>
            <PricingBreakdown>
              <PriceRow>
                <span>Base Price</span>
                <span>₹{pricing.basePrice.toFixed(2)}</span>
              </PriceRow>

              {selectedVariation?.pricing_rule_data && (
                <>
                  {parseFloat(
                    selectedVariation.pricing_rule_data.week_day_price || 0
                  ) > 0 && (
                    <PriceRow>
                      <span>Day Pricing</span>
                      <span>
                        +₹
                        {parseFloat(
                          selectedVariation.pricing_rule_data.week_day_price
                        ).toFixed(2)}
                      </span>
                    </PriceRow>
                  )}
                  {parseFloat(
                    selectedVariation.pricing_rule_data.time_price || 0
                  ) > 0 && (
                    <PriceRow>
                      <span>Time Pricing</span>
                      <span>
                        +₹
                        {parseFloat(
                          selectedVariation.pricing_rule_data.time_price
                        ).toFixed(2)}
                      </span>
                    </PriceRow>
                  )}
                </>
              )}

              <PriceRow className="total">
                <span>Total Amount</span>
                <span>₹{pricing.finalPrice.toFixed(2)}</span>
              </PriceRow>

              {pricing.advanceAmount > 0 && (
                <PriceRow className="advance">
                  <span>Advance Payment ({pricing.advancePercent}%)</span>
                  <span>₹{pricing.advanceAmount.toFixed(2)}</span>
                </PriceRow>
              )}
            </PricingBreakdown>
          </Section>

          {/* Payment Section */}
          <Section>
            <SectionTitle>💳 Payment Method</SectionTitle>
            <PaymentSection>
              <PaymentMethod>
                <PaymentOption
                  className={paymentMethod === "card" ? "active" : ""}
                  onClick={() => setPaymentMethod("card")}
                >
                  💳 Card
                </PaymentOption>
                <PaymentOption
                  className={paymentMethod === "upi" ? "active" : ""}
                  onClick={() => setPaymentMethod("upi")}
                >
                  📱 UPI
                </PaymentOption>
                <PaymentOption
                  className={paymentMethod === "wallet" ? "active" : ""}
                  onClick={() => setPaymentMethod("wallet")}
                >
                  👝 Wallet
                </PaymentOption>
              </PaymentMethod>

              {/* Policy Information */}
              {booking.adv_policy_data && (
                <PolicyInfo>
                  <PolicyTitle>Advance Payment Policy</PolicyTitle>
                  <PolicyText>
                    {booking.adv_policy_data.percent}% advance payment required{" "}
                    {booking.adv_policy_data.due_days_before} days before the
                    booking date. Minimum advance amount: ₹
                    {parseFloat(booking.adv_policy_data.min_amount).toFixed(2)}
                  </PolicyText>
                </PolicyInfo>
              )}

              {booking.refund_policy_data &&
                booking.refund_policy_data.refund_rules.length > 0 && (
                  <PolicyInfo>
                    <PolicyTitle>Refund Policy</PolicyTitle>
                    <PolicyText>
                      {booking.refund_policy_data.refund_rules[0].notes}
                    </PolicyText>
                  </PolicyInfo>
                )}
            </PaymentSection>
          </Section>
        </Content>

        <Actions>
          <Button className="secondary" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button className="primary" onClick={onConfirm} disabled={isLoading}>
            {isLoading && <LoadingSpinner />}
            Confirm & Pay ₹
            {pricing.advanceAmount > 0
              ? pricing.advanceAmount.toFixed(2)
              : pricing.finalPrice.toFixed(2)}
          </Button>
        </Actions>
      </PopupContainer>
    </Overlay>
  );
};

export default BookingConfirmationPopup;
