"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FiPhone, FiSend, FiArrowLeft } from "react-icons/fi";
import { forgotPin } from "../../services/customerServices";

const ForgotPinContainer = styled.div`
  min-height: 100vh;
  margin-top: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 20px;
    left: 0;
    right: 0;
    bottom: 0;
    background: url();
    background-size: cover;
    background-position: center;
    filter: blur(5px);
    z-index: 0;
  }
`;

const ForgotPinCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 2rem;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
  padding: 3rem;
  width: 100%;
  max-width: 450px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 2rem;
    margin: 1rem;
  }
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 3rem;

  .om-symbol {
    font-size: 4rem;
    background: linear-gradient(135deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 1rem;
    filter: drop-shadow(0 4px 8px rgba(102, 126, 234, 0.3));
  }

  .title {
    font-size: 2rem;
    font-weight: 800;
    background: linear-gradient(135deg, #1f2937, #374151);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 0.5rem;
  }

  .subtitle {
    font-size: 1rem;
    color: #6b7280;
    font-weight: 500;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const FormGroup = styled.div`
  position: relative;
`;

const Label = styled.label`
  display: block;
  color: #374151;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .icon {
    color: #e16417ff;
    font-size: 1.2rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1.25rem;
  border: 2px solid #e5e7eb;
  border-radius: 1rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    background: rgba(255, 255, 255, 0.95);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const SubmitButton = styled(motion.button)`
  background: linear-gradient(135deg, #dfea66ff 0%, #dd3320ff 100%);
  color: white;
  font-weight: 700;
  padding: 1.25rem 2rem;
  border-radius: 1rem;
  font-size: 1.1rem;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    box-shadow: 0 15px 40px rgba(102, 126, 234, 0.5);
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled(motion.div)`
  background: linear-gradient(135deg, #fee2e2, #fecaca);
  color: #dc2626;
  padding: 1rem;
  border-radius: 1rem;
  font-size: 0.9rem;
  border: 1px solid #fca5a5;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: "⚠️";
  }
`;

const SuccessMessage = styled(motion.div)`
  background: linear-gradient(135deg, #d1fae5, #a7f3d0);
  color: #065f46;
  padding: 2rem;
  border-radius: 1rem;
  font-size: 0.95rem;
  border: 1px solid #6ee7b7;
  text-align: center;

  .success-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .new-pin {
    font-weight: 800;
    font-size: 1.5rem;
    color: #047857;
    margin: 1rem 0;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 0.75rem;
    border: 2px dashed #047857;
  }

  .instructions {
    font-size: 0.85rem;
    opacity: 0.8;
    margin-top: 1rem;
  }
`;

const BackLink = styled.div`
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;

  a {
    color: #f39552ff;
    text-decoration: none;
    font-weight: 700;
    font-size: 1.05rem;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;

    &:hover {
      color: #eb3b1cff;
      text-decoration: underline;
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

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ForgotPin = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await forgotPin(mobileNumber);
      setSuccess(response);
    } catch (err) {
      setError(err.message || "Failed to reset PIN. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <ForgotPinContainer>
        <ForgotPinCard
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <SuccessMessage
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="success-icon">📧</div>
            <div>
              <strong>PIN Reset Successful!</strong>
            </div>
            <div>{success.message}</div>
            {/* <div className="new-pin">New PIN: {success.e_pin}</div> */}
            <div className="instructions">
              Please save your new PIN securely and use it to login to your
              account.
            </div>
          </SuccessMessage>

          <BackLink>
            <Link to="/customer-login">
              <FiArrowLeft />
              Back to Login
            </Link>
          </BackLink>
        </ForgotPinCard>
      </ForgotPinContainer>
    );
  }

  return (
    <ForgotPinContainer>
      <ForgotPinCard
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Logo>
          <div className="title">Reset PIN</div>
          <div className="subtitle">Get a new PIN via email</div>
        </Logo>

        <Form onSubmit={handleSubmit}>
          {error && (
            <ErrorMessage
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              {error}
            </ErrorMessage>
          )}

          <FormGroup>
            <Label htmlFor="mobile_number">
              <FiPhone className="icon" />
              Mobile Number
            </Label>
            <Input
              type="tel"
              id="mobile_number"
              name="mobile_number"
              value={mobileNumber}
              onChange={(e) => {
                setMobileNumber(e.target.value);
                setError("");
              }}
              required
              placeholder="Enter your registered mobile number"
              pattern="[0-9]{10}"
            />
          </FormGroup>

          <SubmitButton
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? (
              <>
                <LoadingSpinner />
                Sending...
              </>
            ) : (
              <>
                <FiSend />
                Reset PIN
              </>
            )}
          </SubmitButton>
        </Form>

        <BackLink>
          <Link to="/customer-login">
            <FiArrowLeft />
            Back to Login
          </Link>
        </BackLink>
      </ForgotPinCard>
    </ForgotPinContainer>
  );
};

export default ForgotPin;
