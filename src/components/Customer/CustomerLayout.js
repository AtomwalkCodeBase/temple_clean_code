import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMenu,
  FiX,
  FiBell,
  FiSearch,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { FaHome, FaCalendarAlt, FaBook } from "react-icons/fa";
import { IoPerson, IoSettingsSharp } from "react-icons/io5";
import { FaPersonWalkingDashedLineArrowRight } from "react-icons/fa6";
import { MdTempleHindu } from "react-icons/md";
import { useCustomerAuth } from "../../contexts/CustomerAuthContext";
import {
  BookAIcon,
  BookCheck,
  CheckCircleIcon,
  Notebook,
  NotebookIcon,
  NotebookTabs,
  ServerIcon,
} from "lucide-react";

/* Shared sizing */
const SIDEBAR_W_COLLAPSED = 88;
const SIDEBAR_W_EXPANDED = 260;
const NAV_HEIGHT = 88; // px

/* Global animation tokens */
const TRANSITION_EASE = "ease-in-out";
const TRANSITION_S = 0.3; // seconds (Framer + CSS)
const TRANSITION_CSS = `${TRANSITION_S}s ${TRANSITION_EASE}`;

/* Glass tokens */
const GLASS_BG_IDLE =
  "linear-gradient(135deg, rgb(255 255 255 / 18%), rgb(255 255 255 / 10%))";
const GLASS_BG_HOVER =
  "linear-gradient(135deg, rgb(255 255 255 / 24%), rgb(255 255 255 / 14%))";
const GLASS_HILITE = "rgb(255 255 255 / 25%)";
const GLASS_BLUR = "16px";
const GLASS_SAT = "140%";
const PURPLE = "#667eea";
const PURPLE_2 = "#764ba2";
const PURPLE_HOVER = "#7c3aed";
const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: radial-gradient(
      1100px 700px at 6% -12%,
      rgb(99 102 241 / 16%) 0%,
      transparent 60%
    ),
    radial-gradient(
      900px 600px at 96% 108%,
      rgb(16 185 129 / 14%) 0%,
      transparent 60%
    ),
    linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
`;

const Sidebar = styled(motion.div)`
  width: ${(props) =>
    props.collapsed ? `${SIDEBAR_W_COLLAPSED}px` : `${SIDEBAR_W_EXPANDED}px`};
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 1000;
  overflow: visible;

  /* IMPORTANT: do NOT transition width in CSS (Framer owns width) */
  transition: background ${TRANSITION_CSS}, box-shadow ${TRANSITION_CSS},
    border-color ${TRANSITION_CSS}, transform ${TRANSITION_CSS};

  background: ${GLASS_BG_IDLE};
  backdrop-filter: blur(${GLASS_BLUR}) saturate(${GLASS_SAT});
  -webkit-backdrop-filter: blur(${GLASS_BLUR}) saturate(${GLASS_SAT});

  box-shadow: 0 18px 48px rgb(17 24 39 / 14%), 0 4px 12px rgb(17 24 39 / 10%),
    inset 0 1px 0 ${GLASS_HILITE};
  border-right: 1px solid #0b020226;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    border-top-right-radius: 18px;
    border-bottom-right-radius: 18px;
    background: linear-gradient(
      180deg,
      rgb(255 255 255 / 18%) 0%,
      transparent 38%
    );
  }

  &:hover {
    background: ${GLASS_BG_HOVER};
    box-shadow: 0 22px 60px rgb(17 24 39 / 18%), 0 6px 16px rgb(17 24 39 / 12%),
      inset 0 1px 0 ${GLASS_HILITE};
  }

  @media (max-width: 768px) {
    transform: translateX(${(props) => (props.mobileOpen ? "0" : "-100%")});
    width: ${SIDEBAR_W_EXPANDED}px;
    transition: transform ${TRANSITION_CSS};
  }

  @supports not (
    (backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))
  ) {
    background: rgb(255 255 255 / 75%);
  }
