import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import CustomerLayout from "./CustomerLayout";
import ServiceCard from "./ServiceCard";
import { motion } from "framer-motion";
import FilterBar from "./FilterBar";
import { getTempleServicesList } from "../../services/templeServices";

// Add these icon imports (you can use react-icons or custom SVGs)
import {
  FaAllergies,
  FaBuilding,
  FaCalendarAlt,
  FaFireAlt,
  FaHotel,
  FaUmbrellaBeach,
} from "react-icons/fa";

const ServicesContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
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

// Updated Category Cards Section
const CategoryCardsContainer = styled.div`
  display: flex;
  gap: 20px;
  margin: 30px 0;
  padding: 0 20px;
  flex-wrap: wrap;
  justify-content: center;
  align-items: stretch;
`;

const CategoryCard = styled(motion.div)`
  background: ${(props) =>
    props.active
      ? "linear-gradient(135deg, #d4af37, #c44536)"
      : "linear-gradient(135deg, #ffffff, #f8f9fa)"};
  color: ${(props) => (props.active ? "white" : "#333")};
  padding: 25px 20px;
  border-radius: 20px;
  cursor: pointer;
  border: 2px solid ${(props) => (props.active ? "transparent" : "#e9ecef")};
  font-weight: 600;
  text-align: center;
  min-width: 140px;
  flex: 1;
  max-width: 160px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${(props) =>
    props.active
      ? "0 10px 30px rgba(212, 175, 55, 0.3)"
      : "0 4px 15px rgba(0,0,0,0.08)"};
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${(props) =>
      props.active
        ? "linear-gradient(90deg, #d4af37, #c44536)"
        : "transparent"};
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${(props) =>
      props.active
        ? "0 15px 40px rgba(212, 175, 55, 0.4)"
        : "0 8px 25px rgba(0,0,0,0.15)"};
    border-color: ${(props) => (props.active ? "transparent" : "#d4af37")};
  }

  .category-icon {
    font-size: 2.5rem;
    margin-bottom: 12px;
    display: block;
    color: ${(props) => (props.active ? "white" : "#d4af37")};
    filter: ${(props) => (props.active ? "brightness(0) invert(1)" : "none")};
    transition: all 0.3s ease;
  }

  .category-name {
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: 6px;
    letter-spacing: 0.5px;
  }

  .category-count {
    font-size: 0.85rem;
    opacity: ${(props) => (props.active ? 0.9 : 0.7)};
    font-weight: 500;
    background: ${(props) =>
      props.active ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.05)"};
    padding: 4px 8px;
    border-radius: 12px;
    display: inline-block;
  }

  @media (max-width: 768px) {
    min-width: 110px;
    max-width: 120px;
    padding: 20px 15px;

    .category-icon {
      font-size: 2rem;
    }

    .category-name {
      font-size: 0.9rem;
    }
  }

  @media (max-width: 480px) {
    min-width: 90px;
    max-width: 100px;
    padding: 15px 10px;

    .category-icon {
      font-size: 1.8rem;
    }

    .category-name {
      font-size: 0.8rem;
    }

    .category-count {
      font-size: 0.75rem;
    }
  }
`;

const ServiceGrid = styled.div`
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
  margin-top: 30px;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 50px;
  font-size: 1.2rem;
  color: #666;
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 50px;
  color: #e74c3c;
  font-size: 1.2rem;
`;

const NoServicesMessage = styled.div`
  text-align: center;
  padding: 50px;
  color: #666;
  font-size: 1.1rem;
  grid-column: 1 / -1;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 30px;
  padding: 20px;
`;

const PaginationButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #ddd;
  background-color: ${(props) => (props.active ? "#ff4d00ff" : "white")};
  color: ${(props) => (props.active ? "white" : "#333")};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  border-radius: 4px;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};

  &:hover:not(:disabled) {
    background-color: ${(props) => (props.active ? "#ff4d00ff" : "#f8f9fa")};
  }
