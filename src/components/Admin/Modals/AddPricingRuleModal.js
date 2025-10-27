"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiClock, FiCalendar, FiChevronRight } from "react-icons/fi";
import {
  processPricingRuleData,
  getWeekDayList,
} from "../../../services/templeServices";
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
  background: linear-gradient(135deg, #0056d6 0%, #0041a3 100%);
  color: white;
  padding: 2rem;
  border-radius: 1rem 1rem 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;

  h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
  }
`;

const ProgressIndicator = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${(props) =>
      props.step === 1 ? "33%" : props.step === 2 ? "66%" : "100%"};
    background: white;
    transition: width 0.3s ease;
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
  z-index: 10;

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

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
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

const Select = styled.select`
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  background: white;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #0056d6;
    box-shadow: 0 0 0 3px rgba(0, 86, 214, 0.1);
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: ${(props) =>
    props.step === 1 ? "flex-end" : "space-between"};
  padding: 2rem;
  border-top: 1px solid #e5e7eb;
`;

const Button = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &.primary {
    background: linear-gradient(135deg, #0056d6 0%, #0041a3 100%);
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

  &.back {
    background: transparent;
    color: #0056d6;
    border: 1px solid #0056d6;

    &:hover {
      background: rgba(0, 86, 214, 0.1);
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

const RuleTypeSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const RuleTypeCard = styled(motion.div)`
  border: 2px solid ${(props) => (props.selected ? "#0056d6" : "#e5e7eb")};
  background: ${(props) =>
    props.selected ? "rgba(0, 86, 214, 0.05)" : "white"};
  border-radius: 0.75rem;
  padding: 1.5rem;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s ease;

  &:hover {
    border-color: #0056d6;
    transform: translateY(-2px);
  }

  svg {
    font-size: 2rem;
    color: #0056d6;
    margin-bottom: 0.75rem;
  }

  h3 {
    margin: 0 0 0.5rem 0;
    color: #374151;
    font-size: 1.1rem;
  }

  p {
    margin: 0;
    color: #6b7280;
    font-size: 0.9rem;
  }
`;

const EditBadge = styled.div`
  background: #10b981;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 0.5rem;
`;

const StepIndicator = styled.div`
  background: #f3f4f6;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;

  span {
    font-weight: 600;
    color: #374151;
    font-size: 0.9rem;
  }
