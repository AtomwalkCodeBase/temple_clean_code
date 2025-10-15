"use client";

import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiClock,
  FiUsers,
  FiMapPin,
  FiChevronLeft,
  FiChevronRight,
  FiStar,
  FiCalendar,
} from "react-icons/fi";
import {
  IndianRupee,
  Shield,
  RotateCcw,
  Percent,
  Clock,
  Crown,
  Zap,
} from "lucide-react";
import { useState } from "react";

const ListWrapper = styled.div`
  display: grid;
  gap: 3rem;
`;

const ServiceCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 32px;
  overflow: hidden;
  position: relative;

  /* Glassmorphism with subtle gradient border */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    padding: 2px;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.3),
      rgba(102, 126, 234, 0.2),
      rgba(118, 75, 162, 0.2),
      rgba(240, 147, 251, 0.2)
    );
    border-radius: 32px;
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: xor;
    -webkit-mask-composite: xor;
  }

  /* Animated background */
  &::after {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: conic-gradient(
      from 0deg,
      transparent 0deg,
      rgba(102, 126, 234, 0.03) 60deg,
      rgba(118, 75, 162, 0.03) 120deg,
      rgba(240, 147, 251, 0.03) 180deg,
      rgba(245, 87, 108, 0.03) 240deg,
      transparent 300deg,
      transparent 360deg
    );
    animation: rotate 20s linear infinite;
    z-index: -1;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  &:hover {
    transform: translateY(-12px);
    box-shadow: 0 40px 80px rgba(0, 0, 0, 0.15),
      0 0 0 1px rgba(255, 255, 255, 0.1) inset;

    &::before {
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.4),
        rgba(102, 126, 234, 0.3),
        rgba(118, 75, 162, 0.3),
        rgba(240, 147, 251, 0.3)
      );
    }
  }
`;

const ImageSliderSection = styled.div`
  position: relative;
  height: 400px;
  overflow: hidden;
  background: linear-gradient(135deg, #1e293b, #334155);

  .slider-container {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .slide-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
  }

  .gradient-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(
      180deg,
      transparent 0%,
      rgba(0, 0, 0, 0.7) 100%
    );
    z-index: 2;
  }

  .slider-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border: none;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 3;
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

    &:hover {
      background: white;
      transform: translateY(-50%) scale(1.1);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    }

    &.prev {
      left: 1rem;
    }

    &.next {
      right: 1rem;
    }

    svg {
      color: #1e293b;
    }
  }

  .dots-indicator {
    position: absolute;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 0.5rem;
    z-index: 3;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    cursor: pointer;
    transition: all 0.3s ease;

    &.active {
      background: white;
      transform: scale(1.25);
    }

    &:hover {
      background: rgba(255, 255, 255, 0.8);
    }
  }

  .service-type-badge {
    position: absolute;
    top: 1.5rem;
    left: 1.5rem;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-weight: 600;
    font-size: 0.85rem;
    z-index: 3;
    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
  }

  .premium-badge {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    background: linear-gradient(135deg, #f59e0b, #f97316);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-weight: 600;
    font-size: 0.85rem;
    z-index: 3;
    display: flex;
    align-items: center;
    gap: 0.3rem;
    box-shadow: 0 4px 16px rgba(245, 158, 11, 0.4);
  }
`;

const ContentSection = styled.div`
  padding: 2.5rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  position: relative;
`;

const HeaderInfo = styled.div`
  margin-bottom: 2rem;

  .title-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .title {
    font-size: 2rem;
    font-weight: 900;
    background: linear-gradient(135deg, #1e293b, #667eea);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    line-height: 1.2;
    flex: 1;
  }

  .price-display {
    text-align: right;

    .main-price {
      font-size: 2rem;
      font-weight: 800;
      color: #16a34a;
      display: flex;
      align-items: center;
      gap: 0.3rem;
      justify-content: flex-end;
    }

    .price-label {
      color: #64748b;
      font-size: 0.85rem;
      font-weight: 500;
    }
  }

  .temple-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: #64748b;
    font-weight: 600;
    margin-bottom: 1rem;
    font-size: 1rem;

    svg {
      color: #667eea;
    }
  }

  .description {
    color: #475569;
    font-size: 1.1rem;
    line-height: 1.7;
    margin-bottom: 1.5rem;
    background: rgba(102, 126, 234, 0.05);
    padding: 1rem 1.5rem;
    border-radius: 16px;
    border-left: 4px solid #667eea;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
  margin-bottom: 2.5rem;
`;

const StatCard = styled(motion.div)`
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.08),
    rgba(118, 75, 162, 0.08)
  );
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 20px;
  padding: 1.5rem 1rem;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #667eea, #764ba2);
  }

  .icon {
    color: #667eea;
    margin-bottom: 0.75rem;
    background: rgba(102, 126, 234, 0.1);
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 0.75rem;
  }

  .value {
    font-weight: 800;
    color: #1e293b;
    font-size: 1.4rem;
    margin-bottom: 0.25rem;
  }

  .label {
    color: #64748b;
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(102, 126, 234, 0.15);
  }
