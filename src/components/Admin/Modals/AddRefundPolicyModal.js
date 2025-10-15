"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FiX, FiPlus, FiTrash2 } from "react-icons/fi";
import { processRefundPolicyData } from "../../../services/templeServices";
import { getStoredTempleId } from "../../../services/authServices";

const ModalOverlay = styled(motion.div)`
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
  padding: 2rem;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  background: linear-gradient(135deg, #0056d6 0%, #0040a0 100%);
  color: white;
  padding: 2rem;
  border-radius: 1rem 1rem 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ModalBody = styled.div`
  padding: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #374151;
  font-weight: 600;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #0056d6;
    box-shadow: 0 0 0 3px rgba(0, 86, 214, 0.1);
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  input[type="checkbox"] {
    width: 1.25rem;
    height: 1.25rem;
    accent-color: #0056d6;
  }

  label {
    margin: 0;
    font-weight: 500;
  }
`;

const RulesSection = styled.div`
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  background: #f9fafb;
`;

const RuleItem = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const RuleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  h4 {
    margin: 0;
    color: #374151;
    font-size: 0.9rem;
  }
`;

const RemoveRuleButton = styled.button`
  background: #e0f2fe;
  border: 1px solid #bae6fd;
  color: #0369a1;
  padding: 0.5rem;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  &:hover {
    background: #bae6fd;
  }
`;

const RuleFormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const AddRuleButton = styled.button`
  background: #f3f4f6;
  border: 2px dashed #d1d5db;
  color: #6b7280;
  padding: 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  width: 100%;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: #e5e7eb;
    border-color: #9ca3af;
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: 2rem;
  border-top: 1px solid #e5e7eb;
`;

const Button = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  border: none;

  &.primary {
    background: linear-gradient(135deg, #0056d6 0%, #0040a0 100%);
    color: white;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  &.secondary {
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;

    &:hover {
      background: #e5e7eb;
    }
  }
`;

const ErrorMessage = styled.div`
  background: #fee2e2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  border: 1px solid #fecaca;
  margin-bottom: 1rem;
`;

const AddRefundPolicyModal = ({ policy, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    is_default: false,
    refund_rules: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const templeId = getStoredTempleId();

  useEffect(() => {
    if (policy) {
      setFormData({
        name: policy.name || "",
        is_default: policy.is_default || false,
        refund_rules: policy.refund_rules || [],
      });
    }
  }, [policy]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
  };

  const addRule = () => {
    setFormData((prev) => ({
      ...prev,
      refund_rules: [
        ...prev.refund_rules,
        {
          id: null,
          min_hours_before: "",
          min_days_before: "",
          refund_percent: "",
          notes: "",
        },
      ],
    }));
  };

  const removeRule = (index) => {
    setFormData((prev) => ({
      ...prev,
      refund_rules: prev.refund_rules.filter((_, i) => i !== index),
    }));
  };

  const updateRule = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      refund_rules: prev.refund_rules.map((rule, i) =>
        i === index ? { ...rule, [field]: value } : rule
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const policyData = {
        call_mode: policy ? "UPDATE" : "ADD",
        temple_id: templeId,
        name: formData.name,
        is_default: formData.is_default,
        refund_rules: formData.refund_rules.map((rule) => ({
          ...rule,
          min_hours_before: Number.parseInt(rule.min_hours_before),
          min_days_before: Number.parseInt(rule.min_days_before),
          refund_percent: Number.parseFloat(rule.refund_percent),
        })),
      };

      if (policy) {
        policyData.refund_policy_id = policy.id;
      }

      await processRefundPolicyData(policyData);
      onSuccess();
    } catch (err) {
      setError(err.message || "Failed to save policy");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalOverlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <ModalContent
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
      >
        <ModalHeader>
          <h2>{policy ? "Edit Refund Policy" : "Add Refund Policy"}</h2>
          <CloseButton onClick={onClose}>
            <FiX />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <Form onSubmit={handleSubmit}>
            {error && <ErrorMessage>{error}</ErrorMessage>}

            <FormGroup>
              <Label htmlFor="name">Policy Name *</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter the policy name"
              />
            </FormGroup>

            <CheckboxGroup>
              <input
                type="checkbox"
                id="is_default"
                name="is_default"
                checked={formData.is_default}
                onChange={handleChange}
              />
              <Label htmlFor="is_default">Set as default policy</Label>
            </CheckboxGroup>

            <RulesSection>
              <h3 style={{ margin: "0 0 1rem 0", color: "#374151" }}>
                Refund Rules
              </h3>

              {formData.refund_rules.map((rule, index) => (
                <RuleItem key={index}>
                  <RuleHeader>
                    <h4>Rule {index + 1}</h4>
                    <RemoveRuleButton
                      type="button"
                      onClick={() => removeRule(index)}
                    >
                      <FiTrash2 />
                      Remove
                    </RemoveRuleButton>
                  </RuleHeader>

                  <RuleFormRow>
                    <FormGroup>
                      <Label>Hours Before</Label>
                      <Input
                        style={{ maxWidth: "200px" }}
                        type="number"
                        value={rule.min_hours_before}
                        onChange={(e) =>
                          updateRule(index, "min_hours_before", e.target.value)
                        }
                        min="0"
                        placeholder="Enter hours before"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Days Before</Label>
                      <Input
                        style={{ maxWidth: "200px" }}
                        type="number"
                        value={rule.min_days_before}
                        onChange={(e) =>
                          updateRule(index, "min_days_before", e.target.value)
                        }
                        min="0"
                        placeholder="Enter days before"
                      />
                    </FormGroup>
                  </RuleFormRow>

                  <FormGroup>
                    <Label>Refund Percentage</Label>
                    <Input
                      type="number"
                      value={rule.refund_percent}
                      onChange={(e) =>
                        updateRule(index, "refund_percent", e.target.value)
                      }
                      min="0"
                      max="100"
                      step="0.01"
                      placeholder="Enter refund percentage"
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Notes</Label>
                    <Input
                      type="text"
                      value={rule.notes}
                      onChange={(e) =>
                        updateRule(index, "notes", e.target.value)
                      }
                      placeholder="Enter additional notes"
                    />
                  </FormGroup>
                </RuleItem>
              ))}

              <AddRuleButton type="button" onClick={addRule}>
                <FiPlus />
                Add Refund Rule
              </AddRuleButton>
            </RulesSection>
          </Form>
        </ModalBody>

        <ModalActions>
          <Button
            type="button"
            className="secondary"
            onClick={onClose}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="primary"
            disabled={loading}
            onClick={handleSubmit}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? "Saving..." : policy ? "Update Policy" : "Create Policy"}
          </Button>
        </ModalActions>
      </ModalContent>
    </ModalOverlay>
  );
};

export default AddRefundPolicyModal;
