"use client";

import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
  Building2,
  Bookmark,
  Calendar,
  Settings,
  ChevronRight,
} from "lucide-react";
import {
  getTempleServicesList,
  getAdminBookingList,
} from "../../services/templeServices";

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f8fafc 100%);
  padding: 16px 24px;

  @media (max-width: 768px) {
    padding: 12px 16px;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  max-width: 1000px;
  margin: 0 auto;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    max-width: 400px;
  }
`;

const ServiceCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(226, 232, 240, 0.3);
  border-radius: 28px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);

  &:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: 0 20px 56px rgba(0, 0, 0, 0.15);
    border-color: ${(props) => props.hoverColor || "rgba(59, 130, 246, 0.3)"};
  }
`;

const CardHeader = styled.div`
  background: ${(props) => props.bgGradient};
  padding: 28px;
  position: relative;
`;

const StatusBadge = styled.div`
  position: absolute;
  top: 18px;
  right: 18px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 18px;
  padding: 5px 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  span {
    font-size: 11px;
    font-weight: 600;
    color: #059669;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;

const IconWrapper = styled.div`
  width: 60px;
  height: 60px;
  background: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  ${ServiceCard}:hover & {
    transform: scale(1.1);
  }
`;

const CardTitle = styled.h3`
  font-size: 22px;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 6px 0;
  letter-spacing: -0.025em;
  line-height: 1.2;
`;

const CardSubtitle = styled.p`
  font-size: 15px;
  color: #64748b;
  margin: 0 0 20px 0;
  line-height: 1.5;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

const MetricCard = styled.div`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 14px;
  padding: 14px;
  text-align: center;

  .metric-value {
    font-size: 22px;
    font-weight: 700;
    color: ${(props) => props.textColor || "#0f172a"};
    margin-bottom: 4px;
    line-height: 1;
  }

  .metric-label {
    font-size: 11px;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;

const CardContent = styled.div`
  padding: 28px;
`;

const CardDescription = styled.p`
  font-size: 14px;
  color: #64748b;
  margin: 0 0 20px 0;
  line-height: 1.6;
