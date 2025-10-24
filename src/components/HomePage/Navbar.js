"use client";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

const NavbarContainer = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem 0;
  background: ${(props) =>
    props.scrolled ? "rgba(255, 248, 231, 0.95)" : "rgba(255, 248, 231, 0.8)"};
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 153, 51, 0.2);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${(props) =>
    props.scrolled ? "0 10px 40px rgba(0, 0, 0, 0.1)" : "none"};

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: ${(props) => props.theme.colors.gradient.primary};
    opacity: ${(props) => (props.scrolled ? 1 : 0)};
    transition: opacity 0.5s ease;
  }
`;

const NavContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Logo = styled(motion.div)`
  font-family: ${(props) => props.theme.fonts.heading};
  font-size: 2.2rem;
  font-weight: 800;
  background: ${(props) => props.theme.colors.gradient.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  position: relative;
  cursor: pointer;
  &::after {
    content: "";
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 100%;
    height: 2px;
    background: ${(props) => props.theme.colors.gradient.primary};
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  &:hover::after {
    transform: scaleX(1);
  }
`;

const OmSymbol = styled(motion.span)`
  font-size: 2.8rem;
  background: ${(props) => props.theme.colors.gradient.divine};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 10px rgba(218, 165, 32, 0.5));
`;

const NavLinks = styled.div`
  display: flex;
  gap: 3rem;
  align-items: center;

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  font-weight: 600;
  font-size: 1.1rem;
  color: ${(props) => props.theme.colors.text};
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0.5rem 1rem;
  border-radius: 25px;

  &:hover {
    color: ${(props) => props.theme.colors.primary};
    background: rgba(255, 153, 51, 0.1);
    transform: translateY(-2px);
  }

  &.active {
    color: ${(props) => props.theme.colors.primary};
    background: rgba(255, 153, 51, 0.15);
    box-shadow: 0 5px 15px rgba(255, 153, 51, 0.3);
  }

  &::before {
    content: "";
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 3px;
    background: ${(props) => props.theme.colors.gradient.primary};
    border-radius: 2px;
    transition: width 0.3s ease;
  }

  &:hover::before,
  &.active::before {
    width: 80%;
  }
`;

const LoginContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const LoginDropdown = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  width: 300px;
  background: rgba(255, 248, 231, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  padding: 0.5rem;
  margin-top: 0.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 153, 51, 0.2);
  overflow: hidden;
  z-index: 1001;
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0.8rem 1rem;
  color: ${(props) => props.theme.colors.text};
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
  margin-bottom: 0.25rem;

  &:hover {
    background: rgba(255, 153, 51, 0.1);
    color: ${(props) => props.theme.colors.primary};
    transform: translateX(5px);
  }

  &:last-child {
    margin-bottom: 0;
  }

  svg {
    margin-right: 0.75rem;
    font-size: 1.2rem;
  }
`;

const MobileMenuButton = styled(motion.button)`
  display: none;
  background: ${(props) => props.theme.colors.gradient.primary};
  color: white;
  font-size: 1.5rem;
  padding: 0.8rem;
  border-radius: 12px;
  box-shadow: ${(props) => props.theme.shadows.button};

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const MobileMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(255, 248, 231, 0.98);
  backdrop-filter: blur(20px);
  padding: 2rem;
  border-bottom: 1px solid rgba(255, 153, 51, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
`;

const MobileNavLink = styled(Link)`
  display: block;
  padding: 1.5rem 0;
  font-weight: 600;
  font-size: 1.2rem;
  color: ${(props) => props.theme.colors.text};
  border-bottom: 1px solid rgba(255, 153, 51, 0.1);
  transition: all 0.3s ease;
  position: relative;

  &:hover,
  &.active {
    color: ${(props) => props.theme.colors.primary};
    padding-left: 1rem;
  }

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 100%;
    background: rgba(255, 153, 51, 0.1);
    transition: width 0.3s ease;
  }

  &:hover::before,
  &.active::before {
    width: 4px;
  }
`;

const MobileDropdownItem = styled(Link)`
  display: block;
  padding: 1rem 0 1rem 2rem;
  font-weight: 600;
  font-size: 1.1rem;
  color: ${(props) => props.theme.colors.text};
  border-bottom: 1px solid rgba(255, 153, 51, 0.1);
  transition: all 0.3s ease;

  &:hover,
  &.active {
    color: ${(props) => props.theme.colors.primary};
    padding-left: 2.5rem;
  }
`;

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const location = useLocation();
  const loginRef = useRef(null);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    const handleClickOutside = (event) => {
      if (loginRef.current && !loginRef.current.contains(event.target)) {
        setLoginDropdownOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/temples", label: "Temples" },
    { path: "/about-us", label: "About Us" },
  ];

  const loginOptions = [
    {
      path: "/login",
      label: "Login as Admin",
      icon: (
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 16 16"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"></path>
          <path d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2Zm12 1a1 1 0 0 1 1 1v5.5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 5 9.5V4a1 1 0 0 1 1-1h8ZM2 12v-2h4v2H2Zm5-2v2h5v-2H7Z"></path>
        </svg>
      ),
    },
    {
      path: "/customer-login",
      label: "Login as User",
      icon: (
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 16 16"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"></path>
          <path
            fillRule="evenodd"
            d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
          ></path>
        </svg>
      ),
    },
    {
      path: "/seller-login",
      label: "Login as Seller",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M3 9V7l2-4h14l2 4v2h-2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9H3zm4 0v10h10V9H7zm2-4-1 2h8l-1-2H9z" />
        </svg>
      ),
    },
  ];

  return (
    <NavbarContainer
      scrolled={scrolled}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <NavContent>
        <Logo
          onClick={() => (window.location.href = "/")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <OmSymbol
            animate={{
              filter: [
                "drop-shadow(0 0 10px rgba(218, 165, 32, 0.5))",
                "drop-shadow(0 0 20px rgba(255, 153, 51, 0.8))",
                "drop-shadow(0 0 10px rgba(218, 165, 32, 0.5))",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          >
            ॐ
          </OmSymbol>
          Agamandira
        </Logo>

        <NavLinks>
          {navItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <NavLink
                to={item.path}
                className={location.pathname === item.path ? "active" : ""}
              >
                {item.label}
              </NavLink>
            </motion.div>
          ))}

          <LoginContainer
            ref={loginRef}
            onMouseEnter={() => setLoginDropdownOpen(true)}
            onMouseLeave={() => setLoginDropdownOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <NavLink
                to="/customer-login"
                className={
                  loginOptions.some(
                    (option) => location.pathname === option.path
                  )
                    ? "active"
                    : ""
                }
              >
                Login
              </NavLink>
            </motion.div>
          </LoginContainer>
        </NavLinks>

        <MobileMenuButton
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          ☰
        </MobileMenuButton>
      </NavContent>

      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileMenu
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {navItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <MobileNavLink
                  to={item.path}
                  className={location.pathname === item.path ? "active" : ""}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </MobileNavLink>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <MobileNavLink
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  // For mobile, we'll just show the options directly
                }}
              >
                Login
              </MobileNavLink>

              {loginOptions.map((option, index) => (
                <motion.div
                  key={option.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: (index + 1) * 0.1 + 0.4 }}
                >
                  <MobileDropdownItem
                    to={option.path}
                    className={
                      location.pathname === option.path ? "active" : ""
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {option.label}
                  </MobileDropdownItem>
                </motion.div>
              ))}
            </motion.div>
          </MobileMenu>
        )}
      </AnimatePresence>
    </NavbarContainer>
  );
};

export default Navbar;