`;

const VariationsSection = styled.div`
  margin-bottom: 2.5rem;

  .section-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.5rem;

    .title {
      font-weight: 800;
      color: #1e293b;
      font-size: 1.3rem;
    }

    .count {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
    }
  }
`;

const VariationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
`;

const VariationCard = styled(motion.div)`
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.9),
    rgba(248, 250, 252, 0.9)
  );
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 20px;
  padding: 1.75rem;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: ${(props) =>
      props.gradient || "linear-gradient(90deg, #667eea, #764ba2)"};
  }

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
    border-color: rgba(102, 126, 234, 0.4);
  }

  .variation-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;

    .type {
      font-weight: 800;
      color: #1e293b;
      font-size: 1.1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;

      .type-icon {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        background: ${(props) =>
          props.gradient || "linear-gradient(135deg, #667eea, #764ba2)"};
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8rem;
      }
    }

    .price {
      font-size: 1.5rem;
      font-weight: 800;
      color: #16a34a;
      display: flex;
      align-items: center;
      gap: 0.2rem;
    }
  }

  .variation-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .detail-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(102, 126, 234, 0.05);
    padding: 0.5rem 0.75rem;
    border-radius: 12px;
    font-size: 0.85rem;
    font-weight: 600;

    svg {
      color: #667eea;
      width: 16px;
      height: 16px;
    }

    .value {
      color: #1e293b;
    }
  }

  .pricing-info {
    background: linear-gradient(
      135deg,
      rgba(102, 126, 234, 0.05),
      rgba(118, 75, 162, 0.05)
    );
    border: 1px solid rgba(102, 126, 234, 0.1);
    border-radius: 12px;
    padding: 1rem;
    margin-top: 1rem;

    .pricing-title {
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
    }

    .pricing-details {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      font-size: 0.8rem;
    }

    .pricing-item {
      background: rgba(255, 255, 255, 0.7);
      padding: 0.3rem 0.6rem;
      border-radius: 8px;
      font-weight: 500;
      color: #475569;

      .highlight {
        color: #667eea;
        font-weight: 700;
      }
    }
  }
`;

const PoliciesSection = styled.div`
  margin-bottom: 2rem;

  .policies-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.5rem;

    .title {
      font-weight: 800;
      color: #1e293b;
      font-size: 1.3rem;
    }
  }

  .policies-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }
`;

const PolicyCard = styled(motion.div)`
  background: linear-gradient(
    135deg,
    rgba(248, 250, 252, 0.8),
    rgba(241, 245, 249, 0.8)
  );
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.5rem;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${(props) =>
      props.accent || "linear-gradient(180deg, #667eea, #764ba2)"};
    border-radius: 0 2px 2px 0;
  }

  .policy-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;

    .icon-wrapper {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: ${(props) =>
        props.accent || "linear-gradient(135deg, #667eea, #764ba2)"};
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .policy-title {
      font-weight: 700;
      color: #1e293b;
      font-size: 1rem;
    }
  }

  .policy-content {
    color: #475569;
    font-size: 0.9rem;
    line-height: 1.6;

    .highlight {
      background: linear-gradient(135deg, #667eea, #764ba2);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 700;
    }

    .policy-rule {
      background: rgba(102, 126, 234, 0.05);
      padding: 0.75rem;
      border-radius: 10px;
      margin-top: 0.75rem;
      border-left: 3px solid #667eea;
    }
  }
`;

const ActionSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 2rem;
  border-top: 1px solid rgba(226, 232, 240, 0.5);

  .service-info {
    .service-id {
      color: #64748b;
      font-size: 0.8rem;
      font-weight: 500;
      font-family: "SF Mono", "Monaco", monospace;
      background: rgba(100, 116, 139, 0.1);
      padding: 0.25rem 0.5rem;
      border-radius: 6px;
      margin-bottom: 0.5rem;
    }

    .status {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(34, 197, 94, 0.1);
      color: #16a34a;
      padding: 0.4rem 1rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;

      .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #16a34a;
        animation: pulse 2s ease-in-out infinite;
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
    }
  }
