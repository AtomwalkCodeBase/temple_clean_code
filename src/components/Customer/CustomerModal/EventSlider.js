import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiUsers,
  FiMapPin,
  FiCalendar,
  FiStar,
} from "react-icons/fi";
import { getTempleServicesList } from "../../../services/templeServices";
import { useNavigate } from "react-router-dom";

// Keyframe Animations
const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.2); }
  50% { box-shadow: 0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.3); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`;

// Styled Components
const SliderContainer = styled.div`
  /* width: 98%; */
  height: 500px;
  position: relative;
  overflow: hidden;
  margin-bottom: 50px;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3), 0 0 80px rgba(255, 215, 0, 0.1),
    inset 0 0 0 1px rgba(255, 215, 0, 0.2);
  background: #f8f4e6b3;
  border: 2px solid #f8c845ff;
`;

const Slide = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
`;

const SlideBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
        circle at 30% 50%,
        rgba(255, 215, 0, 0.15),
        transparent 60%
      ),
      radial-gradient(
        circle at 70% 50%,
        rgba(255, 140, 0, 0.15),
        transparent 60%
      );
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    /* background: linear-gradient(
      135deg,
      rgba(26, 11, 46, 0.95) 0%,
      rgba(61, 41, 99, 0.85) 50%,
      rgba(26, 11, 46, 0.95) 100%
    ); */
  }
`;

const DecorativePattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.1;
  background-image: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 35px,
      rgba(255, 215, 0, 0.1) 35px,
      rgba(255, 215, 0, 0.1) 70px
    ),
    repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 35px,
      rgba(255, 140, 0, 0.1) 35px,
      rgba(255, 140, 0, 0.1) 70px
    );
  pointer-events: none;
`;

const OmSymbol = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 3rem;
  color: rgba(255, 215, 0, 0.3);
  animation: ${float} 3s ease-in-out infinite;
  z-index: 1;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);

  &::before {
    content: "ॐ";
  }
`;

const SlideContent = styled.div`
  position: relative;
  z-index: 2;
  color: white;
  max-width: 650px;
  margin: 0 auto;
  padding: 3rem;
  background: linear-gradient(
    135deg,
    rgba(255, 215, 0, 0.15) 0%,
    rgba(255, 140, 0, 0.1) 50%,
    rgba(255, 215, 0, 0.15) 100%
  );
  backdrop-filter: blur(20px) saturate(180%);
  border-radius: 24px;
  border: 2px solid rgba(255, 215, 0, 0.4);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 0 60px rgba(255, 215, 0, 0.05), 0 0 80px rgba(255, 215, 0, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, #ffd700, #ff8c00, #ffd700);
    border-radius: 24px;
    opacity: 0;
    z-index: -1;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 0.1;
  }
`;

const DivineBorder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 24px;
  pointer-events: none;

  &::before,
  &::after {
    content: "✦";
    position: absolute;
    font-size: 1.5rem;
    color: #ffd700;
    animation: ${pulse} 2s ease-in-out infinite;
  }

  &::before {
    top: 15px;
    left: 15px;
  }

  &::after {
    bottom: 15px;
    right: 15px;
  }
`;

const TempleName = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  background: linear-gradient(90deg, #ffd700, #ff8c00, #ffd700);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${shimmer} 3s linear infinite;

  svg {
    color: #ffd700;
    filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.6));
    animation: ${glow} 2s ease-in-out infinite;
  }
`;

const ServiceTitle = styled.h2`
  font-size: 3rem;
  font-weight: 800;
  margin: 0 0 1.5rem 0;
  text-align: center;
  background: linear-gradient(135deg, #fff 0%, #ffd700 50%, #fff 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(255, 215, 0, 0.3);
  line-height: 1.2;
  letter-spacing: 1px;
  animation: ${shimmer} 4s linear infinite;
`;

const ServiceDescription = styled.p`
  font-size: 1.15rem;
  line-height: 1.8;
  margin: 0 0 2rem 0;
  text-align: center;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  font-weight: 300;
  letter-spacing: 0.5px;
`;

const ServiceDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
`;

const DetailChip = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.7rem 1.3rem;
  background: linear-gradient(
    135deg,
    rgba(255, 215, 0, 0.2),
    rgba(255, 140, 0, 0.15)
  );
  border-radius: 30px;
  font-size: 0.95rem;
  font-weight: 500;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 215, 0, 0.4);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;

  svg {
    color: #ffd700;
    filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.5));
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 215, 0, 0.3);
    border-color: rgba(255, 215, 0, 0.6);
  }
`;

const PriceBadge = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 1rem 2rem;
  background: ${(props) =>
    props.isFree
      ? "linear-gradient(135deg, #48bb78 0%, #38a169 100%)"
      : "linear-gradient(135deg, #ffd700 0%, #ff8c00 100%)"};
  color: ${(props) => (props.isFree ? "white" : "#1a0b2e")};
  border-radius: 30px;
  font-weight: 700;
  font-size: 1.3rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3),
    0 0 30px
      ${(props) =>
        props.isFree ? "rgba(72, 187, 120, 0.3)" : "rgba(255, 215, 0, 0.4)"};
  text-transform: uppercase;
  letter-spacing: 1px;
  animation: ${glow} 2s ease-in-out infinite;
`;

