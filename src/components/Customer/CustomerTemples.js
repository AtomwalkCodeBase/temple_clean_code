"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FiMapPin, FiPhone, FiMail, FiStar, FiClock } from "react-icons/fi";
import { MdTempleHindu } from "react-icons/md";
import { fetchTemples } from "../../services/templeServices";
import { useCustomerAuth } from "../../contexts/CustomerAuthContext";
import CustomerLayout from "../../components/Customer/CustomerLayout";
import { gettemplist } from "../../services/productServices";

const TemplesContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const HeaderSection = styled(motion.div)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 1.5rem;
  padding: 2rem;
  color: white;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 200px;
    height: 200px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    transform: translate(50%, -50%);
  }

  .header-content {
    position: relative;
    z-index: 1;
  }

  .title {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
  }

  .subtitle {
    font-size: 1.2rem;
    opacity: 0.9;
    font-weight: 500;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;

    .title {
      font-size: 2rem;
    }

    .subtitle {
      font-size: 1rem;
    }
  }
`;

const FilterSection = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;

  .filter-title {
    font-size: 1.2rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 1rem;
  }

  .filter-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .filter-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    label {
      font-weight: 600;
      color: #374151;
      font-size: 0.9rem;
    }

    input,
    select {
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 0.9rem;
      transition: all 0.2s ease;

      &:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }
    }
  }
`;

const TemplesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TempleCard = styled(motion.div)`
  background: white;
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
`;

const ImageCarousel = styled.div`
  height: 220px;
  position: relative;
  overflow: hidden;

  .carousel-inner {
    display: flex;
    transition: transform 0.5s ease;
    height: 100%;
  }

  .carousel-item {
    min-width: 100%;
    height: 100%;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .carousel-controls {
    position: absolute;
    bottom: 10px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    gap: 8px;
    z-index: 2;
  }

  .carousel-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    cursor: pointer;
    transition: all 0.3s ease;

    &.active {
      background: white;
      transform: scale(1.2);
    }
  }

  .carousel-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 2;
    backdrop-filter: blur(4px);
    transition: all 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    &.prev {
      left: 10px;
    }

    &.next {
      right: 10px;
    }
  }
`;

const TempleContent = styled.div`
  padding: 2rem;
`;

const TempleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const TempleName = styled.h3`
  font-size: 1.4rem;
  font-weight: 800;
  color: #1f2937;
  margin: 0;
  flex: 1;
`;

const TempleRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 600;

  .star {
    font-size: 0.9rem;
  }
`;

const TempleDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;

  .detail {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.9rem;
    color: #6b7280;

    .icon {
      color: #667eea;
      font-size: 1rem;
      min-width: 16px;
    }

    .value {
      color: #374151;
      font-weight: 500;
    }
  }
`;

const TempleTimings = styled.div`
  background: #f8fafc;
  border-radius: 0.75rem;
  padding: 1rem;
  margin-bottom: 1.5rem;

  .timings-title {
    font-size: 0.9rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .timing-slots {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .timing-slot {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
    font-weight: 500;

    .time {
      color: #667eea;
      font-weight: 600;
    }

    .name {
      color: #6b7280;
    }
  }
`;

const BookSevaButton = styled(motion.button)`
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 700;
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: #6b7280;

  .spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #e5e7eb;
    border-top: 4px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .text {
    font-size: 1.1rem;
    font-weight: 600;
  }
`;

const ErrorMessage = styled.div`
  background: linear-gradient(135deg, #fee2e2, #fecaca);
  color: #dc2626;
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
  margin: 2rem auto;
  max-width: 500px;
  border: 1px solid #fca5a5;
  font-weight: 600;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem;
  color: #6b7280;

  .icon {
    font-size: 5rem;
    margin-bottom: 2rem;
    opacity: 0.5;
  }

  .title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: #374151;
  }

  .subtitle {
    font-size: 1rem;
    max-width: 400px;
    margin: 0 auto;
  }
`;

