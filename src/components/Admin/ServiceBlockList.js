import React, { useState, useEffect, use } from "react";
import styled from "styled-components";
import BlockDateModal from "./Modals/BlockDateModal";
import {
  getserviceblocklist,
  proceesblockdate,
} from "../../services/productServices";
import { toAPIDate } from "../../services/serviceUtils";
import DataTable from "./AdminLayout/DataTable";
import PageContainer from "./AdminLayout/PageContainer.js";
import { FaCalendarTimes } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import { useLocation } from "react-router-dom";

const Container = styled.div`
  padding: 24px;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
`;

const AddButton = styled.button`
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

const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;

  &.active {
    background: #dcfce7;
    color: #166534;
  }

  &.inactive {
    background: #fef3c7;
    color: #92400e;
  }

  &.completed {
    background: #dbeafe;
    color: #1e40af;
  }
`;

const ServiceBlockList = () => {
  const [blockList, setBlockList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingBlock, setEditingBlock] = useState(null);
  const templeId = localStorage.getItem("templeId");
  const routerLocation = useLocation();
  const params = new URLSearchParams(routerLocation.search);
  const serviceid = params.get("serviceid");
  useEffect(() => {
    if (serviceid) {
      handleAddBlock();
    }
  }, []);
  // Fetch block list
  const fetchBlockList = async () => {
    setLoading(true);
    try {
      const data = await getserviceblocklist(templeId);
      setBlockList(data.data || []);
    } catch (error) {
      console.error("Error fetching block list:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlockList();
  }, []);

  const handleAddBlock = () => {
    setEditingBlock(null);
    setShowModal(true);
  };

  const handleEditBlock = (block) => {
    setEditingBlock(block);
    setShowModal(true);
  };

  const handleDeleteBlock = async (block) => {
    if (window.confirm("Are you sure you want to delete this block?")) {
      try {
        await proceesblockdate({
          service_data: {
            call_mode: "DELETE",
            id: block.id,
            service_id: block.service_id,
          },
        });
        fetchBlockList(); // Refresh list
      } catch (error) {
        console.error("Error deleting block:", error);
        alert("Failed to delete block");
      }
    }
  };

  const handleModalSubmit = async (formData) => {
    console.log(formData, "formData");
    try {
      const payload = {
        service_data: {
          call_mode: editingBlock ? "UPDATE" : "ADD",
          service_id: formData.service_id,
          from_date: toAPIDate(formData.from_date),
          to_date: toAPIDate(formData.to_date),
          start_time: formData.start_time || "",
          end_time: formData.end_time || "",
          day_of_week: formData.day_of_week || null,
          is_completed: formData.is_completed || false,
          ...(editingBlock && { id: editingBlock.id }),
        },
      };

      await proceesblockdate(payload);
      setShowModal(false);
      fetchBlockList(); // Refresh list
    } catch (error) {
      console.error("Error saving block:", error);
      alert("Failed to save block");
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatus = (block) => {
    if (block.is_completed) return "completed";
    return block.is_active ? "active" : "inactive";
  };

  const getStatusText = (block) => {
    if (block.is_completed) return "Completed";
    return block.is_active ? "Active" : "Inactive";
  };

  // Define columns for DataTable
  const columns = [
    {
      key: "service_name",
      title: "Service Name",
      render: (value, item) => <strong>{value}</strong>,
    },
    {
      key: "service_id",
      title: "Service ID",
    },
    {
      key: "from_date",
      title: "From Date",
      render: (value) => formatDate(value),
    },
    {
      key: "to_date",
      title: "To Date",
      render: (value) => formatDate(value),
    },
    {
      key: "time_range",
      title: "Time",
      render: (_, item) =>
        item.start_time && item.end_time
          ? `${item.start_time} - ${item.end_time}`
          : "All Day",
    },
    {
      key: "day_of_week",
      title: "Day of Week",
      render: (value) => value || "-",
    },
    {
      key: "status",
      title: "Status",
      render: (_, item) => (
        <StatusBadge className={getStatus(item)}>
          {getStatusText(item)}
        </StatusBadge>
      ),
    },
  ];

  return (
    <Container>
      <PageContainer
        title="Service Block Dates"
        description="Manage advance booking policies for your temple services"
        icon={<FaCalendarTimes />}
        gradient="linear-gradient(135deg, #0056d6 0%, #0a4db4 100%)"
        actions={
          <AddButton
            onClick={handleAddBlock}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiPlus />
            Add Block Date
          </AddButton>
        }
      >
        <DataTable
          data={blockList}
          columns={columns}
          loading={loading}
          onEdit={handleEditBlock}
          onDelete={handleDeleteBlock}
          searchable={true}
          emptyTitle="No Block Dates Found"
          emptyDescription="There are no blocked dates to display at this time."
          spiritual={false}
          isDiscountButtonShow={false}
        />
      </PageContainer>
      {showModal && (
        <BlockDateModal
          block={editingBlock}
          onSubmit={handleModalSubmit}
          onClose={() => setShowModal(false)}
          serviceid={serviceid}
        />
      )}
    </Container>
  );
};

export default ServiceBlockList;
