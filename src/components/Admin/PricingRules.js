"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrendingUp, FiPlus } from "react-icons/fi";
import {
  getPricingRuleList,
  processPricingRuleData,
} from "../../services/templeServices";
import { getStoredTempleId } from "../../services/authServices";
import PageContainer from "./AdminLayout/PageContainer";
import AddPricingRuleModal from "./Modals/AddPricingRuleModal";
import DataTable from "./AdminLayout/DataTable";

const AddButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
  }
`;

const StatusText = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(props) => (props.active ? "#000000" : "#991b1b")};
`;

const TableContainer = styled.div`
  overflow-x: auto;
  width: 100%;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

const PriceCell = styled.div`
  font-weight: 500;
  white-space: nowrap;
`;

const DateRangeCell = styled.div`
  font-size: 0.875rem;
  line-height: 1.2;
  white-space: nowrap;
`;

const TimeRangeCell = styled.div`
  font-size: 0.875rem;
  white-space: nowrap;
`;

const PricingRules = () => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);

  const templeId = getStoredTempleId();

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      setLoading(true);
      const response = await getPricingRuleList();
      // Filter by temple_id if needed
      const filteredRules = response.filter(
        (rule) => !templeId || rule.temple_id.toString() === templeId
      );
      setRules(filteredRules);
    } catch (error) {
      console.error("Error fetching rules:", error);
      setRules([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRule = () => {
    setSelectedRule(null);
    setShowAddModal(true);
  };

  const handleEditRule = (rule) => {
    setSelectedRule(rule);
    setShowAddModal(true);
  };

  const handleDeleteRule = async (rule) => {
    if (window.confirm(`Are you sure you want to delete "${rule.name}"?`)) {
      try {
        await processPricingRuleData({
          call_mode: "DELETE",
          temple_id: templeId,
          pricing_rule_id: rule.id,
        });
        fetchRules();
      } catch (error) {
        console.error("Error deleting rule:", error);
        alert("Failed to delete rule");
      }
    }
  };

  const handleModalClose = () => {
    setShowAddModal(false);
    setSelectedRule(null);
  };

  const handleRuleSaved = () => {
    fetchRules();
    handleModalClose();
  };

  const getDayName = (dayNumber) => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days[dayNumber] || "All";
  };

  const formatPrice = (value) => {
    if (!value || value === "null") return "Unavailable";
    return `₹${Number.parseFloat(value).toLocaleString("en-IN")}`;
  };

  const formatDateRange = (startDate, endDate) => {
    if (!startDate || startDate === "null" || !endDate || endDate === "null") {
      return "Unavailable";
    }

    // Format dates to be more compact
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      });
    };

    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  const formatTimeRange = (startTime, endTime) => {
    if (!startTime || startTime === "null" || !endTime || endTime === "null") {
      return "Unavailable";
    }

    // Format time to be more readable
    const formatTime = (timeString) => {
      if (!timeString) return "";
      return timeString.slice(0, 5); // Just show HH:MM
    };

    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  };

  const columns = [
    {
      key: "name",
      title: "Rule Name",
      width: "140px",
      render: (value) => (
        <div style={{ fontWeight: 600, color: "#1f2937" }}>{value}</div>
      ),
    },
    {
      key: "day_of_week",
      title: "Day",
      width: "70px",
      render: (value) => getDayName(value),
    },
    {
      key: "start_time",
      title: "Time",
      width: "120px",
      render: (value, item) => (
        <TimeRangeCell>{formatTimeRange(value, item.end_time)}</TimeRangeCell>
      ),
    },
    {
      key: "date_price",
      title: "Date Price",
      width: "90px",
      render: (value) => <PriceCell>{formatPrice(value)}</PriceCell>,
    },
    {
      key: "time_price",
      title: "Time Price",
      width: "90px",
      render: (value) => <PriceCell>{formatPrice(value)}</PriceCell>,
    },
    {
      key: "week_day_price",
      title: "Weekday Price",
      width: "100px",
      render: (value) => <PriceCell>{formatPrice(value)}</PriceCell>,
    },
    {
      key: "start_date",
      title: "Date Range",
      width: "140px",
      render: (value, item) => (
        <DateRangeCell>{formatDateRange(value, item.end_date)}</DateRangeCell>
      ),
    },
    {
      key: "is_active",
      title: "Status",
      width: "80px",
      render: (value) => (
        <StatusText active={value}>{value ? "Active" : "Inactive"}</StatusText>
      ),
    },
  ];

  return (
    <>
      <PageContainer
        title="Pricing Rules"
        description="Manage dynamic pricing rules for different times, dates, and days"
        icon={<FiTrendingUp />}
        gradient="linear-gradient(135deg, #0056d6 0%, #0a4db4 100%)"
        actions={
          <AddButton
            onClick={handleAddRule}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiPlus />
            Add Rule
          </AddButton>
        }
      >
        <TableContainer>
          <DataTable
            data={rules}
            columns={columns}
            loading={loading}
            onEdit={handleEditRule}
            onDelete={handleDeleteRule}
            emptyIcon="📊"
            emptyTitle="No Pricing Rules Found"
            emptyDescription="Create your first pricing rule to manage dynamic pricing."
          />
        </TableContainer>
      </PageContainer>

      <AnimatePresence>
        {showAddModal && (
          <AddPricingRuleModal
            rule={selectedRule}
            onClose={handleModalClose}
            onSuccess={handleRuleSaved}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default PricingRules;
