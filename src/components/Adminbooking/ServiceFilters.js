import React, { useState } from "react";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: translateX(0); }
`;

const FiltersContainer = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08), 0 2px 10px rgba(0, 0, 0, 0.03);
  padding: 32px;
  /* max-width: 800px; */
  margin: 20px auto;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f1f5f9;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const ClearButton = styled.button`
  background: #f1f5f9;
  border: 2px solid #e2e8f0;
  color: #64748b;
  padding: 8px 16px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f8fafc;
    color: #475569;
    border-color: #cbd5e1;
  }
`;

const ServiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
  animation: ${fadeIn} 0.5s ease;
`;

const ServiceCard = styled.div`
  background: ${({ selected, bgImage }) =>
    selected
      ? `linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(29, 78, 216, 0.9)), url(${bgImage})`
      : `linear-gradient(135deg, rgba(12, 12, 12, 0.62), rgba(248, 250, 252, 0.68)), url(${bgImage})`};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border: 3px solid ${({ selected }) => (selected ? "#3b82f6" : "transparent")};
  border-radius: 20px;
  padding: 24px 20px;
  text-align: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: ${({ selected }) =>
    selected
      ? "0 20px 40px rgba(59, 130, 246, 0.3), 0 0 0 1px rgba(59, 130, 246, 0.2)"
      : "0 8px 25px rgba(0, 0, 0, 0.08)"};

  /* Glow effect for selected card */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 20px;
    background: ${({ selected }) =>
      selected
        ? "linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.1))"
        : "none"};
    opacity: ${({ selected }) => (selected ? 1 : 0)};
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15),
      0 0 0 1px rgba(59, 130, 246, 0.1);
    border-color: #3b82f6;
  }

  /* Subtle pulse animation for selected card */
  @keyframes subtlePulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.02);
    }
  }

  ${({ selected }) =>
    selected &&
    `
    animation: subtlePulse 3s ease-in-out infinite;
  `}
`;

const ServiceIcon = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  background: ${({ selected }) =>
    selected
      ? "rgba(255, 255, 255, 0.25)"
      : "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(255, 255, 255, 0.8))"};
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: ${({ selected }) => (selected ? "#ffffff" : "#3b82f6")};
  backdrop-filter: blur(10px);
  border: ${({ selected }) =>
    selected
      ? "1px solid rgba(255, 255, 255, 0.3)"
      : "1px solid rgba(255, 255, 255, 0.5)"};
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;

  ${ServiceCard}:hover & {
    transform: scale(1.1);
    background: ${({ selected }) =>
      selected
        ? "rgba(255, 255, 255, 0.3)"
        : "linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(255, 255, 255, 0.9))"};
  }
`;

const ServiceName = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${({ selected }) => (selected ? "#ffffff" : "#1e293b")};
  margin: 0;
  position: relative;
  z-index: 2;
  text-shadow: ${({ selected }) =>
    selected ? "0 2px 4px rgba(0, 0, 0, 0.2)" : "none"};
  letter-spacing: -0.01em;
`;

const ServiceDescription = styled.p`
  font-size: 14px;
  color: ${({ selected }) =>
    selected ? "rgba(255, 255, 255, 0.9)" : "#64748b"};
  margin: 8px 0 0 0;
  position: relative;
  z-index: 2;
  line-height: 1.4;
  font-weight: 500;
`;

const DateSection = styled.div`
  margin-bottom: 32px;
  animation: ${slideIn} 0.5s ease 0.1s both;
`;

const SectionLabel = styled.label`
  display: block;
  font-weight: 600;
  font-size: 16px;
  color: #1e293b;
  margin-bottom: 16px;
`;

const CalendarContainer = styled.div`
  background: #ffffff;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const MonthNavigation = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const MonthButton = styled.button`
  background: #f1f5f9;
  border: none;
  border-radius: 10px;
  padding: 8px 12px;
  cursor: pointer;
  color: #475569;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: #e2e8f0;
    color: #334155;
  }
`;

const MonthTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
`;

const DayHeader = styled.div`
  text-align: center;
  font-weight: 600;
  font-size: 12px;
  color: #64748b;
  padding: 8px;
  text-transform: uppercase;
`;

const CapacitySection = styled.div`
  margin-bottom: 32px;
  animation: ${slideIn} 0.5s ease 0.2s both;
`;

const CapacityToggle = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
`;

const ToggleButton = styled.button`
  background: ${({ active }) => (active ? "#3b82f6" : "#f1f5f9")};
  border: 2px solid ${({ active }) => (active ? "#3b82f6" : "#e2e8f0")};
  color: ${({ active }) => (active ? "#ffffff" : "#64748b")};
  padding: 12px 20px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;

  &:hover {
    background: ${({ active }) => (active ? "#2563eb" : "#e2e8f0")};
  }
