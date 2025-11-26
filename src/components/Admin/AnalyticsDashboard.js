import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { getServiceBookings } from "../../services/customerServices";

// Styled Components
const AnalyticsContainer = styled.div`
  padding: 24px;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  color: #1f2937;
  font-size: 32px;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const DateFilter = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const Select = styled.select`
  padding: 10px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  cursor: pointer;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
  text-align: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-4px);
  }
`;

const StatIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin: 0 auto 16px;
  background: ${(props) => props.color}15;
  color: ${(props) => props.color};
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  color: #6b7280;
  font-size: 14px;
  font-weight: 600;
`;

const StatChange = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${(props) => (props.positive ? "#10b981" : "#ef4444")};
  margin-top: 8px;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const ChartTitle = styled.h3`
  color: #1f2937;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`;

const RevenueChart = styled.div`
  height: 300px;
  display: flex;
  align-items: end;
  gap: 8px;
  padding: 20px 0;
`;

const RevenueBar = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const Bar = styled.div`
  width: 100%;
  background: linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 4px 4px 0 0;
  /* height: 5px; */
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
    transform: scaleY(1.05);
  }
`;

const BarLabel = styled.div`
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
`;

const ServiceChart = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ServiceItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  background: #f8fafc;
  transition: background 0.3s ease;

  &:hover {
    background: #f1f5f9;
  }
`;

const ServiceColor = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${(props) => props.color};
`;

const ServiceName = styled.div`
  flex: 1;
  color: #374151;
  font-weight: 500;
`;

const ServiceStats = styled.div`
  text-align: right;
`;

const ServiceCount = styled.div`
  color: #1f2937;
  font-weight: 600;
`;

const ServiceRevenue = styled.div`
  color: #6b7280;
  font-size: 12px;
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
`;

const DetailCard = styled(ChartCard)`
  padding: 20px;
`;

const DetailList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
`;

const DetailLabel = styled.div`
  color: #374151;
  font-weight: 500;
`;

const DetailValue = styled.div`
  color: #1f2937;
  font-weight: 600;
