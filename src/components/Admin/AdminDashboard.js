import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { getServiceBookings } from "../../services/customerServices";
import { useNavigate } from "react-router-dom";

// Styled Components
const DashboardContainer = styled.div`
  min-height: 100vh;
  background-color: #f8fafc;
`;

const SummaryCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 0.875rem;
  margin-bottom: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryCard = styled.div`
  background: white;
  border-radius: 14px;
  padding: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
  position: relative;
  overflow: hidden;
  min-height: 120px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 4px solid ${(props) => props.color || "#3b82f6"};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  }

  &.active {
    background: ${(props) => props.color || "#3b82f6"}15;
    border-color: ${(props) => props.color || "#3b82f6"};
  }
`;

const CardValue = styled.div`
  font-size: 32px;
  font-weight: bold;
  margin: 8px 0;
  color: ${(props) => props.color || "#1f2937"};
`;

const CardLabel = styled.div`
  font-size: 16px;
  color: #6b7280;
  font-weight: 500;
`;

const CardIcon = styled.div`
  font-size: 24px;
  margin-bottom: 12px;
  color: ${(props) => props.color || "#3b82f6"};
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const BookButton = styled.button`
  padding: 12px 24px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #059669;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  background: white;
  border-radius: 8px;
  margin-bottom: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Tab = styled.button`
  flex: 1;
  padding: 16px 24px;
  border: none;
  background: ${(props) => (props.active ? "#2563eb" : "transparent")};
  color: ${(props) => (props.active ? "white" : "#666")};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:first-child {
    border-radius: 8px 0 0 8px;
  }

  &:last-child {
    border-radius: 0 8px 8px 0;
  }

  &:hover {
    background: ${(props) => (props.active ? "#2563eb" : "#f8fafc")};
  }
`;

const FiltersContainer = styled.div`
  background: white;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FilterRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
  align-items: end;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const FilterLabel = styled.label`
  font-weight: 600;
  margin-bottom: 8px;
  color: #374151;
`;

const Select = styled.select`
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`;

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`;

const ClearFiltersButton = styled.button`
  padding: 10px 16px;
  background: #6b7280;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
  height: fit-content;

  &:hover {
    background: #4b5563;
  }
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: #f8fafc;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f9fafb;
  }
`;

const TableHeaderCell = styled.th`
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
`;

const TableCell = styled.td`
  padding: 16px;
  color: #6b7280;
`;

const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;

  ${(props) => {
    switch (props.status) {
      case "CONFIRMED":
        return "background: #dcfce7; color: #166534;";
      case "PENDING":
        return "background: #fef3c7; color: #92400e;";
      case "CANCELLED":
        return "background: #fee2e2; color: #991b1b;";
      default:
        return "background: #f3f4f6; color: #374151;";
    }
  }}
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #1d4ed8;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2rem;
  background: white;
  padding: 1.2rem 2rem;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #f1f5f9;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
  }
`;
const PaginationButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #2563eb;
    color: white;
    border-color: #2563eb;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PageInfo = styled.span`
  color: #6b7280;
  font-size: 14px;
`;

const PageNumbers = styled.div`
  display: flex;
  gap: 8px;