`;

const CapacityInput = styled.input`
  width: 100%;
  padding: 16px 20px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  color: #1e293b;
  background: #ffffff;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 20px;
  background: ${({ disabled }) =>
    disabled
      ? "linear-gradient(135deg, #cbd5e1, #94a3b8)"
      : "linear-gradient(135deg, #059669, #10b981)"};
  color: #ffffff;
  border: none;
  border-radius: 16px;
  font-size: 18px;
  font-weight: 700;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(5, 150, 105, 0.3);

  &:hover {
    transform: ${({ disabled }) => (disabled ? "none" : "translateY(-3px)")};
    box-shadow: ${({ disabled }) =>
      disabled
        ? "0 4px 15px rgba(5, 150, 105, 0.3)"
        : "0 8px 25px rgba(5, 150, 105, 0.4)"};
  }

  &:active {
    transform: ${({ disabled }) => (disabled ? "none" : "translateY(-1px)")};
  }
`;

const FilterSummary = styled.div`
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border-radius: 16px;
  padding: 24px;
  margin-top: 24px;
  border: 2px solid #e2e8f0;
  animation: ${fadeIn} 0.5s ease;
`;

const SummaryTitle = styled.h4`
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 16px 0;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

const SummaryItem = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #e2e8f0;
`;

const SummaryLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  margin-bottom: 4px;
`;

const SummaryValue = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
`;

const EditButton = styled.button`
  background: #3b82f6;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 16px;

  &:hover {
    background: #2563eb;
    transform: translateY(-1px);
  }
`;
// Add these styled components for the date fixes
const DayContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

const TodayIndicator = styled.span`
  font-size: 8px;
  font-weight: 700;
  color: #3b82f6;
  background: #dbeafe;
  padding: 1px 4px;
  border-radius: 4px;
  line-height: 1;