`;

const AddPricingRuleModal = ({ rule, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [ruleType, setRuleType] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    start_time: "",
    end_time: "",
    day_of_week: "",
    start_date: "",
    end_date: "",
    date_price: "",
    time_price: "",
    week_day_price: "",
    excluded_days_price: "",
  });
  const [weekDays, setWeekDays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const templeId = getStoredTempleId();
  console.log("Temple ID:", templeId);

  // Convert various API date formats (e.g., 15-Aug-2025, 15-08-2025, 2025-08-15)
  // into HTML input date value format: YYYY-MM-DD
  const toInputDate = (value) => {
    if (!value) return "";
    const str = String(value).trim();
    // Already in input format
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
    // DD-MM-YYYY numeric
    if (/^\d{2}-\d{2}-\d{4}$/.test(str)) {
      const [dd, mm, yyyy] = str.split("-");
      return `${yyyy}-${mm}-${dd}`;
    }
    // DD-MMM-YYYY (month short)
    if (/^\d{2}-[A-Za-z]{3}-\d{4}$/.test(str)) {
      const [dd, mon, yyyy] = str.split("-");
      const months = {
        JAN: "01",
        FEB: "02",
        MAR: "03",
        APR: "04",
        MAY: "05",
        JUN: "06",
        JUL: "07",
        AUG: "08",
        SEP: "09",
        OCT: "10",
        NOV: "11",
        DEC: "12",
      };
      const mm = months[mon.toUpperCase()] || "01";
      return `${yyyy}-${mm}-${dd}`;
    }
    // Fallback: try Date parsing
    const d = new Date(str);
    if (!Number.isNaN(d.getTime())) {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    }
    return "";
  };

  useEffect(() => {
    fetchWeekDays();
    if (rule) {
      // Determine the rule type but DON'T automatically go to step 2
      const detectedRuleType =
        rule.start_time && rule.end_time
          ? "timing"
          : rule.day_of_week
          ? "day"
          : rule.start_date && rule.end_date
          ? "date_range"
          : null;

      setRuleType(detectedRuleType);

      setFormData({
        name: rule.name || "",
        start_time: rule.start_time || "",
        end_time: rule.end_time || "",
        day_of_week: rule.day_of_week?.toString() || "",
        start_date: toInputDate(rule.start_date),
        end_date: toInputDate(rule.end_date),
        date_price: rule.date_price || "",
        time_price: rule.time_price || "",
        week_day_price: rule.week_day_price || "",
        excluded_days_price: rule.excluded_days_price || "",
      });
    }
  }, [rule]);

  const fetchWeekDays = async () => {
    try {
      const response = await getWeekDayList();
      setWeekDays(response);
    } catch (error) {
      console.error("Error fetching week days:", error);
    }
  };

  const handleRuleTypeSelect = (type) => {
    setRuleType(type);
    setStep(2);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const formatDateForAPI = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date
      .toLocaleString("en-US", { month: "short" })
      .toUpperCase();
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleSubmit = async (e) => {
    console.log("=== HANDLE SUBMIT CALLED ===");
    e.preventDefault();
    console.log("Form submitted!", { ruleType, formData, step });

    // Validate required fields based on rule type
    if (!ruleType) {
      console.log("Validation failed: No rule type selected");
      setError("Please select a rule type");
      return;
    }

    if (!formData.name.trim()) {
      console.log("Validation failed: No rule name");
      setError("Please enter a rule name");
      return;
    }

    // Validate rule-specific fields
    if (ruleType === "timing") {
      console.log("Validating timing fields:", {
        start_time: formData.start_time,
        end_time: formData.end_time,
        time_price: formData.time_price,
      });
      if (!formData.start_time || !formData.end_time || !formData.time_price) {
        console.log("Validation failed: Missing timing fields");
        setError("Please fill in all timing fields");
        return;
      }
    }

    if (ruleType === "day") {
      console.log("Validating day fields:", {
        day_of_week: formData.day_of_week,
        week_day_price: formData.week_day_price,
      });
      if (!formData.day_of_week || !formData.week_day_price) {
        console.log("Validation failed: Missing day fields");
        setError("Please fill in all day fields");
        return;
      }
    }

    if (ruleType === "date_range") {
      console.log("Validating date range fields:", {
        start_date: formData.start_date,
        end_date: formData.end_date,
        date_price: formData.date_price,
      });
      if (!formData.start_date || !formData.end_date || !formData.date_price) {
        console.log("Validation failed: Missing date range fields");
        setError("Please fill in all date range fields");
        return;
      }
    }

    console.log("All validations passed, proceeding to API call");
    setLoading(true);
    setError("");

    try {
      const ruleData = {
        call_mode: rule ? "UPDATE" : "ADD",
        temple_id: templeId,
        name: formData.name,
        start_time: ruleType === "timing" ? formData.start_time : null,
        end_time: ruleType === "timing" ? formData.end_time : null,
        day_of_week:
          ruleType === "day" && formData.day_of_week
            ? Number.parseInt(formData.day_of_week)
            : null,
        start_date:
          ruleType === "date_range"
            ? formatDateForAPI(formData.start_date)
            : null,
        end_date:
          ruleType === "date_range"
            ? formatDateForAPI(formData.end_date)
            : null,
        date_price:
          ruleType === "date_range"
            ? Number.parseFloat(formData.date_price)
            : 0,
        time_price:
          ruleType === "timing" ? Number.parseFloat(formData.time_price) : 0,
        week_day_price:
          ruleType === "day" ? Number.parseFloat(formData.week_day_price) : 0,
        excluded_days_price:
          Number.parseFloat(formData.excluded_days_price) || 0,
      };

      if (rule) {
        ruleData.pricing_rule_id = rule.id;
      }

      console.log("Sending pricing rule data:", ruleData);
      console.log("Calling processPricingRuleData API...");
      const response = await processPricingRuleData(ruleData);
      console.log("API response:", response);
      onSuccess();
    } catch (err) {
      console.error("API error:", err);
      setError(err.message || "Failed to save pricing rule");
    } finally {
      setLoading(false);
    }
  };

  const renderRuleTypeSelection = () => (
    <>
      <StepIndicator>
        <span>Step 1 of 2: Select Rule Type</span>
      </StepIndicator>

      <RuleTypeSelector>
        <RuleTypeCard
          selected={ruleType === "timing"}
          onClick={() => handleRuleTypeSelect("timing")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FiClock />
          <h3>Timing Price</h3>
          <p>Set prices based on specific time intervals</p>
          {rule && ruleType === "timing" && (
            <EditBadge>Currently Editing</EditBadge>
          )}
        </RuleTypeCard>

        <RuleTypeCard
          selected={ruleType === "day"}
          onClick={() => handleRuleTypeSelect("day")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FiCalendar />
          <h3>Day Price</h3>
          <p>Set prices for specific days of the week</p>
          {rule && ruleType === "day" && (
            <EditBadge>Currently Editing</EditBadge>
          )}
        </RuleTypeCard>

        <RuleTypeCard
          selected={ruleType === "date_range"}
          onClick={() => handleRuleTypeSelect("date_range")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FiCalendar />
          <h3>Date Range Price</h3>
          <p>Set prices for specific date ranges</p>
          {rule && ruleType === "date_range" && (
            <EditBadge>Currently Editing</EditBadge>
          )}
        </RuleTypeCard>
      </RuleTypeSelector>
    </>
  );

  const renderTimingPriceForm = () => (
    <>
      <StepIndicator>
        <span>Step 2 of 2: Configure Timing Price Rule</span>
      </StepIndicator>

      <FormGroup>
        <Label htmlFor="name">Rule Name *</Label>
        <Input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="e.g., Evening Premium Hours"
        />
      </FormGroup>

      <FormRow>
        <FormGroup>
          <Label htmlFor="start_time">Start Time *</Label>
          <Input
            type="time"
            id="start_time"
            name="start_time"
            value={formData.start_time}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="end_time">End Time *</Label>
          <Input
            type="time"
            id="end_time"
            name="end_time"
            value={formData.end_time}
            onChange={handleChange}
            required
          />
        </FormGroup>
      </FormRow>

      <FormGroup>
        <Label htmlFor="time_price">Time Price (₹) *</Label>
        <Input
          type="number"
          id="time_price"
          name="time_price"
          value={formData.time_price}
          onChange={handleChange}
          min="0"
          step="0.01"
          placeholder="200"
          required
        />
      </FormGroup>
    </>
  );

  const renderDayPriceForm = () => (
    <>
      <StepIndicator>
        <span>Step 2 of 2: Configure Day Price Rule</span>
      </StepIndicator>

      <FormGroup>
        <Label htmlFor="name">Rule Name *</Label>
        <Input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="e.g., Weekend Pricing"
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="day_of_week">Day of Week *</Label>
        <Select
          id="day_of_week"
          name="day_of_week"
          value={formData.day_of_week}
          onChange={handleChange}
          required
        >
          <option value="">Select a day</option>
          {weekDays.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </FormGroup>

      <FormGroup>
        <Label htmlFor="week_day_price">Week Day Price (₹) *</Label>
        <Input
          type="number"
          id="week_day_price"
          name="week_day_price"
          value={formData.week_day_price}
          onChange={handleChange}
          min="0"
          step="0.01"
          placeholder="300"
          required
        />
      </FormGroup>
    </>
  );

  const renderDateRangePriceForm = () => (
    <>
      <StepIndicator>
        <span>Step 2 of 2: Configure Date Range Price Rule</span>
      </StepIndicator>

      <FormGroup>
        <Label htmlFor="name">Rule Name *</Label>
        <Input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="e.g., Festival Season Pricing"
        />
      </FormGroup>

      <FormRow>
        <FormGroup>
          <Label htmlFor="start_date">Start Date *</Label>
          <Input
            type="date"
            id="start_date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="end_date">End Date *</Label>
          <Input
            type="date"
            id="end_date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            required
          />
        </FormGroup>
      </FormRow>

      <FormGroup>
        <Label htmlFor="date_price">Date Price (₹) *</Label>
        <Input
          type="number"
          id="date_price"
          name="date_price"
          value={formData.date_price}
          onChange={handleChange}
          min="0"
          step="0.01"
          placeholder="500"
          required
        />
      </FormGroup>
    </>
  );

  const renderFormContent = () => {
    if (step === 1) {
      return renderRuleTypeSelection();
    }

    switch (ruleType) {
      case "timing":
        return renderTimingPriceForm();
      case "day":
        return renderDayPriceForm();
      case "date_range":
        return renderDateRangePriceForm();
      default:
        return renderRuleTypeSelection();
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
          <h2>{rule ? "Edit Pricing Rule" : "Add Pricing Rule"}</h2>
          <ProgressIndicator step={step} />
          <CloseButton onClick={onClose}>
            <FiX />
          </CloseButton>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          <ModalBody>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: step === 1 ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: step === 1 ? -20 : 20 }}
                transition={{ duration: 0.2 }}
              >
                {renderFormContent()}
              </motion.div>
            </AnimatePresence>
          </ModalBody>

          <ModalActions step={step}>
            {step === 2 && (
              <Button
                type="button"
                className="back"
                onClick={() => {
                  setStep(1);
                  // Don't clear ruleType when going back in edit mode
                  if (!rule) {
                    setRuleType(null);
                    // Clear form data only when adding new rule
                    setFormData({
                      name: "",
                      start_time: "",
                      end_time: "",
                      day_of_week: "",
                      start_date: "",
                      end_date: "",
                      date_price: "",
                      time_price: "",
                      week_day_price: "",
                      excluded_days_price: "",
                    });
                  }
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Back
              </Button>
            )}

            <div style={{ display: "flex", gap: "1rem" }}>
              <Button
                type="button"
                className="secondary"
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </Button>

              {step === 2 && (
                <Button
                  type="submit"
                  className="primary"
                  disabled={loading}
                  onClick={(e) => {
                    console.log("=== BUTTON CLICKED ===");
                    console.log("Button click event:", e);
                    console.log("Current state:", {
                      ruleType,
                      formData,
                      step,
                      loading,
                    });
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? "Saving..." : rule ? "Update Rule" : "Create Rule"}
                  <FiChevronRight />
                </Button>
              )}
            </div>
          </ModalActions>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default AddPricingRuleModal;
