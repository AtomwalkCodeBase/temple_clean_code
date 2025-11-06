// components/AdminServices/ServicesGrid.js
import React, { useMemo } from "react";
import styled from "styled-components";
import ServiceCard from "./ServiceCard";

const ServicesGridContainer = styled.div`
  display: grid;
  gap: 24px;
  margin-bottom: 32px;
`;

const SectionTitle = styled.h2`
  color: #1f2937;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
`;

const ServicesGrid = ({
  services,
  selectedService,
  selectedDate,
  bookings,
  onServiceSelect,
  onVariationSelect,
}) => {
  // Get available services with their variations
  const servicesWithAvailability = useMemo(() => {
    return services.map((service) => {
      const serviceBookings = bookings.filter(
        (booking) => booking.service_data?.service_id === service.service_id
      );

      const availableVariations = service.service_variation_list?.map(
        (variation) => {
          const variationBookings = serviceBookings.filter(
            (booking) => booking.service_variation_data?.id === variation.id
          );

          const isBooked = variationBookings.length > 0;
          const isFullDayBooked = serviceBookings.some(
            (booking) =>
              booking.service_variation_data?.price_type === "FULL_DAY"
          );

          const isHalfDayBooked = serviceBookings.some(
            (booking) =>
              booking.service_variation_data?.price_type === "HALF_DAY"
          );

          let disabled = false;
          let disabledReason = "";

          if (isBooked) {
            disabled = true;
            disabledReason = "Already booked";
          } else if (variation.price_type === "HALF_DAY" && isFullDayBooked) {
            disabled = true;
            disabledReason = "Full day booked";
          } else if (variation.price_type === "FULL_DAY" && isHalfDayBooked) {
            disabled = true;
            disabledReason = "Half day booked";
          }

          return {
            ...variation,
            disabled,
            disabledReason,
            bookings: variationBookings,
          };
        }
      );

      return {
        ...service,
        availableVariations,
        totalBookings: serviceBookings.length,
      };
    });
  }, [services, bookings]);

  return (
    <ServicesGridContainer>
      <SectionTitle>
        Available Services for {new Date(selectedDate).toLocaleDateString()}
      </SectionTitle>

      {servicesWithAvailability.map((service, index) => (
        <ServiceCard
          key={index}
          service={service}
          isSelected={selectedService?.service_id === service.service_id}
          onSelect={() => onServiceSelect(service)}
          onVariationSelect={onVariationSelect}
        />
      ))}
    </ServicesGridContainer>
  );
};

export default ServicesGrid;