`;

const BookButton = styled(motion.button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  color: white;
  border: none;
  padding: 1.25rem 2.5rem;
  border-radius: 50px;
  font-weight: 800;
  font-size: 1.1rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4);

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    transition: all 0.6s ease;
    transform: translate(-50%, -50%);
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 48px rgba(102, 126, 234, 0.5);

    &::before {
      width: 300px;
      height: 300px;
    }
  }

  &:active {
    transform: translateY(-2px);
  }

  .button-text {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(
    135deg,
    rgba(248, 250, 252, 0.8),
    rgba(241, 245, 249, 0.8)
  );
  border: 2px dashed #cbd5e1;
  border-radius: 24px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: conic-gradient(
      from 0deg,
      transparent,
      rgba(102, 126, 234, 0.05),
      transparent
    );
    animation: rotate 15s linear infinite;
  }

  .content {
    position: relative;
    z-index: 2;
  }

  .icon {
    font-size: 4rem;
    margin-bottom: 1.5rem;
    filter: grayscale(0.3);
  }

  .title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
    color: #475569;
  }

  .description {
    font-size: 1.1rem;
    line-height: 1.6;
    color: #64748b;
    max-width: 500px;
    margin: 0 auto;
  }
`;

function getServiceImages(service) {
  const images = [];
  if (service.image) images.push(service.image);
  if (service.image_1) images.push(service.image_1);
  if (service.image_2) images.push(service.image_2);
  if (service.image_3) images.push(service.image_3);
  if (service.image_4) images.push(service.image_4);
  if (service.image_5) images.push(service.image_5);
  return images.filter(Boolean);
}

const typeGradients = {
  FULL_DAY: "linear-gradient(135deg, #f59e0b, #f97316)",
  HALF_DAY: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
  HOURLY: "linear-gradient(135deg, #10b981, #059669)",
};

const typeIcons = {
  FULL_DAY: "🌅",
  HALF_DAY: "🌤️",
  HOURLY: "⏰",
};