`;

const ActionButton = styled.button`
  width: 100%;
  background: #0f172a;
  color: white;
  border: none;
  border-radius: 18px;
  padding: 14px 20px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.2);

  &:hover {
    background: ${(props) => props.hoverColor || "#1e293b"};
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(15, 23, 42, 0.3);
  }

  .chevron {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover .chevron {
    transform: translateX(4px);
  }
`;

const BottomSection = styled.div`
  text-align: center;
  margin-top: 48px;

  .status-indicator {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #64748b;

    .dot {
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

const LoaderWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 16px;
  color: #64748b;
`;

const Spinner = styled.div`
  width: 36px;
  height: 36px;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #2563eb;
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

const TempleServices = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);
  const templeId = localStorage.getItem("templeId") || null;
  const [loading, setLoading] = useState(true);

  const [metrics, setMetrics] = useState({
    HALL: { total: 0, bookings: 0 },
    PUJA: { total: 0, bookings: 0 },
    EVENT: { total: 0, bookings: 0 },
    TOTALS: { services: 0, bookings: 0 },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch services and count totals per type for this temple
        const svcResp = await getTempleServicesList(templeId);
        const svcList = Array.isArray(svcResp)
          ? svcResp
          : Array.isArray(svcResp?.data)
          ? svcResp.data
          : Array.isArray(svcResp?.results)
          ? svcResp.results
          : Array.isArray(svcResp?.services)
          ? svcResp.services
          : [];
        const byTemple = svcList.filter(
          (s) => !templeId || String(s?.temple_id) === String(templeId)
        );
        const totalHall = byTemple.filter(
          (s) => (s?.service_type || "").toString().toUpperCase() === "HALL"
        ).length;
        const totalPuja = byTemple.filter(
          (s) => (s?.service_type || "").toString().toUpperCase() === "PUJA"
        ).length;
        const totalEvent = byTemple.filter(
          (s) => (s?.service_type || "").toString().toUpperCase() === "EVENT"
        ).length;

        // Build service_id sets per type for accurate booking attribution
        const hallServiceIds = new Set(
          byTemple
            .filter(
              (s) => (s?.service_type || "").toString().toUpperCase() === "HALL"
            )
            .map((s) => s?.service_id || s?.service_ref_code || s?.id)
            .filter(Boolean)
        );
        const pujaServiceIds = new Set(
          byTemple
            .filter(
              (s) => (s?.service_type || "").toString().toUpperCase() === "PUJA"
            )
            .map((s) => s?.service_id || s?.service_ref_code || s?.id)
            .filter(Boolean)
        );
        const eventServiceIds = new Set(
          byTemple
            .filter(
              (s) =>
                (s?.service_type || "").toString().toUpperCase() === "EVENT"
            )
            .map((s) => s?.service_id || s?.service_ref_code || s?.id)
            .filter(Boolean)
        );

        // Fetch all bookings for this temple and split by type using service_id mapping
        const bookingsResp = await getAdminBookingList({ temple_id: templeId });
        const list = Array.isArray(bookingsResp)
          ? bookingsResp
          : Array.isArray(bookingsResp?.data)
          ? bookingsResp.data
          : Array.isArray(bookingsResp?.results)
          ? bookingsResp.results
          : [];

        // Defensive temple guard
        const templeScoped = list.filter(
          (b) =>
            String(b?.service_data?.temple_id || "") === String(templeId || "")
        );

        // Normalize type since backend may return different display strings
        const normalizeType = (svc) => {
          const typeRaw = (svc?.service_type || "").toString().toUpperCase();
          if (typeRaw === "PUJA" || typeRaw === "HALL" || typeRaw === "EVENT")
            return typeRaw;
          const typeStr = (svc?.service_type_str || "")
            .toString()
            .toUpperCase();
          if (typeStr.includes("PUJA")) return "PUJA";
          if (typeStr.includes("HALL")) return "HALL";
          if (typeStr.includes("EVENT")) return "EVENT";
          return "";
        };

        const hallBookings = templeScoped.filter((b) => {
          const svc = b?.service_data || {};
          const type = normalizeType(svc);
          const sid = svc?.service_id;
          return type === "HALL" && sid && hallServiceIds.has(sid);
        }).length;

        const pujaBookings = templeScoped.filter((b) => {
          const svc = b?.service_data || {};
          const type = normalizeType(svc);
          const sid = svc?.service_id;
          return type === "PUJA" && sid && pujaServiceIds.has(sid);
        }).length;

        const eventBookings = templeScoped.filter((b) => {
          const svc = b?.service_data || {};
          const type = normalizeType(svc);
          const sid = svc?.service_id;
          return type === "EVENT" && sid && eventServiceIds.has(sid);
        }).length;

        setMetrics({
          HALL: { total: totalHall, bookings: hallBookings },
          PUJA: { total: totalPuja, bookings: pujaBookings },
          EVENT: { total: totalEvent, bookings: eventBookings },
          TOTALS: {
            services: totalHall + totalPuja + totalEvent,
            bookings: hallBookings + pujaBookings + eventBookings,
          },
        });
      } catch (e) {
        setMetrics({
          HALL: { total: 0, bookings: 0 },
          PUJA: { total: 0, bookings: 0 },
          EVENT: { total: 0, bookings: 0 },
          TOTALS: { services: 0, bookings: 0 },
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const services = useMemo(
    () => [
      {
        id: 1,
        title: "Sacred Halls",
        subtitle: "Wedding ceremonies & cultural events",
        description: "Book your hall services from here",
        icon: Building2,
        bgGradient: "linear-gradient(135deg, #fef7e0 0%, #fde68a 100%)",
        textColor: "#d97706",
        hoverColor: "rgba(217, 119, 6, 0.3)",
        metrics: {
          total: String(metrics.HALL.total || 0),
          bookings: String(metrics.HALL.bookings || 0),
        },
        route: "/halls-management?service=HALL",
      },
      {
        id: 2,
        title: "Divine Puja",
        subtitle: "Traditional rituals by learned priests",
        description: "Book your puja services from here",
        icon: Bookmark,
        bgGradient: "linear-gradient(135deg, #eff6ff 0%, #bfdbfe 100%)",
        textColor: "#2563eb",
        hoverColor: "rgba(37, 99, 235, 0.3)",
        metrics: {
          total: String(metrics.PUJA.total || 0),
          bookings: String(metrics.PUJA.bookings || 0),
        },
        route: "/halls-management?service=PUJA",
      },
      {
        id: 3,
        title: "Temple Events",
        subtitle: "Festivals & community programs",
        description: "Book your event services from here",
        icon: Calendar,
        bgGradient: "linear-gradient(135deg, #fdf4ff 0%, #e9d5ff 100%)",
        textColor: "#9333ea",
        hoverColor: "rgba(147, 51, 234, 0.3)",
        metrics: {
          total: String(metrics.EVENT.total || 0),
          bookings: String(metrics.EVENT.bookings || 0),
        },
        route: "/halls-management?service=EVENT",
      },
    ],
    [metrics]
  );

  const handleServiceClick = (service) => {
    navigate(service.route);
  };

  return (
    <PageContainer>
      <ContentWrapper>
        <HeaderSection>
          {/* Removed the HeaderBadge with Sparkles icon */}
        </HeaderSection>

        {loading ? (
          <LoaderWrap>
            <Spinner />
          </LoaderWrap>
        ) : (
          <ServicesGrid>
            {services.map((service, index) => {
              const IconComponent = service.icon;

              return (
                <ServiceCard
                  key={service.id}
                  hoverColor={service.hoverColor}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.15,
                    ease: "easeOut",
                  }}
                  onMouseEnter={() => setHoveredCard(service.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => handleServiceClick(service)}
                >
                  <CardHeader bgGradient={service.bgGradient}>
                    <StatusBadge>
                      <span>Active</span>
                    </StatusBadge>

                    <IconWrapper>
                      <IconComponent size={30} color={service.textColor} />
                    </IconWrapper>

                    <CardTitle>{service.title}</CardTitle>
                    <CardSubtitle>{service.subtitle}</CardSubtitle>

                    <MetricsGrid>
                      <MetricCard textColor={service.textColor}>
                        <div className="metric-value">
                          {service.metrics.total}
                        </div>
                        <div className="metric-label">Total</div>
                      </MetricCard>
                      <MetricCard textColor={service.textColor}>
                        <div className="metric-value">
                          {service.metrics.bookings}
                        </div>
                        <div className="metric-label">Bookings</div>
                      </MetricCard>
                    </MetricsGrid>
                  </CardHeader>

                  <CardContent>
                    <CardDescription>{service.description}</CardDescription>

                    <ActionButton
                      hoverColor={service.textColor}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleServiceClick(service);
                      }}
                    >
                      <Settings size={18} />
                      Manage Service
                      <ChevronRight size={18} className="chevron" />
                    </ActionButton>
                  </CardContent>
                </ServiceCard>
              );
            })}
          </ServicesGrid>
        )}

        {/* <BottomSection>
          <div className="status-indicator">
            <div className="dot"></div>
            All services are currently operational
          </div>
        </BottomSection> */}
      </ContentWrapper>
    </PageContainer>
  );
};

export default TempleServices;
