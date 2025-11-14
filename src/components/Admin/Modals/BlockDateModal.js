import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { formatDateForInput } from "../../../services/serviceUtils";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const ModalTitle = styled.h2`
  color: #1f2937;
  font-size: 24px;
  font-weight: 700;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
  padding: 4px;
  border-radius: 4px;

  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #374151;
  font-size: 14px;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`;

const Select = styled.select`
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
`;

const TimeRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &.primary {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    color: white;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }
  }

  &.secondary {
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #e5e7eb;

    &:hover {
      background: #e5e7eb;
    }
  }
`;

const BlockDateModal = ({ block, onSubmit, onClose, serviceid }) => {
  const [formData, setFormData] = useState({
    service_id: "",
    from_date: "",
    to_date: "",
    start_time: "",
    end_time: "",
    day_of_week: "",
    is_completed: false,
  });

  useEffect(() => {
    if (block) {
      setFormData({
        service_id: block.service_id || "",
        from_date: formatDateForInput(block.from_date) || "",
        to_date: formatDateForInput(block.to_date) || "",
        start_time: block.start_time || "",
        end_time: block.end_time || "",
        day_of_week: block.day_of_week || "",
        is_completed: block.is_completed || false,
      });
    }
  }, [block]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const daysOfWeek = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            {block ? "Edit Block Date" : "Add Block Date"}
          </ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Service ID *</Label>
            <Input
              type="text"
              name="service_id"
              value={formData.service_id || serviceid}
              onChange={handleChange}
              placeholder="e.g., T_0000010_S_00037"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>From Date *</Label>
            <Input
              type="date"
              name="from_date"
              value={formData.from_date}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>To Date *</Label>
            <Input
              type="date"
              name="to_date"
              value={formData.to_date}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Time Range (Optional)</Label>
            <TimeRow>
              <Input
                type="time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                placeholder="Start Time"
              />
              <Input
                type="time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                placeholder="End Time"
              />
            </TimeRow>
          </FormGroup>

          <FormGroup>
            <Label>Day of Week (Optional)</Label>
            <Select
              name="day_of_week"
              value={formData.day_of_week}
              onChange={handleChange}
            >
              <option value="">Select a day</option>
              {daysOfWeek.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </Select>
          </FormGroup>

          <CheckboxGroup>
            <Checkbox
              type="checkbox"
              name="is_completed"
              checked={formData.is_completed}
              onChange={handleChange}
              id="is_completed"
            />
            <Label htmlFor="is_completed">Mark as completed</Label>
          </CheckboxGroup>

          <ButtonGroup>
            <Button type="button" className="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="primary">
              {block ? "Update" : "Add"} Block Date
            </Button>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default BlockDateModal;
