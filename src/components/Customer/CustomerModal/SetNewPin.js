"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiLock, FiEye, FiEyeOff, FiX, FiSave, FiShield } from "react-icons/fi";
import styled, { keyframes } from "styled-components";
import { setNewPin } from "../../../services/customerServices";

// Animations
const shimmer = keyframes`
  0% { background-position: -468px 0; }
  100% { background-position: 468px 0; }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

// Styled Components
const PopupOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5));
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const PopupContent = styled(motion.div)`
  background: linear-gradient(145deg, #ffffff, #f8fafc);
  border-radius: 24px;
  padding: 0;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.9);
  position: relative;
  overflow: hidden;
`;

const HeaderSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 2rem 1.5rem;
  text-align: center;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
      repeat;
    opacity: 0.3;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  z-index: 10;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: rotate(90deg);
  }
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);

  svg {
    font-size: 2rem;
    color: white;
  }
`;

const Title = styled.h2`
  margin: 0;
  color: white;
  font-size: 1.75rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Subtitle = styled.p`
  margin: 0.5rem 0 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
  font-weight: 400;
`;

const ContentSection = styled.div`
  padding: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  position: relative;
  animation: ${slideUp} 0.6s ease-out;
  animation-delay: ${(props) => props.delay || 0}s;
  animation-fill-mode: both;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.75rem;
  color: #374151;
  font-weight: 600;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    font-size: 1rem;
    color: #667eea;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 16px;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 3rem 1rem 1.25rem;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  font-size: 1rem;
  font-weight: 500;
  background: #ffffff;
  transition: all 0.3s ease;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.02);

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    transform: translateY(-1px);
  }

  &:hover {
    border-color: #d1d5db;
  }

  &::placeholder {
    color: #9ca3af;
    font-weight: 400;
  }
`;

const ToggleButton = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: #f3f4f6;
    color: #667eea;
  }
`;

const MessageBase = styled(motion.div)`
  padding: 1rem 1.25rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled(MessageBase)`
  background: linear-gradient(135deg, #fee2e2, #fecaca);
  color: #dc2626;
  border: 1px solid #fca5a5;

  svg {
    font-size: 1.1rem;
  }
`;

const SuccessMessage = styled(MessageBase)`
  background: linear-gradient(135deg, #dcfce7, #bbf7d0);
  color: #16a34a;
  border: 1px solid #86efac;
  text-align: center;
  justify-content: center;
  animation: ${pulse} 2s infinite;

  svg {
    font-size: 1.1rem;
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1.25rem 2rem;
  border-radius: 16px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;

    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.3),
        transparent
      );
      animation: ${shimmer} 1.5s infinite;
    }
  }

  svg {
    font-size: 1.1rem;
  }
`;

const PinStrengthIndicator = styled.div`
  margin-top: 0.5rem;
  display: flex;
  gap: 0.25rem;
`;

const StrengthDot = styled.div`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: ${(props) => {
    if (props.active && props.strength >= 1) return "#ef4444";
    if (props.active && props.strength >= 2) return "#f59e0b";
    if (props.active && props.strength >= 3) return "#10b981";
    return "#e5e7eb";
  }};
  transition: all 0.3s ease;
`;

const SetNewPinPopup = ({ onClose, customerId }) => {
  const [formData, setFormData] = useState({
    u_id: customerId || "",
    o_pin: "",
    n_pin: "",
    confirmPin: "",
  });
  const [showPins, setShowPins] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const getPinStrength = (pin) => {
    if (!pin) return 0;
    if (pin.length < 4) return 1;
    if (pin.length < 6) return 2;
    return 3;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const togglePinVisibility = (field) => {
    setShowPins({ ...showPins, [field]: !showPins[field] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.n_pin !== formData.confirmPin) {
      setError("New PIN and Confirm PIN do not match");
      setLoading(false);
      return;
    }

    if (formData.n_pin.length < 4) {
      setError("PIN must be at least 4 digits");
      setLoading(false);
      return;
    }

    try {
      await setNewPin(formData);
      setSuccess(true);
      setTimeout(() => onClose(), 2500);
    } catch (err) {
      setError(err.message || "Failed to update PIN");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PopupOverlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <PopupContent
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <CloseButton onClick={onClose}>
          <FiX />
        </CloseButton>

        <HeaderSection>
          <IconWrapper>
            <FiShield />
          </IconWrapper>
          <Title>Update Security PIN</Title>
          <Subtitle>Secure your account with a new PIN</Subtitle>
        </HeaderSection>

        <ContentSection>
          <AnimatePresence>
            {success ? (
              <SuccessMessage
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <FiShield />
                PIN updated successfully! Redirecting...
              </SuccessMessage>
            ) : (
              <Form onSubmit={handleSubmit}>
                <AnimatePresence>
                  {error && (
                    <ErrorMessage
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <FiX />
                      {error}
                    </ErrorMessage>
                  )}
                </AnimatePresence>

                <InputGroup delay={0.1}>
                  <Label>
                    <FiLock />
                    Current PIN
                  </Label>
                  <InputWrapper>
                    <Input
                      type={showPins.old ? "text" : "password"}
                      name="o_pin"
                      value={formData.o_pin}
                      onChange={handleChange}
                      placeholder="Enter your current PIN"
                      maxLength="6"
                      required
                    />
                    <ToggleButton
                      type="button"
                      onClick={() => togglePinVisibility("old")}
                    >
                      {showPins.old ? <FiEyeOff /> : <FiEye />}
                    </ToggleButton>
                  </InputWrapper>
                </InputGroup>

                <InputGroup delay={0.2}>
                  <Label>
                    <FiShield />
                    New PIN
                  </Label>
                  <InputWrapper>
                    <Input
                      type={showPins.new ? "text" : "password"}
                      name="n_pin"
                      value={formData.n_pin}
                      onChange={handleChange}
                      placeholder="Create a new secure PIN"
                      maxLength="6"
                      required
                    />
                    <ToggleButton
                      type="button"
                      onClick={() => togglePinVisibility("new")}
                    >
                      {showPins.new ? <FiEyeOff /> : <FiEye />}
                    </ToggleButton>
                  </InputWrapper>
                  <PinStrengthIndicator>
                    {[1, 2, 3].map((level) => (
                      <StrengthDot
                        key={level}
                        active={formData.n_pin.length > 0}
                        strength={getPinStrength(formData.n_pin)}
                      />
                    ))}
                  </PinStrengthIndicator>
                </InputGroup>

                <InputGroup delay={0.3}>
                  <Label>
                    <FiLock />
                    Confirm New PIN
                  </Label>
                  <InputWrapper>
                    <Input
                      type={showPins.confirm ? "text" : "password"}
                      name="confirmPin"
                      value={formData.confirmPin}
                      onChange={handleChange}
                      placeholder="Confirm your new PIN"
                      maxLength="6"
                      required
                    />
                    <ToggleButton
                      type="button"
                      onClick={() => togglePinVisibility("confirm")}
                    >
                      {showPins.confirm ? <FiEyeOff /> : <FiEye />}
                    </ToggleButton>
                  </InputWrapper>
                </InputGroup>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <SubmitButton type="submit" disabled={loading}>
                    {loading ? (
                      "Updating PIN..."
                    ) : (
                      <>
                        <FiSave />
                        Update PIN
                      </>
                    )}
                  </SubmitButton>
                </motion.div>
              </Form>
            )}
          </AnimatePresence>
        </ContentSection>
      </PopupContent>
    </PopupOverlay>
  );
};

export default SetNewPinPopup;
