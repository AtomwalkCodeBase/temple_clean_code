"use client";

import styled from "styled-components";
import { motion } from "framer-motion";
import { MdTempleHindu, MdEventAvailable, MdHomeWork } from "react-icons/md";
import { FaPrayingHands, FaBed } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Container = styled.div`
  position: relative;
  padding: 2rem 0;
`;

const Header = styled(motion.div)`
  text-align: center;
  margin-bottom: 3rem;
  position: relative;

  .title {
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    font-weight: 900;
    background: linear-gradient(145deg, #d4af37ff, #c44536ff);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 1rem;
    line-height: 1.2;
    position: relative;

    &::after {
      content: "";
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 4px;
      background: linear-gradient(90deg, #d4af37ff, #c44536ff);
      border-radius: 2px;
    }
  }

  .subtitle {
    color: #64748b;
    font-size: 1.1rem;
    font-weight: 500;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 0 0.5rem;
  }
`;

const CategoryCard = styled(motion.button)`
  border: none;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  padding: 0;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.2) inset;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  min-height: 180px;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${(props) =>
      props.gradient || "linear-gradient(135deg, #667eea, #764ba2)"};
    opacity: 0;
    transition: opacity 0.3s ease;
    border-radius: 24px;
  }

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15),
      0 0 0 1px rgba(255, 255, 255, 0.3) inset;

    &::before {
      opacity: 0.1;
    }

    .content {
      transform: translateY(-2px);
    }

    .icon-wrapper {
      transform: scale(1.1) rotate(5deg);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
    }

    .floating-elements {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &:active {
    transform: translateY(-4px) scale(1.01);
  }

  .content {
    position: relative;
    z-index: 2;
    padding: 2rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    transition: transform 0.3s ease;
  }

  .icon-wrapper {
    width: 80px;
    height: 80px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${(props) =>
      props.gradient || "linear-gradient(135deg, #667eea, #764ba2)"};
    color: white;
    font-size: 2rem;
    position: relative;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);

    &::before {
      content: "";
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: ${(props) =>
        props.gradient || "linear-gradient(135deg, #667eea, #764ba2)"};
      border-radius: 22px;
      z-index: -1;
      opacity: 0.3;
      filter: blur(8px);
    }
  }

  .text-content {
    text-align: center;
  }

  .label {
    font-weight: 700;
    color: #1e293b;
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
    line-height: 1.3;
  }

  .description {
    color: #64748b;
    font-size: 0.9rem;
    font-weight: 500;
    opacity: 0.8;
    line-height: 1.4;
  }

  .floating-elements {
    position: absolute;
    top: 1rem;
    right: 1rem;
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.3s ease;
    pointer-events: none;

    .sparkle {
      width: 6px;
      height: 6px;
      background: ${(props) =>
        props.gradient || "linear-gradient(135deg, #667eea, #764ba2)"};
      border-radius: 50%;
      margin: 2px;
      animation: sparkle 2s ease-in-out infinite;

      &:nth-child(2) {
        animation-delay: 0.3s;
      }
      &:nth-child(3) {
        animation-delay: 0.6s;
      }
    }
  }

  @keyframes sparkle {
    0%,
    100% {
      opacity: 0.3;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.2);
    }
  }

  .glow-effect {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 120%;
    height: 120%;
    transform: translate(-50%, -50%);
    background: radial-gradient(
      circle,
      ${(props) => props.glowColor || "rgba(102, 126, 234, 0.1)"} 0%,
      transparent 70%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  &:hover .glow-effect {
    opacity: 1;
  }
`;

const defaultIcons = {
  HALL: <MdHomeWork />,
  PUJA: <FaPrayingHands />,
  EVENT: <MdEventAvailable />,
  ACCOMMODATION: <FaBed />,
  EXT_PUJA: <MdTempleHindu />,
};

const categoryGradients = {
  HALL: "linear-gradient(135deg, #667eea, #764ba2)",
  PUJA: "linear-gradient(135deg, #f093fb, #f5576c)",
  EVENT: "linear-gradient(135deg, #4facfe, #00f2fe)",
  ACCOMMODATION: "linear-gradient(135deg, #43e97b, #38f9d7)",
  EXT_PUJA: "linear-gradient(135deg, #fa709a, #fee140)",
};

const glowColors = {
  HALL: "rgba(102, 126, 234, 0.2)",
  PUJA: "rgba(240, 147, 251, 0.2)",
  EVENT: "rgba(79, 172, 254, 0.2)",
  ACCOMMODATION: "rgba(67, 233, 123, 0.2)",
  EXT_PUJA: "rgba(250, 112, 154, 0.2)",
};

const categoryDescriptions = {
  HALL: "Book beautiful halls for ceremonies",
  PUJA: "Sacred rituals in temple premises",
  EVENT: "Special temple celebrations & events",
  ACCOMMODATION: "Comfortable stays near temple",
  EXT_PUJA: "Home visits & external ceremonies",
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.9,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-size: 1.2rem;
  color: #8b4513;
`;

export default function SevaCategories({ categories, onSelect, allServices }) {
  const [loading, setLoading] = useState(true);
  const navigater = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (categories && categories.length > 0 && allServices) {
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    }
  }, [categories, allServices]);

  const availableCategories =
    categories?.filter((category) =>
      allServices?.some(
        (service) =>
          service.service_type &&
          service.service_type.toUpperCase() === category.code
      )
    ) || [];

  if (loading) {
    return <LoadingContainer>Loading services...</LoadingContainer>;
  }

  // If no categories are available, show a message
  if (availableCategories.length === 0) {
    return (
      <Container>
        <Header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="title">No Services Available</div>
          <div className="subtitle">
            Currently, there are no services available at this temple. Please
            check back later or contact the temple administration.
          </div>
        </Header>
      </Container>
    );
  }
  const navigateto = (id) => {
    const pathParts = location.pathname.split("/");
    const templeid = pathParts[pathParts.length - 1];
    navigater(`/customer-services?id=${id}&&templeId=${templeid}`);
  };
  return (
    <Container>
      <Header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="title">Choose Your Sacred Journey</div>
        <div className="subtitle">
          Discover divine services and spiritual experiences tailored for your
          devotional needs
        </div>
      </Header>

      <motion.div variants={containerVariants} initial="hidden" animate="show">
        <CategoriesGrid>
          {availableCategories.map((cat, index) => (
            <CategoryCard
              key={cat.code}
              variants={itemVariants}
              gradient={categoryGradients[cat.code]}
              glowColor={glowColors[cat.code]}
              onClick={() => navigateto(cat.code)}
              whileHover={{
                scale: 1.02,
                transition: { type: "spring", stiffness: 400, damping: 25 },
              }}
              whileTap={{
                scale: 0.98,
                transition: { type: "spring", stiffness: 400, damping: 25 },
              }}
            >
              <div className="glow-effect" />
              <div className="content">
                <div
                  className="icon-wrapper"
                  gradient={categoryGradients[cat.code]}
                >
                  {cat.icon || defaultIcons[cat.code]}
                </div>
                <div className="text-content">
                  <div className="label">{cat.label}</div>
                  <div className="description">
                    {categoryDescriptions[cat.code]}
                  </div>
                </div>
              </div>
              <div className="floating-elements">
                <div className="sparkle"></div>
                <div className="sparkle"></div>
                <div className="sparkle"></div>
              </div>
            </CategoryCard>
          ))}
        </CategoriesGrid>
      </motion.div>
    </Container>
  );
}
