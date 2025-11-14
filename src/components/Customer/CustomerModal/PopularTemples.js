"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiStar, FiMapPin, FiArrowRight } from "react-icons/fi";
import { MdTempleHindu } from "react-icons/md";
import { gettemplist } from "../../../services/productServices";
import { toast } from "react-toastify";
import { Phone } from "lucide-react";

const TemplesContainer = styled.div`
  margin-bottom: 3rem;
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

const TempleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const TempleCard = styled(motion.div)`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid rgba(212, 175, 55, 0.2);
  transition: all 0.3s ease;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
    border-color: #d4af37;
  }

  .image-container {
    position: relative;
    width: 100%;
    height: 200px;
    overflow: hidden;
    background: linear-gradient(135deg, #d4af37, #ff8c00);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    &:hover img {
      transform: scale(1.05);
    }

    .rank-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      background: linear-gradient(135deg, #d4af37, #ff8c00);
      color: white;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 1.1rem;
      box-shadow: 0 4px 12px rgba(212, 175, 55, 0.4);
    }
  }

  .content {
    padding: 1.5rem;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .temple-name {
    font-size: 1.2rem;
    font-weight: 700;
    color: #2c3e50;
    margin: 0 0 0.5rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    svg {
      color: #d4af37;
      font-size: 1.3rem;
    }
  }

  .location {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    color: #6b7280;
    font-size: 0.9rem;
    margin-bottom: 1rem;

    svg {
      color: #d4af37;
    }
  }

  .rating {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin-bottom: 1rem;

    .stars {
      display: flex;
      gap: 0.2rem;

      svg {
        color: #fbbf24;
        font-size: 0.9rem;
      }
    }

    .rating-text {
      color: #6b7280;
      font-size: 0.85rem;
      font-weight: 600;
    }
  }

  .description {
    color: #6b7280;
    font-size: 0.9rem;
    line-height: 1.5;
    margin-bottom: 1rem;
    flex: 1;
  }

  .book-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.8rem 1.5rem;
    background: linear-gradient(135deg, #d4af37, #ff8c00);
    color: white;
    border: none;
    border-radius: 10px;
    font-weight: 700;
    font-size: 0.9rem;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    transition: all 0.2s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(212, 175, 55, 0.4);
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6b7280;

  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  .title {
    font-size: 1.2rem;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 0.5rem;
  }
`;

const PopularTemples = () => {
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const demomode = localStorage.getItem("demoMode");
  console.log(temples, "temples");
  const DEFAULT_IMAGE =
    "https://www.poojn.in/wp-content/uploads/2025/02/Govindaraja-Temple-History-Architecture-and-Significance.jpeg.jpg";

  useEffect(() => {
    const fetchTemples = async () => {
      try {
        setLoading(true);
        const response = await gettemplist();
        // Determine environment
        const isLocal =
          window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1" ||
          demomode === "true";

        // Filter based on environment
        const filteredTemples = response.data?.filter((temple) =>
          isLocal ? temple.is_live_data === false : temple.is_live_data === true
        );

        const list = Array.isArray(filteredTemples) ? filteredTemples : [];
        const mapped = list.map((t) => {
          const timingsObj = t?.additional_field_list?.temple_timings;
          let timingsText = "";
          if (Array.isArray(timingsObj?.selected_time_slots)) {
            timingsText = timingsObj.selected_time_slots
              .map(
                (slot) =>
                  `${slot.name ? slot.name + ": " : ""}${slot.start || ""} - ${
                    slot.end || ""
                  }`
              )
              .join(", ");
          }

          return {
            id: t.temple_id || t.id,
            name: t.name || "Unnamed Temple",
            location:
              t.location ||
              [t.address_line_3, t.state_code].filter(Boolean).join(", ") ||
              "",
            image: t.image || DEFAULT_IMAGE,
            // placeholders to preserve current card layout
            deity: t.mobile_number || null,
            timings: timingsText || null,
          };
        });
        setTemples(mapped);
      } catch (e) {
        toast.error("Failed to load temples try again later");
        setTemples([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTemples();
  }, []);

  const handleBookSeva = (templeId) => {
    navigate(`/book-seva/${templeId}`);
  };

  if (loading) {
    return (
      <TemplesContainer>
        <SectionTitle>
          <MdTempleHindu /> Popular Temples
        </SectionTitle>
        <EmptyState>
          <div className="icon">Loading...</div>
        </EmptyState>
      </TemplesContainer>
    );
  }

  return (
    <TemplesContainer>
      <SectionTitle>
        <MdTempleHindu /> Popular Temples
      </SectionTitle>
      <TempleGrid>
        {temples.slice(0, 6).map((temple, index) => (
          <TempleCard
            key={temple.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="image-container">
              <img src={temple.image || "/placeholder.svg"} alt={temple.name} />
              <div className="rank-badge">#{index + 1}</div>
            </div>
            <div className="content">
              <h3 className="temple-name">
                <MdTempleHindu /> {temple.name}
              </h3>
              <div className="location">
                <FiMapPin /> {temple.location}
              </div>
              <div className="location">
                <Phone /> {temple.deity}
              </div>
              {/* <div className="rating">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      fill={i < Math.floor(temple.rating) ? "#fbbf24" : "none"}
                    />
                  ))}
                </div>
                <span className="rating-text">
                  {temple.rating} ({temple.reviews} reviews)
                </span>
              </div> */}
              <p className="description">{temple.description}</p>
              <button
                className="book-button"
                onClick={() => handleBookSeva(temple.id)}
              >
                Book Seva <FiArrowRight />
              </button>
            </div>
          </TempleCard>
        ))}
      </TempleGrid>
    </TemplesContainer>
  );
};

export default PopularTemples;
