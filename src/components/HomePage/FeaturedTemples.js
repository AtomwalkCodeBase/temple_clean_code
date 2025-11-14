"use client";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { gettemplist } from "../../services/productServices";

const Section = styled.section`
  padding: 2.5rem 0;
  background: url("https://ayodhyadarshanam.com/static/media/SubHeroBg.eefb8ef14f7af1951305.png");
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
        circle at 20% 80%,
        rgba(255, 153, 51, 0.05),
        transparent 50%
      ),
      radial-gradient(
        circle at 80% 20%,
        rgba(218, 165, 32, 0.05),
        transparent 50%
      );
  }
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
  z-index: 2;
`;

const SectionTitle = styled(motion.h2)`
  font-size: 4rem;
  font-weight: 900;
  background: #ab353d;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1.5rem;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    height: 4px;
    background: ${(props) => props.theme.colors.gradient.primary};
    border-radius: 2px;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    font-size: 2.5rem;
  }
`;

const SectionSubtitle = styled(motion.p)`
  font-size: 1.3rem;
  color: ${(props) => props.theme.colors.darkGray};
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const TemplesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 2;

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const TempleCard = styled(motion.div)`
  background: ${(props) => props.theme.colors.white};
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  /* cursor: pointer; */
  position: relative;
  border: 1px solid #eee;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const TempleImageContainer = styled.div`
  height: 200px;
  position: relative;
  overflow: hidden;
`;

const TempleImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const TempleInfo = styled.div`
  padding: 1.5rem;
`;

const TempleName = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const TempleLocation = styled.p`
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: 1rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const TempleDetail = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.8rem;
  gap: 0.4rem;
`;

const DetailLabel = styled.span`
  color: ${(props) => props.theme.colors.darkGray};
  font-size: 0.9rem;
`;

const DetailValue = styled.span`
  color: ${(props) => props.theme.colors.text};
  font-weight: 500;
  font-size: 0.9rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const ViewDetailsButton = styled(motion.button)`
  flex: 1;
  padding: 0.8rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  background: transparent;
  color: ${(props) => props.theme.colors.primary};
  border: 1px solid ${(props) => props.theme.colors.primary};
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: rgba(255, 153, 51, 0.1);
  }
`;

const BookSevaButton = styled(motion.button)`
  flex: 1;
  padding: 0.8rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  background: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: ${(props) => props.theme.colors.primaryDark};
    transform: translateY(-2px);
  }
`;

const FeaturedTemples = () => {
  const navigate = useNavigate();
  const [templeList, setTempleList] = useState([]);
  const demomode = localStorage.getItem("demoMode");
  useEffect(() => {
    gettemplist().then((data) => {
      const temples = data.data;
      // Determine environment
      const isLocal =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        demomode === "true";

      // Filter based on environment
      const filteredTemples = temples.filter((temple) =>
        isLocal ? temple.is_live_data === false : temple.is_live_data === true
      );

      setTempleList(
        filteredTemples.length > 6
          ? filteredTemples.slice(0, 6)
          : filteredTemples
      );
    });
  }, []);
  const handleBookSeva = (templeId) => {
    navigate("/customer-login", { state: { templeId } });
  };
  const handleViewDetails = (templeId) => {
    navigate(`/templeDetails/${templeId}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <Section>
      <div className="container">
        <SectionHeader>
          <SectionTitle
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Sacred Temples
          </SectionTitle>
          <SectionSubtitle
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Discover India's most revered temples and plan your visit
          </SectionSubtitle>
        </SectionHeader>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <TemplesGrid>
            {templeList &&
              templeList.map((temple) => (
                <TempleCard
                  key={temple.id}
                  variants={cardVariants}
                  whileHover={{ y: -5 }}
                >
                  <TempleImageContainer>
                    <TempleImage src={temple.image} alt={temple.name} />
                  </TempleImageContainer>

                  <TempleInfo>
                    <TempleName>{temple.name}</TempleName>
                    <TempleLocation>📍 {temple.location}</TempleLocation>

                    <TempleDetail>
                      <span role="img" aria-label="Om">
                        📞
                      </span>
                      <DetailLabel>contact:</DetailLabel>
                      <DetailValue>{temple.mobile_number}</DetailValue>
                    </TempleDetail>
                    {/* <TempleDetail>
                      <span role="img" aria-label="Clock">
                        🕒
                      </span>
                      <DetailLabel>Timings:</DetailLabel>
                      <DetailValue>{temple.timings}</DetailValue>
                    </TempleDetail> */}

                    <ActionButtons>
                      <ViewDetailsButton
                        onClick={() => handleViewDetails(temple.temple_id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        View Details
                      </ViewDetailsButton>
                      <BookSevaButton
                        onClick={() => handleBookSeva(temple.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Book Seva
                      </BookSevaButton>
                    </ActionButtons>
                  </TempleInfo>
                </TempleCard>
              ))}
          </TemplesGrid>
        </motion.div>
      </div>
    </Section>
  );
};

export default FeaturedTemples;