export default function ServiceList({ services, onBook }) {
  console.log("services", services);
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  if (!services || services.length === 0) {
    return (
      <EmptyState>
        <div className="content">
          <div className="icon">🏛️</div>
          <div className="title">No Sacred Services Found</div>
          <div className="description">
            We couldn't find any services for this category at the moment.
            Please try selecting a different category or check back later for
            new offerings.
          </div>
        </div>
      </EmptyState>
    );
  }

  const handleImageNav = (serviceId, direction, totalImages) => {
    setCurrentImageIndex((prev) => {
      const current = prev[serviceId] || 0;
      let newIndex;
      if (direction === "next") {
        newIndex = current >= totalImages - 1 ? 0 : current + 1;
      } else {
        newIndex = current <= 0 ? totalImages - 1 : current - 1;
      }
      return { ...prev, [serviceId]: newIndex };
    });
  };

  const setImageIndex = (serviceId, index) => {
    setCurrentImageIndex((prev) => ({ ...prev, [serviceId]: index }));
  };

  return (
    <ListWrapper>
      {services.map((service, index) => {
        const images = getServiceImages(service);
        const currentIndex = currentImageIndex[service.service_id] || 0;
        const currentImage = images[currentIndex];
        const variations = service.service_variation_list || [];
        const basePrice = parseFloat(service.base_price || 0);
        const minVariationPrice =
          variations.length > 0
            ? Math.min(...variations.map((v) => parseFloat(v.base_price || 0)))
            : basePrice;
        const displayPrice =
          minVariationPrice > 0 ? minVariationPrice : basePrice;

        return (
          <ServiceCard
            key={service.service_id}
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: index * 0.2,
              type: "spring",
              stiffness: 80,
            }}
          >
            {images.length > 0 && (
              <ImageSliderSection>
                <div className="slider-container">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={`${service.service_id}-${currentIndex}`}
                      src={currentImage}
                      alt={`${service.name || service.service_name} - Image ${
                        currentIndex + 1
                      }`}
                      className="slide-image"
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.5 }}
                    />
                  </AnimatePresence>

                  <div className="gradient-overlay" />

                  {service.service_type_str && (
                    <div className="service-type-badge">
                      {service.service_type_str}
                    </div>
                  )}

                  {service.capacity && service.capacity >= 100 && (
                    <div className="premium-badge">
                      <Crown size={14} />
                      Premium Hall
                    </div>
                  )}

                  {images.length > 1 && (
                    <>
                      <button
                        className="slider-nav prev"
                        onClick={() =>
                          handleImageNav(
                            service.service_id,
                            "prev",
                            images.length
                          )
                        }
                      >
                        <FiChevronLeft size={20} />
                      </button>
                      <button
                        className="slider-nav next"
                        onClick={() =>
                          handleImageNav(
                            service.service_id,
                            "next",
                            images.length
                          )
                        }
                      >
                        <FiChevronRight size={20} />
                      </button>

                      <div className="dots-indicator">
                        {images.map((_, idx) => (
                          <div
                            key={idx}
                            className={`dot ${
                              idx === currentIndex ? "active" : ""
                            }`}
                            onClick={() =>
                              setImageIndex(service.service_id, idx)
                            }
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </ImageSliderSection>
            )}

            <ContentSection>
              <HeaderInfo>
                <div className="title-row">
                  <div className="title">
                    {service.name || service.service_name}
                  </div>
                  <div className="price-display">
                    <div className="main-price">
                      <IndianRupee size={24} />
                      {displayPrice.toLocaleString()}
                      {variations.length > 1 && (
                        <span style={{ fontSize: "1rem", opacity: 0.7 }}>
                          +
                        </span>
                      )}
                    </div>
                    <div className="price-label">
                      {variations.length > 1 ? "Starting from" : "Base price"}
                    </div>
                  </div>
                </div>

                {service.temple_name && (
                  <div className="temple-info">
                    <FiMapPin size={16} />
                    {service.temple_name}
                  </div>
                )}

                {service.description && (
                  <div className="description">{service.description}</div>
                )}
              </HeaderInfo>

              <StatsGrid>
                {service.capacity && (
                  <StatCard whileHover={{ y: -4 }}>
                    <div className="icon">
                      <FiUsers size={20} />
                    </div>
                    <div className="value">{service.capacity}</div>
                    <div className="label">Capacity</div>
                  </StatCard>
                )}

                <StatCard whileHover={{ y: -4 }}>
                  <div className="icon">
                    <FiClock size={20} />
                  </div>
                  <div className="value">
                    {service.duration_minutes || service.duration || 60}m
                  </div>
                  <div className="label">Duration</div>
                </StatCard>

                {variations.length > 0 && (
                  <StatCard whileHover={{ y: -4 }}>
                    <div className="icon">
                      <FiCalendar size={20} />
                    </div>
                    <div className="value">{variations.length}</div>
                    <div className="label">Options</div>
                  </StatCard>
                )}
                {/* 
                {service.pricing_rule_data && (
                  <StatCard whileHover={{ y: -4 }}>
                    <div className="icon">
                      <Zap size={20} />
                    </div>
                    <div className="value">
                      <FiStar size={16} />
                    </div>
                    <div className="label">Special Pricing</div>
                  </StatCard>
                )} */}
              </StatsGrid>

              {variations.length > 0 && (
                <VariationsSection>
                  <div className="section-header">
                    <Clock size={20} style={{ color: "#667eea" }} />
                    <div className="title">Booking Options</div>
                    <div className="count">{variations.length} available</div>
                  </div>
                  <VariationGrid>
                    {variations.map((variation) => (
                      <VariationCard
                        key={variation.id}
                        gradient={typeGradients[variation.price_type]}
                        whileHover={{ y: -6, scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="variation-header">
                          <div className="type">
                            <div className="type-icon">
                              {typeIcons[variation.price_type] || "📅"}
                            </div>
                            {variation.pricing_type_str || variation.price_type}
                          </div>
                          <div className="price">
                            <IndianRupee size={20} />
                            {(
                              (parseFloat(variation.base_price) || 0) +
                              (parseFloat(
                                variation.pricing_rule_data?.week_day_price
                              ) || 0) +
                              (parseFloat(
                                variation.pricing_rule_data?.time_price
                              ) || 0) +
                              (parseFloat(
                                variation.pricing_rule_data?.date_price
                              ) || 0)
                            ).toLocaleString()}
                          </div>
                        </div>

                        <div className="variation-details">
                          {variation.start_time && variation.end_time && (
                            <div className="detail-item">
                              <Clock size={16} />
                              <span className="value">
                                {variation.start_time} - {variation.end_time}
                              </span>
                            </div>
                          )}
                          {variation.max_participant && (
                            <div className="detail-item">
                              <FiUsers size={16} />
                              <span className="value">
                                Max {variation.max_participant}
                              </span>
                            </div>
                          )}
                          {variation.no_hours && (
                            <div className="detail-item">
                              <FiClock size={16} />
                              <span className="value">
                                {variation.no_hours} hours
                              </span>
                            </div>
                          )}
                          {variation.max_no_per_day && (
                            <div className="detail-item">
                              <FiCalendar size={16} />
                              <span className="value">
                                {variation.max_no_per_day}/day
                              </span>
                            </div>
                          )}
                        </div>
                        {/* 
                        {variation.pricing_rule_data && (
                          <div className="pricing-info">
                            <div className="pricing-title">
                              {variation.pricing_rule_data.name}
                            </div>
                            <div className="pricing-details">
                              {variation.pricing_rule_data.day_of_week && (
                                <div className="pricing-item">
                                  Day:{" "}
                                  <span className="highlight">Weekend</span>
                                </div>
                              )}
                              {variation.pricing_rule_data.start_date && (
                                <div className="pricing-item">
                                  Valid:{" "}
                                  <span className="highlight">
                                    {variation.pricing_rule_data.start_date} -{" "}
                                    {variation.pricing_rule_data.end_date}
                                  </span>
                                </div>
                              )}
                              {variation.pricing_rule_data.date_price && (
                                <div className="pricing-item">
                                  Date fee:{" "}
                                  <span className="highlight">
                                    ₹{variation.pricing_rule_data.date_price}
                                  </span>
                                </div>
                              )}
                              {variation.pricing_rule_data.time_price && (
                                <div className="pricing-item">
                                  Time fee:{" "}
                                  <span className="highlight">
                                    ₹{variation.pricing_rule_data.time_price}
                                  </span>
                                </div>
                              )}
                              {variation.pricing_rule_data.week_day_price && (
                                <div className="pricing-item">
                                  Weekday:{" "}
                                  <span className="highlight">
                                    ₹
                                    {variation.pricing_rule_data.week_day_price}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )} */}
                      </VariationCard>
                    ))}
                  </VariationGrid>
                </VariationsSection>
              )}

              {(service.adv_policy_data || service.refund_policy_data) && (
                <PoliciesSection>
                  <div className="policies-header">
                    <Shield size={20} style={{ color: "#667eea" }} />
                    <div className="title">Policies & Terms</div>
                  </div>
                  <div className="policies-grid">
                    {service.adv_policy_data && (
                      <PolicyCard
                        accent="linear-gradient(180deg, #3b82f6, #1d4ed8)"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="policy-header">
                          <div className="icon-wrapper">
                            <Percent size={16} />
                          </div>
                          <div className="policy-title">
                            {service.adv_policy_data.name}
                          </div>
                        </div>
                        <div className="policy-content">
                          <div className="policy-rule">
                            Pay{" "}
                            <span className="highlight">
                              {service.adv_policy_data.percent}%
                            </span>{" "}
                            advance (Minimum ₹
                            {service.adv_policy_data.min_amount})
                            {service.adv_policy_data.due_days_before && (
                              <>
                                <br />
                                Due{" "}
                                <span className="highlight">
                                  {service.adv_policy_data.due_days_before} days
                                </span>{" "}
                                {service.adv_policy_data.due_mode_str.toLowerCase()}{" "}
                                booking
                              </>
                            )}
                          </div>
                        </div>
                      </PolicyCard>
                    )}

                    {service.refund_policy_data && (
                      <PolicyCard
                        accent="linear-gradient(180deg, #16a34a, #15803d)"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="policy-header">
                          <div className="icon-wrapper">
                            <RotateCcw size={16} />
                          </div>
                          <div className="policy-title">
                            {service.refund_policy_data.name}
                          </div>
                        </div>
                        <div className="policy-content">
                          {service.refund_policy_data.refund_rules?.map(
                            (rule, idx) => (
                              <div key={idx} className="policy-rule">
                                <span className="highlight">
                                  {rule.refund_percent}%
                                </span>{" "}
                                refund if cancelled
                                <span className="highlight">
                                  {" "}
                                  {rule.min_hours_before}+ hours
                                </span>{" "}
                                before service
                                {rule.notes && (
                                  <div
                                    style={{
                                      marginTop: "0.5rem",
                                      fontSize: "0.8rem",
                                      opacity: 0.8,
                                    }}
                                  >
                                    {rule.notes}
                                  </div>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      </PolicyCard>
                    )}
                  </div>
                </PoliciesSection>
              )}

              <ActionSection>
                <div className="service-info">
                  <div className="service-id">{service.service_id}</div>
                  <div className="status">
                    <div className="status-dot" />
                    {service.is_active
                      ? "Available Now"
                      : "Currently Unavailable"}
                  </div>
                </div>

                <BookButton
                  onClick={() => onBook(service)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  disabled={!service.is_active}
                >
                  <div className="button-text">
                    <Crown size={18} />
                    Book Sacred Service
                  </div>
                </BookButton>
              </ActionSection>
            </ContentSection>
          </ServiceCard>
        );
      })}
    </ListWrapper>
  );
}
