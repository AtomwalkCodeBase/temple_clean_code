// components/AdminServices/ServiceCard.js
import React, { useState } from "react";
import styled, { keyframes } from "styled-components";

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
`;

const slideDown = keyframes`
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 1000px;
  }
`;

const ServiceCardContainer = styled.div`
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 24px;
  overflow: hidden;
  border: 2px solid ${(props) => (props.isSelected ? "#2563eb" : "#e5e7eb")};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: ${(props) =>
      props.isSelected
        ? "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)"
        : "linear-gradient(90deg, #e5e7eb, #d1d5db)"};
    background-size: 200% 100%;
    animation: ${(props) => (props.isSelected ? shimmer : "none")} 3s linear
      infinite;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 50px rgba(247, 249, 253, 0.15);
    border-color: #3b82f6;
  }
`;

const ServiceHeader = styled.div`
  padding: 28px;
  cursor: pointer;
  display: flex;
  gap: 24px;
  align-items: flex-start;
  background: ${(props) =>
    props.isSelected
      ? "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)"
      : "transparent"};
  transition: background 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  }
`;

const ImageSection = styled.div`
  position: relative;
  flex-shrink: 0;
`;

const ServiceImage = styled.div`
  width: 140px;
  height: 140px;
  border-radius: 20px;
  background: ${(props) =>
    props.$imageUrl
      ? `url(${props.$imageUrl})`
      : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"};
  background-size: cover;
  background-position: center;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  position: relative;
  overflow: hidden;

  &::after {
    content: "${(props) => (props.$imageUrl ? "" : "🎯")}";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 48px;
  }
`;

const ImageBadge = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
  animation: ${pulse} 2s ease-in-out infinite;
`;

const ServiceInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ServiceNameRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
`;

const ServiceName = styled.h3`
  margin: 0;
  color: #1f2937;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.3;
  background: linear-gradient(135deg, #1f2937 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const ExpandIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${(props) =>
    props.isExpanded
      ? "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
      : "linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => (props.isExpanded ? "white" : "#6b7280")};
  font-size: 18px;
  font-weight: bold;
  transition: all 0.3s ease;
  transform: ${(props) =>
    props.isExpanded ? "rotate(180deg)" : "rotate(0deg)"};
  box-shadow: ${(props) =>
    props.isExpanded ? "0 4px 12px rgba(37, 99, 235, 0.3)" : "none"};
`;

const ServiceType = styled.span`
  display: inline-block;
  padding: 8px 16px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border-radius: 24px;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  margin-bottom: 16px;
  display: inline-flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: "⚡";
    font-size: 14px;
  }
`;

const ServiceDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 16px;
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 14px;
  background: white;
  border-radius: 12px;
  border: 2px solid #f1f5f9;
  transition: all 0.3s ease;

  &:hover {
    border-color: #3b82f6;
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.15);
  }
`;

const DetailIcon = styled.div`
  font-size: 20px;
  margin-bottom: 4px;
`;

const DetailLabel = styled.span`
  font-size: 11px;
  color: #6b7280;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DetailValue = styled.span`
  font-size: 18px;
  color: #1f2937;
  font-weight: 700;
  margin-top: 4px;
`;

const VariationsSection = styled.div`
  padding: 0 28px 28px 28px;
  border-top: 2px dashed #e5e7eb;
  margin-top: 0;
  animation: ${slideDown} 0.4s ease-out;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
`;

const VariationsTitle = styled.h4`
  margin: 20px 0 16px 0;
  color: #1f2937;
  font-size: 18px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;

  &::before {
    content: "🎨";
    font-size: 22px;
  }
`;

const VariationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
`;

const VariationCard = styled.div`
  padding: 20px;
  background: ${(props) =>
    props.disabled
      ? "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)"
      : props.isSelected
      ? "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)"
      : "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)"};
  border: 2px solid
    ${(props) =>
      props.disabled ? "#d1d5db" : props.isSelected ? "#3b82f6" : "#e5e7eb"};
  border-radius: 16px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.3s ease;
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${(props) =>
      props.disabled
        ? "linear-gradient(90deg, #9ca3af, #6b7280)"
        : props.isSelected
        ? "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)"
        : "linear-gradient(90deg, #10b981, #059669)"};
    background-size: 200% 100%;
    animation: ${(props) => (!props.disabled ? shimmer : "none")} 3s linear
      infinite;
  }

  &:hover {
    transform: ${(props) =>
      props.disabled ? "none" : "translateY(-4px) scale(1.02)"};
    border-color: ${(props) => (props.disabled ? "#d1d5db" : "#3b82f6")};
    box-shadow: ${(props) =>
      props.disabled ? "none" : "0 12px 35px rgba(59, 130, 246, 0.25)"};
  }
`;

const VariationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const VariationType = styled.span`
  font-size: 16px;
  color: #1f2937;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: "💎";
    font-size: 18px;
  }
`;

const VariationPrice = styled.span`
  font-size: 24px;
  color: #059669;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 4px;

  &::before {
    content: "₹";
    font-size: 18px;
    font-weight: 600;
  }
`;

const VariationTime = styled.div`
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;

  &::before {
    content: "🕐";
    font-size: 16px;
  }
`;

const VariationCapacity = styled.div`
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;

  &::before {
    content: "👥";
    font-size: 16px;
  }
`;

const DisabledReason = styled.div`
  font-size: 12px;
  color: #dc2626;
  font-weight: 700;
  margin-top: 12px;
  padding: 8px 12px;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border-radius: 8px;
  text-align: center;
  border: 1px solid #fecaca;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &::before {
    content: "⚠️";
    font-size: 14px;
  }
`;
const BookNow = styled.div`
  font-size: 12px;
  color: #63dc26ff;
  font-weight: 700;
  margin-top: 12px;
  padding: 8px 12px;
  background: linear-gradient(135deg, #f2fef2ff 0%, #e7fee2ff 100%);
  border-radius: 8px;
  text-align: center;
  border: 1px solid #2bef69ff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &::before {
    content: "✅";
    font-size: 14px;
  }
`;
const CapacityInfo = styled.div`
  font-size: 11px;
  color: ${(props) => (props.$isLow ? "#dc2626" : "#059669")};
  font-weight: 600;
  margin-bottom: 8px;
  padding: 4px 8px;
  background: ${(props) => (props.$isLow ? "#fef2f2" : "#f0fdf4")};
  border-radius: 4px;
  text-align: center;
`;

const ServiceCard = ({ service, isSelected, onSelect, onVariationSelect }) => {
  const [showVariations, setShowVariations] = useState(false);
  console.log(service, "service");
  const handleCardClick = () => {
    onSelect();
    setShowVariations(!showVariations);
  };

  const handleVariationClick = (variation) => {
    handleCardClick();
    if (!variation.disabled) {
      onVariationSelect(variation);
      setTimeout(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    }
  };

  return (
    <ServiceCardContainer isSelected={isSelected}>
      <ServiceHeader isSelected={isSelected} onClick={handleCardClick}>
        <ImageSection>
          <ServiceImage $imageUrl={service.image} />
          {service.totalBookings > 0 && (
            <ImageBadge>{service.totalBookings} Bookings</ImageBadge>
          )}
        </ImageSection>

        <ServiceInfo>
          <ServiceNameRow>
            <ServiceName>{service.name}</ServiceName>
            <ExpandIcon isExpanded={showVariations}>↓</ExpandIcon>
          </ServiceNameRow>

          <ServiceType>
            {service.service_type_str || service.service_type}
          </ServiceType>

          <ServiceDetails>
            <DetailItem>
              <DetailIcon>👥</DetailIcon>
              <DetailLabel>Capacity</DetailLabel>
              <DetailValue>{service.capacity || "N/A"}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailIcon>🗺️</DetailIcon>
              <DetailLabel>Location</DetailLabel>
              <DetailValue>
                {service.location ? service.location : service.geo_location}
              </DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailIcon>📅</DetailIcon>
              <DetailLabel>Bookings</DetailLabel>
              <DetailValue>{service.totalBookings}</DetailValue>
            </DetailItem>
          </ServiceDetails>
        </ServiceInfo>
      </ServiceHeader>

      <VariationsSection>
        <VariationsTitle>Available Variations</VariationsTitle>
        {service.availableVariations?.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "20px",
              color: "#6b7280",
              background: "white",
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            }}
          >
            No variations are available for this service on the selected date.
            Please choose another day.
          </div>
        ) : (
          <VariationsGrid>
            {service.availableVariations?.map((variation, idx) => (
              <VariationCard
                key={idx}
                disabled={variation.disabled}
                isSelected={variation.isSelected}
                onClick={() => handleVariationClick(variation)}
              >
                <VariationHeader>
                  <VariationType>{variation.pricing_type_str}</VariationType>
                  <VariationPrice>₹{variation.base_price}</VariationPrice>
                </VariationHeader>
                <VariationTime>
                  {variation.start_time} - {variation.end_time}
                </VariationTime>
                <VariationCapacity>
                  Max {variation.max_participant} participants
                </VariationCapacity>

                {/* Show capacity info for EVENT and PUJA */}
                {(service.service_type === "EVENT" ||
                  service.service_type === "PUJA") && (
                  <CapacityInfo
                    $isLow={
                      variation.availableQuantity <
                      (variation.max_participant || 1)
                    }
                  >
                    {variation.disabled
                      ? variation.disabledReason
                      : variation.availableQuantity <
                        (variation.max_participant || 1)
                      ? `Only ${variation.availableQuantity} spots left`
                      : `${variation.availableQuantity} spots available`}
                  </CapacityInfo>
                )}

                {variation.disabled && service.service_type === "HALL" ? (
                  <DisabledReason>{variation.disabledReason}</DisabledReason>
                ) : !variation.disabled ? (
                  <BookNow>Book Now</BookNow>
                ) : null}
              </VariationCard>
            ))}
          </VariationsGrid>
        )}
      </VariationsSection>
    </ServiceCardContainer>
  );
};

export default ServiceCard;