`;

// Helper function to normalize category names
const normalizeCategory = (category) => {
  if (!category) return "";
  return category.toLowerCase().trim();
};

// Category configuration with icons
const categoryConfig = {
  all: { icon: FaAllergies, label: "All Services" },
  hall: { icon: FaBuilding, label: "Hall" },
  event: { icon: FaCalendarAlt, label: "Event" },
  puja: { icon: FaFireAlt, label: "Puja" },
  accommodation: { icon: FaHotel, label: "Accommodation" },
  // Add more categories as needed
};

const MyServices = ({ servicesdata }) => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();
  const routerLocation = useLocation();

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(routerLocation.search);
    const urlStatus = params.get("id");
    if (urlStatus) {
      const filters = {
        search: params.get("templeId") || "",
        category: urlStatus.toLowerCase(),
      };
      handleFilter(filters);
      setSelectedCategory(urlStatus.toLowerCase());
    }
  }, [routerLocation.search, services]);

  // Extract unique categories from services and count items
  useEffect(() => {
    if (services.length > 0) {
      const categoryCounts = { all: services.length };

      services.forEach((service) => {
        const category = normalizeCategory(service.service_type);
        if (category) {
          categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        }
      });

      // Create categories array with counts
      const availableCategories = Object.keys(categoryConfig).filter(
        (cat) => cat === "all" || categoryCounts[cat] > 0
      );

      const formattedCategories = availableCategories.map((cat) => ({
        value: cat,
        label: categoryConfig[cat].label,
        icon: categoryConfig[cat].icon,
        count: categoryCounts[cat] || 0,
      }));

      setCategories(formattedCategories);
    }
  }, [services]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentServices = filteredServices.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const fetchServices = async () => {
    if (servicesdata && servicesdata.length > 0) {
      const normalizedServices = servicesdata.map((service) => ({
        ...service,
        service_type: normalizeCategory(service.service_type),
      }));
      setServices(normalizedServices);
      setFilteredServices(normalizedServices);
      setLoading(false);
    } else {
      try {
        setLoading(true);
        const isLocal =
          window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1";
        const serviceList = await getTempleServicesList();

        // Normalize category names in services
        const normalizedServices =
          serviceList?.map((service) => ({
            ...service,
            service_type: normalizeCategory(service.service_type),
          })) || [];

        const filteredservices = normalizedServices?.filter((service) =>
          isLocal
            ? service.is_live_temple === false
            : service.is_live_temple === true
        );
        setServices(filteredservices);
        setFilteredServices(filteredservices);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    const filters = {
      category: category === "all" ? "" : category,
      search: "",
    };
    handleFilter(filters);
  };

  const handleFilter = (filters) => {
    let filtered = services;

    if (filters.search) {
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          service.description
            .toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          service.temple_id.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.category && filters.category !== "all") {
      filtered = filtered.filter(
        (service) =>
          service.service_type === normalizeCategory(filters.category)
      );
    }

    if (filters.priceRange) {
      filtered = filtered.filter((service) => {
        const basePrice = parseFloat(service.base_price) || 0;
        return (
          basePrice >= filters.priceRange.min &&
          basePrice <= filters.priceRange.max
        );
      });
    }

    setFilteredServices(filtered);
    setCurrentPage(1);
  };

  const handleViewDetails = (serviceId) => {
    navigate(`/customer-services/${serviceId}`);
  };

  // Pagination handlers
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  if (loading)
    return (
      <CustomerLayout>
        <LoadingState>Loading services...</LoadingState>
      </CustomerLayout>
    );
  if (error)
    return (
      <CustomerLayout>
        <ErrorState>Error: {error}</ErrorState>
      </CustomerLayout>
    );

  return (
    <CustomerLayout>
      <HeaderSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="title">🛕 Sacred Seva</div>
        <div className="subtitle">
          Discover divine temples and book your spiritual journey with us
        </div>
      </HeaderSection>

      <FilterBar
        onFilter={handleFilter}
        serviceTypes={categories.map((cat) => cat.value)}
      />

      {/* Beautiful Category Cards Section */}
      {categories.length > 0 && (
        <CategoryCardsContainer>
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <CategoryCard
                key={category.value}
                active={selectedCategory === category.value}
                onClick={() => handleCategoryClick(category.value)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconComponent className="category-icon" />
                <div className="category-name">{category.label}</div>
                <div className="category-count">
                  {category.count} {category.count === 1 ? "item" : "items"}
                </div>
              </CategoryCard>
            );
          })}
        </CategoryCardsContainer>
      )}

      {/* Items per page selector */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          padding: "0 20px",
        }}
      >
        <div style={{ color: "#666", fontSize: "14px" }}>
          Showing {indexOfFirstItem + 1}-
          {Math.min(indexOfLastItem, filteredServices.length)} of{" "}
          {filteredServices.length} services
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <label
            htmlFor="itemsPerPage"
            style={{ fontSize: "14px", color: "#666" }}
          >
            Items per page:
          </label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(e.target.value)}
            style={{
              padding: "5px 10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          >
            <option value="6">6</option>
            <option value="9">9</option>
            <option value="12">12</option>
            <option value="18">18</option>
          </select>
        </div>
      </div>

      <ServiceGrid>
        {currentServices.map((service) => (
          <ServiceCard
            key={service.service_id}
            service={service}
            onViewDetails={handleViewDetails}
          />
        ))}

        {filteredServices.length === 0 && (
          <NoServicesMessage>
            No services found matching your filters.
          </NoServicesMessage>
        )}
      </ServiceGrid>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <PaginationContainer>
          <PaginationButton
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </PaginationButton>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationButton
              key={page}
              active={page === currentPage}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </PaginationButton>
          ))}

          <PaginationButton
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </PaginationButton>
        </PaginationContainer>
      )}
    </CustomerLayout>
  );
};

export default MyServices;