`;

const SidebarHeader = styled.div`
  padding: 1.25rem 1.25rem 1rem 1.25rem;
  position: relative;
  display: flex;
  align-items: center;
  border-bottom: 0;

  /* Keep transitions consistent (if any style toggles happen) */
  transition: background ${TRANSITION_CSS}, color ${TRANSITION_CSS},
    border-color ${TRANSITION_CSS};

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 20px;
    right: 20px;
    height: 1px;
    background: #0b020226;
    pointer-events: none;
    border-radius: 1px;
    transition: background ${TRANSITION_CSS};
  }

  @media (max-width: 768px) {
    &::after {
      left: 16px;
      right: 16px;
    }
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  .om-symbol {
    font-size: 1.75rem;
    color: ${PURPLE};
    background: none;
    -webkit-text-fill-color: initial;
    filter: none;
  }

  .brand-text {
    display: ${(props) => (props.collapsed ? "none" : "block")};
    transition: opacity ${TRANSITION_CSS};

    .title {
      font-size: 1.08rem;
      font-weight: 800;
      margin: 0;
      color: #0f172a;
      letter-spacing: 0.2px;
    }

    .subtitle {
      font-size: 0.78rem;
      color: #94a3b8;
      margin: 0;
      font-weight: 500;
    }
  }
`;

const CollapseButton = styled.button`
  position: absolute;
  top: 50%;
  right: -18px;
  transform: translateY(-50%);
  width: 38px;
  height: 38px;
  border: 1px solid rgb(255 255 255 / 35%);
  border-radius: 20px;
  background: #6d28d9;
  backdrop-filter: blur(8px) saturate(140%);
  -webkit-backdrop-filter: blur(8px) saturate(140%);
  color: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.05rem;
  transition: transform 0.16s ${TRANSITION_EASE},
    background 0.16s ${TRANSITION_EASE}, box-shadow 0.16s ${TRANSITION_EASE},
    border-color 0.16s ${TRANSITION_EASE};
  box-shadow: 0 10px 22px rgba(109, 40, 217, 0.36),
    0 3px 8px rgba(17, 24, 39, 0.12), inset 0 1px 0 rgb(255 255 255 / 25%);
  z-index: 2000;
  pointer-events: auto;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: radial-gradient(
      120% 100% at -10% -20%,
      rgb(255 255 255 / 28%) 0%,
      transparent 50%
    );
    pointer-events: none;
    transition: opacity 0.16s ${TRANSITION_EASE};
    opacity: 0.8;
  }

  &:hover {
    transform: translateY(-50%) scale(1.06);
    border-color: rgb(255 255 255 / 50%);
    box-shadow: 0 14px 28px rgba(109, 40, 217, 0.42),
      0 5px 12px rgba(17, 24, 39, 0.16), inset 0 1px 0 rgb(255 255 255 / 28%);
  }

  &:active {
    transform: translateY(-50%) scale(0.97);
    box-shadow: 0 8px 18px rgba(109, 40, 217, 0.32),
      0 2px 8px rgba(17, 24, 39, 0.1), inset 0 1px 0 rgb(255 255 255 / 22%);
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const SidebarContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0.6rem 0;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #e5e7eb;
    border-radius: 4px;
  }
`;

const MenuSection = styled.div`
  margin: 0.5rem 0 1.2rem 0;
