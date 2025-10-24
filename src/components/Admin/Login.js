"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import { loginUser, getUserProfile } from "../../services/authServices";

const LoginContainer = styled.div`
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

const LoginCard = styled(motion.div)`
  background: rgba(245, 248, 231, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 2rem;
  box-shadow: 0 25px 50px rgba(225, 80, 32, 0.2);
  padding: 3rem;
  width: 100%;
  max-width: 450px;
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
  margin-bottom: 2rem;

  .om-symbol {
    font-size: 3rem;
    color: #ea580c;
    margin-bottom: 0.5rem;
  }

  .title {
    font-size: 1.5rem;
    font-weight: bold;
    color: #9a3412;
  }
`;

const TabContainer = styled.div`
  display: flex;
  background: rgba(248, 250, 252, 0.8);
  border-radius: 1rem;
  padding: 0.5rem;
  margin-bottom: 2rem;
  gap: 0.5rem;
  border: 1px solid rgba(212, 175, 55, 0.2);
`;

const Tab = styled(motion.button)`
  flex: 1;
  padding: 5px 2px;
  border: 2px solid rgba(212, 175, 55, 0.2);
  background: ${(props) =>
    props.active ? "linear-gradient(135deg, #d4af37, #c44536)" : "transparent"};
  color: ${(props) => (props.active ? "white" : "#666")};
  font-weight: 600;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;

  &:hover {
    background: ${(props) =>
      props.active
        ? "linear-gradient(135deg, #d4af37, #c44536)"
        : "rgba(212, 175, 55, 0.1)"};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #b45309;
  font-weight: 600;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 2px solid #fed7aa;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #ea580c;
    box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.1);
  }
`;

const LoginButton = styled(motion.button)`
  background: linear-gradient(135deg, #ea580c 0%, #dc2626 100%);
  color: white;
  font-weight: bold;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  font-size: 1.1rem;
  box-shadow: 0 10px 20px rgba(234, 88, 12, 0.3);
  border: none;
  cursor: pointer;

  &:hover {
    box-shadow: 0 15px 30px rgba(234, 88, 12, 0.4);
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background: #fee2e2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  border: 1px solid #fecaca;
`;

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const adminId = localStorage.getItem("userToken");
  const userId = localStorage.getItem("customerToken");
  useEffect(() => {
    const currentPath = window.location.pathname;
    if (adminId && currentPath !== "/dashboard") {
      window.location.href = "/dashboard";
    } else if (!adminId && !userId && currentPath !== "/login") {
      window.location.href = "/login";
    }
  }, []);
  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await loginUser(credentials);

      if (response.key) {
        // Store token and username
        localStorage.setItem("userToken", response.key);
        localStorage.setItem("username", credentials.username);

        // Get user profile to fetch first_name
        try {
          const userProfile = await getUserProfile();
          if (userProfile.first_name) {
            localStorage.setItem("firstName", userProfile.first_name);
            // You can use first_name to match with temple_id here
            // For now, we'll store a sample temple_id
            localStorage.setItem(
              "templeId",
              userProfile.first_name || "T_0000010"
            );
          }
        } catch (profileError) {
          console.error("Error fetching user profile:", profileError);
        }

        navigate("/dashboard");
      } else {
        setError("Invalid response from server");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };
  const navigatetopage = (path) => {
    navigate(path);
  };
  return (
    <LoginContainer>
      <LoginCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <TabContainer>
          <Tab onClick={() => navigatetopage("/seller-login")}>
            👥 Seller Login
          </Tab>
          <Tab onClick={() => navigatetopage("/customer-login")}>
            👤 Customer Login
          </Tab>
        </TabContainer>
        <Logo>
          {/* <div className="om-symbol">🕉️</div> */}
          <div className="title">Temple Admin</div>
        </Logo>

        <Form onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}

          <FormGroup>
            <Label htmlFor="username">Username</Label>
            <Input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              required
              placeholder="Enter your username"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </FormGroup>

          <LoginButton
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? "🙏 Signing In..." : "🙏 Sign In"}
          </LoginButton>
        </Form>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
