"use client";

import { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FiSearch, FiMapPin, FiCalendar } from "react-icons/fi";
import { GrServices } from "react-icons/gr";
import { indianStates } from "../../../services/serviceUtils";

const SearchContainer = styled.div`
  background: linear-gradient(135deg, #f8f4e6b3 0%, #fefcf5 100%);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(212, 175, 55, 0.2);
`;

const Title = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.6rem;

  svg {
    color: #d4af37;
  }
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;

  svg {
    color: #d4af37;
    font-size: 1.1rem;
  }
`;

const Select = styled.select`
  padding: 0.8rem 1rem;
  border: 2px solid rgba(212, 175, 55, 0.3);
  border-radius: 10px;
  background: white;
  color: #2c3e50;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(212, 175, 55, 0.5);
    background: rgba(212, 175, 55, 0.05);
  }

  &:focus {
    outline: none;
    border-color: #d4af37;
    box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
  }
`;

const DateInput = styled.input`
  padding: 0.8rem 1rem;
  border: 2px solid rgba(212, 175, 55, 0.3);
  border-radius: 10px;
  background: white;
  color: #2c3e50;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(212, 175, 55, 0.5);
    background: rgba(212, 175, 55, 0.05);
  }

  &:focus {
    outline: none;
    border-color: #d4af37;
    box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Button = styled(motion.button)`
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.2s ease;

  ${(props) =>
    props.primary
      ? `
    background: linear-gradient(135deg, #d4af37, #ff8c00);
    color: white;
    box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(212, 175, 55, 0.4);
    }
  `
      : `
    background: rgba(212, 175, 55, 0.1);
    color: #2c3e50;
    border: 2px solid rgba(212, 175, 55, 0.3);

    &:hover {
      background: rgba(212, 175, 55, 0.2);
      border-color: rgba(212, 175, 55, 0.5);
    }
  `}
`;

const SearchFilterComponent = ({ onSearch, currentLocation }) => {
  const [filters, setFilters] = useState({
    state: currentLocation || "",
    serviceType: "",
    date: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({
      state: currentLocation || "",
      serviceType: "",
      date: "",
    });
  };

  return (
    <SearchContainer>
      <Title>
        <FiSearch /> Search & Filter Services
      </Title>

      <FilterGrid>
        <FilterGroup>
          <Label>
            <FiMapPin /> State
          </Label>
          <Select
            name="state"
            value={filters.state}
            onChange={handleFilterChange}
          >
            <option value="all">All Location</option>
            {indianStates.map((type) => (
              <option key={type.number} value={type.code}>
                {type.name}
              </option>
            ))}
          </Select>
        </FilterGroup>

        <FilterGroup>
          <Label>
            {" "}
            <GrServices /> Service Type
          </Label>
          <Select
            name="serviceType"
            value={filters.serviceType}
            onChange={handleFilterChange}
          >
            <option value="">All Services</option>
            <option value="Puja">Puja</option>
            <option value="Event">Event</option>
            <option value="Hall">Hall</option>
            <option value="Accommodation">Accommodation</option>
          </Select>
        </FilterGroup>

        <FilterGroup>
          <Label>
            <FiCalendar /> Date
          </Label>
          <DateInput
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
          />
        </FilterGroup>
      </FilterGrid>

      <ButtonGroup>
        <Button onClick={handleReset} whileHover={{ scale: 1.02 }}>
          Reset
        </Button>
        <Button primary onClick={handleSearch} whileHover={{ scale: 1.02 }}>
          Search
        </Button>
      </ButtonGroup>
    </SearchContainer>
  );
};

export default SearchFilterComponent;
