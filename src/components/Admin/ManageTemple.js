import React, { useMemo, useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import TempleTimeSlots from "../../components/Admin/TempleTimeSlots";
import {
  addupdatetempale,
  gettemplist,
  uploadTempleImages,
} from "../../services/productServices";
import TimeSlotModal from "./Modals/TimeSlotModal";

// Premium White & Blue Design System
const theme = {
  colors: {
    primary: "#0056d6",
    primaryLight: "#e3f2fd",
    primaryDark: "#003d96",
    white: "#ffffff",
    gray50: "#f8fafc",
    gray100: "#f1f5f9",
    gray200: "#e2e8f0",
    gray300: "#cbd5e1",
    gray400: "#94a3b8",
    gray500: "#64748b",
    gray600: "#475569",
    gray700: "#334155",
    gray800: "#1e293b",
    gray900: "#0f172a",
    success: "#10b981",
    error: "#ef4444",
    warning: "#f59e0b",
  },
  shadows: {
    xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    sm: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
  },
};

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const slideIn = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

// Styled Components
const PageContainer = styled(motion.div).attrs({
  variants: fadeIn,
  initial: "hidden",
  animate: "visible",
})`
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    ${theme.colors.primaryLight} 0%,
    ${theme.colors.white} 50%,
    ${theme.colors.primaryLight} 100%
  );
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: radial-gradient(
        circle at 25% 25%,
        rgba(0, 86, 214, 0.05) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 75% 75%,
        rgba(0, 86, 214, 0.03) 0%,
        transparent 50%
      );
    animation: float 20s ease-in-out infinite;
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }
`;

const Container = styled(motion.div)`
  position: relative;
  z-index: 1;
  max-width: 1800px;
  margin: 0 auto;
  padding: 2rem;
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled(motion.div)`
  display: none;
`;

const Title = styled(motion.h1)`
  font-size: 3rem;
  font-weight: 900;
  margin: 0;
  background: linear-gradient(
    135deg,
    ${theme.colors.primary} 0%,
    ${theme.colors.primaryDark} 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: -0.02em;
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.1rem;
  color: ${theme.colors.gray600};
  margin: 0.5rem 0 0;
  font-weight: 400;
`;

const TabContainer = styled(motion.div)`
  display: flex;
  background: ${theme.colors.white};
  border-radius: 16px;
  padding: 0.5rem;
  margin-bottom: 2rem;
  box-shadow: ${theme.shadows.lg};
  border: 1px solid ${theme.colors.gray200};
  overflow-x: auto;
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const Tab = styled(motion.button)`
  flex: 1;
  min-width: 150px;
  padding: 1rem 1.5rem;
  background: ${(props) =>
    props.active
      ? `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`
      : "transparent"};
  color: ${(props) =>
    props.active ? theme.colors.white : theme.colors.gray600};
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: ${(props) =>
      props.active
        ? `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`
        : theme.colors.gray100};
    color: ${(props) =>
      props.active ? theme.colors.white : theme.colors.gray800};
    transform: translateY(-1px);
  }
`;

const Card = styled(motion.div)`
  background: ${theme.colors.white};
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: ${theme.shadows.xl};
  border: 1px solid ${theme.colors.gray200};
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent,
      ${theme.colors.primary},
      transparent
    );
    border-radius: 20px 20px 0 0;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const ProgressContainer = styled(motion.div)`
  margin-bottom: 2.5rem;
`;

const ProgressTrack = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    background: ${theme.colors.gray200};
    z-index: 0;
  }
`;

const ProgressLine = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 0;
  height: 2px;
  z-index: 0;
  background: linear-gradient(
    90deg,
    ${theme.colors.primary},
    ${theme.colors.primaryLight}
  );
  transform: translateY(-50%);
`;

const ProgressStep = styled(motion.div)`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
  z-index: 1;
  background: ${(props) =>
    props.active
      ? `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`
      : props.completed
      ? theme.colors.success
      : theme.colors.white};
  color: ${(props) =>
    props.active || props.completed
      ? theme.colors.white
      : theme.colors.gray500};
  border: 3px solid
    ${(props) =>
      props.active
        ? "transparent"
        : props.completed
        ? theme.colors.success
        : theme.colors.gray200};
  box-shadow: ${theme.shadows.md};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: ${theme.shadows.lg};
  }
`;

const StepLabel = styled(motion.div)`
  color: ${theme.colors.gray700};
  text-align: center;
  font-weight: 600;
  font-size: 1.1rem;
  margin-top: 0.5rem;
`;

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const FormGroup = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  &.full {
    grid-column: 1 / -1;
  }
`;

const Label = styled(motion.label)`
  color: ${theme.colors.gray700};
  font-weight: 600;
  font-size: 0.95rem;
`;

const inputStyles = `
  padding: 1rem 1.25rem; background: ${theme.colors.white};
  border: 2px solid ${theme.colors.gray200}; border-radius: 12px;
  font-size: 1rem; color: ${theme.colors.gray800};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${theme.shadows.xs};
  
  &::placeholder { color: ${theme.colors.gray400}; }
  
  &:hover {
    border-color: ${theme.colors.gray300};
    box-shadow: ${theme.shadows.sm};
  }
  
  &:focus {
    outline: none; border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 4px rgba(0, 86, 214, 0.1);
    transform: translateY(-1px);
  }
`;

const Input = styled(motion.input)`
  ${inputStyles}
`;
const TextArea = styled(motion.textarea)`
  ${inputStyles}
  resize: vertical;
  min-height: 120px;
`;
const Select = styled(motion.select)`
  ${inputStyles}
  cursor: pointer;
`;

const Button = styled(motion.button)`
  padding: ${(props) => (props.size === "sm" ? "0.75rem 1.5rem" : "1rem 2rem")};
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  background: ${(props) => {
    const c = props.color;
    if (typeof c === "string" && c.startsWith("#")) {
      return c;
    }
    switch (c) {
      // Primary Action (Add / Create / Save New)
      case "primary":
        return "#10b981";
      // Secondary Action (Edit / Update / Save Changes)
      case "secondary":
        return "#3b82f6";
      // Warning Action (Update with Caution / Special Update)
      case "warning":
        return "#f59e0b";
      // Danger Action (Delete / Remove / Discard)
      case "danger":
      case "red":
        return "#ef4444";
      // Info / View / Details (Optional)
      case "info":
        return "#06b6d4";
      // Neutral Action (Back / Cancel / Close)
      case "neutral":
        return "#f1f5f9";
      default:
        return theme.colors.gray100;
    }
  }};

  color: ${(props) =>
    (typeof props.color === "string" && props.color.startsWith("#")) ||
    ["primary", "secondary", "warning", "danger", "red", "info"].includes(
      props.color
    )
      ? "#ffffff"
      : theme.colors.gray700};
  box-shadow: ${theme.shadows.md};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.lg};
    filter: brightness(0.95);
  }

  &:active {
    transform: translateY(0px);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${(props) =>
    props.loading &&
    `
    color: transparent;
    &::after {
      content: '';
      position: absolute; top: 50%; left: 50%;
      width: 20px; height: 20px; margin: -10px 0 0 -10px;
      border: 2px solid transparent;
      border-top-color: ${
        ["primary", "secondary", "warning", "danger", "red", "info"].includes(
          props.color
        )
          ? "#ffffff"
          : theme.colors.gray700
      };
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `}
`;

const NoticeBox = styled(motion.div)`
  padding: 1rem 1.25rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
  box-shadow: ${theme.shadows.sm};
`;

const ErrorBox = styled(NoticeBox)`
  background: #fef2f2;
  border: 2px solid #fecaca;
  color: #dc2626;
`;

const SuccessBox = styled(NoticeBox)`
  background: #f0fdf4;
  border: 2px solid #bbf7d0;
  color: #16a34a;
`;

const InfoBox = styled(NoticeBox)`
  background: ${theme.colors.primaryLight};
  border: 2px solid #bfdbfe;
  color: ${theme.colors.primaryDark};
`;

const WarningBox = styled(NoticeBox)`
  background: #fffbeb;
  border: 2px solid #fde68a;
  color: #d97706;
`;

const ActionRow = styled(motion.div)`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  flex-wrap: wrap;
  margin-top: 2rem;
  @media (max-width: 768px) {
    justify-content: stretch;
  }
`;

const Divider = styled(motion.hr)`
  border: none;
  height: 1px;
  margin: 2rem 0;
  background: linear-gradient(
    to right,
    transparent,
    ${theme.colors.gray200},
    transparent
  );
`;

const TimeSlotItem = ({ slot, selected, onToggle }) => (
  <motion.div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      padding: "1rem 1.25rem",
      border: `2px solid ${
        selected ? theme.colors.primary : theme.colors.gray200
      }`,
      borderRadius: "12px",
      background: selected ? theme.colors.primaryLight : theme.colors.white,
      cursor: "pointer",
      transition: "all 0.3s ease",
    }}
    whileHover={{ scale: 1.01, boxShadow: theme.shadows.md }}
    onClick={() => onToggle(slot.id, !selected)}
  >
    <input
      type="checkbox"
      checked={selected}
      onChange={() => {}}
      style={{
        width: "20px",
        height: "20px",
        accentColor: theme.colors.primary,
      }}
    />
    <div
      style={{
        flex: 1,
        fontWeight: selected ? "600" : "500",
        color: theme.colors.gray800,
      }}
    >
      <strong>{slot.name}</strong> - {slot.start} to {slot.end}
    </div>
  </motion.div>
);

