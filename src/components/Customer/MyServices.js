import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

const MyServices = ({ servicesdata }) => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    if (servicesdata && servicesdata.length > 0) {
      setServices(servicesdata);
      setFilteredServices(servicesdata);
      setLoading(false);
    } else {
      try {
        setLoading(true);
        const serviceList = await getTempleServicesList();
        setServices(serviceList);
        setFilteredServices(serviceList);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFilter = (filters) => {
    let filtered = services;

    if (filters.search) {
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          service.description
            .toLowerCase()
            .includes(filters.search.toLowerCase())
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
  };

  const handleViewDetails = (serviceId) => {
    navigate(`/customer-services/${serviceId}`);
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
        <div className="title">🛕 Sacred Temples</div>
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

      <ServiceGrid>
        {filteredServices.map((service) => (
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
    </CustomerLayout>
  );
};

export default MyServices;
