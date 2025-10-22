import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled, { keyframes, css } from "styled-components";
import {
  extractDisabledDatesFromBookings,
  getServiceBookings,
  processBooking,
  processpayment,
} from "../../services/customerServices";
import CustomerLayout from "./CustomerLayout";
import VariationModal from "./CustomerModal/VariationModal";
import AvailabilityCalendarModal from "./CustomerModal/AvailabilityCalendarModal";
import BookingConfirmationPopup from "./CustomerModal/BookingConfirmationPopup";
import { useCustomerAuth } from "../../contexts/CustomerAuthContext";
import { getTempleServicesList } from "../../services/templeServices";
import { toAPIDate } from "../../services/serviceUtils";

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

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// Main Container
const DetailsContainer = styled.div`
  min-height: 100vh;
  /* background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); */
  position: relative;
  padding-bottom: 120px;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const HeroSection = styled.div`
  position: relative;
  height: 70vh;
  min-height: 500px;
  border-radius: 50px 50px 50px 50px;
  overflow: hidden;
  margin-bottom: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const HeroBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url(${(props) => props.bgImage}) center/cover;
  filter: brightness(0.4);
  transition: all 0.8s ease;
`;

const HeroOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* background: linear-gradient(
    45deg,
    rgba(234, 164, 102, 0.8) 0%,
    rgba(162, 88, 75, 0.6) 100%
  ); */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  padding: 40px;
`;

const BackButton = styled.button`
  position: absolute;
  top: 30px;
  left: 30px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 12px 24px;
  border-radius: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  animation: ${slideInLeft} 0.6s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  }
`;

const ServiceTitle = styled.h1`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  margin-bottom: 20px;
  background: linear-gradient(45deg, #fff, #f8f9fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${fadeInUp} 0.8s ease 0.2s both;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`;

const TempleName = styled.p`
  font-size: 1.4rem;
  margin-bottom: 30px;
  opacity: 0.9;
  font-weight: 300;
  animation: ${fadeInUp} 0.8s ease 0.4s both;
`;

const QuickStats = styled.div`
  display: flex;
  gap: 30px;
  margin-top: 30px;
  animation: ${fadeInUp} 0.8s ease 0.6s both;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const StatItem = styled.div`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 15px 25px;
  border-radius: 20px;
  text-align: center;

  .stat-value {
    font-size: 1.8rem;
    font-weight: 700;
    display: block;
    margin-bottom: 5px;
  }

  .stat-label {
    font-size: 0.9rem;
    opacity: 0.8;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
`;

// Main Content
const MainContent = styled.div`
  /* background: white; */
  border-radius: 30px 30px 0 0;
  margin-top: -30px;
  position: relative;
  z-index: 2;
  /* box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.1); */
  overflow: hidden;
`;

const ContentSection = styled.section`
  padding: 50px 40px;
  animation: ${fadeInUp} 0.6s ease;

  @media (max-width: 768px) {
    padding: 30px 20px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.2rem;
  color: #2c3e50;
  margin-bottom: 30px;
  position: relative;
  display: inline-block;

  &::after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 60px;
    height: 4px;
    background: linear-gradient(45deg, #667eea, #764ba2);
    border-radius: 2px;
  }
`;

const Description = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: #555;
  margin-bottom: 40px;
  text-align: justify;
`;

// Image Gallery
const GallerySection = styled.div`
  margin-bottom: 50px;
`;

const MainImageContainer = styled.div`
  position: relative;
  height: 400px;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  }
`;

const MainImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;

  ${MainImageContainer}:hover & {
    transform: scale(1.05);
  }
`;

const ImageCounter = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  backdrop-filter: blur(10px);
`;

const ThumbnailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 15px;
  max-width: 600px;
`;

const Thumbnail = styled.div`
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 3px solid ${(props) => (props.active ? "#667eea" : "transparent")};
  transform: ${(props) => (props.active ? "scale(1.05)" : "scale(1)")};

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

// Pricing Section
const PricingContainer = styled.div`
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 40px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(45deg, #667eea, #764ba2);
  }
`;

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
  margin-top: 30px;
`;

const PricingCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
    border-color: #667eea;
  }

  .price {
    font-size: 2rem;
    font-weight: 700;
    color: #667eea;
    margin-bottom: 15px;
  }

  .details {
    color: #666;
    line-height: 1.6;

    div {
      margin-bottom: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    strong {
      color: #2c3e50;
      font-weight: 600;
    }
  }
`;

// Variations Section
const VariationsGrid = styled.div`
  display: grid;
  gap: 20px;
  margin-top: 30px;
`;

const VariationCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    background: linear-gradient(
      45deg,
      rgba(102, 126, 234, 0.05),
      rgba(118, 75, 162, 0.05)
    );
    transition: width 0.3s ease;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
    border-color: #667eea;

    &::before {
      width: 100%;
    }
  }
`;

const VariationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  position: relative;
  z-index: 1;
`;

const VariationType = styled.span`
  font-weight: 700;
  color: #2c3e50;
  font-size: 1.2rem;
`;

const VariationPrice = styled.span`
  font-size: 1.5rem;
  color: #667eea;
  font-weight: 700;
`;

const VariationDetails = styled.div`
  color: #666;
  position: relative;
  z-index: 1;

  div {
    margin-bottom: 8px;
    padding: 5px 0;
    border-bottom: 1px solid #f1f3f4;

    &:last-child {
      border-bottom: none;
    }

    strong {
      color: #2c3e50;
      margin-right: 10px;
    }
  }
`;

// Policy Section
const PolicyContainer = styled.div`
  margin-bottom: 40px;
`;

const PolicyGrid = styled.div`
  display: grid;
  gap: 25px;
  margin-top: 30px;
`;

const PolicyCard = styled.div`
  background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
  border-left: 5px solid #667eea;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  }

  h3 {
    color: #2c3e50;
    font-size: 1.4rem;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;

    &::before {
      content: "📋";
      font-size: 1.2rem;
    }
  }

  p {
    margin-bottom: 12px;
    color: #555;
    line-height: 1.6;

    strong {
      color: #2c3e50;
    }
  }
`;

// Floating Book Button
const FloatingBookButton = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: linear-gradient(145deg, rgb(212, 175, 55), rgb(196, 69, 54));
  color: white;
  border: none;
  padding: 20px 40px;
  border-radius: 60px;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.4);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;

  &::before {
    content: "⚡";
    font-size: 1.3rem;
  }

  &:hover {
    transform: translateY(-8px) scale(1.05);
    box-shadow: 0 15px 40px rgba(234, 172, 102, 0.6);
    animation: ${pulse} 2s infinite;
  }

  &:active {
    transform: translateY(-4px) scale(1.02);
  }

  @media (max-width: 768px) {
    bottom: 20px;
    right: 20px;
    padding: 15px 30px;
    font-size: 1rem;
  }