const DetailSection = ({
  detail,
  index,
  canMoveUp,
  canMoveDown,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  onAddAbove,
  onAddBelow,
}) => (
  <motion.div
    style={{
      background: theme.colors.white,
      padding: "1.5rem",
      marginBottom: "1rem",
      borderRadius: "16px",
      border: `2px solid ${theme.colors.gray200}`,
      boxShadow: theme.shadows.md,
    }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
  >
    <Grid>
      <FormGroup>
        <Label>Section Title</Label>
        <Input
          value={detail.title}
          onChange={(e) => onChange(index, "title", e.target.value)}
          placeholder="e.g., History, Architecture, Festivals"
        />
      </FormGroup>
      <FormGroup className="full">
        <Label>Section Content</Label>
        <TextArea
          value={detail.paragraph}
          onChange={(e) => onChange(index, "paragraph", e.target.value)}
          placeholder="Write detailed information about this section..."
        />
      </FormGroup>
    </Grid>
    <ActionRow style={{ marginTop: "1rem", justifyContent: "space-between" }}>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <Button size="sm" onClick={() => onAddAbove(index)}>
          + Insert Above
        </Button>
        <Button size="sm" onClick={() => onAddBelow(index)}>
          + Insert Below
        </Button>
        <Button size="sm" disabled={!canMoveUp} onClick={() => onMoveUp(index)}>
          ↑ Move Up
        </Button>
        <Button
          size="sm"
          disabled={!canMoveDown}
          onClick={() => onMoveDown(index)}
        >
          ↓ Move Down
        </Button>
      </div>
      <Button color="red" size="sm" onClick={() => onRemove(index)}>
        Remove Section
      </Button>
    </ActionRow>
  </motion.div>
);

const DocumentSection = ({ document, index, onChange, onRemove }) => (
  <motion.div
    style={{
      background: theme.colors.white,
      padding: "1.5rem",
      marginBottom: "1rem",
      borderRadius: "16px",
      border: `2px solid ${theme.colors.gray200}`,
      boxShadow: theme.shadows.md,
    }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
  >
    <Grid>
      <FormGroup>
        <Label>Document Name *</Label>
        <Input
          value={document.name}
          onChange={(e) => onChange(index, "name", e.target.value)}
          placeholder="e.g., Aadhar Card, PAN Card, Passport"
        />
      </FormGroup>
      <FormGroup>
        <Label>Mandatory Document</Label>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "1rem 1.25rem",
            background: theme.colors.gray50,
            borderRadius: "12px",
            border: `2px solid ${theme.colors.gray200}`,
          }}
        >
          <input
            type="checkbox"
            checked={document.is_mandatory}
            onChange={(e) => onChange(index, "is_mandatory", e.target.checked)}
            style={{
              width: "20px",
              height: "20px",
              accentColor: theme.colors.primary,
              cursor: "pointer",
            }}
          />
          <span
            style={{
              color: theme.colors.gray700,
              fontWeight: "500",
              cursor: "pointer",
            }}
            onClick={() =>
              onChange(index, "is_mandatory", !document.is_mandatory)
            }
          >
            This document is required for temple services
          </span>
        </div>
      </FormGroup>
    </Grid>
    <ActionRow style={{ marginTop: "1rem", justifyContent: "flex-end" }}>
      <Button color="red" size="sm" onClick={() => onRemove(index)}>
        Remove Document
      </Button>
    </ActionRow>
  </motion.div>
);

