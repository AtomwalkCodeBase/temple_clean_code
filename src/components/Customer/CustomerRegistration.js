"use client";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FiUser, FiPhone, FiMail, FiUserPlus } from "react-icons/fi";
import { registerCustomer } from "../../services/customerServices";

const RegistrationContainer = styled.div`
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
    background: url("https://i.pinimg.com/236x/92/72/be/9272bec9a4977ba0f128b7fe8179bd9d.jpg");
    background-size: cover;
    background-position: center;
    filter: blur(5px);
    z-index: 0;
  }
`;

const RegistrationCard = styled(motion.div)`
  background: rgba(245, 248, 231, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 2rem;
  box-shadow: 0 25px 50px rgba(225, 80, 32, 0.2);
  padding: 3rem;
  width: 100%;
  margin-top: 50px;
  max-width: 600px;
  border: 3px solid rgba(227, 98, 24, 0.2);
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

const RegisterButton = styled(motion.button)`
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

  .pin {
    font-weight: 800;
    font-size: 1.5rem;
    color: #047857;
    margin: 1rem 0;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 0.75rem;
    border: 2px dashed #047857;
  }

  .ref-code {
    font-weight: 700;
    color: #047857;
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }

  .instructions {
    font-size: 0.85rem;
    opacity: 0.8;
    margin-top: 1rem;
  }
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;

  .text {
    color: #6b7280;
    margin-bottom: 0.5rem;
  }

  a {
    color: #f18746ff;
    text-decoration: none;
    font-weight: 700;
    font-size: 1.05rem;
    transition: all 0.2s ease;

    &:hover {
      color: #e95929ff;
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
const Conecter = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  gap: 1.5rem;
`;
const CustomerRegistration = () => {
  const [formData, setFormData] = useState({
    mobile_number: "",
    name: "",
    email_id: "",
    alternate_contact_number: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const pathName = window.location.pathname;
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await registerCustomer(
        pathName !== "/seller-register" ? formData : formData,
        pathName
      );
      setSuccess(response);

      // Auto redirect to login after 8 seconds
      setTimeout(() => {
        navigate("/customer-login");
      }, 8000);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <RegistrationContainer>
        <RegistrationCard
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <SuccessMessage
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="success-icon">🎉</div>
            <div>
              <strong>Registration Successful!</strong>
            </div>
            <div>Your account has been created successfully!</div>
            <div className="pin">PIN: {success.pin}</div>
            <div className="ref-code">Reference Code: {success.ref_code}</div>
            <div className="instructions">
              Please save your PIN and Reference Code securely.
              <br />
              You'll need them to login to your account.
              <br />
              <em>Redirecting to login page in 8 seconds...</em>
            </div>
          </SuccessMessage>

          <LoginLink>
            <Link to="/customer-login">Continue to Login →</Link>
          </LoginLink>
        </RegistrationCard>
      </RegistrationContainer>
    );
  }

  return (
    <RegistrationContainer>
      <RegistrationCard
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Logo>
          <div className="title">Join Temple Connect</div>
          <div className="subtitle">Begin your spiritual journey with us</div>
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
          <Conecter>
            <FormGroup>
              <Label htmlFor="name">
                <FiUser className="icon" />
                Full Name
              </Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="mobile_number">
                <FiPhone className="icon" />
                Mobile Number
              </Label>
              <Input
                type="tel"
                id="mobile_number"
                name="mobile_number"
                value={formData.mobile_number}
                onChange={handleChange}
                required
                placeholder="Enter your mobile number"
                pattern="[0-9]{10}"
              />
            </FormGroup>
          </Conecter>
          <Conecter>
            <FormGroup>
              <Label htmlFor="email_id">
                <FiMail className="icon" />
                Email Address
              </Label>
              <Input
                type="email"
                id="email_id"
                name="email_id"
                value={formData.email_id}
                onChange={handleChange}
                required
                placeholder="Enter your email address"
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="alternate_contact_number">
                <FiPhone className="icon" />
                Alternate Contact (Optional)
              </Label>
              <Input
                type="tel"
                id="alternate_contact_number"
                name="alternate_contact_number"
                value={formData.alternate_contact_number}
                onChange={handleChange}
                placeholder="Enter alternate contact number"
                pattern="[0-9]{10}"
              />
            </FormGroup>
          </Conecter>
          <RegisterButton
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? (
              <>
                <LoadingSpinner />
                Creating Account...
              </>
            ) : (
              <>
                <FiUserPlus />
                Create Account
              </>
            )}
          </RegisterButton>
        </Form>

        <LoginLink>
          <div className="text">Already have an account?</div>
          {pathName === "/seller-register" ? (
            <Link to="/seller-login">Sign In Here</Link>
          ) : (
            <Link to="/customer-login">Sign In Here</Link>
          )}
        </LoginLink>
      </RegistrationCard>
    </RegistrationContainer>
  );
};

export default CustomerRegistration;
