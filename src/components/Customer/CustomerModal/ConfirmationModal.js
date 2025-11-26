import React from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContainer = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 450px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  border: 1px solid #e5e7eb;
`;

const ModalHeader = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
`;

const ModalIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #fee2e2;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;

  svg {
    width: 30px;
    height: 30px;
    color: #dc2626;
  }
`;

const ModalTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const ModalMessage = styled.p`
  color: #6b7280;
  text-align: center;
  line-height: 1.5;
  margin-bottom: 2rem;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const Button = styled(motion.button)`
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 120px;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background: #f3f4f6;
  color: #374151;

  &:hover:not(:disabled) {
    background: #e5e7eb;
  }
`;

const ConfirmButton = styled(Button)`
  background: #dc2626;
  color: white;

  &:hover:not(:disabled) {
    background: #b91c1c;
  }
`;

const BookingRef = styled.div`
  background: #f3f4f6;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-family: monospace;
  font-weight: 600;
  color: #374151;
  margin: 1rem 0;
  display: inline-block;
`;
// Add these styled components
const RefundInfoContainer = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

const RefundDetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem 0;
  color: ${(props) => (props.highlight ? "#dc2626" : "#374151")};
  font-weight: ${(props) => (props.highlight ? "bold" : "normal")};

  &:not(:last-child) {
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 0.5rem;
  }
`;

const RefundPolicyNote = styled.div`
  margin-top: 0.75rem;
  padding: 0.5rem;
  background: #fef3c7;
  border-radius: 4px;
  font-size: 0.875rem;
  color: #92400e;
  text-align: center;
  font-weight: 500;
`;

const TimeRemaining = styled.div`
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
  text-align: center;
`;

// SVG Icon for warning
const WarningIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  bookingRef = null,
  isLoading = false,
  type = "cancel",
  refunddata,
  price,
  bookingDate,
  bookingtime,
}) => {
  console.log(bookingDate, "refunddata");
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.8, y: -20 },
  };

  const getIconColor = () => {
    switch (type) {
      case "cancel":
        return { bg: "#fee2e2", color: "#dc2626" };
      case "delete":
        return { bg: "#fee2e2", color: "#dc2626" };
      case "warning":
        return { bg: "#fef3c7", color: "#d97706" };
      default:
        return { bg: "#fee2e2", color: "#dc2626" };
    }
  };

  // Calculate refund amount based on cancellation time
  const calculateRefund = () => {
    // If refunddata is null, return 100% refund
    if (!refunddata || !refunddata.refund_rules) {
      return {
        refundPercent: 100,
        refundAmount: price,
        applicableRule: "100% refund as per policy",
        timeUntilBooking: { days: 0, hours: 0 },
      };
    }

    if (!bookingDate || !price) {
      return null;
    }

    const now = new Date();

    // Create booking datetime properly
    const [year, month, day] = bookingDate.split("-");
    const [hours, minutes] = bookingtime.split(":");
    const bookingDateTime = new Date(year, month - 1, day, hours, minutes);

    const timeDiff = bookingDateTime.getTime() - now.getTime();

    // If booking is in the past, no refund
    if (timeDiff < 0) {
      return {
        refundPercent: 0,
        refundAmount: 0,
        applicableRule: "No refund for past bookings",
        timeUntilBooking: { days: 0, hours: 0 },
      };
    }

    // Convert to hours and days
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    const daysDiff = hoursDiff / 24;

    // Sort rules by priority (most restrictive first)
    const sortedRules = [...refunddata.refund_rules].sort((a, b) => {
      // Handle days comparison
      if (a.min_days_before !== null && b.min_days_before !== null) {
        return b.min_days_before - a.min_days_before;
      }
      // Handle hours comparison
      if (a.min_hours_before !== null && b.min_hours_before !== null) {
        return b.min_hours_before - a.min_hours_before;
      }
      // Days come before hours
      if (a.min_days_before !== null) return -1;
      if (b.min_days_before !== null) return 1;
      return 0;
    });

    // Find the applicable refund rule
    const applicableRule = sortedRules.find((rule) => {
      if (rule.min_days_before !== null) {
        return daysDiff >= rule.min_days_before;
      }
      if (rule.min_hours_before !== null) {
        return hoursDiff >= rule.min_hours_before;
      }
      return false;
    });

    console.log("Applicable rule:", applicableRule);

    // If no rule matches, use the last rule (most restrictive)
    const finalRule = applicableRule || sortedRules[sortedRules.length - 1];

    const refundPercent = parseFloat(finalRule?.refund_percent) || 0;
    const refundAmount = (price * refundPercent) / 100;

    return {
      rule: finalRule,
      refundPercent,
      refundAmount,
      applicableRule: finalRule?.notes || "No refund applicable",
      timeUntilBooking: {
        days: Math.floor(daysDiff),
        hours: Math.floor(hoursDiff % 24),
      },
    };
  };

  const refundInfo = calculateRefund();
  const iconColors = getIconColor();

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose} // Fixed: removed arrow function
        >
          <ModalContainer
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <ModalIcon style={{ background: iconColors.bg }}>
                <WarningIcon style={{ color: iconColors.color }} />
              </ModalIcon>
              <ModalTitle>{title}</ModalTitle>

              {bookingRef && <BookingRef>Ref: {bookingRef}</BookingRef>}

              <ModalMessage>{message}</ModalMessage>

              {/* Refund Information */}
              {refundInfo && price && (
                <RefundInfoContainer>
                  <RefundDetailRow>
                    <span>Original Amount:</span>
                    <span>₹{price}</span>
                  </RefundDetailRow>
                  <RefundDetailRow>
                    <span>Refund Percentage:</span>
                    <span>{refundInfo.refundPercent}%</span>
                  </RefundDetailRow>
                  <RefundDetailRow highlight>
                    <span>Refund Amount:</span>
                    <span>₹{refundInfo.refundAmount}</span>
                  </RefundDetailRow>
                  <RefundPolicyNote>
                    {refundInfo.applicableRule}
                  </RefundPolicyNote>
                  <TimeRemaining>
                    Time until booking: {refundInfo.timeUntilBooking.days} days,{" "}
                    {refundInfo.timeUntilBooking.hours} hours
                  </TimeRemaining>
                </RefundInfoContainer>
              )}

              {!refundInfo && price && (
                <RefundInfoContainer>
                  <RefundDetailRow>
                    <span>Original Amount:</span>
                    <span>₹{price}</span>
                  </RefundDetailRow>
                  <RefundPolicyNote>
                    Unable to calculate refund amount. Please contact support.
                  </RefundPolicyNote>
                </RefundInfoContainer>
              )}
            </ModalHeader>

            <ModalActions>
              <CancelButton
                onClick={onClose} // Fixed: removed arrow function
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {cancelText}
              </CancelButton>

              <ConfirmButton
                onClick={onConfirm} // Fixed: removed arrow function
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? "Processing..." : confirmText}
              </ConfirmButton>
            </ModalActions>
          </ModalContainer>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;
