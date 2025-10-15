import React, { useState } from "react";

import styled, { keyframes } from "styled-components";
import {
  MdAccessTime,
  MdEdit,
  MdDelete,
  MdToggleOn,
  MdToggleOff,
} from "react-icons/md";
import { FiPlus, FiClock } from "react-icons/fi";
import TimeSlotModal from "./Modals/TimeSlotModal";
import Button from "../Reusecomponets/Button";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Styled Components
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif;
`;

const HeaderBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2.5rem;
  gap: 1.5rem;
  flex-wrap: wrap;
  animation: ${fadeIn} 0.6s ease-out;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Title = styled.h2`
  font-size: 2.25rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
  position: relative;
  letter-spacing: -0.5px;

  &::after {
    content: "";
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, #4361ee, #3a0ca3);
    border-radius: 2px;
  }
`;

const AddButton = styled(Button)`
  background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%) !important;
  color: #fff !important;
  border: none !important;
  font-size: 1rem !important;
  font-weight: 600 !important;
  padding: 0.85rem 1.75rem !important;
  border-radius: 12px !important;
  box-shadow: 0 4px 14px rgba(67, 97, 238, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(67, 97, 238, 0.5);
  }
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  margin-bottom: 2rem;
  animation: ${slideIn} 0.5s ease-out;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: 700px;
`;

const Th = styled.th`
  position: sticky;
  top: 0;
  background: #f8fafc;
  color: #64748b;
  font-weight: 600;
  padding: 1.25rem 1rem;
  text-align: left;
  z-index: 2;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #e2e8f0;
`;

const Td = styled.td`
  padding: 1.25rem 1rem;
  font-size: 1rem;
  color: #2d3748;
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.2s;
`;

const Tr = styled.tr`
  background: ${(props) => (props.$zebra ? "#fafbff" : "#fff")};
  transition: all 0.3s ease;

  &:hover {
    background: #f8faff;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

    ${Td} {
      background: transparent;
    }
  }

  &:last-child {
    ${Td} {
      border-bottom: none;
    }
  }
`;

const StatusBadge = styled.span`
  padding: 0.4rem 0.9rem;
  border-radius: 100px;
  font-size: 0.85rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;

  background: ${(props) =>
    props.$status === "Active"
      ? "rgba(72, 187, 120, 0.15)"
      : "rgba(239, 68, 68, 0.15)"};
  color: ${(props) => (props.$status === "Active" ? "#15803d" : "#dc2626")};

  &::before {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${(props) =>
      props.$status === "Active" ? "#22c55e" : "#ef4444"};
  }
`;

const TableActions = styled.div`
  display: flex;
  gap: 0.6rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #a0aec0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const EmptyIcon = styled.div`
  font-size: 3.5rem;
  color: #e2e8f0;
  margin-bottom: 1rem;
`;

const EmptyText = styled.p`
  font-size: 1.1rem;
  margin: 0;
  color: #718096;
`;

// Inline modal styles/components removed in favor of reusable TimeSlotModal

const ActionButton = styled.button`
  padding: 0.6rem 1.2rem;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  ${({ variant }) =>
    variant === "toggle" &&
    `
      background: ${(props) =>
        props.active === "Active"
          ? "rgba(72, 187, 120, 0.15)"
          : "rgba(239, 68, 68, 0.15)"};
      color: ${(props) => (props.active === "Active" ? "#15803d" : "#dc2626")};
      
      &:hover {
        background: ${(props) =>
          props.active === "Active"
            ? "rgba(72, 187, 120, 0.25)"
            : "rgba(239, 68, 68, 0.25)"};
        transform: translateY(-2px);
      }
    `}

  ${({ variant }) =>
    variant === "edit" &&
    `
      background: rgba(67, 97, 238, 0.15);
      color: #4361ee;
      
      &:hover {
        background: rgba(67, 97, 238, 0.25);
        transform: translateY(-2px);
      }
    `}
  
  ${({ variant }) =>
    variant === "delete" &&
    `
      background: rgba(239, 68, 68, 0.15);
      color: #dc2626;
      
      &:hover {
        background: rgba(239, 68, 68, 0.25);
        transform: translateY(-2px);
      }
    `}