const NavigationButton = styled(motion.button)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 60px;
  height: 60px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    rgba(255, 215, 0, 0.3),
    rgba(255, 140, 0, 0.2)
  );
  backdrop-filter: blur(15px);
  color: #ffd700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
  border: 2px solid rgba(255, 215, 0, 0.5);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(
      135deg,
      rgba(255, 215, 0, 0.5),
      rgba(255, 140, 0, 0.3)
    );
    box-shadow: 0 6px 30px rgba(255, 215, 0, 0.4);
    border-color: rgba(255, 215, 0, 0.8);
  }

  &.prev {
    left: 2rem;
  }

  &.next {
    right: 2rem;
  }
`;

const BookButton = styled(motion.button)`
  padding: 1rem 2.5rem;
  background: linear-gradient(
    135deg,
    rgba(255, 215, 0, 0.25),
    rgba(255, 140, 0, 0.2)
  );
  color: white;
  border: 2px solid rgba(255, 215, 0, 0.5);
  border-radius: 30px;
  font-weight: 700;
  cursor: pointer;
  backdrop-filter: blur(10px);
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(
      135deg,
      rgba(255, 215, 0, 0.4),
      rgba(255, 140, 0, 0.3)
    );
    box-shadow: 0 8px 30px rgba(255, 215, 0, 0.4);
    transform: translateY(-2px);
    border-color: rgba(255, 215, 0, 0.8);
  }
`;

const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
`;

// Main Component
const EventSlider = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  // Simulate API call
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        const response = await getTempleServicesList();
        // Use mock data instead of API call
        setServices(response);
      } catch (error) {
        console.error("Error fetching temple services:", error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);
  const selectServiceAndNavigate = (serviceId) => {
    // console.log(serviceId, "serviceId");
    navigate(`/customer-services/${serviceId.service_id}`);
  };
  // Auto-advance slides
  useEffect(() => {
    if (services.length > 1) {
      const interval = setInterval(() => {
        nextSlide();
      }, 6000);

      return () => clearInterval(interval);
    }
  }, [services.length, currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % services.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + services.length) % services.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const formatPrice = (price) => {
    const numPrice = parseFloat(price);
    return numPrice === 0 ? "Free Service" : `₹${numPrice.toFixed(0)}`;
  };

  const getEventDate = (service) => {
    if (service.event_from_date) {
      return new Date(service.event_from_date).toLocaleDateString("en-IN", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    }
    return "Daily";
  };

  if (loading) {
    return (
      <SliderContainer>
        <OmSymbol />
        <DecorativePattern />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: "#ffd700",
            fontSize: "1.3rem",
            fontWeight: "600",
            letterSpacing: "2px",
            textShadow: "0 0 20px rgba(255, 215, 0, 0.5)",
          }}
        >
          Loading Divine Services...
        </div>
      </SliderContainer>
    );
  }

  if (!services.length) {
    return (
      <SliderContainer>
        <OmSymbol />
        <DecorativePattern />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: "#ffd700",
            fontSize: "1.2rem",
            textAlign: "center",
            padding: "2rem",
          }}
        >
          No services available at the moment. Please check back later.
        </div>
      </SliderContainer>
    );
  }

  return (
    <SliderContainer>
      <OmSymbol />
      <DecorativePattern />

      <AnimatePresence mode="wait">
        <Slide
          key={currentSlide}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <SlideBackground src={services[currentSlide]?.image} />
          <SlideContent>
            <DivineBorder />

            <TempleName>
              <FiStar />
              {services[currentSlide]?.temple_name}
              <FiStar />
            </TempleName>

            <ServiceTitle>{services[currentSlide]?.name}</ServiceTitle>

            {/* <ServiceDescription>
              {services[currentSlide]?.description}
            </ServiceDescription> */}

            <ServiceDetails>
              <DetailChip>
                <FiCalendar />
                {getEventDate(services[currentSlide])}
              </DetailChip>

              {services[currentSlide]?.duration_minutes > 0 && (
                <DetailChip>
                  <FiClock />
                  {services[currentSlide]?.duration_minutes} mins
                </DetailChip>
              )}

              {services[currentSlide]?.capacity > 0 && (
                <DetailChip>
                  <FiUsers />
                  {services[currentSlide]?.capacity} people
                </DetailChip>
              )}

              <DetailChip>
                <FiMapPin />
                {services[currentSlide]?.service_type_str}
              </DetailChip>
            </ServiceDetails>

            <ActionContainer>
              <PriceBadge
                isFree={services[currentSlide]?.base_price === "0.00"}
              >
                {formatPrice(services[currentSlide]?.base_price)}
              </PriceBadge>

              <BookButton
                onClick={() => selectServiceAndNavigate(services[currentSlide])}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Book Now
              </BookButton>
            </ActionContainer>
          </SlideContent>
        </Slide>
      </AnimatePresence>

      {/* Navigation Buttons */}
      {services.length > 1 && (
        <>
          <NavigationButton
            className="prev"
            onClick={prevSlide}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiChevronLeft size={28} />
          </NavigationButton>

          <NavigationButton
            className="next"
            onClick={nextSlide}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiChevronRight size={28} />
          </NavigationButton>
        </>
      )}
    </SliderContainer>
  );
};

export default EventSlider;
