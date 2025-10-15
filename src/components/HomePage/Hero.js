import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes, css } from "styled-components";
import { ChevronLeft, ChevronRight, Play, ArrowRight } from "lucide-react";
import durgaMaa from "../../assets/img/durgaMaa.png";
import ganesh from "../../assets/img/Ganesh.png";
import Shiva from "../../assets/img/LordShiva.png";

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translate3d(0, 60px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const Slide = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateX(${(props) => (props.active ? "0" : "100%")});
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  background-image: url(${(props) => props.img});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  animation: ${(props) =>
    props.active ? css`gradientShift 8s ease infinite` : "none"};

  @keyframes gradientShift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

const Content = styled.div`
  max-width: 1200px;
  padding: 0.5rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  z-index: 2;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 2rem;
  }
`;

const TextContent = styled.div`
  color: white;
  animation: ${(props) => (props.active ? fadeInUp : "none")} 1s ease-out 0.3s
    both;
`;

const Title = styled.h1`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  margin-bottom: 1.5rem;
  background: linear-gradient(45deg, #fff, rgb(255, 153, 51));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.1;
  animation: ${(props) => (props.active ? fadeInUp : "none")} 1s ease-out 0.5s
    both;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.6;
  animation: ${(props) => (props.active ? fadeInUp : "none")} 1s ease-out 0.7s
    both;
`;

const CTAContainer = styled.div`
  display: flex;
  gap: 1rem;
  animation: ${(props) => (props.active ? fadeInUp : "none")} 1s ease-out 0.9s
    both;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const PrimaryButton = styled.button`
  background: linear-gradient(45deg, #ff6b6b, #ee5a24);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(255, 107, 107, 0.4);
    animation: ${pulse} 2s infinite;
  }
`;

const VisualContent = styled.div`
  position: relative;
  animation: ${(props) => (props.active ? slideIn : "none")} 1s ease-out 0.2s
    both;
`;

const FloatingElement = styled.div`
  opacity: 0.3;
  width: ${(props) => props.size || "300px"};
  height: ${(props) => props.size || "300px"};
  background: ${(props) =>
    props.bg ||
    "linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))"};
  border-radius: 50%;
  position: absolute;
  top: ${(props) => props.top || "50%"};
  left: ${(props) => props.left || "50%"};
  transform: translate(-50%, -50%);
  animation: ${float} ${(props) => props.duration || "6s"} ease-in-out infinite;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: ${(props) => props.zIndex || 1};

  &::before {
    content: "";
    position: absolute;
    top: 20%;
    left: 20%;
    width: 60%;
    height: 60%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.2) 0%,
      transparent 70%
    );
    border-radius: 50%;
  }
`;

const NavigationContainer = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1rem;
  align-items: center;
  z-index: 10;
`;

const NavButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
`;

const Indicators = styled.div`
  display: flex;
  gap: 0.5rem;
  margin: 0 1rem;
`;

const Indicator = styled.button`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  background: ${(props) =>
    props.active ? "white" : "rgba(255, 255, 255, 0.3)"};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.7);
    transform: scale(1.2);
  }
`;

const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4px;
  background: linear-gradient(90deg, #ff6b6b, #ee5a24);
  width: ${(props) => props.progress}%;
  transition: width 0.1s linear;
  z-index: 10;
`;

const slides = [
  {
    id: 1,
    title: "Maa Durga’s Blessings for All",
    subtitle:
      "She rises with strength, protects with grace, The divine energy in every time and space.",
    gradient: "linear-gradient(135deg, #DC143C 0%, #FF8C00 100%)",
    cta1: "Get Started",
    // cta2: "Watch Demo",
    img: durgaMaa,
  },
  {
    id: 2,
    title: "Divine Beginnings with Lord Ganesha",
    subtitle:
      "Seek blessings under the sacred shade,Where wisdom and new journeys are made.",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    cta1: "Explore",
    // cta2: "More",
    img: ganesh,
  },
  {
    id: 3,
    title: "Ganesh Chaturthi Celebrations Begin",
    subtitle:
      "In the heart of nature, Bappa arrives with grace,Let wisdom and joy fill every sacred space.",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    cta1: "Start Free Trial",
    // cta2: "View Pricing",
    img: Shiva,
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const navigate = useNavigate();

  const handlePrimaryCta = () => {
    const customerToken = localStorage.getItem("customerToken");
    if (customerToken) {
      navigate("/customer-dashboard");
    } else {
      navigate("/customer-login");
    }
  };

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentSlide((current) => (current + 1) % slides.length);
          return 0;
        }
        return prev + 0.5;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setProgress(0);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setProgress(0);
  };

  return (
    <CarouselContainer
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {slides.map((slide, index) => (
        <Slide
          key={slide.id}
          active={index === currentSlide}
          gradient={slide.gradient}
          img={slide.img}
        >
          <Content>
            <TextContent active={index === currentSlide}>
              <Title active={index === currentSlide}>{slide.title}</Title>
              <Subtitle active={index === currentSlide}>
                {slide.subtitle}
              </Subtitle>
              <CTAContainer active={index === currentSlide}>
                <PrimaryButton onClick={handlePrimaryCta}>
                  {slide.cta1}
                  <ArrowRight size={20} />
                </PrimaryButton>
              </CTAContainer>
            </TextContent>

            <VisualContent active={index === currentSlide}>
              <FloatingElement size="400px" duration="8s" zIndex={1} />
              <FloatingElement
                size="200px"
                top="30%"
                left="70%"
                duration="6s"
                bg="linear-gradient(45deg, rgba(255,255,255,0.15), rgba(255,255,255,0.08))"
                zIndex={2}
              />
              <FloatingElement
                size="120px"
                top="70%"
                left="20%"
                duration="4s"
                bg="linear-gradient(45deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))"
                zIndex={3}
              />
            </VisualContent>
          </Content>
        </Slide>
      ))}

      <NavigationContainer>
        <NavButton onClick={prevSlide}>
          <ChevronLeft size={24} />
        </NavButton>

        <Indicators>
          {slides.map((_, index) => (
            <Indicator
              key={index}
              active={index === currentSlide}
              onClick={() => goToSlide(index)}
            />
          ))}
        </Indicators>

        <NavButton onClick={nextSlide}>
          <ChevronRight size={24} />
        </NavButton>
      </NavigationContainer>

      <ProgressBar progress={progress} />
    </CarouselContainer>
  );
}
