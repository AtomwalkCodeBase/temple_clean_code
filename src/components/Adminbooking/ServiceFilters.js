import React from "react";
import styled, { keyframes } from "styled-components";

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const FiltersContainer = styled.div`
  background: #ffffff;
  padding: 32px 40px;
  border-radius: 20px;
  margin: 20px auto;
  /* max-width: 800px; */
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  animation: ${slideIn} 0.6s ease forwards;
  opacity: 0;
  transform: translateY(20px);
  animation-delay: ${(props) => props.delay || "0s"};
`;

const FilterLabel = styled.label`
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
  font-size: 15px;
  text-align: left;
`;

const inputHoverSlide = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(6px); }
`;

const InputBase = styled.input`
  padding: 18px 20px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 15px;
  width: 100%;
  background: #f9fafb;
  transition: all 0.3s ease;

  &:focus,
  &:hover {
    outline: none;
    border-color: #2563eb;
    background: #ffffff;
    animation: ${inputHoverSlide} 0.3s ease forwards;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
  }
`;

const Select = styled.select`
  /* ${InputBase} */
  padding: 12px 14px;
  border: 1.5px solid #d1d5db;
  border-radius: 12px;
  font-size: 14px;
  background: #f9fafb;
  color: #111827;
  transition: all 0.3s ease;
  &:focus {
    outline: none;
    border-color: #2563eb;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  }
`;

const Input = styled(InputBase)``;

const CheckButton = styled.button`
  padding: 18px 24px;
  width: 100%;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: ${slideIn} 0.6s ease forwards;
  animation-delay: 0.4s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(37, 99, 235, 0.25);
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ServiceFilters = ({ filters, onFilterChange, services }) => {
  const serviceTypes = [
    ...new Set(services.map((s) => s.service_type).filter(Boolean)),
  ];

  const handleChange = (field, value) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  const isCheckDisabled = !filters.serviceType || !filters.date;

  return (
    <FiltersContainer>
      <FilterGroup delay="0s">
        <FilterLabel>Service Type</FilterLabel>
        <Select
          value={filters.serviceType}
          onChange={(e) => handleChange("serviceType", e.target.value)}
        >
          <option value="">Select Service Type</option>
          {serviceTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </Select>
      </FilterGroup>

      <FilterGroup delay="0.1s">
        <FilterLabel>Date</FilterLabel>
        <Input
          type="date"
          value={filters.date}
          onChange={(e) => handleChange("date", e.target.value)}
          min={new Date().toISOString().split("T")[0]}
        />
      </FilterGroup>

      <FilterGroup delay="0.2s">
        <FilterLabel>Minimum Capacity</FilterLabel>
        <Input
          type="number"
          placeholder="e.g., 50"
          value={filters.capacity}
          onChange={(e) => handleChange("capacity", e.target.value)}
          min="1"
        />
      </FilterGroup>

      <CheckButton disabled={isCheckDisabled}>Check Availability</CheckButton>
    </FiltersContainer>
  );
};

export default ServiceFilters;
