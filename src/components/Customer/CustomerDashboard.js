import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
  FiCalendar,
  FiMapPin,
  FiActivity,
  FiArrowRight,
  FiUser,
  FiClock,
} from "react-icons/fi";
import {
  FaClipboardList,
  FaHourglassHalf,
  FaCheckCircle,
} from "react-icons/fa";
import { MdTempleHindu, MdEmojiPeople } from "react-icons/md";
import { useCustomerAuth } from "../../contexts/CustomerAuthContext";
import { getBookingList } from "../../services/customerServices";
import CustomerLayout from "../../components/Customer/CustomerLayout";

const DashboardContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const WelcomeSection = styled(motion.div)`
  background: #f9fafb;
  border-radius: 1.5rem;
  padding: 3rem;
  color: #1f2937;
  margin-bottom: 2.5rem;
  position: relative;
  overflow: hidden;
  border: 2px solid transparent;
  background-clip: padding-box;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 6px;
    width: 100%;
    background: linear-gradient(
      90deg,
      #6366f1,
      #8b5cf6,
      #ec4899,
      #f59e0b,
      #10b981
    );
    background-size: 300% 100%;
    animation: gradientMove 6s infinite linear;
    border-top-left-radius: 1.5rem;
    border-top-right-radius: 1.5rem;
  }

  @keyframes gradientMove {
    0% {
      background-position: 0% 50%;
    }
    100% {
      background-position: 100% 50%;
    }
  }

  .welcome-content {
    position: relative;
    z-index: 1;
  }

  .greeting {
    font-size: 2.2rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
    color: #111827;
  }

  .subtitle {
    font-size: 1.15rem;
    color: #4b5563;
    margin-bottom: 2rem;
    max-width: 650px;
    line-height: 1.6;
  }

  .quick-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
  }

  .stat {
    display: flex;
    /* text-align: center; */
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 1rem;
    backdrop-filter: blur(15px);
    border: 1px solid rgba(229, 231, 235, 0.8);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    animation: fadeInUp 0.6s ease-out forwards;
    opacity: 0;

    &:nth-child(1) {
      animation-delay: 0.1s;
      .icon {
        color: #6366f1;
      }
    }
    &:nth-child(2) {
      animation-delay: 0.2s;
      .icon {
        color: #10b981;
      }
    }
    &:nth-child(3) {
      animation-delay: 0.3s;
      .icon {
        color: #f59e0b;
      }
    }

    &:hover {
      transform: translateY(-6px);
      box-shadow: 0 12px 25px rgba(0, 0, 0, 0.1);
    }

    .icon {
      font-size: 2rem;
      margin-bottom: 0.75rem;
      transition: transform 0.3s ease;
    }

    .number {
      font-size: 1.9rem;
      font-weight: 700;
      margin-bottom: 0.25rem;
      color: #111827;
    }

    .label {
      font-size: 0.95rem;
      color: #6b7280;
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    padding: 1.8rem;

    .greeting {
      font-size: 1.9rem;
    }

    .subtitle {
      font-size: 1rem;
    }

    .quick-stats {
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const StatCard = styled(motion.div)`
  cursor: pointer;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 1.5rem;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08),
    0 0 0 1px rgba(255, 255, 255, 0.5) inset;

  &:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15),
      0 0 0 1px rgba(255, 255, 255, 0.8) inset;
  }

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
      rgba(255, 255, 255, 0.6),
      transparent
    );
    transition: left 0.6s;
  }

  &:hover::before {
    left: 100%;
  }

  &::after {
    content: "";
    position: absolute;
    top: -50%;
    right: -50%;
    width: 100%;
    height: 200%;
    background: ${(props) => props.color || "#4f46e5"};
    opacity: 0.05;
    border-radius: 50%;
    transition: all 0.4s ease;
  }

  &:hover::after {
    opacity: 0.1;
    transform: scale(1.5);
  }

  .stat-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1.5rem;
  }

  .stat-icon {
    width: 4rem;
    height: 4rem;
    border-radius: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: white;
    background: linear-gradient(
      135deg,
      ${(props) => props.color || "#4f46e5"} 0%,
      ${(props) => (props.color ? `${props.color}dd` : "#3730a3")} 100%
    );
    box-shadow: 0 10px 25px rgba(79, 70, 229, 0.3);
    position: relative;
    transition: all 0.3s ease;

    &::before {
      content: "";
      position: absolute;
      inset: -2px;
      background: linear-gradient(
        135deg,
        ${(props) => props.color || "#4f46e5"},
        transparent
      );
      border-radius: inherit;
      z-index: -1;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    svg {
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
    }
  }

  &:hover .stat-icon {
    transform: rotate(10deg) scale(1.1);

    &::before {
      opacity: 1;
    }
  }

  .stat-content {
    position: relative;
    z-index: 2;
  }

  .stat-value {
    font-size: 1.5rem;
    font-weight: 800;
    color: #1f2937;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, #1f2937, #4f46e5);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .stat-label {
    color: #64748b;
    font-size: 1.1rem;
    font-weight: 600;
    line-height: 1.4;
  }

  .stat-description {
    color: #94a3b8;
    font-size: 0.9rem;
    margin-top: 0.5rem;
    line-height: 1.4;
  }
`;

const ContentGrid = styled.div`
  /* display: grid; */
  grid-template-columns: 1.6fr 1fr;
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const RecentBookings = styled(motion.div)`
  background: linear-gradient(180deg, #ffffff, #f9fafb);
  border-radius: 1.25rem;
  padding: 2rem;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.75rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #f1f5f9;

    h3 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #111827;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .view-all {
      color: #2563eb;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.95rem;
      display: flex;
      align-items: center;
      gap: 0.35rem;
      transition: all 0.2s ease;

      &:hover {
        color: #1d4ed8;
        transform: translateX(2px);
      }
    }
  }
`;

const BookingItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1.2rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid #f3f4f6;
  margin-bottom: 1rem;
  transition: all 0.25s ease;
  cursor: pointer;
  backdrop-filter: blur(10px);

  &:hover {
    background: #f9fafb;
    border-color: #e2e8f0;
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
  }

  .booking-icon {
    width: 3rem;
    height: 3rem;
    border-radius: 0.75rem;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.5rem;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  }

  .booking-details {
    flex: 1;
    min-width: 0;

    .service-name {
      font-weight: 700;
      font-size: 1.05rem;
      color: #111827;
      margin-bottom: 0.3rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .booking-info {
      display: flex;
      align-items: center;
      gap: 1.2rem;
      font-size: 0.85rem;
      color: #6b7280;
      flex-wrap: wrap;

      .info-item {
        display: flex;
        align-items: center;
        gap: 0.3rem;
        white-space: nowrap;
      }
    }
  }

  .booking-status {
    padding: 0.4rem 0.9rem;
    border-radius: 999px;
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: capitalize;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.05);

    &.booked {
      background: #eef2ff;
      color: #3730a3;
    }

    &.completed {
      background: #dcfce7;
      color: #166534;
    }

    &.cancelled {
      background: #fee2e2;
      color: #991b1b;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3.5rem 1rem;
  color: #6b7280;

  .icon {
    font-size: 3.8rem;
    margin-bottom: 1.25rem;
    opacity: 0.6;
  }

  .title {
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: #111827;
  }

  .subtitle {
    font-size: 0.9rem;
    max-width: 320px;
    margin: 0 auto;
    line-height: 1.5;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.6rem;
  font-weight: 800;
  color: #111827;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;

const CustomerDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { customerData } = useCustomerAuth();

  useEffect(() => {
    loadRecentBookings();
  }, [customerData]);

  const loadRecentBookings = async () => {
    try {
      if (customerData?.custRefCode) {
        const response = await getBookingList(customerData.custRefCode);
        setBookings(response || []);
      }
    } catch (error) {
      console.error("Error loading bookings:", error);
    } finally {
      setLoading(false);
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

  // Calculate stats based on actual data
  const totalBookings = bookings.length;
  const activeBookings = bookings.filter((b) => b.status === "B").length;
  const completedBookings = bookings.filter((b) => b.status === "C").length;
  const mybooking = (data) => {
    navigate(`/customer-bookings?status=${data}`);
  };
  return (
    <CustomerLayout>
      <DashboardContainer>
        <WelcomeSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="welcome-content">
            <div className="greeting">
              <MdEmojiPeople /> Namaste, {customerData?.name || "Devotee"}!
            </div>
            <div className="subtitle">
              Welcome to your spiritual journey dashboard. Manage your bookings
              and continue your divine experiences.
            </div>

            <div className="quick-stats">
              <StatCard onClick={() => mybooking("A")}>
                <div className="stat">
                  <div>
                    <div className="stat-value">{totalBookings}</div>
                    <div className="stat-label">Total Bookings</div>
                  </div>
                  <div className="stat-icon">
                    <FaClipboardList />
                  </div>
                </div>
              </StatCard>
              <StatCard color="#10b981" onClick={() => mybooking("B")}>
                <div className="stat">
                  <div>
                    <div className="stat-value">{activeBookings}</div>
                    <div className="stat-label">Active Bookings</div>
                  </div>
                  <div className="stat-icon">
                    <FaHourglassHalf />
                  </div>
                </div>
              </StatCard>
              <StatCard color="#f59e0b" onClick={() => mybooking("C")}>
                <div className="stat">
                  <div>
                    <div className="number">{completedBookings}</div>
                    <div className="stat-label">Completed</div>
                  </div>
                  <div className="stat-icon">
                    <FaCheckCircle />
                  </div>
                </div>
              </StatCard>
            </div>
          </div>
        </WelcomeSection>

        <SectionTitle>
          <FiActivity /> Dashboard Overview
        </SectionTitle>

        <StatsGrid>
          <StatCard
            onClick={() => navigate("/customer-temples")}
            color="#4f46e5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="stat-header">
              <div>
                <div className="stat-value">Book New Seva</div>
                <div className="stat-label">Find temples and book services</div>
              </div>
              <div className="stat-icon">
                <MdTempleHindu />
              </div>
            </div>
          </StatCard>
          <StatCard
            onClick={() => navigate("/customer-bookings")}
            color="#10b981"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="stat-header">
              <div>
                <div className="stat-value">View Bookings</div>
                <div className="stat-label">Manage your bookings</div>
              </div>
              <div className="stat-icon">
                <FiCalendar />
              </div>
            </div>
          </StatCard>

          <StatCard
            onClick={() => navigate("/customer-profile")}
            color="#f59e0b"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="stat-header">
              <div>
                <div className="stat-value">Profile Settings</div>
                <div className="stat-label">Update your information</div>
              </div>
              <div className="stat-icon">
                <FiUser />
              </div>
            </div>
          </StatCard>
        </StatsGrid>

        <ContentGrid>
          <RecentBookings
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="section-header">
              <h3>Recent Bookings</h3>
              <a href="/customer-bookings" className="view-all">
                View All <FiArrowRight />
              </a>
            </div>

            {loading ? (
              <EmptyState>
                <div className="icon">
                  <FiClock />
                </div>
                <div className="title">Loading bookings...</div>
                <div className="subtitle">
                  Please wait while we fetch your spiritual journey details
                </div>
              </EmptyState>
            ) : bookings.length > 0 ? (
              bookings
                .slice(-5)
                .reverse()
                .map((booking, index) => (
                  <BookingItem
                    key={booking.booking_ref_code || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    onClick={() =>
                      navigate(`/booking-details/${booking.booking_ref_code}`)
                    }
                  >
                    <div className="booking-icon">
                      <MdTempleHindu />
                    </div>
                    <div className="booking-details">
                      <div className="service-name">
                        {booking.service_data?.name || "Religious Service"}
                      </div>
                      <div className="booking-info">
                        <div className="info-item">
                          <FiCalendar />
                          {booking.booking_date || "Date not available"}
                        </div>
                        <div className="info-item">
                          <FiMapPin />
                          {booking.service_data?.temple_name || "Temple"}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`booking-status ${getStatusClass(
                        booking.status
                      )}`}
                    >
                      {getStatusText(booking.status)}
                    </div>
                  </BookingItem>
                ))
            ) : (
              <EmptyState>
                <div className="icon">🙏</div>
                <div className="title">No bookings yet</div>
                <div className="subtitle">
                  Start your spiritual journey by booking a seva
                </div>
              </EmptyState>
            )}
          </RecentBookings>
        </ContentGrid>
      </DashboardContainer>
    </CustomerLayout>
  );
};

export default CustomerDashboard;
