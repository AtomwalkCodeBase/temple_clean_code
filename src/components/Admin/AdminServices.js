// components/AdminServices/AdminServices.js
import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { getTempleServicesList } from "../../services/templeServices";
import ServicesGrid from "../Adminbooking/ServicesGrid";
import BookingSummary from "../Adminbooking/BookingSummary";
import ServiceFilters from "../Adminbooking/ServiceFilters";
import { getBookingList } from "../../services/customerServices";
import { useLocation } from "react-router-dom";

const ServicesContainer = styled.div`
  padding: 24px;
  min-height: 100vh;
  /* background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); */
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: #6b7280;
`;

const AdminServices = () => {
  const routerLocation = useLocation();
  const params = new URLSearchParams(routerLocation.search);
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    serviceType: "",
    date: "",
    capacity: "",
    state_code: "",
  });
  console.log(filters, "filters");
  const [selectedService, setSelectedService] = useState(null);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [currentMonthData, setCurrentMonthData] = useState(null);
  const templeId = localStorage.getItem("templeId") || params.get("templeId");
  const urllocation = params.get("location");
  const urldate = params.get("date");
  const urlservice = params.get("id");
  console.log(urllocation, "urllocation");
  useEffect(() => {
    // debugger;
    if (urllocation) {
      setFilters((prev) => ({
        ...prev,
        state_code: urllocation,
      }));
    }
    if (urldate) {
      setFilters((prev) => ({ ...prev, date: urldate }));
    }
    if (urlservice) {
      setFilters((prev) => ({
        ...prev,
        serviceType: urlservice.toUpperCase(),
      }));
    }
  }, []);
  // Format date to DD-MMM-YYYY format for API
  const formatDateForAPI = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("en", { month: "short" }).toUpperCase();
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Get first and last day of month from a date
  const getMonthRange = (date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return {
      firstDay: formatDateForAPI(firstDay),
      lastDay: formatDateForAPI(lastDay),
      month: date.getMonth(),
      year: date.getFullYear(),
    };
  };

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const servicesData = await getTempleServicesList();
        const filteredServices = servicesData.filter(
          (temple) => temple.temple_id === templeId
        );
        setServices(templeId ? filteredServices : servicesData);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [templeId]);

  // Fetch bookings when date changes and it's a new month
  useEffect(() => {
    const fetchBookingsForMonth = async () => {
      if (!filters.date) return;

      const selectedDate = new Date(filters.date);
      const monthRange = getMonthRange(selectedDate);

      // Check if we already have data for this month
      if (
        currentMonthData &&
        currentMonthData.month === monthRange.month &&
        currentMonthData.year === monthRange.year
      ) {
        console.log("Using cached bookings data for same month");
        return;
      }

      setLoading(true);
      try {
        console.log("Fetching bookings for month:", monthRange);
        const bookingsData = await getBookingList(
          monthRange.firstDay,
          monthRange.lastDay
        );

        const filteredBookings = bookingsData.filter(
          (data) => data.service_data?.temple_id === templeId
        );

        setBookings(templeId ? filteredBookings : bookingsData);
        setCurrentMonthData(monthRange);
        console.log("Bookings fetched successfully:", filteredBookings.length);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingsForMonth();
  }, [filters.date, templeId]);

  // Filter services based on filters
  const filteredServices = useMemo(() => {
    let filtered = services;

    if (filters.serviceType) {
      filtered = filtered.filter(
        (service) => service.service_type === filters.serviceType
      );
    }

    if (filters.capacity) {
      filtered = filtered.filter(
        (service) => service.capacity >= parseInt(filters.capacity)
      );
    }
    if (filters.state_code) {
      filtered = filtered.filter(
        (service) => service.state_code === filters.state_code
      );
    }

    return filtered;
  }, [services, filters]);

  // Get bookings for selected date
  const bookingsForSelectedDate = useMemo(() => {
    if (!filters.date) return [];

    // Convert selected date from YYYY-MM-DD to DD-MM-YYYY format for comparison
    const selectedDateFormatted = filters.date.split("-").reverse().join("-");

    return bookings.filter(
      (booking) => booking.booking_date === selectedDateFormatted
    );
  }, [bookings, filters.date]);

  const handleFilterChange = (newFilters) => {
    const oldDate = filters.date;
    const newDate = newFilters.date;

    setFilters(newFilters);
    setSelectedService(null);
    setSelectedVariation(null);
    setShowSummary(false);

    // If date changed to a different month, clear current month data to trigger new API call
    if (oldDate && newDate && oldDate !== newDate) {
      const oldDateObj = new Date(oldDate);
      const newDateObj = new Date(newDate);

      if (
        oldDateObj.getMonth() !== newDateObj.getMonth() ||
        oldDateObj.getFullYear() !== newDateObj.getFullYear()
      ) {
        setCurrentMonthData(null);
      }
    }
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setSelectedVariation(null);
    setShowSummary(false);
  };

  const handleVariationSelect = (variation) => {
    setSelectedVariation(variation);
    setShowSummary(true);
  };

  const handleBookingComplete = () => {
    setSelectedService(null);
    setSelectedVariation(null);
    setShowSummary(false);
    setFilters((prev) => ({ ...prev, date: "" }));
    // Clear month data to force refresh when booking is completed
    setCurrentMonthData(null);
  };

  return (
    <ServicesContainer>
      <ServiceFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        services={services}
      />

      {loading ? (
        <LoadingState>Loading services...</LoadingState>
      ) : (
        <>
          {filters.date && filteredServices.length > 0 && (
            <ServicesGrid
              services={filteredServices}
              selectedService={selectedService}
              selectedDate={filters.date}
              bookings={bookingsForSelectedDate}
              onServiceSelect={handleServiceSelect}
              onVariationSelect={handleVariationSelect}
            />
          )}

          {!filters.date && filteredServices.length > 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                color: "#6b7280",
                background: "white",
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
              }}
            >
              <h3>Select a date to check availability</h3>
              <p>
                Choose a service type, date, and capacity to see available
                bookings
              </p>
            </div>
          )}

          {filters.date && filteredServices.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                color: "#6b7280",
                background: "white",
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
              }}
            >
              <h3>No services available</h3>
              <p>
                No services match your selected criteria. Try adjusting your
                filters.
              </p>
            </div>
          )}

          {showSummary && selectedService && selectedVariation && (
            <BookingSummary
              service={selectedService}
              variation={selectedVariation}
              selectedDate={filters.date}
              onBookingComplete={handleBookingComplete}
              onCancel={() => setShowSummary(false)}
            />
          )}
        </>
      )}
    </ServicesContainer>
  );
};

export default AdminServices;