`;

const PageNumber = styled.button`
  padding: 8px 12px;
  border: 1px solid ${(props) => (props.active ? "#2563eb" : "#d1d5db")};
  background: ${(props) => (props.active ? "#2563eb" : "white")};
  color: ${(props) => (props.active ? "white" : "#374151")};
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    border-color: #2563eb;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
`;

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("today");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    serviceType: "",
    date: "",
    serviceName: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
  });
  const navigate = useNavigate();
  const id = localStorage.getItem("templeId");
  const name = "admin";

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const data = await getServiceBookings(id, name);
        setBookings(data);
        setPagination((prev) => ({ ...prev, totalItems: data.length }));
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [id, name]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const today = new Date();
    const todayStr = today
      .toISOString()
      .split("T")[0]
      .split("-")
      .reverse()
      .join("-");

    const todayBookings = bookings.filter(
      (booking) => booking.booking_date === todayStr
    );

    const thisMonthBookings = bookings.filter((booking) => {
      const bookingDate = new Date(
        booking.booking_date.split("-").reverse().join("-")
      );
      return (
        bookingDate.getMonth() === today.getMonth() &&
        bookingDate.getFullYear() === today.getFullYear()
      );
    });

    return {
      today: todayBookings.length,
      thisMonth: thisMonthBookings.length,
      total: bookings.length,
    };
  }, [bookings]);

  // Filter bookings based on active tab and filters
  const filteredBookings = useMemo(() => {
    let filtered = bookings;

    // Tab-based filtering
    if (activeTab === "today") {
      const today = new Date();
      const todayStr = today
        .toISOString()
        .split("T")[0]
        .split("-")
        .reverse()
        .join("-");
      filtered = filtered.filter(
        (booking) => booking.booking_date === todayStr
      );
    } else if (activeTab === "monthly") {
      const today = new Date();
      filtered = filtered.filter((booking) => {
        const bookingDate = new Date(
          booking.booking_date.split("-").reverse().join("-")
        );
        return (
          bookingDate.getMonth() === today.getMonth() &&
          bookingDate.getFullYear() === today.getFullYear()
        );
      });
    }
    // For "total" tab, no date filtering is applied

    // Apply additional filters
    if (filters.serviceType) {
      filtered = filtered.filter(
        (booking) => booking.service_data?.service_type === filters.serviceType
      );
    }

    if (filters.date) {
      // Convert date from YYYY-MM-DD to DD-MM-YYYY format
      const filterDate = filters.date.split("-").reverse().join("-");
      filtered = filtered.filter(
        (booking) => booking.booking_date === filterDate
      );
    }

    if (filters.serviceName) {
      filtered = filtered.filter(
        (booking) => booking.service_data?.name === filters.serviceName
      );
    }

    return filtered;
  }, [bookings, activeTab, filters]);

  // Paginate filtered bookings
  const paginatedBookings = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    return filteredBookings.slice(
      startIndex,
      startIndex + pagination.itemsPerPage
    );
  }, [filteredBookings, pagination]);

  // Get unique service types and names for filters
  const serviceTypes = [
    ...new Set(
      bookings
        .map((booking) => booking.service_data?.service_type)
        .filter(Boolean)
    ),
  ];
  const serviceNames = [
    ...new Set(
      bookings.map((booking) => booking.service_data?.name).filter(Boolean)
    ),
  ];

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handleBookForCustomer = () => {
    navigate("/admin-services");
  };

  const handleRowBook = (booking) => {
    // Implement book functionality for specific booking
    console.log("Booking for:", booking);
    alert(`Booking ${booking.ref_code} selected for customer`);
  };

  const handleCardClick = (cardType) => {
    setActiveTab(cardType);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({
      serviceType: "",
      date: "",
      serviceName: "",
    });
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const totalPages = Math.ceil(
    filteredBookings.length / pagination.itemsPerPage
  );

  // Check if any filter is active
  const isAnyFilterActive =
    filters.serviceType || filters.date || filters.serviceName;

  return (
    <DashboardContainer>
      <HeaderSection>
        <h1 style={{ margin: 0, color: "#1f2937", fontSize: "28px" }}></h1>
        <BookButton onClick={handleBookForCustomer}>
          <span>📅</span>
          Book for Customer
        </BookButton>
      </HeaderSection>

      {/* Summary Cards */}
      <SummaryCards>
        <SummaryCard
          color="#3b82f6"
          className={activeTab === "today" ? "active" : ""}
          onClick={() => handleCardClick("today")}
        >
          <CardIcon color="#3b82f6">📊</CardIcon>
          <CardValue color="#3b82f6">{summaryStats.today}</CardValue>
          <CardLabel>Today's Bookings</CardLabel>
        </SummaryCard>

        <SummaryCard
          color="#8b5cf6"
          className={activeTab === "monthly" ? "active" : ""}
          onClick={() => handleCardClick("monthly")}
        >
          <CardIcon color="#8b5cf6">📅</CardIcon>
          <CardValue color="#8b5cf6">{summaryStats.thisMonth}</CardValue>
          <CardLabel>This Month Bookings</CardLabel>
        </SummaryCard>

        <SummaryCard
          color="#10b981"
          className={activeTab === "total" ? "active" : ""}
          onClick={() => handleCardClick("total")}
        >
          <CardIcon color="#10b981">💰</CardIcon>
          <CardValue color="#10b981">{summaryStats.total}</CardValue>
          <CardLabel>Total Bookings</CardLabel>
        </SummaryCard>
      </SummaryCards>

      <TabsContainer>
        <Tab
          active={activeTab === "today"}
          onClick={() => setActiveTab("today")}
        >
          Today's Booking
        </Tab>
        <Tab
          active={activeTab === "monthly"}
          onClick={() => setActiveTab("monthly")}
        >
          Monthly Booking
        </Tab>
        <Tab
          active={activeTab === "total"}
          onClick={() => setActiveTab("total")}
        >
          Total Booking
        </Tab>
      </TabsContainer>

      <FiltersContainer>
        <FilterRow>
          <FilterGroup>
            <FilterLabel>Service Type</FilterLabel>
            <Select
              value={filters.serviceType}
              onChange={(e) =>
                handleFilterChange("serviceType", e.target.value)
              }
            >
              <option value="">All Types</option>
              {serviceTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Date</FilterLabel>
            <Input
              type="date"
              value={filters.date}
              onChange={(e) => handleFilterChange("date", e.target.value)}
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Service Name</FilterLabel>
            <Select
              value={filters.serviceName}
              onChange={(e) =>
                handleFilterChange("serviceName", e.target.value)
              }
            >
              <option value="">All Services</option>
              {serviceNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </Select>
          </FilterGroup>

          <FilterGroup>
            <ClearFiltersButton
              onClick={handleClearFilters}
              disabled={!isAnyFilterActive}
            >
              Clear Filters
            </ClearFiltersButton>
          </FilterGroup>
        </FilterRow>
      </FiltersContainer>

      <TableContainer>
        {loading ? (
          <LoadingState>Loading bookings...</LoadingState>
        ) : paginatedBookings.length === 0 ? (
          <EmptyState>
            No bookings found for the selected criteria
            {isAnyFilterActive && (
              <div style={{ marginTop: "10px" }}>
                <ClearFiltersButton onClick={handleClearFilters}>
                  Clear Filters to see all bookings
                </ClearFiltersButton>
              </div>
            )}
          </EmptyState>
        ) : (
          <>
            <Table>
              <TableHeader>
                <tr>
                  <TableHeaderCell>Service Name</TableHeaderCell>
                  <TableHeaderCell>Customer</TableHeaderCell>
                  <TableHeaderCell>Type</TableHeaderCell>
                  <TableHeaderCell>Date</TableHeaderCell>
                  <TableHeaderCell>Time</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Amount</TableHeaderCell>
                </tr>
              </TableHeader>
              <tbody>
                {paginatedBookings.map((booking, index) => (
                  <TableRow key={index}>
                    <TableCell>{booking.service_data?.name || "N/A"}</TableCell>
                    <TableCell>
                      <div>
                        <strong>{booking.customer_data?.name || "N/A"}</strong>
                        <div>
                          {booking.customer_data?.mobile_number || "N/A"}
                        </div>
                        <div>{booking.customer_data?.email_id || "N/A"}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {booking.service_data?.service_type || "N/A"}
                    </TableCell>
                    <TableCell>{booking.booking_date}</TableCell>
                    <TableCell>
                      {booking.start_time} - {booking.end_time}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={booking.status_display}>
                        {booking.status_display}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>₹{booking.unit_price || "0.00"}</TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>

            <PaginationContainer>
              <div>
                <PageInfo>
                  Showing{" "}
                  {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}{" "}
                  to{" "}
                  {Math.min(
                    pagination.currentPage * pagination.itemsPerPage,
                    filteredBookings.length
                  )}{" "}
                  of {filteredBookings.length} entries
                </PageInfo>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  flexWrap: "wrap",
                }}
              >
                <PaginationButton
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                >
                  Previous
                </PaginationButton>

                <PageNumbers>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PageNumber
                        key={page}
                        active={page === pagination.currentPage}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </PageNumber>
                    )
                  )}
                </PageNumbers>

                <PaginationButton
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === totalPages}
                >
                  Next
                </PaginationButton>
              </div>
            </PaginationContainer>
          </>
        )}
      </TableContainer>
    </DashboardContainer>
  );
};

export default AdminDashboard;