`;

const SectionTitle = styled.div`
  padding: 0 1.25rem 0.5rem;
  font-size: 0.72rem;
  font-weight: 700;
  color: #9aa4b2;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: ${(props) => (props.collapsed ? "none" : "block")};
  border-bottom: 1px solid rgb(255 255 255 / 18%);
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.72rem 1rem;
  margin: 0.28rem 0.75rem;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.18s ${TRANSITION_EASE},
    color 0.18s ${TRANSITION_EASE}, box-shadow 0.18s ${TRANSITION_EASE},
    border-color 0.18s ${TRANSITION_EASE};

  color: ${(props) => (props.active ? "#ffffff" : "#334155")};
  background: ${(props) =>
    props.active
      ? `linear-gradient(145deg, ${PURPLE}, ${PURPLE_2})`
      : "rgb(255 255 255 / 12%)"};
  border: 1px solid
    ${(props) => (props.active ? "transparent" : "rgb(255 255 255 / 22%)")};
  box-shadow: ${(props) =>
    props.active
      ? "0 2px 10px rgba(109, 40, 217, 0.35)"
      : "inset 0 1px 0 rgb(255 255 255 / 18%)"};

  &:hover {
    background: ${(props) =>
      props.active
        ? `linear-gradient(145deg, ${PURPLE_HOVER}, ${PURPLE_2})`
        : "rgb(255 255 255 / 18%)"};
    border-color: ${(props) =>
      props.active ? "transparent" : "rgb(255 255 255 / 30%)"};
    color: ${(props) => (props.active ? "#ffffff" : "#1f2937")};
    box-shadow: ${(props) =>
      props.active
        ? "0 4px 14px rgba(109, 40, 217, 0.42)"
        : "inset 0 1px 0 rgb(255 255 255 / 22%), 0 2px 8px rgb(15 23 42 / 6%)"};
  }

  .icon {
    font-size: 1.22rem;
    min-width: 1.22rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${(props) => (props.active ? "#ffffff" : "#6b7280")};
    transition: color 0.18s ${TRANSITION_EASE};
  }

  .label {
    margin-left: 0.9rem;
    font-weight: 600;
    font-size: 0.95rem;
    display: ${(props) => (props.collapsed ? "none" : "block")};
    color: inherit;
  }

  .badge {
    margin-left: auto;
    background: #ef4444;
    color: #ffffff;
    font-size: 0.7rem;
    padding: 0.125rem 0.375rem;
    border-radius: 9999px;
    min-width: 1rem;
    height: 1rem;
    display: ${(props) => (props.collapsed ? "none" : "flex")};
    align-items: center;
    justify-content: center;
    font-weight: 600;
    box-shadow: 0 1px 3px rgba(239, 68, 68, 0.35);
  }
`;

const MainContent = styled.div`
  flex: 1;
  margin-left: ${(props) =>
    props.sidebarCollapsed
      ? `${SIDEBAR_W_COLLAPSED}px`
      : `${SIDEBAR_W_EXPANDED}px`};
  padding-top: ${NAV_HEIGHT}px; /* space for fixed navbar */
  transition: margin-left ${TRANSITION_CSS};
  will-change: margin-left;

  @media (max-width: 768px) {
    margin-left: 0;
    padding-top: ${NAV_HEIGHT}px;
  }
`;

/* Fixed navbar aligned to sidebar width */
const TopNavbar = styled.div`
  background: rgb(255 255 255 / 52%);
  backdrop-filter: blur(10px) saturate(130%);
  -webkit-backdrop-filter: blur(10px) saturate(130%);
  border-bottom: 1px solid rgb(255 255 255 / 36%);
  box-shadow: 0 6px 18px rgb(17 24 39 / 10%),
    inset 0 1px 0 rgb(255 255 255 / 30%);

  height: ${NAV_HEIGHT}px;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  position: fixed;
  top: 0;
  left: ${(props) =>
    props.sidebarCollapsed
      ? `${SIDEBAR_W_COLLAPSED}px`
      : `${SIDEBAR_W_EXPANDED}px`};
  right: 0;
  z-index: 900; /* above sidebar */

  /* Smooth realignment when sidebar width changes */
  transition: left ${TRANSITION_CSS};
  will-change: left;

  @media (max-width: 768px) {
    left: 0;
    padding: 0 1.5rem;
  }
