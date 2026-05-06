import React, { useState } from "react";
import styled from "styled-components";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const calendarData = [
  {
    month: "January 2026",
    year: 2026,
    monthNumber: 0,
    days: [
      { date: 4, day: "Sun", name: "Saat Chauin Lambodera Santashti" },
      { date: 5, day: "Mon", name: "Saat Chauin Lambodera Santashti" },
      { date: 11, day: "Sun", name: "Shattila Ekadashi" },
      { date: 12, day: "Mon", name: "Shattila Ekadashi" },
      { date: 13, day: "Tue", name: "Malaz Sankranti" },
      { date: 14, day: "Wed", name: "Makara Sankranti/Pongal" },
      { date: 15, day: "Thu", name: "Lohri" },
      { date: 16, day: "Fri", name: "Pongal" },
      { date: 17, day: "Sat", name: "Uttrayana" },
      { date: 18, day: "Sun", name: "Ramal Jala" },
      { date: 23, day: "Fri", name: "Magha Amawiya" },
      {
        date: 24,
        day: "Sat",
        name: "Martin Luther King Jr. Day",
        isHoliday: true,
      },
      { date: 25, day: "Sun", name: "Pratishita Diwae Vasant Panchami" },
      { date: 26, day: "Mon", name: "India Republic Day", isHoliday: true },
      { date: 30, day: "Fri", name: "Jaya Ekadashi" },
      { date: 31, day: "Sat", name: "Gandhiji Punyattihi" },
    ],
  },
  {
    month: "February 2026",
    year: 2026,
    monthNumber: 1,
    days: [
      { date: 1, day: "Sun", name: "Marja Purinha" },
      { date: 2, day: "Mon", name: "Full Snow Moon" },
      { date: 3, day: "Tue", name: "Thai Pusam" },
      { date: 8, day: "Sun", name: "Phalgun Begins" },
      { date: 15, day: "Sun", name: "Vijaya Ekadashi" },
      {
        date: 19,
        day: "Thu",
        name: "Chhatrapati Shivaji Maharaj Jayanti",
        isHoliday: true,
      },
      { date: 20, day: "Fri", name: "Pulara Dool" },
      { date: 27, day: "Fri", name: "Amalaki Ekadashi" },
    ],
  },
  {
    month: "March 2026",
    year: 2026,
    monthNumber: 2,
    days: [
      { date: 1, day: "Sun", name: "Holika Dahan" },
      { date: 2, day: "Mon", name: "Chaitra Begins" },
      { date: 3, day: "Tue", name: "Bhai Dooj/Bhratri" },
      { date: 4, day: "Wed", name: "Distanja Puritma" },
      { date: 5, day: "Thu", name: "Ediger Cheera" },
      { date: 6, day: "Fri", name: "Gishan - Wom Bodad" },
      { date: 7, day: "Sat", name: "Moora" },
      { date: 8, day: "Sun", name: "International Women's Day" },
      { date: 9, day: "Mon", name: "Rang Panchami" },
      { date: 17, day: "Tue", name: "St. Patrick's Day" },
      { date: 19, day: "Thu", name: "Chaitra Amavaya" },
      { date: 20, day: "Fri", name: "Ugadi Gudi Padwa" },
      { date: 21, day: "Sat", name: "Jhulelal Jayanti" },
      { date: 22, day: "Sun", name: "Vernal Equinox" },
      { date: 23, day: "Mon", name: "Eid al-Fitr", isHoliday: true },
      { date: 24, day: "Tue", name: "Gangaur/Gauri Puja" },
      { date: 25, day: "Wed", name: "Mataya Jayanti" },
      { date: 26, day: "Thu", name: "Shaheed Divas" },
      { date: 27, day: "Fri", name: "Rama Navami", isHoliday: true },
      { date: 28, day: "Sat", name: "Kamada Ekadashi" },
      { date: 29, day: "Sun", name: "Mahaveer Swami Jayanti", isHoliday: true },
    ],
  },
  {
    month: "April 2026",
    year: 2026,
    monthNumber: 3,
    days: [
      { date: 5, day: "Sun", name: "Easter Sunday", isHoliday: true },
      { date: 8, day: "Wed", name: "Varuthini Ekadashi" },
      { date: 13, day: "Mon", name: "Baisakhi" },
      { date: 14, day: "Tue", name: "Solar New Year" },
      { date: 15, day: "Wed", name: "Vishu/Puthandu" },
      { date: 16, day: "Thu", name: "Poila Boishakh" },
      { date: 17, day: "Fri", name: "Shankaracharya Jayanti" },
      { date: 18, day: "Sat", name: "Earth Day" },
      { date: 19, day: "Sun", name: "Ganga Saptami" },
      { date: 22, day: "Wed", name: "Narsimha Jayanti" },
      { date: 23, day: "Thu", name: "Vaishakha Amavaya" },
      { date: 26, day: "Sun", name: "Akshaya Tritiya" },
      { date: 27, day: "Mon", name: "Parashuram Jayanti" },
      { date: 29, day: "Wed", name: "Mohini Ekadashi" },
    ],
  },
  {
    month: "May 2026",
    year: 2026,
    monthNumber: 4,
    days: [
      { date: 1, day: "Fri", name: "May Day", isHoliday: true },
      { date: 12, day: "Tue", name: "Akshaya Tritiya", isHoliday: false },
    ],
  },
  {
    month: "June 2026",
    year: 2026,
    monthNumber: 5,
    days: [
      { date: 13, day: "Sat", name: "Parama Ekadashi" },
      { date: 14, day: "Sun", name: "Adhika Masar" },
      { date: 19, day: "Fri", name: "Juneteenth", isHoliday: true },
      { date: 20, day: "Sat", name: "Summer Solstice" },
      { date: 21, day: "Sun", name: "Father's Day" },
      { date: 21, day: "Sun", name: "International Yoga Day" },
      { date: 24, day: "Wed", name: "Nirjala Ekadashi" },
      { date: 25, day: "Thu", name: "Gayatri Jayanti" },
      { date: 29, day: "Mon", name: "Full Strawberry Moon" },
      { date: 30, day: "Tue", name: "Jyestha Amavasya" },
      { date: 30, day: "Tue", name: "Jyestha Purnima" },
      { date: 30, day: "Tue", name: "Kalathas Jayanti" },
    ],
  },
  {
    month: "July 2026",
    year: 2026,
    monthNumber: 6,
    days: [
      { date: 4, day: "Sat", name: "July 4th", isHoliday: true },
      { date: 9, day: "Thu", name: "Yogini Ekadashi" },
      { date: 17, day: "Fri", name: "National Ice Cream Day" },
      { date: 19, day: "Sun", name: "Parents' Day" },
      { date: 24, day: "Fri", name: "Ashadha Somvati Amavasya" },
      { date: 25, day: "Sat", name: "Jagannath Rath Yatra" },
      { date: 26, day: "Sun", name: "Guru Purnima" },
      { date: 26, day: "Sun", name: "Chili Rock Moon" },
      { date: 27, day: "Mon", name: "National Vehicle Day" },
      { date: 28, day: "Tue", name: "Sravana Begins" },
      { date: 30, day: "Thu", name: "Devshayani Ekadashi" },
    ],
  },
  {
    month: "August 2026",
    year: 2026,
    monthNumber: 7,
    days: [
      { date: 1, day: "Sat", name: "Friendship Day" },
      { date: 2, day: "Sun", name: "1st Savana Somvaar" },
      { date: 7, day: "Fri", name: "Kamika Ekadashi" },
      { date: 11, day: "Tue", name: "Hariyali Amavasya" },
      { date: 12, day: "Wed", name: "Hariyali Teej" },
      { date: 15, day: "Sat", name: "India Independence Day", isHoliday: true },
      { date: 15, day: "Sat", name: "2nd Savana Somvaar" },
      { date: 16, day: "Sun", name: "Solar Eclipse" },
      { date: 18, day: "Tue", name: "Tulasidas Jayanti" },
      { date: 21, day: "Fri", name: "Varalakshmi Vrat" },
      { date: 22, day: "Sat", name: "Nag Panchami" },
      { date: 23, day: "Sun", name: "Malayalam New Year" },
      { date: 26, day: "Wed", name: "Rakshabandhan", isHoliday: true },
      { date: 28, day: "Fri", name: "Sravana Purnima" },
      { date: 28, day: "Fri", name: "Ekadashi" },
      { date: 29, day: "Sat", name: "Sravana Somvaar" },
      { date: 29, day: "Sat", name: "Onam", isHoliday: true },
      { date: 29, day: "Sat", name: "Chandra Grahan - Lunar Eclipse" },
      { date: 30, day: "Sun", name: "Bhadrapada Begins" },
      { date: 31, day: "Mon", name: "Bahula Chaturthi" },
    ],
  },
  {
    month: "September 2026",
    year: 2026,
    monthNumber: 8,
    days: [
      { date: 3, day: "Thu", name: "Hala Shashthi" },
      { date: 4, day: "Fri", name: "Krishna Janmashtami", isHoliday: true },
      { date: 5, day: "Sat", name: "Teacher's Day (India)" },
      { date: 7, day: "Mon", name: "Aja Ekadashi" },
      { date: 12, day: "Sat", name: "Labor Day", isHoliday: true },
      { date: 13, day: "Sun", name: "Bhadrapada Amavasya" },
      { date: 14, day: "Mon", name: "Ganesh Chaturthi", isHoliday: true },
      { date: 15, day: "Tue", name: "Rishi Panchami" },
      { date: 16, day: "Wed", name: "Balarama Jayanti" },
      { date: 18, day: "Fri", name: "Radha Ashtami" },
      { date: 19, day: "Sat", name: "Vamana Jayanti" },
      { date: 21, day: "Mon", name: "Parsva Ekadashi" },
      { date: 24, day: "Thu", name: "Ganesh Visarjan" },
      { date: 25, day: "Fri", name: "Pitra Paksha Begins" },
      { date: 26, day: "Sat", name: "Bhadrapada Purnima" },
      { date: 26, day: "Sat", name: "Autumnal Equinox" },
      { date: 26, day: "Sat", name: "Full Harvest Moon" },
      { date: 27, day: "Sun", name: "Ashwina Begins" },
      { date: 30, day: "Wed", name: "National Immigrant Day" },
    ],
  },
  {
    month: "October 2026",
    year: 2026,
    monthNumber: 9,
    days: [
      { date: 4, day: "Sun", name: "Navratri Begins" },
      { date: 5, day: "Mon", name: "Agrasen Jayanti" },
      { date: 12, day: "Mon", name: "Columbus Day", isHoliday: true },
      { date: 18, day: "Sun", name: "Durga Navami" },
      { date: 19, day: "Mon", name: "Dussehra/Vijayadashami", isHoliday: true },
      { date: 20, day: "Tue", name: "Kartika Begins" },
      { date: 25, day: "Sun", name: "Papankusha Ekadashi" },
    ],
  },
  {
    month: "November 2026",
    year: 2026,
    monthNumber: 10,
    days: [
      { date: 1, day: "Sun", name: "Karwa Chauth" },
      { date: 2, day: "Mon", name: "Ahoi Ashtami" },
      { date: 6, day: "Fri", name: "Dhanteras" },
      { date: 7, day: "Sat", name: "Diwali Lakshmi Puja", isHoliday: true },
      { date: 8, day: "Sun", name: "Govardhan Puja" },
      { date: 9, day: "Mon", name: "Bhai Dooj" },
      { date: 14, day: "Sat", name: "Kartika Amavasya" },
      { date: 15, day: "Sun", name: "Chhath Puja", isHoliday: true },
      { date: 22, day: "Sun", name: "Vaikuntha Chaturdashi" },
      { date: 23, day: "Mon", name: "Kartika Purnima" },
      { date: 24, day: "Tue", name: "Guru Nanak Jayanti", isHoliday: true },
      { date: 25, day: "Wed", name: "Super Beaver Moon" },
      { date: 26, day: "Thu", name: "Margashirsha/Aghayana Begins" },
      { date: 27, day: "Fri", name: "Thanksgiving Day", isHoliday: true },
      { date: 28, day: "Sat", name: "Black Friday" },
    ],
  },
  {
    month: "December 2026",
    year: 2026,
    monthNumber: 11,
    days: [
      { date: 6, day: "Sun", name: "Vivah Panchami (Sita Rama Kalyanam)" },
      { date: 13, day: "Sun", name: "Mokshada Ekadashi" },
      { date: 21, day: "Mon", name: "Shortest Day of the Year" },
      { date: 24, day: "Thu", name: "Dattatreya Jayanti" },
      { date: 24, day: "Thu", name: "Margashirsha Purnima" },
      { date: 25, day: "Fri", name: "Christmas Eve" },
      { date: 25, day: "Fri", name: "Christmas Day", isHoliday: true },
      { date: 26, day: "Sat", name: "Pausha Begins" },
    ],
  },
];

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #fff8e7 0%, #fff1d6 50%, #ffe8cc 100%);
  padding: 20px;
  margin-top: 50px;
