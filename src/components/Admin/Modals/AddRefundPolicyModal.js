"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiPlus,
  FiTrash2,
  FiChevronDown,
  FiChevronUp,
  FiEdit2,
  FiAlertCircle,
} from "react-icons/fi";
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

  &:disabled {
    background: #f3f4f6;
    cursor: not-allowed;
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

const InfoBanner = styled.div`
  background: #dbeafe;
  border: 1px solid #93c5fd;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  gap: 0.75rem;
  align-items: start;

  svg {
    color: #2563eb;
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  p {
    margin: 0;
    color: #1e40af;
    font-size: 0.875rem;
    line-height: 1.5;
  }
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

const CollapsedRuleItem = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  overflow: hidden;

  &:last-child {
    margin-bottom: 0;
  }
`;

const RuleItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #f9fafb;
  }
`;

const RuleItemSummary = styled.div`
  flex: 1;

  h4 {
    margin: 0 0 0.25rem 0;
    color: #374151;
    font-size: 0.95rem;
    font-weight: 600;
  }

  p {
    margin: 0;
    color: #6b7280;
    font-size: 0.85rem;
  }
`;

const RuleItemActions = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  padding: 0.5rem;
  border-radius: 0.375rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
    color: #374151;
  }

  &.delete {
    color: #dc2626;

    &:hover {
      background: #fee2e2;
    }
  }
`;

const RuleItemContent = styled(motion.div)`
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
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
  background: #fee2e2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 500;

  &:hover {
    background: #fecaca;
  }
`;

const TimeframeSelector = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const RadioOption = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 2px solid ${(props) => (props.checked ? "#0056d6" : "#e5e7eb")};
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  background: ${(props) => (props.checked ? "#eff6ff" : "white")};

  &:hover {
    border-color: #0056d6;
  }

  input[type="radio"] {
    accent-color: #0056d6;
  }

  span {
    font-weight: 500;
    color: ${(props) => (props.checked ? "#0056d6" : "#374151")};
  }
