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

      // Calculate total booked quantity for the entire service (all variations combined)
      const totalServiceBookedQuantity = serviceBookings.reduce(
        (sum, booking) => sum + (parseInt(booking.quantity) || 1),
        0
      );

      // Calculate remaining capacity for the entire service
      const remainingServiceCapacity =
        service.capacity - totalServiceBookedQuantity;

      const availableVariations = service.service_variation_list?.map(
        (variation) => {
          let disabled = false;
          let disabledReason = "";
          let availableQuantity = 0;

          // For HALL service type - check time slot conflicts (variation-specific)
          if (service.service_type === "HALL") {
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

            availableQuantity = variation.max_participant || 1;
          }
          // For EVENT and PUJA service types - check overall service capacity
          else if (
            service.service_type === "EVENT" ||
            service.service_type === "PUJA"
          ) {
            // For EVENT/PUJA, available quantity is the remaining service capacity
            availableQuantity = remainingServiceCapacity;

            // Check if this variation can be booked based on its requirements
            const variationRequirement = variation.max_participant || 1;

            if (remainingServiceCapacity <= 0) {
              disabled = true;
              disabledReason = "Fully booked";
            } else if (remainingServiceCapacity < variationRequirement) {
              // Service has some capacity left, but not enough for this variation
              disabled = true;
              disabledReason = `Need ${variationRequirement} spots, only ${remainingServiceCapacity} left`;
            }

            // Check daily limit for the variation
            const dailyVariationBookings = serviceBookings.filter(
              (booking) => booking.service_variation_data?.id === variation.id
            );
            const dailyBookingsCount = dailyVariationBookings.length;

            if (
              variation.max_no_per_day &&
              dailyBookingsCount >= variation.max_no_per_day
            ) {
              disabled = true;
              disabledReason = "Daily limit reached";
            }
          }

          return {
            ...variation,
            disabled,
            disabledReason,
            availableQuantity,
            totalBookedQuantity: totalServiceBookedQuantity,
            remainingServiceCapacity,
            variationRequirement: variation.max_participant || 1,
          };
        }
      );

      // Filter variations to only show available ones for EVENT and PUJA
      const filteredVariations =
        service.service_type === "EVENT" || service.service_type === "PUJA"
          ? availableVariations?.filter((variation) => !variation.disabled)
          : availableVariations;

      return {
        ...service,
        availableVariations: filteredVariations,
        totalBookings: serviceBookings.length,
        totalBookedQuantity: totalServiceBookedQuantity,
        remainingServiceCapacity,
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
