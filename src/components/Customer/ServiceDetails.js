import React, { useState } from "react";
import styled, { keyframes } from "styled-components";

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// Modal Container
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const ModalContainer = styled.div`
  width: 95vw;
  max-width: 1200px;
  max-height: 95vh;
  background: white;
  border-radius: 24px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  animation: ${fadeInUp} 0.3s ease;
  overflow-y: scroll;
  @media (max-width: 768px) {
    width: 100%;
    max-height: 90vh;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  color: #333;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;
  font-weight: bold;
  z-index: 1000;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  &:hover {
    background: #fff;
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  }
`;

// Main Content Styles
const DetailsContainer = styled.div`
  min-height: 400px;
  position: relative;
`;

const HeroSection = styled.div`
  position: relative;
  height: 50vh;
  min-height: 400px;
  border-radius: 0;
  overflow: hidden;
  margin-bottom: 0;
`;

const HeroBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url(${(props) => props.bgImage}) center/cover;
  filter: brightness(0.4);
`;

const HeroOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  padding: 40px;
`;

const ServiceTitle = styled.h1`
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  margin-bottom: 15px;
  background: linear-gradient(45deg, #fff, #f8f9fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${fadeInUp} 0.8s ease 0.2s both;
`;

const TempleName = styled.p`
  font-size: 1.2rem;
  margin-bottom: 20px;
  opacity: 0.9;
  font-weight: 300;
  animation: ${fadeInUp} 0.8s ease 0.4s both;
`;

const QuickStats = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
  animation: ${fadeInUp} 0.8s ease 0.6s both;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const StatItem = styled.div`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 12px 20px;
  border-radius: 15px;
  text-align: center;

  .stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    display: block;
    margin-bottom: 5px;
  }

  .stat-label {
    font-size: 0.8rem;
    opacity: 0.8;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const MainContent = styled.div`
  background: white;
  border-radius: 30px 30px 0 0;
  margin-top: -30px;
  position: relative;
  z-index: 2;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const ContentSection = styled.section`
  padding: 40px;
  animation: ${fadeInUp} 0.6s ease;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 20px;
  position: relative;
  display: inline-block;

  &::after {
    content: "";
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 50px;
    height: 3px;
    background: linear-gradient(45deg, #667eea, #764ba2);
    border-radius: 2px;
  }
`;

const Description = styled.p`
  font-size: 1rem;
  line-height: 1.7;
  color: #555;
  margin-bottom: 30px;
  text-align: justify;
`;

// Image Gallery
const GallerySection = styled.div`
  margin-bottom: 40px;
`;

const MainImageContainer = styled.div`
  position: relative;
  height: 300px;
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 15px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
`;

const MainImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ImageCounter = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  backdrop-filter: blur(10px);
`;

const ThumbnailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 10px;
  max-width: 500px;
`;

const Thumbnail = styled.div`
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 3px solid ${(props) => (props.active ? "#667eea" : "transparent")};
  transform: ${(props) => (props.active ? "scale(1.05)" : "scale(1)")};

  &:hover {
    transform: scale(1.05);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

// Variations Section
const VariationsGrid = styled.div`
  display: grid;
  gap: 15px;
  margin-top: 20px;
`;

const VariationCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;

const VariationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const VariationType = styled.span`
  font-weight: 700;
  color: #2c3e50;
  font-size: 1.1rem;
`;

const VariationPrice = styled.span`
  font-size: 1.3rem;
  color: #667eea;
  font-weight: 700;
`;

const VariationDetails = styled.div`
  color: #666;

  div {
    margin-bottom: 6px;
    padding: 4px 0;
    border-bottom: 1px solid #f1f3f4;

    &:last-child {
      border-bottom: none;
    }

    strong {
      color: #2c3e50;
      margin-right: 8px;
    }
  }
`;

// Policy Section
const PolicyContainer = styled.div`
  margin-bottom: 30px;