// Mock components (would normally be separate files)
const MasterTabs = ({ tabs, activeTab, onChange }) => (
  <TabContainer>
    {tabs.map((tab) => (
      <Tab
        key={tab.id}
        active={activeTab === tab.id}
        onClick={() => onChange(tab.id)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {tab.label}
      </Tab>
    ))}
  </TabContainer>
);

const ProgressBar = ({ steps, currentStep }) => (
  <ProgressContainer>
    <ProgressTrack>
      <ProgressLine
        style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        transition={{ duration: 0.5 }}
      />
      {steps.map((step, index) => (
        <ProgressStep
          key={step.id}
          active={currentStep === index}
          completed={currentStep > index}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {currentStep > index ? "✓" : index + 1}
        </ProgressStep>
      ))}
    </ProgressTrack>
    <StepLabel>{steps[currentStep]?.label}</StepLabel>
  </ProgressContainer>
);

const TempleList = ({ onEditTemple }) => (
  <motion.div variants={fadeIn} initial="hidden" animate="visible">
    <InfoBox>
      📋 Temple list functionality will load existing temples here
    </InfoBox>
  </motion.div>
);

function ManageTemple(props) {
  // State management
  const [activeTab, setActiveTab] = useState("add-temple");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [templeId, setTempleId] = useState("");
  const [currentStep, setCurrentStep] = useState(0);

  // Form state
  const [templeForm, setTempleForm] = useState({
    name: "",
    email_id: "",
    mobile_number: "",
    alternate_contact_number: "",
    contact_name: "",
    address_line_1: "",
    address_line_2: "",
    address_line_3: "",
    state_code: "",
    pin_code: "",
    county_code: "IN",
    established_date: "",
    remarks: "",
    web_page: "",
    location: "",
    geo_location_data: "",
    temple_group: "",
    temple_sub_group: "",
    temple_group_id: null,
    temple_sub_group_id: null,
    is_live_data: window.location.hostname === "localhost" ? false : true,
  });

  const [imageFiles, setImageFiles] = useState({
    mainImage: null,
    additionalImages: [],
  });

  const [details, setDetails] = useState([{ title: "", paragraph: "" }]);
  const [documents, setDocuments] = useState([
    { name: "", is_mandatory: false },
  ]);
  const [currentImages, setCurrentImages] = useState([]);

  // Time slots state
  const [timeSlots, setTimeSlots] = useState([
    {
      id: "morning",
      name: "Morning Darshan",
      start: "6:00 AM",
      end: "11:00 AM",
      status: "Active",
    },
    {
      id: "evening",
      name: "Evening Darshan",
      start: "4:00 PM",
      end: "9:00 PM",
      status: "Active",
    },
  ]);

  const [selectedTimeSlotIds, setSelectedTimeSlotIds] = useState([]);
  // Reusable Add Time Slot modal state
  const [showAddSlotModal, setShowAddSlotModal] = useState(false);
  const [newSlotForm, setNewSlotForm] = useState({
    name: "",
    start: "",
    end: "",
  });

  // Temple Groups state
  const [groups, setGroups] = useState([
    { id: 1, name: "South Indian Temples", image: null },
    { id: 2, name: "North Indian Temples", image: null },
  ]);
  const [subGroups, setSubGroups] = useState([
    { id: 1, name: "Dravidian Architecture", image: null },
    { id: 2, name: "Nagara Architecture", image: null },
  ]);

  const fetchCurrentImages = async (id) => {
    const effectiveId =
      id || (props.selectedTemple && props.selectedTemple.temple_id);
    if (!effectiveId) return;
    try {
      const listRes = await gettemplist();
      const payload = listRes?.data;
      const list = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload)
        ? payload
        : [];
      const t = list.find((x) => x.temple_id === effectiveId);
      if (!t) return setCurrentImages([]);
      const keys = [
        "image",
        "image_1",
        "image_2",
        "image_3",
        "image_4",
        "image_5",
        "image_6",
        "image_7",
        "image_8",
        "image_9",
      ];
      setCurrentImages(keys.map((k) => t[k]).filter(Boolean));
    } catch {}
  };

  // Constants
  const tabs = useMemo(() => {
    const baseTabs = [
      {
        id: "add-temple",
        label: templeId || props.selectedTemple ? "Edit Temple" : "Add Temple",
      },
      { id: "time-slots", label: "Time Slots" },
    ];
    return baseTabs;
  }, [templeId, props.selectedTemple]);

  const formSteps = useMemo(
    () => [
      { id: 0, label: "Basic Information" },
      { id: 1, label: "Address Details" },
      { id: 2, label: "Groups & Remarks" },
      { id: 3, label: "Temple Timings" },
      { id: 4, label: "Temple Sections" },
      { id: 5, label: "Documents Required" },
      { id: 6, label: "Temple Images" },
    ],
    []
  );

  // Helper functions
  const resetNotices = () => {
    setError("");
    setSuccess("");
  };

  const handleTempleChange = (e) => {
    resetNotices();
    const { name, value } = e.target;
    setTempleForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDetailChange = (idx, field, value) => {
    setDetails((prev) =>
      prev.map((d, i) => (i === idx ? { ...d, [field]: value } : d))
    );
  };

  const handleAddDetail = () =>
    setDetails((prev) => [...prev, { title: "", paragraph: "" }]);
  const handleRemoveDetail = (idx) =>
    setDetails((prev) => prev.filter((_, i) => i !== idx));

  const handleDocumentChange = (idx, field, value) => {
    setDocuments((prev) =>
      prev.map((d, i) => (i === idx ? { ...d, [field]: value } : d))
    );
  };

  const handleAddDocument = () =>
    setDocuments((prev) =>
      prev.length >= 3 ? prev : [...prev, { name: "", is_mandatory: false }]
    );
  const handleRemoveDocument = (idx) =>
    setDocuments((prev) => prev.filter((_, i) => i !== idx));

  const handleTimeSlotToggle = (id, checked) => {
    if (checked) {
      setSelectedTimeSlotIds((prev) => [...prev, id]);
    } else {
      setSelectedTimeSlotIds((prev) => prev.filter((slotId) => slotId !== id));
    }
  };

  const openAddSlotModal = () => {
    setNewSlotForm({ name: "", start: "", end: "" });
    setShowAddSlotModal(true);
  };

  const closeAddSlotModal = () => {
    setShowAddSlotModal(false);
    setTimeout(() => {
      setNewSlotForm({ name: "", start: "", end: "" });
    }, 200);
  };

  const submitNewTimeSlot = ({ name, start, end }) => {
    const newId = Date.now();
    const newSlot = { id: newId, name, start, end, status: "Active" };
    setTimeSlots((prev) => [...prev, newSlot]);
    setSelectedTimeSlotIds((prev) => [...prev, newId]);
    closeAddSlotModal();
  };

  const handleEditTemple = (templeData) => {
    if (!templeData) return;
    setActiveTab("add-temple");
    setTempleId(templeData.temple_id || "");
    setTempleForm((prev) => ({
      ...prev,
      name: templeData.name || "",
      email_id: templeData.email_id || "",
      mobile_number: templeData.mobile_number || "",
      alternate_contact_number: templeData.alternate_contact_number || "",
      contact_name: templeData.contact_name || "",
      address_line_1: templeData.address_line_1 || "",
      address_line_2: templeData.address_line_2 || "",
      address_line_3: templeData.address_line_3 || "",
      state_code: templeData.state_code || "",
      pin_code: templeData.pin_code || "",
      county_code: templeData.county_code || prev.county_code || "IN",
      established_date: templeData.established_date || "",
      remarks: templeData.remarks || "",
      web_page: templeData.web_page || templeData.website || "",
      location: templeData.location || "",
      geo_location_data: templeData.geo_location_data || "",
      temple_group: templeData.temple_group || "",
      temple_sub_group: templeData.temple_sub_group || "",
      temple_group_id:
        templeData.temple_group_id ||
        templeData.temple_group?.id ||
        prev.temple_group_id ||
        null,
      temple_sub_group_id:
        templeData.temple_sub_group_id ||
        templeData.temple_sub_group?.id ||
        prev.temple_sub_group_id ||
        null,
    }));

    // Prefill details sections
    if (templeData.additional_field_list?.temple_data_list?.length) {
      setDetails(templeData.additional_field_list.temple_data_list);
    }

    // Prefill documents
    if (templeData.additional_field_list?.supplier_document_name_list?.length) {
      setDocuments(
        templeData.additional_field_list.supplier_document_name_list
          .slice(0, 3)
          .map((doc) => ({
            name: doc.name || "",
            is_mandatory:
              doc.is_mandatory === "True" || doc.is_mandatory === true,
          }))
      );
    }

    // Prefill timing selections
    if (
      templeData.additional_field_list?.temple_timings?.selected_time_slots
        ?.length
    ) {
      const ids =
        templeData.additional_field_list.temple_timings.selected_time_slots.map(
          (s) => s.id
        );
      setSelectedTimeSlotIds(ids);
    }

    // Prefill images from selectedTemple immediately (optimistic), API refresh follows via useEffect
    const imageKeys = [
      "image",
      "image_1",
      "image_2",
      "image_3",
      "image_4",
      "image_5",
      "image_6",
      "image_7",
      "image_8",
      "image_9",
    ];
    setCurrentImages(imageKeys.map((k) => templeData[k]).filter(Boolean));

    setCurrentStep(0);
    resetNotices();
  };

  useEffect(() => {
    if (props.selectedTemple) {
      handleEditTemple(props.selectedTemple);
    }
  }, [props.selectedTemple]);

  useEffect(() => {
    fetchCurrentImages(templeId);
  }, [templeId]);

  // Ensure images are fetched when Images step is opened
  useEffect(() => {
    if (activeTab === "add-temple" && currentStep === 6 && templeId) {
      fetchCurrentImages(templeId);
    }
  }, [activeTab, currentStep, templeId]);

  const resetForm = () => {
    setTempleId("");
    setTempleForm({
      name: "",
      email_id: "",
      mobile_number: "",
      alternate_contact_number: "",
      contact_name: "",
      address_line_1: "",
      address_line_2: "",
      address_line_3: "",
      state_code: "",
      pin_code: "",
      county_code: "IN",
      established_date: "",
      remarks: "",
      web_page: "",
      location: "",
      geo_location_data: "",
      temple_group: "",
      temple_sub_group: "",
      temple_group_id: "",
      temple_sub_group_id: "",
    });
    setSelectedTimeSlotIds([]);
    setDetails([{ title: "", paragraph: "" }]);
    setDocuments([{ name: "", is_mandatory: false }]);
    setImageFiles({ mainImage: null, additionalImages: [] });
    setCurrentStep(0);
  };

  const submitTempleSections = async () => {
    setSaving(true);
    resetNotices();
    try {
      const selectedSlots = timeSlots.filter((s) =>
        selectedTimeSlotIds.includes(s.id)
      );
      const timingsPayload = {
        selected_time_slots: selectedSlots.map((slot) => ({
          id: slot.id,
          name: slot.name,
          start: slot.start,
          end: slot.end,
        })),
      };

      const templePayload = {
        temple_data: {
          call_mode: templeId ? "UPDATE" : "ADD",
          ...(templeId ? { temple_id: templeId } : {}),
          ...templeForm,
          temple_timings: timingsPayload,
          temple_data_list: details.filter((d) => d.title || d.paragraph),
          supplier_document_name_list: documents
            .filter((d) => d.name)
            .map((doc) => ({
              name: doc.name,
              is_mandatory: doc.is_mandatory ? "True" : "false",
            })),
        },
      };

      const res = await addupdatetempale(templePayload);

      if (!templeId) {
        const listRes = await gettemplist();
        const list = listRes?.data?.data || listRes?.data || [];
        const match = list.find(
          (t) =>
            t.name === templeForm.name &&
            t.mobile_number === templeForm.mobile_number &&
            t.address_line_1 === templeForm.address_line_1
        );
        if (!match || !match.temple_id)
          throw new Error("Temple created but could not find temple ID.");
        setTempleId(match.temple_id);
      }

      setSuccess(
        templeId
          ? "Temple updated successfully!"
          : "Temple created successfully!"
      );
      setCurrentStep(6);
    } catch (err) {
      setError(
        err?.response?.data?.message || err?.message || "Failed to save temple"
      );
    } finally {
      setSaving(false);
    }
  };

  const submitTempleImages = async () => {
    setSaving(true);
    resetNotices();
    try {
      const formData = new FormData();
      formData.append(
        "temple_id",
        templeId ||
          (props.selectedTemple && props.selectedTemple.temple_id) ||
          ""
      );
      formData.append("call_mode", "TEMPLE_IMAGE");
      if (imageFiles.mainImage) {
        formData.append("image_file", imageFiles.mainImage);
        formData.append("image_file_1", imageFiles.mainImage);
      }
      imageFiles.additionalImages.slice(0, 9).forEach((file, index) => {
        formData.append(`image_file_${index + 1}`, file);
      });
      await uploadTempleImages(
        templeId ||
          (props.selectedTemple && props.selectedTemple.temple_id) ||
          "",
        formData
      );
      setSuccess("Images uploaded successfully.");
      await fetchCurrentImages(templeId);
      // Redirect to My Temple list
      setTimeout(() => {
        if (typeof window !== "undefined") {
          window.location.assign("/temple-list");
        }
      }, 600);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to upload images"
      );
    } finally {
      setSaving(false);
    }
  };

  // Render functions for different steps
  const renderBasicInfoStep = () => (
    <motion.div variants={slideIn} initial="hidden" animate="visible">
      {templeId && (
        <InfoBox>
          ✏️ <strong>Editing Temple:</strong> {templeForm.name} (ID: {templeId})
        </InfoBox>
      )}
      <Grid>
        <FormGroup>
          <Label>Temple Name *</Label>
          <Input
            name="name"
            value={templeForm.name}
            onChange={handleTempleChange}
            required
            placeholder="Sri Ram Mandir"
          />
        </FormGroup>
        <FormGroup>
          <Label>Contact Person</Label>
          <Input
            name="contact_name"
            value={templeForm.contact_name}
            onChange={handleTempleChange}
            placeholder="Ramesh Kumar"
          />
        </FormGroup>
        <FormGroup>
          <Label>Email Address</Label>
          <Input
            type="email"
            name="email_id"
            value={templeForm.email_id}
            onChange={handleTempleChange}
            placeholder="contact@temple.org"
          />
        </FormGroup>
        <FormGroup>
          <Label>Mobile Number *</Label>
          <Input
            name="mobile_number"
            value={templeForm.mobile_number}
            onChange={handleTempleChange}
            placeholder="9876543210"
          />
        </FormGroup>
        <FormGroup>
          <Label>Alternate Contact</Label>
          <Input
            name="alternate_contact_number"
            value={templeForm.alternate_contact_number}
            onChange={handleTempleChange}
            placeholder="9123456780"
          />
        </FormGroup>
        <FormGroup>
          <Label>Website</Label>
          <Input
            name="web_page"
            value={templeForm.web_page}
            onChange={handleTempleChange}
            placeholder="https://temple.org"
          />
        </FormGroup>
      </Grid>
    </motion.div>
  );

  const renderAddressStep = () => (
    <motion.div variants={slideIn} initial="hidden" animate="visible">
      <Grid>
        <FormGroup className="full">
          <Label>Address Line 1 *</Label>
          <Input
            name="address_line_1"
            value={templeForm.address_line_1}
            onChange={handleTempleChange}
            placeholder="Main Road"
          />
        </FormGroup>
        <FormGroup>
          <Label>Address Line 2</Label>
          <Input
            name="address_line_2"
            value={templeForm.address_line_2}
            onChange={handleTempleChange}
            placeholder="Near River Bank"
          />
        </FormGroup>
        <FormGroup>
          <Label>City *</Label>
          <Input
            name="address_line_3"
            value={templeForm.address_line_3}
            onChange={handleTempleChange}
            placeholder="Bangalore"
          />
        </FormGroup>
        <FormGroup>
          <Label>State Code *</Label>
          <Input
            name="state_code"
            value={templeForm.state_code}
            onChange={handleTempleChange}
            placeholder="KA"
          />
        </FormGroup>
        <FormGroup>
          <Label>PIN Code *</Label>
          <Input
            name="pin_code"
            value={templeForm.pin_code}
            onChange={handleTempleChange}
            placeholder="560001"
          />
        </FormGroup>
        <FormGroup>
          <Label>Location</Label>
          <Input
            name="location"
            value={templeForm.location}
            onChange={handleTempleChange}
            placeholder="Bangalore, Karnataka"
          />
        </FormGroup>
        <FormGroup>
          <Label>Geo Location (Lat,Long)</Label>
          <Input
            name="geo_location_data"
            value={templeForm.geo_location_data}
            onChange={handleTempleChange}
            placeholder="12.9716,77.5946"
          />
        </FormGroup>
      </Grid>
    </motion.div>
  );

  const renderGroupsStep = () => (
    <motion.div variants={slideIn} initial="hidden" animate="visible">
      <Grid>
        <FormGroup>
          <Label>Temple Group</Label>
          <Input
            value={
              groups.find((g) => g.id === (templeForm.temple_group_id || 0))
                ?.name ||
              templeForm.temple_group ||
              "Not assigned"
            }
            readOnly
          />
        </FormGroup>
        <FormGroup>
          <Label>Temple Sub Group</Label>
          <Input
            value={
              subGroups.find(
                (sg) => sg.id === (templeForm.temple_sub_group_id || 0)
              )?.name ||
              templeForm.temple_sub_group ||
              "Not assigned"
            }
            readOnly
          />
        </FormGroup>
        <FormGroup className="full">
          <Label>Remarks</Label>
          <TextArea
            name="remarks"
            value={templeForm.remarks}
            onChange={handleTempleChange}
            placeholder="Any additional information about the temple..."
          />
        </FormGroup>
      </Grid>
    </motion.div>
  );

  const renderTimingsStep = () => (
    <motion.div variants={slideIn} initial="hidden" animate="visible">
      <div style={{ marginBottom: "2rem" }}>
        <Label
          style={{
            display: "block",
            marginBottom: "1rem",
            fontSize: "1.1rem",
            color: theme.colors.gray800,
          }}
        >
          Select Temple Darshan Timings
        </Label>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "1rem",
          }}
        >
          <Button color="#0056d6" onClick={openAddSlotModal}>
            + Add New Time Slot
          </Button>
        </div>
        <div style={{ display: "grid", gap: "1rem" }}>
          {timeSlots
            .filter((s) => s.status !== "Inactive")
            .map((slot) => (
              <TimeSlotItem
                key={slot.id}
                slot={slot}
                selected={selectedTimeSlotIds.includes(slot.id)}
                onToggle={handleTimeSlotToggle}
              />
            ))}
          {timeSlots.filter((s) => s.status !== "Inactive").length === 0 && (
            <div
              style={{
                padding: "2rem",
                textAlign: "center",
                color: theme.colors.gray500,
                border: `2px dashed ${theme.colors.gray300}`,
                borderRadius: "12px",
                background: theme.colors.gray50,
              }}
            >
              No active time slots available. Please add time slots in the "Time
              Slots" tab first.
            </div>
          )}
        </div>
      </div>
      <TimeSlotModal
        open={showAddSlotModal}
        title="Add New Time Slot"
        submitLabel="Add Time Slot"
        submitColor="#0056d6"
        initialValues={newSlotForm}
        onClose={closeAddSlotModal}
        onSubmit={submitNewTimeSlot}
      />
    </motion.div>
  );

  const renderSectionsStep = () => (
    <motion.div variants={slideIn} initial="hidden" animate="visible">
      <div style={{ marginBottom: "2rem" }}>
        <Label
          style={{
            display: "block",
            marginBottom: "1rem",
            fontSize: "1.2rem",
            color: theme.colors.gray800,
          }}
        >
          Temple Information Sections
        </Label>
        <p style={{ color: theme.colors.gray600, marginBottom: "1.5rem" }}>
          Add detailed sections about your temple like history, architecture,
          festivals, etc.
        </p>
      </div>

      <AnimatePresence>
        {details.map((detail, idx) => (
          <DetailSection
            key={idx}
            detail={detail}
            index={idx}
            canMoveUp={idx > 0}
            canMoveDown={idx < details.length - 1}
            onChange={handleDetailChange}
            onRemove={handleRemoveDetail}
            onMoveUp={(i) =>
              setDetails((prev) => {
                const copy = [...prev];
                [copy[i - 1], copy[i]] = [copy[i], copy[i - 1]];
                return copy;
              })
            }
            onMoveDown={(i) =>
              setDetails((prev) => {
                const copy = [...prev];
                [copy[i + 1], copy[i]] = [copy[i], copy[i + 1]];
                return copy;
              })
            }
            onAddAbove={(i) =>
              setDetails((prev) => {
                const copy = [...prev];
                copy.splice(i, 0, { title: "", paragraph: "" });
                return copy;
              })
            }
            onAddBelow={(i) =>
              setDetails((prev) => {
                const copy = [...prev];
                copy.splice(i + 1, 0, { title: "", paragraph: "" });
                return copy;
              })
            }
          />
        ))}
      </AnimatePresence>

      <ActionRow style={{ justifyContent: "space-between" }}>
        <Button color="primary" onClick={handleAddDetail}>
          + Add Section
        </Button>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Button onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}>
            ← Previous
          </Button>
          <Button
            color="secondary"
            onClick={() =>
              setCurrentStep((s) => Math.min(formSteps.length - 1, s + 1))
            }
          >
            Next →
          </Button>
        </div>
      </ActionRow>
    </motion.div>
  );

  const renderDocumentsStep = () => (
    <motion.div variants={slideIn} initial="hidden" animate="visible">
      <div style={{ marginBottom: "2rem" }}>
        <Label
          style={{
            display: "block",
            marginBottom: "1rem",
            fontSize: "1.2rem",
            color: theme.colors.gray800,
          }}
        >
          Documents Required
        </Label>
        <p style={{ color: theme.colors.gray600, marginBottom: "1.5rem" }}>
          Specify which documents are required from devotees for temple services
          and bookings.
        </p>
      </div>

      <AnimatePresence>
        {documents.map((document, idx) => (
          <DocumentSection
            key={idx}
            document={document}
            index={idx}
            onChange={handleDocumentChange}
            onRemove={handleRemoveDocument}
          />
        ))}
      </AnimatePresence>

      <ActionRow style={{ justifyContent: "space-between" }}>
        <Button
          color="primary"
          onClick={handleAddDocument}
          disabled={documents.length >= 3}
        >
          + Add Document
        </Button>
        {documents.length >= 3 && (
          <span style={{ alignSelf: "center", color: theme.colors.gray500 }}>
            Maximum 3 documents allowed
          </span>
        )}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Button onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}>
            ← Previous
          </Button>
          <Button
            color="primary"
            onClick={submitTempleSections}
            loading={saving}
            disabled={saving}
          >
            {templeId ? "Update Temple & Continue" : "Create Temple & Continue"}
          </Button>
        </div>
      </ActionRow>
    </motion.div>
  );

  const renderImagesStep = () => (
    <motion.div variants={slideIn} initial="hidden" animate="visible">
      {!templeId && (
        <WarningBox>
          ⚠️ Please complete the previous steps to create the temple first. You
          need a temple ID to upload images.
        </WarningBox>
      )}

      <div style={{ marginBottom: "2rem" }}>
        <Label
          style={{
            display: "block",
            marginBottom: "1rem",
            fontSize: "1.2rem",
            color: theme.colors.gray800,
          }}
        >
          Temple Images
        </Label>
        <p style={{ color: theme.colors.gray600, marginBottom: "1.5rem" }}>
          Upload high-quality images of your temple. The main image will be
          displayed prominently.
        </p>
      </div>

      {/* Main Image Section */}
      <Card style={{ marginBottom: "2rem", padding: "2rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "12px",
              background: theme.colors.primaryLight,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "1rem",
              color: theme.colors.primary,
              fontSize: "1.5rem",
            }}
          >
            📸
          </div>
          <div>
            <h3 style={{ margin: 0, color: theme.colors.gray800 }}>
              Main Temple Image
            </h3>
            <p
              style={{
                margin: "0.25rem 0 0",
                color: theme.colors.gray600,
                fontSize: "0.9rem",
              }}
            >
              This will be the primary image displayed for your temple
            </p>
          </div>
        </div>

        <FormGroup className="full">
          <Label>Upload Main Image * (Required)</Label>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <label
              style={{
                display: "inline-block",
                padding: "1rem 1.5rem",
                background: theme.colors.primaryLight,
                color: theme.colors.primaryDark,
                borderRadius: "12px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: theme.shadows.sm,
                border: `2px dashed ${theme.colors.primary}30`,
              }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setImageFiles((prev) => ({
                    ...prev,
                    mainImage: e.target.files[0] || null,
                  }))
                }
                style={{ display: "none" }}
              />
              📁 Choose File
            </label>

            {imageFiles.mainImage ? (
              <div
                style={{
                  padding: "0.75rem 1rem",
                  background: theme.colors.success + "15",
                  color: theme.colors.success,
                  borderRadius: "8px",
                  border: `1px solid ${theme.colors.success}30`,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span style={{ fontSize: "1.2rem" }}>✓</span>
                <span>{imageFiles.mainImage.name}</span>
                <Button
                  color="red"
                  size="sm"
                  style={{ marginLeft: "0.5rem" }}
                  onClick={() =>
                    setImageFiles((prev) => ({ ...prev, mainImage: null }))
                  }
                >
                  Remove
                </Button>
              </div>
            ) : (
              <div style={{ color: theme.colors.gray500, fontStyle: "italic" }}>
                No main image selected yet
              </div>
            )}
          </div>

          {imageFiles.mainImage && (
            <div
              style={{
                marginTop: "1.5rem",
                padding: "1rem",
                background: theme.colors.gray50,
                borderRadius: "12px",
                border: `1px solid ${theme.colors.gray200}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1rem",
                }}
              >
                <strong style={{ color: theme.colors.gray800 }}>
                  Image Preview
                </strong>
                <Button
                  color="red"
                  size="sm"
                  onClick={() =>
                    setImageFiles((prev) => ({ ...prev, mainImage: null }))
                  }
                >
                  Change Image
                </Button>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "200px",
                  background: `url(${URL.createObjectURL(
                    imageFiles.mainImage
                  )}) center/cover no-repeat`,
                  borderRadius: "8px",
                  border: `1px solid ${theme.colors.gray200}`,
                }}
              />
            </div>
          )}
        </FormGroup>
      </Card>

      {/* Existing Images Gallery */}
      {imageFiles.additionalImages.length > 0 && (
        <div style={{ marginBottom: "1.5rem" }}>
          <Label>Current Images</Label>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              gap: "1rem",
            }}
          >
            {imageFiles.additionalImages.map((src, i) => (
              <div
                key={i}
                style={{
                  border: `1px solid ${theme.colors.gray200}`,
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "120px",
                    background: `url(${src}) center/cover no-repeat`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Images Section */}
      <Card style={{ padding: "2rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "12px",
              background: "#f0fdf4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "1rem",
              color: theme.colors.success,
              fontSize: "1.5rem",
            }}
          >
            🖼️
          </div>
          <div>
            <h3 style={{ margin: 0, color: theme.colors.gray800 }}>
              Additional Images
            </h3>
            <p
              style={{
                margin: "0.25rem 0 0",
                color: theme.colors.gray600,
                fontSize: "0.9rem",
              }}
            >
              Add up to 9 supplementary images (optional)
            </p>
          </div>
        </div>

        <FormGroup className="full">
          <Label>Upload Additional Images</Label>

          {/* Image Upload Area */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "2rem",
              background: theme.colors.gray50,
              borderRadius: "12px",
              border: `2px dashed ${theme.colors.gray300}`,
              marginBottom: "1.5rem",
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.style.background = theme.colors.primaryLight;
              e.currentTarget.style.borderColor = theme.colors.primary;
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.currentTarget.style.background = theme.colors.gray50;
              e.currentTarget.style.borderColor = theme.colors.gray300;
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.style.background = theme.colors.gray50;
              e.currentTarget.style.borderColor = theme.colors.gray300;

              if (
                e.dataTransfer.files.length > 0 &&
                imageFiles.additionalImages.length < 9
              ) {
                const newFiles = Array.from(e.dataTransfer.files).slice(
                  0,
                  9 - imageFiles.additionalImages.length
                );
                setImageFiles((prev) => ({
                  ...prev,
                  additionalImages: [...prev.additionalImages, ...newFiles],
                }));
              }
            }}
            onClick={() =>
              document.getElementById("additional-images-input").click()
            }
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📁</div>
            <p
              style={{
                margin: "0 0 0.5rem",
                color: theme.colors.gray700,
                fontWeight: "600",
              }}
            >
              Drag & drop images here or click to browse
            </p>
            <p
              style={{
                margin: 0,
                color: theme.colors.gray500,
                fontSize: "0.9rem",
              }}
            >
              Supports JPG, PNG, WEBP (Max 9 images)
            </p>
            <input
              id="additional-images-input"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                if (
                  e.target.files.length > 0 &&
                  imageFiles.additionalImages.length < 9
                ) {
                  const newFiles = Array.from(e.target.files).slice(
                    0,
                    9 - imageFiles.additionalImages.length
                  );
                  setImageFiles((prev) => ({
                    ...prev,
                    additionalImages: [...prev.additionalImages, ...newFiles],
                  }));
                }
              }}
              style={{ display: "none" }}
            />
          </div>

          {/* Image Gallery */}
          {imageFiles.additionalImages.length > 0 && (
            <div style={{ marginBottom: "1.5rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1rem",
                }}
              >
                <Label>
                  Uploaded Images ({imageFiles.additionalImages.length}/9)
                </Label>
                <Button
                  color="red"
                  size="sm"
                  onClick={() =>
                    setImageFiles((prev) => ({ ...prev, additionalImages: [] }))
                  }
                  disabled={imageFiles.additionalImages.length === 0}
                >
                  Remove All
                </Button>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                  gap: "1rem",
                }}
              >
                {imageFiles.additionalImages.map((file, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    style={{
                      position: "relative",
                      borderRadius: "12px",
                      overflow: "hidden",
                      boxShadow: theme.shadows.md,
                      border: `1px solid ${theme.colors.gray200}`,
                    }}
                    whileHover={{ boxShadow: theme.shadows.lg }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "120px",
                        background: `url(${URL.createObjectURL(
                          file
                        )}) center/cover no-repeat`,
                      }}
                    />

                    <div
                      style={{
                        padding: "0.5rem",
                        background: theme.colors.white,
                        borderTop: `1px solid ${theme.colors.gray200}`,
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.8rem",
                          color: theme.colors.gray700,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {file.name}
                      </p>
                    </div>

                    <div
                      style={{
                        position: "absolute",
                        top: "0.5rem",
                        right: "0.5rem",
                        display: "flex",
                        gap: "0.5rem",
                      }}
                    >
                      <Button
                        color="red"
                        size="sm"
                        style={{
                          width: "30px",
                          height: "30px",
                          padding: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "50%",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setImageFiles((prev) => ({
                            ...prev,
                            additionalImages: prev.additionalImages.filter(
                              (_, i) => i !== index
                            ),
                          }));
                        }}
                      >
                        ×
                      </Button>
                    </div>

                    {/* Reordering buttons */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: "0.5rem",
                        left: "0.5rem",
                        display: "flex",
                        gap: "0.25rem",
                      }}
                    >
                      {index > 0 && (
                        <Button
                          color="primary"
                          size="sm"
                          style={{
                            width: "28px",
                            height: "28px",
                            padding: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "50%",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            const newImages = [...imageFiles.additionalImages];
                            [newImages[index], newImages[index - 1]] = [
                              newImages[index - 1],
                              newImages[index],
                            ];
                            setImageFiles((prev) => ({
                              ...prev,
                              additionalImages: newImages,
                            }));
                          }}
                        >
                          ↑
                        </Button>
                      )}

                      {index < imageFiles.additionalImages.length - 1 && (
                        <Button
                          color="primary"
                          size="sm"
                          style={{
                            width: "28px",
                            height: "28px",
                            padding: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "50%",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            const newImages = [...imageFiles.additionalImages];
                            [newImages[index], newImages[index + 1]] = [
                              newImages[index + 1],
                              newImages[index],
                            ];
                            setImageFiles((prev) => ({
                              ...prev,
                              additionalImages: newImages,
                            }));
                          }}
                        >
                          ↓
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {imageFiles.additionalImages.length >= 9 && (
            <div
              style={{
                padding: "0.75rem",
                background: "#fffbeb",
                color: "#d97706",
                borderRadius: "8px",
                fontSize: "0.9rem",
                border: "1px solid #fde68a",
                marginBottom: "1.5rem",
              }}
            >
              Maximum 9 additional images reached. Remove some images to add new
              ones.
            </div>
          )}
        </FormGroup>

        <ActionRow>
          <Button
            onClick={() => setCurrentStep(5)}
            style={{
              background: theme.colors.gray100,
              color: theme.colors.gray700,
            }}
          >
            ← Back to Documents
          </Button>
          <Button
            color="primary"
            onClick={submitTempleImages}
            loading={saving}
            disabled={saving || !imageFiles.mainImage}
            style={{ minWidth: "200px" }}
          >
            {saving ? "Uploading Images..." : "Complete Temple Setup"}
          </Button>
        </ActionRow>
      </Card>
    </motion.div>
  );

  return (
    <PageContainer>
      <Container>
        <Header>
          <Title>Temple Master</Title>
          <Subtitle>Manage your temples with precision and care</Subtitle>
        </Header>

        <MasterTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <Card>
          <AnimatePresence mode="wait">
            {error && (
              <ErrorBox
                key="error"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                ⚠️ {error}
              </ErrorBox>
            )}
            {success && (
              <SuccessBox
                key="success"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                ✅ {success}
              </SuccessBox>
            )}
          </AnimatePresence>

          {activeTab === "add-temple" && (
            <>
              <ProgressBar steps={formSteps} currentStep={currentStep} />

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentStep === 0 && renderBasicInfoStep()}
                  {currentStep === 1 && renderAddressStep()}
                  {currentStep === 2 && renderGroupsStep()}
                  {currentStep === 3 && renderTimingsStep()}
                  {currentStep === 4 && renderSectionsStep()}
                  {currentStep === 5 && renderDocumentsStep()}
                  {currentStep === 6 && renderImagesStep()}
                </motion.div>
              </AnimatePresence>

              {currentStep < 4 && (
                <>
                  <Divider />
                  <ActionRow>
                    {currentStep > 0 && (
                      <Button
                        onClick={() =>
                          setCurrentStep((s) => Math.max(0, s - 1))
                        }
                      >
                        ← Previous
                      </Button>
                    )}
                    <Button
                      color="secondary"
                      onClick={() =>
                        setCurrentStep((s) =>
                          Math.min(formSteps.length - 1, s + 1)
                        )
                      }
                    >
                      Next →
                    </Button>
                  </ActionRow>
                </>
              )}
            </>
          )}

          {activeTab === "time-slots" && (
            <TempleTimeSlots
              timeSlots={timeSlots}
              onAddTimeSlot={(slot) =>
                setTimeSlots((prev) => [
                  ...prev,
                  { ...slot, id: Date.now(), status: slot.status || "Active" },
                ])
              }
              onEditTimeSlot={(id, updated) =>
                setTimeSlots((prev) =>
                  prev.map((s) => (s.id === id ? { ...s, ...updated } : s))
                )
              }
              onDeleteTimeSlot={(id) =>
                setTimeSlots((prev) => prev.filter((s) => s.id !== id))
              }
              onToggleTimeSlotStatus={(id) =>
                setTimeSlots((prev) =>
                  prev.map((s) =>
                    s.id === id
                      ? {
                          ...s,
                          status: s.status === "Active" ? "Inactive" : "Active",
                        }
                      : s
                  )
                )
              }
            />
          )}

          {activeTab === "temple-groups" && (
            <motion.div variants={fadeIn} initial="hidden" animate="visible">
              <div style={{ marginBottom: "2rem" }}>
                <Label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "1.3rem",
                    color: theme.colors.gray800,
                  }}
                >
                  Temple Groups Management
                </Label>
                <p style={{ color: theme.colors.gray600 }}>
                  Organize temples into groups and sub-groups for better
                  management and categorization.
                </p>
              </div>

              {/* Groups Section */}
              <Card style={{ marginBottom: "2rem", padding: "2rem" }}>
                <h3
                  style={{
                    margin: "0 0 1.5rem 0",
                    color: theme.colors.gray800,
                    fontSize: "1.1rem",
                  }}
                >
                  Create New Group
                </h3>
                <Grid>
                  <FormGroup>
                    <Label>Group Name *</Label>
                    <Input placeholder="e.g., South Indian Temples" />
                  </FormGroup>
                  <FormGroup>
                    <Label>Group Image</Label>
                    <Input type="file" accept="image/*" />
                  </FormGroup>
                </Grid>
                <ActionRow style={{ marginTop: "1.5rem" }}>
                  <Button color="primary">Create Group</Button>
                </ActionRow>
              </Card>

              {/* Sub Groups Section */}
              <Card style={{ marginBottom: "2rem", padding: "2rem" }}>
                <h3
                  style={{
                    margin: "0 0 1.5rem 0",
                    color: theme.colors.gray800,
                    fontSize: "1.1rem",
                  }}
                >
                  Create New Sub Group
                </h3>
                <Grid>
                  <FormGroup>
                    <Label>Sub Group Name *</Label>
                    <Input placeholder="e.g., Dravidian Architecture" />
                  </FormGroup>
                  <FormGroup>
                    <Label>Sub Group Image</Label>
                    <Input type="file" accept="image/*" />
                  </FormGroup>
                </Grid>
                <ActionRow style={{ marginTop: "1.5rem" }}>
                  <Button color="primary">Create Sub Group</Button>
                </ActionRow>
              </Card>

              {/* Existing Groups Table */}
              <Card style={{ padding: "2rem" }}>
                <h3
                  style={{
                    margin: "0 0 1.5rem 0",
                    color: theme.colors.gray800,
                    fontSize: "1.1rem",
                  }}
                >
                  Existing Groups & Sub Groups
                </h3>
                <div
                  style={{
                    display: "grid",
                    gap: "1rem",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(300px, 1fr))",
                  }}
                >
                  {[...groups, ...subGroups].map((item, index) => (
                    <motion.div
                      key={item.id}
                      style={{
                        padding: "1.5rem",
                        background: theme.colors.gray50,
                        borderRadius: "12px",
                        border: `1px solid ${theme.colors.gray200}`,
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                      }}
                      whileHover={{ scale: 1.02, boxShadow: theme.shadows.md }}
                    >
                      <h4 style={{ margin: 0, color: theme.colors.gray800 }}>
                        {item.name}
                      </h4>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <Button color="primary" size="sm">
                          Edit
                        </Button>
                        <Button color="red" size="sm">
                          Delete
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </Card>
      </Container>
    </PageContainer>
  );
}

export default ManageTemple;