`;

// Loading Component
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  /* background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); */
`;

const LoadingCard = styled.div`
  background: white;
  padding: 60px 40px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);

  .spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  p {
    color: #666;
    font-size: 1.1rem;
    margin: 0;
  }
`;

const ServiceDetails = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [variationOpen, setVariationOpen] = useState(false);
  const [chosenService, setChosenService] = useState(null);
  const [chosenVariation, setChosenVariation] = useState(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [disabledDateKeys, setDisabledDateKeys] = useState(new Set());
  const [selectateddate, setselecteddate] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [bookingData, setBookingData] = useState([]);
  const { customerData } = useCustomerAuth();
  useEffect(() => {
    fetchServiceDetails();
  }, [serviceId]);
  const onConfirmDate = async (dateKey) => {
    setselecteddate(dateKey);
    setCalendarOpen(false);
    setVariationOpen(true);

    // try {
    //   await processBooking(booking);
    //   navigate("/customer-bookings", {
    //     state: {
    //       message: "🎉 Booking confirmed successfully!",
    //       booking: booking.booking_data,
    //     },
    //   });
    // } catch (err) {
    //   console.error(err);
    //   setError(err?.message || "Failed to confirm booking. Please try again.");
    // }
  };

  const handleConfirmBooking = async () => {
    let latestBooking = null; // use let, not const
    const id = localStorage.getItem("customerRefCode");
    setIsLoading(true);

    try {
      // Step 1: Process initial booking
      await processBooking(bookingData);

      // Step 2: Fetch latest booking
      const res = await getServiceBookings(id);
      latestBooking = res[res.length - 1];

      // Step 3: Proceed only if booking exists
      if (latestBooking?.ref_code) {
        const data = { ref_code: latestBooking.ref_code };
        const paymentRes = await processpayment(data);

        if (paymentRes?.data?.payment?.status === "F") {
          // Payment failed -> Cancel booking
          const cancelData = {
            booking_data: {
              cust_ref_code: customerData.custRefCode,
              call_mode: "CANCEL",
              booking_ref_code: latestBooking.ref_code,
              remarks: `Payment failed or cancelled for ${latestBooking.ref_code}`,
            },
          };

          await processBooking(cancelData);

          navigate("/customer-bookings", {
            state: {
              message:
                "❌ Payment failed or was cancelled. Booking has been cancelled.",
            },
          });
        } else if (paymentRes?.data?.payment?.status === "P") {
          // Payment pending
          navigate("/customer-bookings", {
            state: {
              message:
                "⚠️ Payment process was not completed. Please check your bookings.",
              booking: latestBooking,
            },
          });
        } else {
          // Payment success
          navigate("/customer-bookings", {
            state: {
              message: "🎉 Booking and payment successful!",
              booking: latestBooking,
            },
          });
        }
      }

      setShowConfirmation(false);
    } catch (error) {
      console.error("Error while confirming booking:", error);
      navigate("/customer-bookings", {
        state: {
          message: "❌ Something went wrong while confirming your booking.",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSelectVariation = async (variationOrNull) => {
    setVariationOpen(false);
    setChosenVariation(variationOrNull || null);
    if (!chosenService) return;
    const booking = {
      booking_data: {
        cust_ref_code: customerData.custRefCode,
        call_mode: "ADD_BOOKING",
        service_id: chosenService.service_id,
        // IMPORTANT: include service_variation_id for API
        service_variation_id:
          variationOrNull?.id || variationOrNull?.variation_id || null,
        booking_date: toAPIDate(selectateddate || ""),
        end_date: toAPIDate(selectateddate || ""),
        start_time: variationOrNull?.start_time || "",
        end_time: variationOrNull?.end_time || "",
        notes: "",
        quantity: variationOrNull?.max_participant || 1,
        duration: Number.parseInt(
          chosenService.duration_minutes || chosenService.duration || 60,
          10
        ),
        unit_price: Number.parseFloat(
          (parseFloat(variationOrNull?.base_price) || 0) +
            (parseFloat(variationOrNull?.pricing_rule_data?.week_day_price) ||
              0) +
            (parseFloat(variationOrNull?.pricing_rule_data?.time_price) || 0) +
            (parseFloat(variationOrNull?.pricing_rule_data?.date_price) || 0)
        ),
      },
    };
    setBookingData(booking);
    if (!chosenService) return;
    await loadDisabledDates(chosenService.service_id, variationOrNull);
    setShowConfirmation(true);
  };
  const loadDisabledDates = async (serviceId, variationOrNull) => {
    const starttime = variationOrNull?.start_time;
    const endtime = variationOrNull?.end_time;
    try {
      const bookings = await getServiceBookings(1, "user");
      const filteredServices = bookings.filter(
        (service) =>
          !serviceId ||
          (service?.service_data?.service_id === serviceId &&
            service?.status !== "X")
      );
      setDisabledDateKeys(
        extractDisabledDatesFromBookings(
          selectedCategory === "PUJA" ? [] : filteredServices,
          starttime,
          endtime
        )
      );
    } catch (e) {
      console.warn(
        "Could not fetch booked dates, proceeding without disabled dates."
      );
      setDisabledDateKeys(new Set());
    }
  };
  const fetchServiceDetails = async () => {
    try {
      setLoading(true);
      const services = await getTempleServicesList();
      const foundService = services.find((s) => s.service_id === serviceId);
      setChosenService(foundService);
      if (foundService) {
        setService(foundService);

        // Filter out null images and set first image as main
        const images = [
          foundService.image,
          foundService.image_1,
          foundService.image_2,
          foundService.image_3,
          foundService.image_4,
          foundService.image_5,
        ].filter((img) => img != null);

        setService((prev) => ({ ...prev, allImages: images }));
      } else {
        setError("Service not found");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    setCalendarOpen(true);
  };

  const getServiceImages = () => {
    if (!service) return [];
    return [
      service.image,
      service.image_1,
      service.image_2,
      service.image_3,
      service.image_4,
      service.image_5,
    ].filter((img) => img != null);
  };

  if (loading) {
    return (
      <CustomerLayout>
        <LoadingContainer>
          <LoadingCard>
            <div className="spinner"></div>
            <p>Loading service details...</p>
          </LoadingCard>
        </LoadingContainer>
      </CustomerLayout>
    );
  }

  if (error) {
    return (
      <CustomerLayout>
        <LoadingContainer>
          <LoadingCard>
            <p style={{ color: "red" }}>Error: {error}</p>
          </LoadingCard>
        </LoadingContainer>
      </CustomerLayout>
    );
  }

  if (!service) {
    return (
      <CustomerLayout>
        <LoadingContainer>
          <LoadingCard>
            <p>Service not found</p>
          </LoadingCard>
        </LoadingContainer>
      </CustomerLayout>
    );
  }

  const images = getServiceImages();

  return (
    <CustomerLayout>
      <DetailsContainer>
        <HeroSection>
          <HeroBackground
            bgImage={images[selectedImage] || "/placeholder-image.jpg"}
          />
          <HeroOverlay>
            <BackButton onClick={() => navigate(-1)}>
              ← Back to Services
            </BackButton>

            <ServiceTitle>{service.name}</ServiceTitle>
            <TempleName>{service.temple_name}</TempleName>

            {/* <QuickStats>
              <StatItem>
                <span className="stat-value">
                  ₹{parseFloat(service.base_price || 0).toFixed(0)}
                </span>
                <span className="stat-label">Starting Price</span>
              </StatItem>
              <StatItem>
                <span className="stat-value">{service.capacity}</span>
                <span className="stat-label">Max Capacity</span>
              </StatItem>
              {service.duration_minutes > 0 && (
                <StatItem>
                  <span className="stat-value">{service.duration_minutes}</span>
                  <span className="stat-label">Minutes</span>
                </StatItem>
              )}
            </QuickStats> */}
          </HeroOverlay>
        </HeroSection>

        <MainContent>
          <ContentWrapper>
            <ContentSection>
              <SectionTitle>About This Service</SectionTitle>
              <Description>{service.description}</Description>

              {images.length > 0 && (
                <GallerySection>
                  <SectionTitle>Gallery</SectionTitle>
                  <MainImageContainer
                    onClick={() =>
                      setSelectedImage((selectedImage + 1) % images.length)
                    }
                  >
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
                          <img src={img} alt={`${service.name} ${index + 1}`} />
                        </Thumbnail>
                      ))}
                    </ThumbnailGrid>
                  )}
                </GallerySection>
              )}

              {/* <SectionTitle>Pricing</SectionTitle>
              <PricingContainer>
                <PricingGrid>
                  <PricingCard>
                    <div className="price">
                      ₹ {parseFloat(service.base_price || 0).toFixed(2)}
                    </div>
                    <div className="details">
                      <div>
                        <strong>Base Price</strong>
                      </div>
                      <div>
                        <strong>Capacity:</strong>{" "}
                        <span>{service.capacity} people</span>
                      </div>
                      {service.duration_minutes > 0 && (
                        <div>
                          <strong>Duration:</strong>{" "}
                          <span>{service.duration_minutes} min</span>
                        </div>
                      )}
                    </div>
                  </PricingCard>
                </PricingGrid>
              </PricingContainer> */}

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
                              </VariationPrice>
                            </VariationHeader>
                            <VariationDetails>
                              <div>
                                <strong>Time:</strong> {variation.start_time} -{" "}
                                {variation.end_time}
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

              <PolicyContainer>
                <SectionTitle>Policies & Terms</SectionTitle>
                <PolicyGrid>
                  {service.adv_policy_data && (
                    <PolicyCard>
                      <h3>Advance Payment Policy</h3>
                      <p>
                        <strong>{service.adv_policy_data.name}</strong>
                      </p>
                      <p>
                        Advance payment required:{" "}
                        <strong>{service.adv_policy_data.percent}%</strong>{" "}
                        (minimum ₹{service.adv_policy_data.min_amount})
                      </p>
                      <p>
                        Payment due:{" "}
                        <strong>
                          {service.adv_policy_data.due_days_before} days
                        </strong>{" "}
                        before booking date
                      </p>
                    </PolicyCard>
                  )}

                  {service.refund_policy_data &&
                    service.refund_policy_data.refund_rules && (
                      <PolicyCard>
                        <h3>Refund Policy</h3>
                        <p>
                          <strong>{service.refund_policy_data.name}</strong>
                        </p>
                        {service.refund_policy_data.refund_rules.map(
                          (rule, index) => (
                            <div key={rule.id || index}>
                              <p>
                                Cancellation{" "}
                                <strong>{rule.min_hours_before} hours</strong>{" "}
                                before:{" "}
                                <strong>{rule.refund_percent}% refund</strong>
                              </p>
                              {rule.notes && (
                                <p>
                                  <em>Note: {rule.notes}</em>
                                </p>
                              )}
                            </div>
                          )
                        )}
                      </PolicyCard>
                    )}
                </PolicyGrid>
              </PolicyContainer>
            </ContentSection>
          </ContentWrapper>
        </MainContent>

        <FloatingBookButton onClick={handleBookNow}>
          Book Now
        </FloatingBookButton>
        <VariationModal
          open={variationOpen}
          service={chosenService}
          onClose={() => setVariationOpen(false)}
          onSelect={onSelectVariation}
          selectateddate={selectateddate}
        />
        <AvailabilityCalendarModal
          open={calendarOpen}
          // disabledDateKeys={disabledDateKeys}
          onClose={() => setCalendarOpen(false)}
          onConfirm={onConfirmDate}
        />
        {showConfirmation && (
          <BookingConfirmationPopup
            booking={service}
            onConfirm={handleConfirmBooking}
            onCancel={() => setShowConfirmation(false)}
            isLoading={isLoading}
            variationId={chosenVariation?.id || chosenVariation?.variation_id}
            bookingDate={bookingData.booking_data?.booking_date}
          />
        )}
      </DetailsContainer>
    </CustomerLayout>
  );
};

export default ServiceDetails;