const CustomerTemples = () => {
  const [temples, setTemples] = useState([]);
  const [filteredTemples, setFilteredTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    rating: "",
  });
  const [carouselIndices, setCarouselIndices] = useState({});
  const navigate = useNavigate();
  const { customerData } = useCustomerAuth();

  useEffect(() => {
    loadTemples();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [temples, filters]);

  const loadTemples = async () => {
    try {
      setLoading(true);
      const response = await gettemplist();
      const templesData = response.data || [];
      setTemples(templesData);

      // Initialize carousel indices
      const initialIndices = {};
      templesData.forEach((temple) => {
        initialIndices[temple.temple_id] = 0;
      });
      setCarouselIndices(initialIndices);
    } catch (err) {
      setError("Failed to load temples. Please try again.");
      console.error("Error loading temples:", err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = temples;

    if (filters.search) {
      filtered = filtered.filter(
        (temple) =>
          temple.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
          temple.location
            ?.toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          temple.address_line_1
            ?.toLowerCase()
            .includes(filters.search.toLowerCase())
      );
    }

    if (filters.location) {
      filtered = filtered.filter(
        (temple) =>
          temple.location
            ?.toLowerCase()
            .includes(filters.location.toLowerCase()) ||
          temple.address_line_1
            ?.toLowerCase()
            .includes(filters.location.toLowerCase())
      );
    }

    if (filters.rating) {
      filtered = filtered.filter((temple) => {
        // This is a placeholder - you might need to adjust based on your actual rating data
        const rating = 4.8; // Default rating for now
        return rating >= parseFloat(filters.rating);
      });
    }

    setFilteredTemples(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value,
    });
  };

  const handleBookSeva = (temple) => {
    navigate(`/book-seva/${temple.temple_id}`, { state: { temple } });
  };

  const nextImage = (templeId, totalImages) => {
    setCarouselIndices((prev) => ({
      ...prev,
      [templeId]: (prev[templeId] + 1) % totalImages,
    }));
  };

  const prevImage = (templeId, totalImages) => {
    setCarouselIndices((prev) => ({
      ...prev,
      [templeId]: (prev[templeId] - 1 + totalImages) % totalImages,
    }));
  };

  const goToImage = (templeId, index) => {
    setCarouselIndices((prev) => ({
      ...prev,
      [templeId]: index,
    }));
  };

  const getTempleImages = (temple) => {
    const images = [];
    if (temple.image) images.push(temple.image);
    if (temple.image_1) images.push(temple.image_1);
    if (temple.image_2) images.push(temple.image_2);
    if (temple.image_3) images.push(temple.image_3);
    if (temple.image_4) images.push(temple.image_4);
    if (temple.image_5) images.push(temple.image_5);

    // If no images, use a placeholder with the temple icon
    if (images.length === 0) {
      return [null];
    }

    return images;
  };

  if (loading) {
    return (
      <CustomerLayout>
        <LoadingContainer>
          <div className="spinner"></div>
          <div className="text">Loading sacred temples...</div>
        </LoadingContainer>
      </CustomerLayout>
    );
  }

  if (error) {
    return (
      <CustomerLayout>
        <ErrorMessage>{error}</ErrorMessage>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <TemplesContainer>
        <HeaderSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="title">🛕 Sacred Temples</div>
          <div className="subtitle">
            Discover divine temples and book your spiritual journey with us
          </div>
        </HeaderSection>

        <FilterSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="filter-title">Find Your Perfect Temple</div>
          <div className="filter-grid">
            <div className="filter-item">
              <label>Search Temples</label>
              <input
                type="text"
                placeholder="Search by name or location..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>
            <div className="filter-item">
              <label>Location</label>
              <input
                type="text"
                placeholder="Enter location..."
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
              />
            </div>
            <div className="filter-item">
              <label>Rating</label>
              <select
                value={filters.rating}
                onChange={(e) => handleFilterChange("rating", e.target.value)}
              >
                <option value="">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
              </select>
            </div>
          </div>
        </FilterSection>

        {filteredTemples.length === 0 ? (
          <EmptyState>
            <div className="icon">🏛️</div>
            <div className="title">No Temples Found</div>
            <div className="subtitle">
              {temples.length === 0
                ? "No temples are available at the moment. Please check back later."
                : "No temples match your search criteria. Try adjusting your filters."}
            </div>
          </EmptyState>
        ) : (
          <TemplesGrid>
            {filteredTemples.map((temple, index) => {
              const images = getTempleImages(temple);
              const currentIndex = carouselIndices[temple.temple_id] || 0;

              return (
                <TempleCard
                  key={temple.temple_id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <ImageCarousel>
                    <div
                      className="carousel-inner"
                      style={{
                        transform: `translateX(-${currentIndex * 100}%)`,
                      }}
                    >
                      {images[0] ? (
                        images.map((img, idx) => (
                          <div key={idx} className="carousel-item">
                            <img
                              src={img || "/placeholder.svg"}
                              alt={`${temple.name} - Image ${idx + 1}`}
                            />
                          </div>
                        ))
                      ) : (
                        <div
                          className="carousel-item"
                          style={{
                            background:
                              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "4rem",
                          }}
                        >
                          <MdTempleHindu />
                        </div>
                      )}
                    </div>

                    {images.length > 1 && (
                      <>
                        <button
                          className="carousel-nav prev"
                          onClick={() =>
                            prevImage(temple.temple_id, images.length)
                          }
                        >
                          &#8249;
                        </button>
                        <button
                          className="carousel-nav next"
                          onClick={() =>
                            nextImage(temple.temple_id, images.length)
                          }
                        >
                          &#8250;
                        </button>
                        <div className="carousel-controls">
                          {images.map((_, idx) => (
                            <div
                              key={idx}
                              className={`carousel-dot ${
                                currentIndex === idx ? "active" : ""
                              }`}
                              onClick={() => goToImage(temple.temple_id, idx)}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </ImageCarousel>

                  <TempleContent>
                    <TempleHeader>
                      <TempleName>{temple.name}</TempleName>
                      <TempleRating>
                        <FiStar className="star" />
                        4.8
                      </TempleRating>
                    </TempleHeader>

                    <TempleDetails>
                      <div className="detail">
                        <FiMapPin className="icon" />
                        <span className="value">
                          {temple.address_line_1 || temple.location}
                          {temple.address_line_2 &&
                            `, ${temple.address_line_2}`}
                          {temple.pin_code && `, ${temple.pin_code}`}
                        </span>
                      </div>
                      <div className="detail">
                        <FiPhone className="icon" />
                        <span className="value">{temple.mobile_number}</span>
                      </div>
                      <div className="detail">
                        <FiMail className="icon" />
                        <span className="value">{temple.email_id}</span>
                      </div>
                    </TempleDetails>

                    {temple.additional_field_list?.temple_timings
                      ?.selected_time_slots && (
                      <TempleTimings>
                        <div className="timings-title">
                          <FiClock className="icon" />
                          Temple Timings
                        </div>
                        <div className="timing-slots">
                          {temple.additional_field_list.temple_timings.selected_time_slots.map(
                            (slot, idx) => (
                              <div key={idx} className="timing-slot">
                                <div className="time">
                                  {slot.start} - {slot.end}
                                </div>
                                <div className="name">{slot.name}</div>
                              </div>
                            )
                          )}
                        </div>
                      </TempleTimings>
                    )}
                    <BookSevaButton
                      onClick={() => handleBookSeva(temple)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <MdTempleHindu />
                      Book Seva
                    </BookSevaButton>
                  </TempleContent>
                </TempleCard>
              );
            })}
          </TemplesGrid>
        )}
      </TemplesContainer>
    </CustomerLayout>
  );
};

export default CustomerTemples;