`;

const NavLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s ${TRANSITION_EASE};

  &:hover {
    background: rgb(255 255 255 / 40%);
  }

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  max-width: 420px;
  flex: 1;
  border: 1px solid #0b020226;
  border-radius: 12px;

  .search-icon {
    position: absolute;
    left: 0.9rem;
    top: 50%;
    transform: translateY(-50%);
    color: black;
    font-size: 1rem;
  }

  input {
    width: 100%;
    padding: 0.72rem 1rem 0.72rem 2.4rem;
    border: 1px solid rgb(255 255 255 / 38%);
    border-radius: 12px;
    font-size: 0.92rem;
    background: rgb(255 255 255 / 46%);
    backdrop-filter: blur(8px) saturate(125%);
    -webkit-backdrop-filter: blur(8px) saturate(125%);
    transition: all 0.2s ${TRANSITION_EASE};
    color: #111827;

    &:focus {
      outline: none;
      border-color: ${PURPLE};
      box-shadow: 0 0 0 3px rgb(109 40 217 / 18%);
      background: rgb(255 255 255 / 58%);
    }

    &::placeholder {
      color: #9ca3af;
    }
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const NotificationButton = styled(motion.button)`
  background: rgb(255 255 255 / 46%);
  border: 1px solid rgb(255 255 255 / 36%);
  backdrop-filter: blur(8px) saturate(125%);
  -webkit-backdrop-filter: blur(8px) saturate(125%);
  border-radius: 12px;
  padding: 0.6rem;
  color: #6b7280;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.18s ${TRANSITION_EASE};
  font-size: 1.25rem;
  position: relative;
  border: 1px solid #0b020226;

  &:hover {
    background: rgb(255 255 255 / 58%);
    color: #374151;
    box-shadow: inset 0 1px 0 rgb(255 255 255 / 28%);
  }

  .badge {
    position: absolute;
    top: 0.35rem;
    right: 0.35rem;
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: white;
    font-size: 0.7rem;
    padding: 0.125rem 0.375rem;
    border-radius: 9999px;
    min-width: 1rem;
    height: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);
  }
`;

const UserMenu = styled.div`
  position: relative;
  border: 1px solid #0b020226;
  border-radius: 12px;
`;

const UserButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgb(255 255 255 / 46%);
  border: 1px solid rgb(255 255 255 / 36%);
  backdrop-filter: blur(8px) saturate(125%);
  -webkit-backdrop-filter: blur(8px) saturate(125%);
  cursor: pointer;
  padding: 0.5rem 0.8rem;
  border-radius: 12px;
  transition: all 0.18s ${TRANSITION_EASE};

  &:hover {
    background: rgb(255 255 255 / 58%);
    border-color: rgb(255 255 255 / 42%);
  }
`;

const UserAvatar = styled.div`
  width: 2.25rem;
  height: 2.25rem;
  background: linear-gradient(135deg, ${PURPLE}, ${PURPLE_2});
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
  box-shadow: 0 2px 8px rgba(109, 40, 217, 0.3);
`;

const UserInfo = styled.div`
  text-align: left;

  .name {
    font-weight: 600;
    color: #1f2937;
    font-size: 0.9rem;
    margin: 0;
  }

  .role {
    font-size: 0.75rem;
    color: #6b7280;
    margin: 0;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const PageContent = styled.div`
  padding: 2rem;
  min-height: calc(100vh - 80px);

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const MobileOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

const CustomerLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      const saved = localStorage.getItem("sidebarCollapsed");
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        "sidebarCollapsed",
        JSON.stringify(sidebarCollapsed)
      );
    } catch {
      /* ignore storage failures */
    }
  }, [sidebarCollapsed]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { customerData, logout } = useCustomerAuth();
  const custmercode = localStorage.getItem("customerRefCode");
  let menuItems = [];

  if (custmercode?.startsWith("S")) {
    // ✅ Only Dashboard + Profile
    menuItems = [
      {
        section: "Main",
        items: [
          {
            path: "/customer-dashboard",
            icon: FaHome,
            label: "Dashboard",
            badge: null,
          },
          {
            path: "/seller-Application",
            icon: FaBook,
            label: "My Application",
            badge: null,
          },
        ],
      },
    ];
  } else {
    // ✅ Full menu
    menuItems = [
      {
        section: "Main",
        items: [
          {
            path: "/customer-dashboard",
            icon: FaHome,
            label: "Dashboard",
            badge: null,
          },
          {
            path: "/customer-services",
            icon: ServerIcon,
            label: "All Services",
            badge: null,
          },
          {
            path: "/customer-temples",
            icon: MdTempleHindu,
            label: "Temples",
            badge: null,
          },
          {
            path: "/customer-bookings",
            icon: FaCalendarAlt,
            label: "My Bookings",
            badge: null,
          },
        ],
      },
      {
        section: "Account",
        items: [
          {
            path: "/customer-profile",
            icon: IoPerson,
            label: "Profile",
            badge: null,
          },
          {
            path: "/customer-settings",
            icon: IoSettingsSharp,
            label: "Settings",
            badge: null,
          },
        ],
      },
    ];
  }
  const handleMenuClick = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/customer-login");
  };

  const getUserInitials = () => {
    if (customerData?.custRefCode) {
      return customerData.custRefCode.charAt(0).toUpperCase();
    }
    return "C";
  };

  return (
    <LayoutContainer>
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        initial={false}
        animate={{
          width: sidebarCollapsed ? SIDEBAR_W_COLLAPSED : SIDEBAR_W_EXPANDED,
        }}
        transition={{ duration: TRANSITION_S, ease: "easeInOut" }}
      >
        <SidebarHeader>
          <Logo collapsed={sidebarCollapsed}>
            <motion.div
              className="om-symbol"
              animate={{ opacity: [0.9, 1, 0.9] }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            >
              🕉️
            </motion.div>
            <div className="brand-text">
              <div className="title">Temple Connect</div>
              <div className="subtitle">{customerData?.custRefCode}</div>
            </div>
          </Logo>

          <CollapseButton
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label="Toggle sidebar"
            title="Toggle sidebar"
          >
            {sidebarCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </CollapseButton>
        </SidebarHeader>

        <SidebarContent>
          {menuItems.map((section, sectionIndex) => (
            <MenuSection key={sectionIndex}>
              <SectionTitle collapsed={sidebarCollapsed}>
                {section.section}
              </SectionTitle>
              {section.items.map((item, itemIndex) => (
                <MenuItem
                  key={itemIndex}
                  active={location.pathname === item.path}
                  collapsed={sidebarCollapsed}
                  onClick={() => handleMenuClick(item.path)}
                >
                  <span className="icon">
                    <item.icon />
                  </span>
                  <span className="label">{item.label}</span>
                  {item.badge && <span className="badge">{item.badge}</span>}
                </MenuItem>
              ))}
            </MenuSection>
          ))}

          <MenuSection>
            <MenuItem collapsed={sidebarCollapsed} onClick={handleLogout}>
              <span className="icon">
                <FaPersonWalkingDashedLineArrowRight />
              </span>
              <span className="label">Logout</span>
            </MenuItem>
          </MenuSection>
        </SidebarContent>
      </Sidebar>

      <MainContent sidebarCollapsed={sidebarCollapsed}>
        {/* PASS THE PROP HERE */}
        <TopNavbar sidebarCollapsed={sidebarCollapsed}>
          <NavLeft>
            <MobileMenuButton
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FiX /> : <FiMenu />}
            </MobileMenuButton>

            <SearchContainer>
              <FiSearch className="search-icon" />
              <input type="text" placeholder="Search temples, services..." />
            </SearchContainer>
          </NavLeft>

          <NavRight>
            {/* <NotificationButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiBell />
              <span className="badge">2</span>
            </NotificationButton> */}

            <UserMenu>
              <UserButton
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <UserAvatar>{getUserInitials()}</UserAvatar>
                <UserInfo>
                  <div className="name">Devotee</div>
                  <div className="role">{customerData?.custRefCode}</div>
                </UserInfo>
                <FiChevronDown />
              </UserButton>
            </UserMenu>
          </NavRight>
        </TopNavbar>

        <PageContent>{children}</PageContent>
      </MainContent>

      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </LayoutContainer>
  );
};

export default CustomerLayout;