`;

const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;

  &.completed {
    background: #dcfce7;
    color: #166534;
  }

  &.confirmed {
    background: #dbeafe;
    color: #1e40af;
  }

  &.pending {
    background: #fef3c7;
    color: #92400e;
  }

  &.cancelled {
    background: #fee2e2;
    color: #991b1b;
  }
`;

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState("month");
  const [bookings, setBookings] = useState([]);
  const id = localStorage.getItem("templeId");
  const name = "admin";
  console.log(bookings, "bookings");
  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      // setLoading(true);
      try {
        const data = await getServiceBookings(id, name);
        setBookings(data);
        // setPagination((prev) => ({ ...prev, totalItems: data.length }));
      } catch (error) {
        toast.error("Error fetching bookings:", error);
      } finally {
        // setLoading(false);
      }
    };

    fetchBookings();
  }, [id, name]);
  const getServiceColor = (serviceName) => {
    const colors = [
      "#3b82f6",
      "#ef4444",
      "#10b981",
      "#f59e0b",
      "#8b5cf6",
      "#ec4899",
    ];
    const index = serviceName
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };
  // Calculate analytics from bookings data
  const analytics = useMemo(() => {
    if (!bookings.length) return {};

    const totalRevenue = bookings.reduce(
      (sum, booking) => sum + (parseFloat(booking.unit_price) || 0),
      0
    );

    const completedBookings = bookings.filter(
      (b) => b.status_display === "COMPLETED"
    );
    const cancelledBookings = bookings.filter(
      (b) => b.status_display === "CANCELLED"
    );
    const confirmedBookings = bookings.filter(
      (b) => b.status_display === "CONFIRMED"
    );

    // Service-wise analytics
    const serviceStats = {};
    bookings.forEach((booking) => {
      const serviceName = booking.service_data?.name || "Unknown";
      const price = parseFloat(booking.unit_price) || 0;

      if (!serviceStats[serviceName]) {
        serviceStats[serviceName] = {
          count: 0,
          revenue: 0,
          color: getServiceColor(serviceName),
        };
      }

      serviceStats[serviceName].count++;
      serviceStats[serviceName].revenue += price;
    });

    // Monthly revenue (last 6 months)
    const monthlyRevenue = {};
    bookings.forEach((booking) => {
      const month = booking.booking_date.split("-")[1]; // MM from DD-MM-YYYY
      const price = parseFloat(booking.unit_price) || 0;

      if (!monthlyRevenue[month]) {
        monthlyRevenue[month] = 0;
      }
      monthlyRevenue[month] += price;
    });

    // Customer analytics
    const customerStats = {};
    bookings.forEach((booking) => {
      const customerId = booking.customer_data?.cust_ref_code;
      if (customerId) {
        customerStats[customerId] = (customerStats[customerId] || 0) + 1;
      }
    });

    const repeatCustomers = Object.values(customerStats).filter(
      (count) => count > 1
    ).length;

    return {
      totalBookings: bookings.length,
      completedBookings: completedBookings.length,
      cancelledBookings: cancelledBookings.length,
      confirmedBookings: confirmedBookings.length,
      totalRevenue,
      averageBookingValue: totalRevenue / bookings.length,
      serviceStats,
      monthlyRevenue,
      repeatCustomers,
      uniqueCustomers: Object.keys(customerStats).length,
      completionRate: (completedBookings.length / bookings.length) * 100,
      cancellationRate: (cancelledBookings.length / bookings.length) * 100,
    };
  }, [bookings]);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Get top 5 services by revenue
  const topServices = useMemo(() => {
    return Object.entries(analytics.serviceStats || {})
      .sort(([, a], [, b]) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [analytics.serviceStats]);

  // Recent bookings for the list
  const recentBookings = useMemo(() => {
    return [...bookings]
      .sort(
        (a, b) =>
          new Date(b.booking_date.split("-").reverse().join("-")) -
          new Date(a.booking_date.split("-").reverse().join("-"))
      )
      .slice(0, 5);
  }, [bookings]);

  if (!bookings.length) {
    return (
      <AnalyticsContainer>
        <Header>
          <Title>Analytics Dashboard</Title>
        </Header>
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "#6b7280",
          }}
        >
          <h3>No booking data available</h3>
          <p>Start accepting bookings to see analytics</p>
        </div>
      </AnalyticsContainer>
    );
  }
  console.log(analytics, "analytics");
  return (
    <AnalyticsContainer>
      <Header>
        <Title>Analytics Dashboard</Title>
        <DateFilter>
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="quarter">Last 3 Months</option>
            <option value="year">Last Year</option>
          </Select>
        </DateFilter>
      </Header>

      {/* Key Metrics */}
      <StatsGrid>
        <StatCard>
          <StatIcon color="#3b82f6">📊</StatIcon>
          <StatValue>{analytics.totalBookings}</StatValue>
          <StatLabel>Total Bookings</StatLabel>
          <StatChange positive={true}>+12% from last month</StatChange>
        </StatCard>

        <StatCard>
          <StatIcon color="#10b981">💰</StatIcon>
          <StatValue>₹{(analytics.totalRevenue / 1000).toFixed(0)}K</StatValue>
          <StatLabel>Total Revenue</StatLabel>
          <StatChange positive={true}>+8% from last month</StatChange>
        </StatCard>

        <StatCard>
          <StatIcon color="#8b5cf6">✅</StatIcon>
          <StatValue>{analytics.completedBookings}</StatValue>
          <StatLabel>Completed</StatLabel>
          <StatChange positive={analytics.completionRate > 70}>
            {analytics.completionRate.toFixed(1)}% completion rate
          </StatChange>
        </StatCard>

        <StatCard>
          <StatIcon color="#f59e0b">👥</StatIcon>
          <StatValue>{analytics.uniqueCustomers}</StatValue>
          <StatLabel>Unique Customers</StatLabel>
          <StatChange positive={true}>
            {analytics.repeatCustomers} repeat customers
          </StatChange>
        </StatCard>
      </StatsGrid>

      {/* Charts Section */}
      <ChartsGrid>
        <ChartCard>
          <ChartHeader>
            <ChartTitle>Revenue Overview</ChartTitle>
          </ChartHeader>
          <RevenueChart>
            {monthNames.map((month, index) => {
              const monthKey = (index + 1).toString().padStart(2, "0");
              const revenue = analytics.monthlyRevenue?.[monthKey] || 0;
              debugger;
              const maxRevenue = Math.max(
                ...Object.values(analytics.monthlyRevenue || { 0: 0 })
              );
              const height = maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0;
              return (
                <RevenueBar key={month}>
                  <Bar style={{ minHeight: `${Math.max(height, 4)}px` }} />
                  <BarLabel>{month}</BarLabel>
                </RevenueBar>
              );
            })}
          </RevenueChart>
        </ChartCard>

        <ChartCard>
          <ChartHeader>
            <ChartTitle>Top Services</ChartTitle>
          </ChartHeader>
          <ServiceChart>
            {topServices.map(([serviceName, stats]) => (
              <ServiceItem key={serviceName}>
                <ServiceColor color={stats.color} />
                <ServiceName>{serviceName}</ServiceName>
                <ServiceStats>
                  <ServiceCount>{stats.count} bookings</ServiceCount>
                  <ServiceRevenue>
                    ₹{stats.revenue.toLocaleString()}
                  </ServiceRevenue>
                </ServiceStats>
              </ServiceItem>
            ))}
          </ServiceChart>
        </ChartCard>
      </ChartsGrid>

      {/* Details Section */}
      <DetailsGrid>
        <DetailCard>
          <ChartTitle>Booking Status Distribution</ChartTitle>
          <DetailList>
            <DetailItem>
              <DetailLabel>Completed</DetailLabel>
              <DetailValue>
                {analytics.completedBookings}
                <StatusBadge
                  className="completed"
                  style={{ marginLeft: "8px" }}
                >
                  {analytics.completionRate.toFixed(1)}%
                </StatusBadge>
              </DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Confirmed</DetailLabel>
              <DetailValue>
                {analytics.confirmedBookings}
                <StatusBadge
                  className="confirmed"
                  style={{ marginLeft: "8px" }}
                >
                  Active
                </StatusBadge>
              </DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Cancelled</DetailLabel>
              <DetailValue>
                {analytics.cancelledBookings}
                <StatusBadge
                  className="cancelled"
                  style={{ marginLeft: "8px" }}
                >
                  {analytics.cancellationRate.toFixed(1)}%
                </StatusBadge>
              </DetailValue>
            </DetailItem>
          </DetailList>
        </DetailCard>

        <DetailCard>
          <ChartTitle>Recent Bookings</ChartTitle>
          <DetailList>
            {recentBookings.map((booking, index) => (
              <DetailItem key={index}>
                <div>
                  <DetailLabel>{booking.service_data?.name}</DetailLabel>
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>
                    {booking.customer_data?.name} • {booking.booking_date}
                  </div>
                </div>
                <DetailValue>
                  ₹{parseFloat(booking.unit_price || 0).toLocaleString()}
                  <StatusBadge
                    className={booking.status_display?.toLowerCase()}
                    style={{ marginLeft: "8px" }}
                  >
                    {booking.status_display}
                  </StatusBadge>
                </DetailValue>
              </DetailItem>
            ))}
          </DetailList>
        </DetailCard>

        <DetailCard>
          <ChartTitle>Performance Metrics</ChartTitle>
          <DetailList>
            <DetailItem>
              <DetailLabel>Average Booking Value</DetailLabel>
              <DetailValue>
                ₹{analytics.averageBookingValue?.toFixed(0) || 0}
              </DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Repeat Customer Rate</DetailLabel>
              <DetailValue>
                {analytics.uniqueCustomers > 0
                  ? (
                      (analytics.repeatCustomers / analytics.uniqueCustomers) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Success Rate</DetailLabel>
              <DetailValue>
                {(
                  (analytics.completedBookings / analytics.totalBookings) *
                  100
                ).toFixed(1)}
                %
              </DetailValue>
            </DetailItem>
          </DetailList>
        </DetailCard>
      </DetailsGrid>
    </AnalyticsContainer>
  );
};

export default AnalyticsDashboard;
