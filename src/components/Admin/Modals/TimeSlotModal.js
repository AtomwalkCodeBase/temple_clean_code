import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import Button from "../../Reusecomponets/Button";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  animation: ${fadeIn} 0.3s ease-out;
`;

const ModalCard = styled.form`
  background: #fff;
  border-radius: 20px;
  padding: 2.5rem;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: relative;
  animation: ${slideIn} 0.4s cubic-bezier(0.16, 1, 0.3, 1);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
`;

const ModalClose = styled.button`
  background: #f7fafc;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #718096;
  font-size: 1.5rem;
  cursor: pointer;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.95rem;
  color: #4a5568;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.9rem 1rem;
  border-radius: 12px;
  border: 1.5px solid #e2e8f0;
  font-size: 1rem;
  background: #fff;
  transition: all 0.3s;
  &:focus {
    outline: none;
    border-color: #4361ee;
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.15);
  }
  &::placeholder {
    color: #a0aec0;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 0.5rem;
`;

const ErrorText = styled.div`
  color: #e53e3e;
  font-size: 0.9rem;
`;

const TimeInputs = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const TimeSlotModal = ({
  open,
  title = "Add New Time Slot",
  submitLabel = "Add Time Slot",
  submitColor = "#4361ee",
  initialValues = { name: "", start: "", end: "" },
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState(initialValues);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm(initialValues || { name: "", start: "", end: "" });
      setError("");
    }
  }, [open, initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!form.name.trim() || !form.start || !form.end) {
      setError("All fields are required.");
      return;
    }
    if (form.start >= form.end) {
      setError("Start time must be before end time.");
      return;
    }
    onSubmit && onSubmit(form);
  };

  if (!open) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalCard onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <ModalClose type="button" onClick={onClose} aria-label="Close">
            ✕
          </ModalClose>
        </ModalHeader>
        <Field>
          <Label>Time Slot Name</Label>
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g., Morning Puja"
          />
        </Field>
        <TimeInputs>
          <Field>
            <Label>Start Time</Label>
            <Input
              name="start"
              type="time"
              value={form.start}
              onChange={handleChange}
            />
          </Field>
          <Field>
            <Label>End Time</Label>
            <Input
              name="end"
              type="time"
              value={form.end}
              onChange={handleChange}
            />
          </Field>
        </TimeInputs>
        {error && <ErrorText>{error}</ErrorText>}
        <Actions>
          <Button
            onClick={onClose}
            variant="outline"
            color="gray"
            size="md"
            type="button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            color={submitColor}
            size="md"
            type="submit"
          >
            {submitLabel}
          </Button>
        </Actions>
      </ModalCard>
    </ModalOverlay>
  );
};

export default TimeSlotModal;
