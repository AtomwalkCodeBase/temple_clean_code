"use client";

import styled from "styled-components";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import {
  MdTempleHindu,
  MdEventNote,
  MdMeetingRoom,
  MdHotel,
} from "react-icons/md";

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled(motion.div)`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 16px;
  padding: 2rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border: 2px solid rgba(212, 175, 55, 0.2);
  transition: all 0.3s ease;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${(props) => props.gradientColor};
    background-size: 200% 100%;
  }

  &::after {
    content: "";
    position: absolute;
    top: -50%;
    right: -50%;
    width: 100%;
    height: 200%;
    background: radial-gradient(
      circle,
      ${(props) => props.accentColor}20,
      transparent 70%
    );
    transition: all 0.6s ease;
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
    border-color: ${(props) => props.accentColor};

    &::after {
      top: -20%;
      right: -20%;
    }

    .arrow {
      transform: translateX(4px);
    }
  }

  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: ${(props) => props.accentColor};
    display: flex;
    align-items: center;
    justify-content: center;
    width: 70px;
    height: 70px;
    background: ${(props) => props.accentColor}15;
    border-radius: 12px;
    transition: all 0.3s ease;
  }

  &:hover .icon {
    transform: scale(1.1) rotate(5deg);
    background: ${(props) => props.accentColor}25;
  }

  .title {
    font-size: 1.3rem;
    font-weight: 700;
    color: #2c3e50;
    margin: 0 0 0.5rem 0;
  }

  .description {
    color: #6b7280;
    font-size: 0.95rem;
    margin: 0 0 1.5rem 0;
    line-height: 1.5;
  }

  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 1rem;
    border-top: 1px solid rgba(212, 175, 55, 0.1);
  }

  .cta {
    color: ${(props) => props.accentColor};
    font-weight: 700;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;

    .arrow {
      transition: transform 0.2s ease;
    }
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.6rem;
  font-weight: 800;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;

  svg {
    color: #d4af37;
  }
`;

const ServiceTypeCards = () => {
  const navigate = useNavigate();

  const serviceTypes = [
    {
      id: "puja",
      title: "Puja Services",
      description: "Book sacred rituals and prayers for your spiritual needs",
      icon: MdTempleHindu,
      accentColor: "#d4af37",
      gradientColor: "linear-gradient(90deg, #d4af37, #ff8c00)",
      path: "/customer-services?id=Puja",
    },
    {
      id: "event",
      title: "Events",
      description: "Organize religious events and celebrations",
      icon: MdEventNote,
      accentColor: "#10b981",
      gradientColor: "linear-gradient(90deg, #10b981, #059669)",
      path: "/customer-services?id=Event",
    },
    {
      id: "hall",
      title: "Halls",
      description: "Rent temple halls for your gatherings",
      icon: MdMeetingRoom,
      accentColor: "#3b82f6",
      gradientColor: "linear-gradient(90deg, #3b82f6, #1d4ed8)",
      path: "/customer-services?id=Hall",
    },
    {
      id: "accommodation",
      title: "Accommodation",
      description: "Find comfortable lodging near temples",
      icon: MdHotel,
      accentColor: "#f59e0b",
      gradientColor: "linear-gradient(90deg, #f59e0b, #d97706)",
      path: "/customer-services?id=Accommodation",
    },
  ];

  return (
    <div>
      <SectionTitle>Browse by Service Type</SectionTitle>
      <CardsContainer>
        {serviceTypes.map((service, index) => (
          <Card
            key={service.id}
            accentColor={service.accentColor}
            gradientColor={service.gradientColor}
            onClick={() => navigate(service.path)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="icon">
              <service.icon />
            </div>
            <h3 className="title">{service.title}</h3>
            <p className="description">{service.description}</p>
            <div className="footer">
              <span className="cta">
                Explore <FiArrowRight className="arrow" />
              </span>
            </div>
          </Card>
        ))}
      </CardsContainer>
    </div>
  );
};

export default ServiceTypeCards;
