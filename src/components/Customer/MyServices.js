import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import CustomerLayout from "./CustomerLayout";
import ServiceCard from "./ServiceCard";
import { motion } from "framer-motion";
import FilterBar from "./FilterBar";
import { getTempleServicesList } from "../../services/templeServices";

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
const ServiceGrid = styled.div`
  /* display: grid; */
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
// Add these styled components for pagination (or use your existing styling approach)
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

const MyServices = ({ servicesdata }) => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9); // You can adjust this number
  const navigate = useNavigate();
  const routerLocation = useLocation();

  console.log(filteredServices, "filteredServices");

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(routerLocation.search);
    const urlStatus = params.get("id");
    if (urlStatus) {
      const filters = {
        search: params.get("templeId") || "",
        category: urlStatus,
      };
      handleFilter(filters);
    }
  }, [routerLocation.search, services]);

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
      setServices(servicesdata);
      setFilteredServices(servicesdata);
      setLoading(false);
    } else {
      try {
        setLoading(true);
        const isLocal =
          window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1";
        const serviceList = await getTempleServicesList();
        const filteredservices = serviceList?.filter((service) =>
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

  const handleFilter = (filters) => {
    console.log(filters, "filters");
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
        (service) => service.service_type === filters.category
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
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleViewDetails = (serviceId) => {
    navigate(`/customer-services/${serviceId}`);
  };

  // Pagination handlers
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when items per page changes
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
        serviceTypes={[
          ...new Set(services.map((service) => service.service_type)),
        ]}
      />

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