`;

const PolicyGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PolicyCard = styled.div`
  background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
  border-left: 4px solid #667eea;

  &.refund {
    border-left-color: #10b981;
  }

  h3 {
    color: #2c3e50;
    font-size: 1.2rem;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const PolicySection = styled.div`
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e9ecef;

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const PolicySectionTitle = styled.h4`
  color: #1a1a1a;
  font-size: 1rem;
  margin-bottom: 10px;
  font-weight: 700;
`;

const PolicyDetails = styled.div`
  display: grid;
  gap: 8px;
`;

const PolicyItem = styled.div`
  background: #f8f9fa;
  padding: 10px 12px;
  border-radius: 6px;
  border-left: 3px solid #667eea;
  font-size: 0.9rem;
  color: #555;
  line-height: 1.4;

  strong {
    color: #2c3e50;
  }
`;

const ServiceDetailsView = ({ service, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!service) {
    return (
      <ModalOverlay onClick={onClose}>
        <ModalContainer>
          <CloseButton onClick={onClose}>×</CloseButton>
          <div style={{ padding: "40px", textAlign: "center" }}>
            <p>No service data available</p>
          </div>
        </ModalContainer>
      </ModalOverlay>
    );
  }

  // Get all service images
  const getServiceImages = () => {
    return [
      service.image,
      service.image_1,
      service.image_2,
      service.image_3,
      service.image_4,
      service.image_5,
    ].filter((img) => img != null);
  };

  const images = getServiceImages();

  return (
    <ModalOverlay>
      <ModalContainer>
        <CloseButton onClick={onClose}>×</CloseButton>

        <DetailsContainer>
          {/* Hero Section */}
          <HeroSection>
            <HeroBackground
              bgImage={images[selectedImage] || "/placeholder-image.jpg"}
            />
            <HeroOverlay>
              <ServiceTitle>{service.name}</ServiceTitle>
              <TempleName>{service.temple_name}</TempleName>

              <QuickStats>
                <StatItem>
                  <span className="stat-value">
                    {service.capacity || "N/A"}
                  </span>
                  <span className="stat-label">Capacity</span>
                </StatItem>
                <StatItem>
                  <span className="stat-value">
                    {service.totalBookings || 0}
                  </span>
                  <span className="stat-label">Bookings</span>
                </StatItem>
                <StatItem>
                  <span className="stat-value">
                    {service.service_type_str || service.service_type}
                  </span>
                  <span className="stat-label">Type</span>
                </StatItem>
              </QuickStats>
            </HeroOverlay>
          </HeroSection>

          {/* Main Content */}
          <MainContent>
            <ContentWrapper>
              <ContentSection>
                {/* Description */}
                <SectionTitle>About This Service</SectionTitle>
                <Description>
                  {service.description || "No description available."}
                </Description>

                {/* Image Gallery */}
                {images.length > 0 && (
                  <GallerySection>
                    <SectionTitle>Gallery</SectionTitle>
                    <MainImageContainer>
                      <MainImage
                        src={images[selectedImage] || "/placeholder-image.jpg"}
                        alt={service.name}
                      />
                      {images.length > 1 && (
                        <ImageCounter>
                          {selectedImage + 1} / {images.length}
                        </ImageCounter>
                      )}
                    </MainImageContainer>

                    {images.length > 1 && (
                      <ThumbnailGrid>
                        {images.map((img, index) => (
                          <Thumbnail
                            key={index}
                            active={index === selectedImage}
                            onClick={() => setSelectedImage(index)}
                          >
                            <img
                              src={img || "/placeholder.svg"}
                              alt={`${service.name} ${index + 1}`}
                            />
                          </Thumbnail>
                        ))}
                      </ThumbnailGrid>
                    )}
                  </GallerySection>
                )}

                {/* Service Variations */}
                {service.service_variation_list &&
                  service.service_variation_list.length > 0 && (
                    <>
                      <SectionTitle>Service Variations</SectionTitle>
                      <VariationsGrid>
                        {service.service_variation_list.map(
                          (variation, index) => (
                            <VariationCard key={variation.id || index}>
                              <VariationHeader>
                                <VariationType>
                                  {variation.pricing_type_str}
                                </VariationType>
                                <VariationPrice>
                                  ₹
                                  {Number.parseFloat(
                                    variation.base_price || 0
                                  ).toLocaleString()}
                                </VariationPrice>
                              </VariationHeader>
                              <VariationDetails>
                                <div>
                                  <strong>Time:</strong> {variation.start_time}{" "}
                                  - {variation.end_time}
                                </div>
                                <div>
                                  <strong>Max Participants:</strong>{" "}
                                  {variation.max_participant}
                                </div>
                                {variation.max_no_per_day && (
                                  <div>
                                    <strong>Max per day:</strong>{" "}
                                    {variation.max_no_per_day}
                                  </div>
                                )}
                              </VariationDetails>
                            </VariationCard>
                          )
                        )}
                      </VariationsGrid>
                    </>
                  )}

                {/* Policies */}
                <PolicyContainer>
                  <SectionTitle>Policies & Terms</SectionTitle>
                  <PolicyGrid>
                    {/* Advance Payment Policy */}
                    {service.adv_policy_data && (
                      <PolicyCard>
                        <h3>📋 Advance Payment Policy</h3>
                        <PolicySection>
                          <PolicySectionTitle>
                            Payment Requirements
                          </PolicySectionTitle>
                          <PolicyDetails>
                            <PolicyItem>
                              <strong>Policy:</strong>{" "}
                              {service.adv_policy_data.name}
                            </PolicyItem>
                            <PolicyItem>
                              <strong>Advance:</strong>{" "}
                              {service.adv_policy_data.percent}% of total
                            </PolicyItem>
                            <PolicyItem>
                              <strong>Minimum:</strong> ₹
                              {service.adv_policy_data.min_amount}
                            </PolicyItem>
                          </PolicyDetails>
                        </PolicySection>
                      </PolicyCard>
                    )}

                    {/* Refund Policy */}
                    {service.refund_policy_data && (
                      <PolicyCard className="refund">
                        <h3>🔄 Refund Policy</h3>
                        <PolicySection>
                          <PolicySectionTitle>
                            Policy Details
                          </PolicySectionTitle>
                          <PolicyDetails>
                            <PolicyItem>
                              <strong>Policy:</strong>{" "}
                              {service.refund_policy_data.name}
                            </PolicyItem>
                            {service.refund_policy_data.refund_rules?.map(
                              (rule, index) => (
                                <PolicyItem key={index}>
                                  <strong>
                                    Cancel{" "}
                                    {rule.min_hours_before
                                      ? `${rule.min_hours_before} hours`
                                      : `${rule.min_days_before} days`}{" "}
                                    before:
                                  </strong>{" "}
                                  {rule.refund_percent}% refund
                                </PolicyItem>
                              )
                            )}
                          </PolicyDetails>
                        </PolicySection>
                      </PolicyCard>
                    )}
                  </PolicyGrid>
                </PolicyContainer>
              </ContentSection>
            </ContentWrapper>
          </MainContent>
        </DetailsContainer>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ServiceDetailsView;