`;

const TempleTimeSlots = ({
  timeSlots,
  onAddTimeSlot,
  onEditTimeSlot,
  onDeleteTimeSlot,
  onToggleTimeSlotStatus,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [form, setForm] = useState({ name: "", start: "", end: "" });

  const resetForm = () => {
    setForm({ name: "", start: "", end: "" });
    setEditingSlot(null);
  };

  const handleOpenForm = (slot = null) => {
    if (slot) {
      setForm({ name: slot.name, start: slot.start, end: slot.end });
      setEditingSlot(slot);
    } else {
      resetForm();
    }
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setTimeout(resetForm, 300);
  };

  const handleSubmit = (data) => {
    if (editingSlot) {
      onEditTimeSlot(editingSlot.id, { ...editingSlot, ...data });
    } else {
      onAddTimeSlot({ ...data });
    }
    handleCloseForm();
  };

  return (
    <PageContainer>
      <HeaderBar>
        <Title>Time Slots Management</Title>
        <AddButton onClick={() => handleOpenForm()} size="md">
          <FiPlus size={18} />
          Add New Time Slot
        </AddButton>
      </HeaderBar>

      <TableWrapper>
        <StyledTable>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Start Time</Th>
              <Th>End Time</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {timeSlots.length === 0 ? (
              <tr>
                <Td colSpan={5}>
                  <EmptyState>
                    <EmptyIcon>
                      <FiClock size={48} />
                    </EmptyIcon>
                    <EmptyText>No time slots defined yet</EmptyText>
                    <AddButton onClick={() => handleOpenForm()} size="md">
                      <FiPlus size={18} />
                      Create Your First Time Slot
                    </AddButton>
                  </EmptyState>
                </Td>
              </tr>
            ) : (
              timeSlots.map((slot, idx) => (
                <Tr key={slot.id} $zebra={idx % 2 === 1}>
                  <Td>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                      }}
                    >
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "10px",
                          background:
                            "linear-gradient(135deg, #4361ee, #0056d6)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                        }}
                      >
                        <MdAccessTime size={18} />
                      </div>
                      {slot.name}
                    </div>
                  </Td>
                  <Td>{slot.start}</Td>
                  <Td>{slot.end}</Td>
                  <Td>
                    <StatusBadge $status={slot.status}>
                      {slot.status}
                    </StatusBadge>
                  </Td>
                  <Td>
                    <TableActions>
                      <ActionButton
                        variant="toggle"
                        active={slot.status}
                        onClick={() => onToggleTimeSlotStatus(slot.id)}
                        title={
                          slot.status === "Active" ? "Deactivate" : "Activate"
                        }
                      >
                        {slot.status === "Active" ? (
                          <MdToggleOn size={18} />
                        ) : (
                          <MdToggleOff size={18} />
                        )}
                      </ActionButton>
                      <ActionButton
                        variant="edit"
                        onClick={() => handleOpenForm(slot)}
                        title="Edit"
                      >
                        <MdEdit size={16} />
                      </ActionButton>
                      <ActionButton
                        variant="delete"
                        onClick={() => onDeleteTimeSlot(slot.id)}
                        title="Delete"
                      >
                        <MdDelete size={16} />
                      </ActionButton>
                    </TableActions>
                  </Td>
                </Tr>
              ))
            )}
          </tbody>
        </StyledTable>
      </TableWrapper>

      <TimeSlotModal
        open={showForm}
        title={editingSlot ? "Edit Time Slot" : "Add New Time Slot"}
        submitLabel={editingSlot ? "Update Time Slot" : "Add Time Slot"}
        submitColor="#4361ee"
        initialValues={form}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
      />
    </PageContainer>
  );
};

export default TempleTimeSlots;