`;

const CalendarCard = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255, 245, 235, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 40px;
  box-shadow: 0 30px 60px rgba(230, 180, 140, 0.2);
  overflow: hidden;
  border: 2px solid rgba(255, 215, 180, 0.6);
`;

const HeaderSection = styled.div`
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  padding: 30px;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: "🕉️";
    position: absolute;
    font-size: 200px;
    opacity: 0.1;
    top: -50px;
    right: -30px;
  }
`;

const Title = styled.h1`
  color: white;
  font-size: 2.5rem;
  margin: 0 0 10px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  font-weight: 700;
`;

const Subtitle = styled.p`
  color: #fff5e6;
  font-size: 1.1rem;
  margin: 0;
  font-style: italic;
`;

const NavigationBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 40px;
  background: linear-gradient(to right, #fffaf0, #fff5e6, #fffaf0);
  border-bottom: 2px solid #ff9933;
`;

const NavButton = styled.button`
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  border: none;
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);

  &:hover:not(:disabled) {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(255, 107, 53, 0.5);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const MonthDisplay = styled.div`
  text-align: center;
`;

const MonthName = styled.h2`
  color: #8b4513;
  font-size: 2rem;
  margin: 0;
  font-weight: 700;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  padding: 20px 30px;
  background: #fffaf0;
  flex-wrap: wrap;
`;

const FilterChip = styled.button`
  padding: 10px 20px;
  border: 2px solid ${(props) => (props.active ? "#ff6b35" : "#ddd")};
  background: ${(props) =>
    props.active
      ? "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)"
      : "white"};
  color: ${(props) => (props.active ? "white" : "#8b4513")};
  border-radius: 25px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: ${(props) =>
    props.active ? "0 4px 15px rgba(255, 107, 53, 0.3)" : "none"};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
  }
`;

const CalendarGrid = styled.div`
  padding: 30px 40px 40px 40px;
`;

const WeekDaysRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  margin-bottom: 15px;
`;

const WeekDay = styled.div`
  text-align: center;
  font-weight: 700;
  color: #ff6b35;
  padding: 12px;
  font-size: 1rem;
  background: linear-gradient(135deg, #fff5e6, #fffaf0);
  border-radius: 10px;
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
`;

const DayCell = styled.div`
 aspect-ratio: 1;
  background: ${(props) => {
    if (props.hasEvent && props.isHoliday)
      return "linear-gradient(145deg, #fee1c0 0%, #fcd5b0 100%)";
    if (props.hasEvent)
      return "linear-gradient(145deg, #e3f0da 0%, #d4e8c5 100%)";
    return "rgba(255, 250, 245, 0.7)";
  }};
  border: 2px solid ${(props) =>
    props.hasEvent
      ? props.isHoliday
        ? "#f5be95"
        : "#b8d9a0"
      : "#f0e0d0"
  };
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: ${(props) => (props.hasEvent ? "pointer" : "default")};
  transition: all 0.3s ease;
  position: relative;
  backdrop-filter: blur(5px);
  color: ${(props) => (props.hasEvent ? "#6b4f3a" : "#b29178")};

  &:hover {
    transform: ${(props) =>
    props.hasEvent ? "translateY(-5px) scale(1.05)" : "none"};
    box-shadow: ${(props) =>
    props.hasEvent ? "0 8px 20px rgba(200, 160, 130, 0.25)" : "none"};
  }
`;

const DateNumber = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 4px;
`;

const EventIndicator = styled.div`
  font-size: 0.7rem;
  font-weight: 600;
  text-align: center;
  line-height: 1.2;
  max-height: 30px;
  overflow: hidden;
  padding: 0 4px;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const HolidayIcon = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
`;

const EmptyCell = styled.div`
  aspect-ratio: 1;
`;

const LegendContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 30px;
  padding: 20px 30px;
  background: #fffaf0;
  border-top: 2px solid #ff9933;
  flex-wrap: wrap;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.95rem;
  color: #8b4513;
`;

const LegendColor = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: ${(props) => props.color};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

const Footer = styled.div`
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  padding: 20px;
  text-align: center;
  color: white;
  font-size: 0.95rem;
  font-style: italic;
`;

const SelectedEventModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  max-width: 400px;
  width: 90%;
  border: 3px solid #ff9933;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const ModalTitle = styled.h3`
  color: #ff6b35;
  font-size: 1.8rem;
  margin: 0 0 15px 0;
`;

const ModalContent = styled.p`
  color: #4a4a4a;
  font-size: 1.1rem;
  margin: 0 0 20px 0;
`;

const CloseButton = styled.button`
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  width: 100%;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(255, 107, 53, 0.5);
  }
`;

const Calendar = () => {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [filter, setFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const currentMonth = calendarData[currentMonthIndex];

  const filteredEvents = currentMonth.days.filter((event) => {
    if (filter === "all") return true;
    if (filter === "holidays") return event.isHoliday;
    if (filter === "festivals") return !event.isHoliday;
    return true;
  });

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(
      currentMonth.year,
      currentMonth.monthNumber
    );
    const firstDay = getFirstDayOfMonth(
      currentMonth.year,
      currentMonth.monthNumber
    );
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<EmptyCell key={`empty-${i}`} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const eventForDay = filteredEvents.find((event) => event.date === day);
      const hasEvent = !!eventForDay;
      const isHoliday = eventForDay?.isHoliday || false;

      days.push(
        <DayCell
          key={day}
          hasEvent={hasEvent}
          isHoliday={isHoliday}
          onClick={() => hasEvent && setSelectedEvent(eventForDay)}
        >
          {hasEvent && isHoliday && (
            <HolidayIcon>
              <Star size={16} fill="white" />
            </HolidayIcon>
          )}
          <DateNumber>{day}</DateNumber>
          {hasEvent && <EventIndicator>{eventForDay.name}</EventIndicator>}
        </DayCell>
      );
    }

    return days;
  };
  function generateGoogleCalendarLink(festival) {
    const startDate = festival.date.replace(/-/g, "");
    const endDate = startDate;
    const reminderMinutes = 1440; // 1 day before

    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      festival.name
    )}&dates=${startDate}/${endDate}&details=${encodeURIComponent(
      festival.description
    )}&reminder=${reminderMinutes}`;
  }
  return (
    <Container>
      <CalendarCard>
        <HeaderSection>
          <Title>🕉️ Hindu Calendar 2026</Title>
          <Subtitle>Sacred Festivals, Holidays & Auspicious Days</Subtitle>
        </HeaderSection>

        <NavigationBar>
          <NavButton
            onClick={() => setCurrentMonthIndex(currentMonthIndex - 1)}
            disabled={currentMonthIndex === 0}
          >
            <ChevronLeft size={24} />
          </NavButton>

          <MonthDisplay>
            <MonthName>{currentMonth.month}</MonthName>
          </MonthDisplay>

          <NavButton
            onClick={() => setCurrentMonthIndex(currentMonthIndex + 1)}
            disabled={currentMonthIndex === calendarData.length - 1}
          >
            <ChevronRight size={24} />
          </NavButton>
        </NavigationBar>

        <FilterContainer>
          <FilterChip
            active={filter === "all"}
            onClick={() => setFilter("all")}
          >
            All Events
          </FilterChip>
          <FilterChip
            active={filter === "holidays"}
            onClick={() => setFilter("holidays")}
          >
            Public Holidays
          </FilterChip>
          <FilterChip
            active={filter === "festivals"}
            onClick={() => setFilter("festivals")}
          >
            Festivals Only
          </FilterChip>
        </FilterContainer>

        <CalendarGrid>
          <WeekDaysRow>
            <WeekDay>Sun</WeekDay>
            <WeekDay>Mon</WeekDay>
            <WeekDay>Tue</WeekDay>
            <WeekDay>Wed</WeekDay>
            <WeekDay>Thu</WeekDay>
            <WeekDay>Fri</WeekDay>
            <WeekDay>Sat</WeekDay>
          </WeekDaysRow>
          <DaysGrid>{renderCalendarDays()}</DaysGrid>
        </CalendarGrid>

        <LegendContainer>
          <LegendItem>
            <LegendColor color="linear-gradient(135deg, #fabaa3 0%, #f8c993 100%)" />
            <span>Public Holiday</span>
          </LegendItem>
          <LegendItem>
            <LegendColor color="linear-gradient(135deg, #b4f7ae 0%, #bdf4ca 100%)" />
            <span>Festival</span>
          </LegendItem>
          <LegendItem>
            <LegendColor color="white" />
            <span>Regular Day</span>
          </LegendItem>
        </LegendContainer>

        <Footer>
          "Dharmo Rakshati Rakshitah" - Those who protect Dharma are protected
          by Dharma
        </Footer>
      </CalendarCard>

      {selectedEvent && (
        <>
          <Overlay onClick={() => setSelectedEvent(null)} />
          <SelectedEventModal>
            <ModalTitle>{selectedEvent.name}</ModalTitle>
            <ModalContent>
              <strong>Date:</strong> {currentMonth.month.split(" ")[0]}{" "}
              {selectedEvent.date}, {currentMonth.year}
              <br />
              <strong>Day:</strong> {selectedEvent.day}
              <br />
              <strong>Type:</strong>{" "}
              {selectedEvent.isHoliday ? "Public Holiday" : "Festival"}
            </ModalContent>
            <CloseButton onClick={() => generateGoogleCalendarLink(selectedEvent)}>
              Add to Google Calendar (1-Day Reminder)
            </CloseButton>
          </SelectedEventModal>
        </>
      )}
    </Container>
  );
};

export default Calendar;
