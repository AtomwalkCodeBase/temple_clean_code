"use client";

import { useState, useEffect, useRef } from "react";
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
  /* max-width: 1200px; */
  /* margin: 0 auto; */
  /* padding: 0 1rem; */
`;

const HeaderSection = styled(motion.div)`
  background: linear-gradient(145deg, rgb(212, 175, 55), rgb(196, 69, 54));
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
  background: linear-gradient(145deg, rgb(212, 175, 55), rgb(196, 69, 54));
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

export const LocationScrollContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-top: 2rem;
  overflow: hidden;
  max-width: 1150px;
`;

export const LocationScroll = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 1rem 2rem;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const StateCard = styled.div`
  flex: 0 0 auto;
  width: 120px;
  height: 140px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  text-align: center;
  transition: all 0.2s ease-in-out;
  overflow: hidden;
  border: 0.3px solid #fad0beff;

  .image-container {
    width: 100%;
    height: 85px;
    overflow: hidden;
    border-top-left-radius: 14px;
    border-top-right-radius: 14px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .name {
    font-size: 0.85rem;
    font-weight: 500;
    padding: 0.5rem;
    color: #333;
  }

  &:hover img {
    transform: scale(1.05);
  }

  &:hover {
    transform: translateY(-4px);
  }

  &.active {
    border-color: #e45417ff;
    box-shadow: 0 0 10px rgba(162, 100, 75, 0.3);
  }
`;

export const ScrollButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  border: none;
  font-size: 2rem;
  color: #764ba2;
  cursor: pointer;
  z-index: 2;
  padding: 0.2rem 0.6rem;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);

  &:hover {
    background: #f8f8f8;
  }

  &:first-of-type {
    left: 0.4rem;
  }

  &:last-of-type {
    right: 0.4rem;
  }
`;
const indianStates = [
  {
    name: "Andhra Pradesh",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Tirumala_090615.jpg/330px-Tirumala_090615.jpg",
  },
  {
    name: "Arunachal Pradesh",
    image:
      "https://s7ap1.scene7.com/is/image/incredibleindia/giant-budhha-statue-tawang-arunachal-pradesh-2-attr-hero?qlt=82&ts=1742178821432",
  },
  {
    name: "Assam",
    image:
      "https://www.tusktravel.com/blog/wp-content/uploads/2023/05/Places-to-Visit-in-Assam-in-June.jpg",
  },
  {
    name: "Bihar",
    image: "https://www.capertravelindia.com/images/bihar1.jpg",
  },
  {
    name: "Chhattisgarh",
    image:
      "https://stylesatlife.com/wp-content/uploads/2018/01/chhattisgarh-festivals-list.jpg",
  },
  {
    name: "Goa",
    image:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/18/3e/36/95/baga-sea-beach.jpg?w=500&h=500&s=1",
  },
  {
    name: "Gujarat",
    image:
      "https://imgcdn.flamingotravels.co.in/Images/Country/GujaratTourism.jpg",
  },
  {
    name: "Haryana",
    image:
      "https://haryanatourism.gov.in/wp-content/uploads/2024/08/OnStage_067-scaled.jpg",
  },
  {
    name: "Himachal Pradesh",
    image:
      "https://cdn.britannica.com/12/1612-050-8A4D277F/Settlement-Kullu-Valley-India-Himachal-Pradesh.jpg",
  },
  {
    name: "Jharkhand",
    image:
      "https://indiano.travel/wp-content/uploads/2022/03/Patratu-valley-located-in-Ranchi-Jharkhand..jpg",
  },
  {
    name: "Karnataka",
    image:
      "https://www.tripsavvy.com/thmb/2Te8NxqI0AHakN-bXkmn2HqN7eI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-157455052-56a87ea73df78cf7729e572c.jpg",
  },
  {
    name: "Kerala",
    image:
      "https://images.nativeplanet.com/img/2014/04/24-1398325628-houseboat.jpg",
  },
  {
    name: "Madhya Pradesh",
    image:
      "https://gandhisagarforestretreat.com/wp-content/uploads/2024/06/BLOG-head-title-1-1.webp",
  },
  {
    name: "Maharashtra",
    image:
      "https://www.fabhotels.com/blog/wp-content/uploads/2019/05/Gateway-Of-India_600.jpg",
  },
  {
    name: "Manipur",
    image: "https://www.holidify.com/images/bgImages/MANIPUR.jpg",
  },
  {
    name: "Meghalaya",
    image:
      "https://res.cloudinary.com/ddjuftfy2/image/upload/f_webp,c_fill,q_auto/memphis/xlarge/154154142_3.jpg",
  },
  {
    name: "Mizoram",
    image: "https://ichef.bbci.co.uk/images/ic/480xn/p091swjv.jpg.webp",
  },
  {
    name: "Nagaland",
    image:
      "https://m.economictimes.com/thumb/msid-104419864,width-1200,height-1200,resizemode-4,imgsize-1785990/nagaland.jpg",
  },
  {
    name: "Odisha",
    image:
      "https://s7ap1.scene7.com/is/image/incredibleindia/1-sri-jagannath-temple-puri-odisha-2-city-hero?qlt=82&ts=1726663809131",
  },
  {
    name: "Punjab",
    image:
      "https://shop.gaatha.com/image/cache/catalog/1-Category%20images/blog/jan-25/famous-crafts-of-punjab-600x315h.jpg",
  },
  {
    name: "Rajasthan",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Thar_Khuri.jpg/330px-Thar_Khuri.jpg",
  },
  {
    name: "Sikkim",
    image:
      "https://nomadicweekends.com/blog/wp-content/uploads/2019/03/Lachung-City-In-between-the-Mountain-Ranges.jpg",
  },
  {
    name: "Tamil Nadu",
    image:
      "https://assets.cntraveller.in/photos/60c07ef28fc45ba3917d99f0/16:9/w_1024%2Cc_limit/chennai-tamil-nadu-lockdown-1366x768.jpg",
  },
  {
    name: "Telangana",
    image:
      "https://s7ap1.scene7.com/is/image/incredibleindia/2-charminar-hyderabad-telangana-state-hero?qlt=82&ts=1726653487606",
  },
  {
    name: "Tripura",
    image:
      "https://www.incredibleindia.gov.in/content/dam/incredible-india/images/trips/tripura/7-day-trip-tripura-a-week-in-the-crown-of-the-east/1-ujjayanta-palace-tripura-tri-iter-day1.jpg",
  },
  {
    name: "Uttar Pradesh",
    image:
      "https://s7ap1.scene7.com/is/image/incredibleindia/dashashwamedh-ghat-varanasi-uttar-pradesh-city-hero?qlt=82&ts=1726649273578",
  },
  {
    name: "Uttarakhand",
    image:
      "https://www.tusktravel.com/blog/wp-content/uploads/2023/02/Mussoorie-Uttarakhand4.jpg",
  },
  {
    name: "West Bengal",
    image: "https://www.trawell.in/images/pics/west-bengal_all_main.jpg",
  },
  {
    name: "Delhi",
    image:
      "https://cdn.britannica.com/37/189837-050-F0AF383E/New-Delhi-India-War-Memorial-arch-Sir.jpg",
  },
  {
    name: "Jammu and Kashmir",
    image:
      "https://www.easeindiatrip.com/blog/wp-content/uploads/2025/03/Jammu-Kashmir-in-May-05.jpg",
  },
  {
    name: "Ladakh",
    image:
      "https://grandholidayparkvacation.com/uploads/62208357b184e_1646297943.jpg",
  },
];

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
  const scrollRef = useRef(null);

  const scrollStates = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = 300;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

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

      // Determine environment
      const isLocal =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";

      // Filter based on environment
      const filteredTemples = templesData.filter((temple) =>
        isLocal ? temple.is_live_data === false : temple.is_live_data === true
      );

      setTemples(filteredTemples);

      // Initialize carousel indices
      const initialIndices = {};
      filteredTemples.forEach((temple) => {
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
          {/* Horizontal Scroll of Indian States */}
          <LocationScrollContainer>
            <ScrollButton onClick={() => scrollStates("left")}>
              &#8249;
            </ScrollButton>
            <LocationScroll ref={scrollRef}>
              {indianStates.map((state, idx) => (
                <StateCard
                  key={idx}
                  className={filters.location === state.name ? "active" : ""}
                  onClick={() => handleFilterChange("location", state.name)}
                >
                  <div className="image-container">
                    <img src={state.image} alt={state.name} />
                  </div>
                  <div className="name">{state.name}</div>
                </StateCard>
              ))}
            </LocationScroll>
            <ScrollButton onClick={() => scrollStates("right")}>
              &#8250;
            </ScrollButton>
          </LocationScrollContainer>
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
