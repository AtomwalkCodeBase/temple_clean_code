import React from "react";
import styled from "styled-components";

const Card = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
  margin-bottom: 24px;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  }
`;

const CardContent = styled.div`
  padding: 24px;
  display: grid;
  grid-template-columns: 320px 1fr auto;
  gap: 24px;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 20px;
  }
`;

const ImageSection = styled.div`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
`;

const CardImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const ServiceTypeBadge = styled.span`
  position: absolute;
  top: 12px;
  left: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
`;

const InfoSection = styled.div`
  flex: 1;
`;

const CardTitle = styled.h3`
  color: #1a1a1a;
  margin-bottom: 8px;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.3;
`;

const TempleInfo = styled.div`
  color: #666;
  margin-bottom: 16px;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
`;

const Description = styled.p`
  color: #555;
  line-height: 1.6;
  margin: 16px 0;
  font-size: 0.95rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
  margin: 16px 0;
`;

const DetailItem = styled.div`
  background: #f8f9fa;
  padding: 12px 16px;
  border-radius: 8px;
  border-left: 4px solid #667eea;
`;

const DetailLabel = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 4px;
  text-transform: uppercase;
  font-weight: 600;
`;

const DetailValue = styled.div`
  font-size: 0.95rem;
  color: #1a1a1a;
  font-weight: 600;
`;

const VariationsSection = styled.div`
  margin-top: 16px;
`;

const VariationsTitle = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 8px;
  font-weight: 600;
`;

const VariationTags = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const VariationTag = styled.span`
  background: #e3f2fd;
  color: #1976d2;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid #bbdefb;
`;

const PriceSection = styled.div`
  text-align: right;
  min-width: 140px;

  @media (max-width: 768px) {
    text-align: left;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

const PriceContainer = styled.div`
  margin-bottom: 20px;
`;

const PriceLabel = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 4px;
  text-transform: uppercase;
  font-weight: 600;
`;

const Price = styled.div`
  font-size: 1.8rem;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 4px;
`;

const PriceRange = styled.div`
  font-size: 0.85rem;
  color: #999;
`;

const ViewButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
  width: 100%;
  transition: all 0.3s ease;
  font-size: 0.95rem;

  &:hover {
    background: linear-gradient(135deg, #5a67d8 0%, #6b4e9d 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  }
`;

const PolicyInfo = styled.div`
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 8px;
  padding: 12px;
  margin-top: 16px;
`;

const PolicyText = styled.div`
  font-size: 0.8rem;
  color: #0369a1;
  font-weight: 500;
`;

const ServiceCard = ({ service, onViewDetails }) => {
  // Calculate price display
  const getDisplayPrice = () => {
    const basePrice = parseFloat(service.base_price || 0);

    if (
      service.service_variation_list &&
      service.service_variation_list.length > 0
    ) {
      const prices = service.service_variation_list.map((v) =>
        parseFloat(v.base_price || 0)
      );
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      if (minPrice === maxPrice) {
        return { single: minPrice };
      }
      return { min: minPrice, max: maxPrice };
    }

    return { single: basePrice };
  };

  const priceDisplay = getDisplayPrice();

  // Format duration
  const formatDuration = (minutes) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0
        ? `${hours}h ${remainingMinutes}m`
        : `${hours}h`;
    }
    return `${minutes}m`;
  };

  // Get advance payment info
  const getAdvanceInfo = () => {
    if (service.adv_policy_data) {
      return `${service.adv_policy_data.percent}% advance required`;
    }
    return null;
  };

  // Get unique variation types
  const getVariationTypes = () => {
    if (!service.service_variation_list) return [];
    const types = [
      ...new Set(service.service_variation_list.map((v) => v.pricing_type_str)),
    ];
    return types;
  };

  // Default image if service.image is not present
  const defaultImage =
    "https://garudalife.in/vendor/webkul/customui/assets/images/product/meduim-product-placeholder.webp";
  return (
    <Card>
      <CardContent>
        <ImageSection>
          <CardImage
            src={service.image ? service.image : defaultImage}
            alt={service.name}
            onError={(e) => {
              e.target.src = defaultImage;
            }}
          />
          <ServiceTypeBadge>{service.service_type}</ServiceTypeBadge>
        </ImageSection>

        <InfoSection>
          <CardTitle>{service.name}</CardTitle>

          <TempleInfo>
            <span>🏛️ {service.temple_name}</span>
          </TempleInfo>

          {service.description && service.description !== "test" && (
            <Description>{service.description}</Description>
          )}

          <DetailsGrid>
            <DetailItem>
              <DetailLabel>Capacity</DetailLabel>
              <DetailValue>{service.capacity} people</DetailValue>
            </DetailItem>

            {service.duration_minutes > 0 && (
              <DetailItem>
                <DetailLabel>Duration</DetailLabel>
                <DetailValue>
                  {formatDuration(service.duration_minutes)}
                </DetailValue>
              </DetailItem>
            )}
          </DetailsGrid>

          {getVariationTypes().length > 0 && (
            <VariationsSection>
              <VariationsTitle>Available Options:</VariationsTitle>
              <VariationTags>
                {getVariationTypes().map((type, index) => (
                  <VariationTag key={index}>{type}</VariationTag>
                ))}
              </VariationTags>
            </VariationsSection>
          )}

          {getAdvanceInfo() && (
            <PolicyInfo>
              <PolicyText>{getAdvanceInfo()}</PolicyText>
            </PolicyInfo>
          )}
        </InfoSection>

        <PriceSection>
          <PriceContainer>
            <PriceLabel>Starting from</PriceLabel>
            {priceDisplay.single !== undefined ? (
              <Price>₹{priceDisplay.single}</Price>
            ) : (
              <>
                <Price>₹{priceDisplay.min}</Price>
                <PriceRange>up to ₹{priceDisplay.max}</PriceRange>
              </>
            )}
          </PriceContainer>

          <ViewButton onClick={() => onViewDetails(service.service_id)}>
            Book Now
          </ViewButton>
        </PriceSection>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