`;

const RuleFormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

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
  font-weight: 500;

  &:hover {
    background: #e5e7eb;
    border-color: #9ca3af;
    color: #374151;
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
  const [expandedRules, setExpandedRules] = useState(new Set());
  const [editingNewRule, setEditingNewRule] = useState(false);

  const templeId = getStoredTempleId();
  const isEditMode = !!policy;

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
    const newRule = {
      id: null,
      timeframe_type: "hours", // default to hours
      min_hours_before: "",
      min_days_before: "",
      refund_percent: "",
      notes: "",
    };

    setFormData((prev) => ({
      ...prev,
      refund_rules: [...prev.refund_rules, newRule],
    }));

    if (isEditMode) {
      setExpandedRules(
        new Set([...expandedRules, formData.refund_rules.length])
      );
    }
    setEditingNewRule(true);
  };

  const removeRule = (index) => {
    setFormData((prev) => ({
      ...prev,
      refund_rules: prev.refund_rules.filter((_, i) => i !== index),
    }));
    const newExpanded = new Set(expandedRules);
    newExpanded.delete(index);
    setExpandedRules(newExpanded);
  };

  const updateRule = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      refund_rules: prev.refund_rules.map((rule, i) =>
        i === index ? { ...rule, [field]: value } : rule
      ),
    }));
  };

  const toggleRuleExpansion = (index) => {
    const newExpanded = new Set(expandedRules);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRules(newExpanded);
  };

  const getRuleSummary = (rule) => {
    const timeframe = rule.min_hours_before
      ? `${rule.min_hours_before} hours before`
      : rule.min_days_before
      ? `${rule.min_days_before} days before`
      : "No timeframe set";

    const refund = rule.refund_percent
      ? `${rule.refund_percent}% refund`
      : "No refund percentage";

    return `${timeframe} • ${refund}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (formData.refund_rules.length === 0) {
      setError("Please add at least one refund rule");
      setLoading(false);
      return;
    }

    for (let i = 0; i < formData.refund_rules.length; i++) {
      const rule = formData.refund_rules[i];

      if (!rule.min_hours_before && !rule.min_days_before) {
        setError(`Rule ${i + 1}: Please specify either hours or days before`);
        setLoading(false);
        return;
      }

      if (rule.min_hours_before && rule.min_days_before) {
        setError(`Rule ${i + 1}: Please specify only hours OR days, not both`);
        setLoading(false);
        return;
      }

      if (!rule.refund_percent) {
        setError(`Rule ${i + 1}: Please specify refund percentage`);
        setLoading(false);
        return;
      }
    }

    try {
      const policyData = {
        call_mode: policy ? "UPDATE" : "ADD",
        temple_id: templeId,
        name: formData.name,
        is_default: formData.is_default,
        refund_rules: formData.refund_rules.map((rule) => ({
          ...rule,
          min_hours_before: rule.min_hours_before
            ? Number.parseInt(rule.min_hours_before)
            : 0,
          min_days_before: rule.min_days_before
            ? Number.parseInt(rule.min_days_before)
            : 0,
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

  const renderRuleForm = (rule, index) => {
    const timeframeType = rule.min_hours_before
      ? "hours"
      : rule.min_days_before
      ? "days"
      : rule.timeframe_type || "hours";

    return (
      <>
        <InfoBanner>
          <FiAlertCircle size={18} />
          <p>
            <strong>Choose ONE timeframe:</strong> Set cancellation time in
            either hours OR days before the booking. For example: "24 hours
            before" OR "2 days before" (not both).
          </p>
        </InfoBanner>

        <TimeframeSelector>
          <RadioOption
            checked={timeframeType === "hours"}
            onClick={() => {
              updateRule(index, "timeframe_type", "hours");
              updateRule(index, "min_days_before", "");
            }}
          >
            <input
              type="radio"
              name={`timeframe_${index}`}
              checked={timeframeType === "hours"}
              onChange={() => {}}
            />
            <span>Hours Before</span>
          </RadioOption>

          <RadioOption
            checked={timeframeType === "days"}
            onClick={() => {
              updateRule(index, "timeframe_type", "days");
              updateRule(index, "min_hours_before", "");
            }}
          >
            <input
              type="radio"
              name={`timeframe_${index}`}
              checked={timeframeType === "days"}
              onChange={() => {}}
            />
            <span>Days Before</span>
          </RadioOption>
        </TimeframeSelector>

        <RuleFormRow>
          <FormGroup>
            <Label>
              {timeframeType === "hours" ? "Hours Before *" : "Days Before *"}
            </Label>
            <Input
              type="number"
              value={
                timeframeType === "hours"
                  ? rule.min_hours_before
                  : rule.min_days_before
              }
              onChange={(e) => {
                const field =
                  timeframeType === "hours"
                    ? "min_hours_before"
                    : "min_days_before";
                updateRule(index, field, e.target.value);
              }}
              disabled={
                timeframeType === "hours" ? false : timeframeType !== "days"
              }
              min="0"
              placeholder={timeframeType === "hours" ? "e.g., 24" : "e.g., 2"}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Refund Percentage *</Label>
            <Input
              type="number"
              value={rule.refund_percent}
              onChange={(e) =>
                updateRule(index, "refund_percent", e.target.value)
              }
              min="0"
              max="100"
              step="0.01"
              placeholder="e.g., 50"
              required
            />
          </FormGroup>
        </RuleFormRow>

        <FormGroup>
          <Label>Notes (Optional)</Label>
          <Input
            type="text"
            value={rule.notes}
            onChange={(e) => updateRule(index, "notes", e.target.value)}
            placeholder="e.g., Processing fee of ₹50 will be deducted"
          />
        </FormGroup>
      </>
    );
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
                placeholder="e.g., Standard Refund Policy"
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

              {isEditMode ? (
                // Edit mode: Collapsed/Expandable view
                <>
                  {formData.refund_rules.map((rule, index) => (
                    <CollapsedRuleItem key={index}>
                      <RuleItemHeader
                        onClick={() => toggleRuleExpansion(index)}
                      >
                        <RuleItemSummary>
                          <h4>Rule {index + 1}</h4>
                          <p>{getRuleSummary(rule)}</p>
                        </RuleItemSummary>
                        <RuleItemActions>
                          <IconButton
                            type="button"
                            className="delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeRule(index);
                            }}
                          >
                            <FiTrash2 />
                          </IconButton>
                          <IconButton type="button">
                            {expandedRules.has(index) ? (
                              <FiChevronUp />
                            ) : (
                              <FiChevronDown />
                            )}
                          </IconButton>
                        </RuleItemActions>
                      </RuleItemHeader>

                      <AnimatePresence>
                        {expandedRules.has(index) && (
                          <RuleItemContent
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {renderRuleForm(rule, index)}
                          </RuleItemContent>
                        )}
                      </AnimatePresence>
                    </CollapsedRuleItem>
                  ))}
                </>
              ) : (
                // Add mode: Fully expanded view
                <>
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
                      {renderRuleForm(rule, index)}
                    </RuleItem>
                  ))}
                </>
              )}

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