`;

// Update the Day component to handle different states
const Day = styled.button`
  background: ${({ selected, today, past }) =>
    selected
      ? "#3b82f6"
      : today
      ? "#dbeafe"
      : past
      ? "#f3f4f6"
      : "transparent"};
  border: 2px solid
    ${({ selected, today }) =>
      selected ? "#3b82f6" : today ? "#3b82f6" : "transparent"};
  border-radius: 12px;
  padding: 12px 8px;
  font-weight: 600;
  font-size: 14px;
  color: ${({ selected, past }) =>
    selected ? "#ffffff" : past ? "#d1d5db" : "#1e293b"};
  cursor: ${({ past }) => (past ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${({ selected, past }) =>
      past ? "#f3f4f6" : selected ? "#2563eb" : "#f1f5f9"};
    border-color: ${({ selected, past }) =>
      past ? "transparent" : selected ? "#2563eb" : "#cbd5e1"};
  }

  &:disabled {
    color: #d1d5db;
    cursor: not-allowed;
    background: transparent;
    border-color: transparent;
  }
`;

const ServiceFilters = ({ filters, onFilterChange, services }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [showCustomCapacity, setShowCustomCapacity] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const serviceTypes = [
    {
      id: "HALL",
      name: "HALL",
      icon: "🏛️",
      bgImage:
        "https://png.pngtree.com/thumb_back/fh260/background/20250305/pngtree-elegant-grand-hall-interior-with-arches-and-symmetrical-design-image_17062750.jpg",
    },
    {
      id: "PUJA",
      name: "PUJA",
      icon: "🛕",
      bgImage:
        "https://previews.123rf.com/images/snapgalleria/snapgalleria1809/snapgalleria180900034/110173980-happy-durga-puja-india-festival-holiday-background.jpg",
    },
    {
      id: "EVENT",
      name: "EVENT",
      icon: "🎪",
      bgImage:
        "https://png.pngtree.com/thumb_back/fh260/back_our/20190619/ourmid/pngtree-opening-event-poster-background-image_134083.jpg",
    },
  ];

  const capacityOptions = [50, 100, 200];

  // Fix: Proper date formatting to get YYYY-MM-DD in local timezone
  const formatDateToLocal = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Generate calendar days
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const handleChange = (field, value) => {
    console.log(field, value, "data");
    onFilterChange({ ...filters, [field]: value });
  };

  const handleCapacityClick = (capacity) => {
    if (capacity === "custom") {
      setShowCustomCapacity(true);
      handleChange("capacity", "");
    } else {
      setShowCustomCapacity(false);
      handleChange("capacity", capacity);
    }
  };

  const handleClearFilters = () => {
    onFilterChange({
      serviceType: "",
      date: "",
      capacity: "",
    });
    setShowCustomCapacity(false);
  };

  const navigateMonth = (direction) => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

  const formatDisplayDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  // Fix: Compare dates properly using local format
  const isSameDate = (date1, date2) => {
    if (!date1 || !date2) return false;
    return (
      formatDateToLocal(new Date(date1)) === formatDateToLocal(new Date(date2))
    );
  };

  const isCheckDisabled = !filters.serviceType || !filters.date;

  const days = getDaysInMonth(currentMonth);
  const dayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthYear = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Fix: Get today's date in proper format for comparison
  const today = new Date();
  const todayFormatted = formatDateToLocal(today);

  return (
    <FiltersContainer>
      <Header>
        <Title>Find Your Perfect Service</Title>
        <ClearButton onClick={handleClearFilters}>
          Clear All Filters
        </ClearButton>
      </Header>

      {!collapsed ? (
        <>
          <ServiceGrid>
            {serviceTypes.map((service) => (
              <ServiceCard
                key={service.id}
                selected={filters.serviceType === service.id}
                bgImage={service.bgImage}
                onClick={() => handleChange("serviceType", service.id)}
              >
                <ServiceIcon selected={filters.serviceType === service.id}>
                  {service.icon}
                </ServiceIcon>
                <ServiceName selected={filters.serviceType === service.id}>
                  {service.name}
                </ServiceName>
                <ServiceDescription
                  selected={filters.serviceType === service.id}
                >
                  {service.description}
                </ServiceDescription>
              </ServiceCard>
            ))}
          </ServiceGrid>

          <DateSection>
            <SectionLabel>Select Date</SectionLabel>
            <CalendarContainer>
              <MonthNavigation>
                <MonthButton onClick={() => navigateMonth(-1)}>
                  ← Previous
                </MonthButton>
                <MonthTitle>{monthYear}</MonthTitle>
                <MonthButton onClick={() => navigateMonth(1)}>
                  Next →
                </MonthButton>
              </MonthNavigation>

              <DaysGrid>
                {dayHeaders.map((day) => (
                  <DayHeader key={day}>{day}</DayHeader>
                ))}
                {days.map((day, index) => {
                  if (!day) {
                    return <Day key={index} disabled={true}></Day>;
                  }

                  const dayFormatted = formatDateToLocal(day);
                  const isSelected = filters.date === dayFormatted;
                  const isToday = dayFormatted === todayFormatted;
                  const isPast = day < today && !isToday;

                  return (
                    <Day
                      key={index}
                      selected={isSelected}
                      today={isToday}
                      past={isPast}
                      onClick={() => handleChange("date", dayFormatted)}
                      disabled={isPast}
                    >
                      <DayContent>
                        {day.getDate()}
                        {isToday && <TodayIndicator>Today</TodayIndicator>}
                      </DayContent>
                    </Day>
                  );
                })}
              </DaysGrid>
            </CalendarContainer>
          </DateSection>

          <CapacitySection>
            <SectionLabel>Capacity Requirements</SectionLabel>
            <CapacityToggle>
              {capacityOptions.map((cap) => (
                <ToggleButton
                  key={cap}
                  active={filters.capacity == cap && !showCustomCapacity}
                  onClick={() => handleCapacityClick(cap)}
                >
                  {cap}+ People
                </ToggleButton>
              ))}
              <ToggleButton
                active={showCustomCapacity}
                onClick={() => handleCapacityClick("custom")}
              >
                Custom
              </ToggleButton>
            </CapacityToggle>

            {showCustomCapacity && (
              <CapacityInput
                type="number"
                placeholder="Enter custom capacity..."
                value={filters.capacity}
                onChange={(e) => handleChange("capacity", e.target.value)}
                min="1"
              />
            )}
          </CapacitySection>

          <ActionButton
            disabled={isCheckDisabled}
            onClick={() => setCollapsed(true)}
          >
            Check Availability
          </ActionButton>
        </>
      ) : (
        <>
          <FilterSummary>
            <SummaryTitle>Your Selection</SummaryTitle>
            <SummaryGrid>
              <SummaryItem>
                <SummaryLabel>Service Type</SummaryLabel>
                <SummaryValue>
                  {serviceTypes.find((s) => s.id === filters.serviceType)
                    ?.name || "Not selected"}
                </SummaryValue>
              </SummaryItem>
              <SummaryItem>
                <SummaryLabel>Date</SummaryLabel>
                <SummaryValue>
                  {filters.date
                    ? formatDisplayDate(new Date(filters.date))
                    : "Not selected"}
                </SummaryValue>
              </SummaryItem>
              <SummaryItem>
                <SummaryLabel>Capacity</SummaryLabel>
                <SummaryValue>
                  {filters.capacity
                    ? `${filters.capacity}+ People`
                    : "Not selected"}
                </SummaryValue>
              </SummaryItem>
            </SummaryGrid>

            <EditButton onClick={() => setCollapsed(false)}>
              Edit Filters
            </EditButton>
          </FilterSummary>
        </>
      )}
    </FiltersContainer>
  );
};

export default ServiceFilters;
