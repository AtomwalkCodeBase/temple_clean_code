import React, { useEffect, useMemo, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  processTempleServiceData,
  processTempleServiceImages,
  getTempleServicesList,
} from "../../services/templeServices";
import { getCurrentTempleId } from "../../services/serviceUtils";
import CloneFromExistingModal from "./Modals/CloneFromExistingModal";

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

// Main Container
const Container = styled.div`
  background: #ffffff;
  border-radius: 24px;
  backdrop-filter: blur(20px);
  box-shadow: 0 32px 64px rgba(0, 86, 214, 0.08),
    0 16px 32px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.8);
  max-width: 900px;
  margin: 0 auto;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 80vh;
  max-height: 90vh;
  position: relative;
  animation: ${css`
    ${fadeInUp} 0.6s ease-out
  `};

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(0, 86, 214, 0.3),
      transparent
    );
  }

  @media (max-width: 768px) {
    margin: 0 16px;
    border-radius: 20px;
    min-height: 85vh;
    max-height: 95vh;
  }
`;

// Header Section
const Header = styled.div`
  padding: 32px 40px 0;
  background: linear-gradient(135deg, #0056d6 0%, #004bb8 100%);
  color: white;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 768px) {
    padding: 24px 24px 0;
  }
`;

const HeaderClose = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
`;

const IconContainer = styled.div`
  width: 52px;
  height: 52px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const TitleContent = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 4px 0;
  letter-spacing: -0.5px;
  line-height: 1.2;
`;

const Subtitle = styled.p`
  font-size: 15px;
  opacity: 0.8;
  margin: 0;
  font-weight: 400;
`;

// Progress Bar
const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 32px;
`;

const ProgressStep = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  position: relative;
`;

const StepIndicator = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  ${(props) =>
    props.active
      ? css`
          background: rgba(255, 255, 255, 1);
          color: #0056d6;
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3);
        `
      : css`
          background: rgba(255, 255, 255, 0.2);
          color: rgba(255, 255, 255, 0.7);
        `}

  ${(props) =>
    props.completed &&
    css`
      background: rgba(255, 255, 255, 0.9);
      color: #0056d6;
    `}
`;

const StepLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  opacity: ${(props) => (props.active ? 1 : 0.7)};
  transition: opacity 0.3s ease;
`;

const ProgressLine = styled.div`
  height: 2px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 1px;
  flex: 1;
  margin: 0 8px;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 1px;
    width: ${(props) => props.progress}%;
    transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;

// Content Area
const Content = styled.div`
  padding: 40px 40px 0;
  flex: 1;
  overflow-y: auto;
  background: ${(props) => (props.hasBackground ? "#f8fafc" : "#ffffff")};

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f8f9fa;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #e0e0e0;
    border-radius: 3px;

    &:hover {
      background: #d0d0d0;
    }
  }

  @media (max-width: 768px) {
    padding: 32px 24px 0;
  }
`;

const FormSection = styled.div`
  animation: ${css`
    ${slideIn} 0.5s ease-out
  `};
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  letter-spacing: -0.3px;
`;

const SectionDescription = styled.p`
  font-size: 15px;
  color: #6b7280;
  margin: 0 0 32px 0;
  line-height: 1.5;
`;

// Form Controls
const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  &.full-width {
    grid-column: 1 / -1;
  }
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 4px;

  &::after {
    content: ${(props) => (props.required ? '"*"' : '""')};
    color: #0056d6;
    font-weight: 700;
  }
`;

const InputBase = css`
  padding: 16px 20px;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 500;
  background: #ffffff;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;

  &:focus {
    border-color: #0056d6;
    box-shadow: 0 0 0 4px rgba(0, 86, 214, 0.1);
    transform: translateY(-1px);
  }

  &::placeholder {
    color: #9ca3af;
    font-weight: 400;
  }

  &:hover:not(:focus) {
    border-color: #d1d5db;
  }
`;

const Input = styled.input`
  ${InputBase}
`;

const TextArea = styled.textarea`
  ${InputBase}
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
`;

// Image Upload Section
const ImageSection = styled.div`
  margin-bottom: 20px;
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding-bottom: 16px;
  max-width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const ImageSlot = styled.div`
  position: relative;
  background: ${(props) =>
    props.hasFile ? "linear-gradient(135deg, #f0f9ff, #e0f2fe)" : "#fafbfc"};
  border: 2px dashed ${(props) => (props.hasFile ? "#0056d6" : "#e5e7eb")};
  border-radius: 12px;
  aspect-ratio: 1/1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: ${(props) => (props.hasFile ? "default" : "pointer")};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  width: 100%;
  height: 80px;

  &:hover:not(.has-file) {
    border-color: #0056d6;
    background: linear-gradient(135deg, #f8faff, #f0f9ff);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 86, 214, 0.1);
  }

  &.uploading {
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: -200px;
      width: 200px;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(0, 86, 214, 0.1),
        transparent
      );
      animation: ${css`
        ${shimmer} 2s infinite
      `};
    }
  }
`;

const ImagePreview = styled.div`
  position: absolute;
  inset: 0;
  background: #000;
  border-radius: 18px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

const ImageContent = styled.div`
  text-align: center;
  padding: 8px;
  z-index: 1;
`;

const ImageIcon = styled.div`
  font-size: 16px;
  margin-bottom: 4px;
  transition: transform 0.3s ease;

  ${ImageSlot}:hover & {
    transform: scale(1.1);
  }
`;

const ImageText = styled.div`
  color: ${(props) => (props.hasFile ? "#0056d6" : "#6b7280")};
  font-size: 11px;
  font-weight: 600;
  margin-bottom: 2px;
`;

const ImageSubtext = styled.div`
  color: #9ca3af;
  font-size: 9px;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(220, 38, 38, 0.9);
  backdrop-filter: blur(10px);
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  z-index: 3;
  transition: all 0.2s ease;

  &:hover {
    background: #dc2626;
    transform: scale(1.1);
  }
`;

// Footer
const Footer = styled.div`
  padding: 32px 40px;
  background: #fafbfc;
  border-top: 1px solid #f3f4f6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;

  @media (max-width: 768px) {
    padding: 24px;
    flex-direction: column-reverse;

    > div {
      width: 100%;
      display: flex;
      gap: 12px;
    }
  }
`;

const Button = styled.button`
  padding: 14px 28px;
  border-radius: 12px;
  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 120px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s ease;
  }

  &:hover::before {
    left: 100%;
  }

  &.primary {
    background: linear-gradient(135deg, #0056d6, #004bb8);
    color: white;
    box-shadow: 0 4px 12px rgba(0, 86, 214, 0.3);

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 86, 214, 0.4);
    }

    &:active {
      transform: translateY(0);
    }

    &:disabled {
      background: #e5e7eb;
      color: #9ca3af;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;

      &::before {
        display: none;
      }
    }
  }

  &.secondary {
    background: white;
    color: #374151;
    border: 2px solid #e5e7eb;

    &:hover {
      background: #f9fafb;
      border-color: #d1d5db;
      transform: translateY(-1px);
    }
  }

  @media (max-width: 768px) {
    flex: 1;
    min-width: auto;
  }
`;

// Alerts
const Alert = styled.div`
  padding: 16px 20px;
  border-radius: 12px;
  margin-bottom: 24px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 12px;
  animation: ${css`
    ${fadeInUp} 0.4s ease-out
  `};

  &.error {
    background: linear-gradient(135deg, #fef2f2, #fee2e2);
    color: #dc2626;
    border: 1px solid #fecaca;

    &::before {
      content: "⚠️";
      font-size: 16px;
    }
  }

  &.success {
    background: linear-gradient(135deg, #f0fdf4, #dcfce7);
    color: #16a34a;
    border: 1px solid #bbf7d0;

    &::before {
      content: "✅";
      font-size: 16px;
    }
  }
`;
const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  background-color: white;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }

  &:disabled {
    background-color: #f8f9fa;
    color: #6c757d;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;
const HelpText = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 4px;
  font-style: italic;
  line-height: 1.4;
`;

export default function HallForm({
  onCancel,
  onSuccess,
  onInlineUpdate,
  editService,
  serviceType = "HALL",
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCloneModal, setShowCloneModal] = useState(false);
  const [templeId, setTempleId] = useState(
    () => getCurrentTempleId() || "T_0000010"
  );
  const [serviceId, setServiceId] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Initialize form data with default values for EVENT fields
  const [formData, setFormData] = useState({
    name: "",
    service_type:
      serviceType === "PUJA"
        ? "PUJA"
        : serviceType === "EVENT"
        ? "EVENT"
        : "Hall",
    description: "",
    capacity: serviceType === "PUJA" || serviceType === "EVENT" ? "" : "",
    duration_minutes: serviceType === "PUJA" ? "" : "0",
    // New EVENT-specific fields
    frequency: "S", // Default to Single (S)
    event_from_date: "",
    event_to_date: "",
    booking_from_date: "",
    booking_to_date: "",
    booking_type: "E", // Default to Exclusive (E)
  });
  const currentTempleId = useMemo(
    () => getCurrentTempleId() || templeId,
    [templeId]
  );

  // Format date for API (DD-MMM-YYYY format)
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

  // Parse API date format (DD-MMM-YYYY) to YYYY-MM-DD for input fields
  const parseAPIDate = (dateString) => {
    if (!dateString) return "";
    const parts = dateString.split("-");
    if (parts.length !== 3) return "";

    const day = parts[0];
    const month = parts[1];
    const year = parts[2];

    const monthMap = {
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

    return `${year}-${monthMap[month]}-${day.padStart(2, "0")}`;
  };

  // Initialize form data when editing
  useEffect(() => {
    if (editService) {
      setIsEditing(true);
      setServiceId(editService.service_id || editService.id || "");

      // Prepare form data with EVENT-specific fields
      const initialFormData = {
        name: editService.name || "",
        service_type:
          editService.service_type ||
          (serviceType === "PUJA"
            ? "PUJA"
            : serviceType === "EVENT"
            ? "EVENT"
            : "Hall"),
        description: editService.description || "",
        capacity: editService.capacity ? String(editService.capacity) : "",
        duration_minutes: editService.duration_minutes
          ? String(editService.duration_minutes)
          : "0",
        // EVENT-specific fields with fallbacks
        frequency: editService.frequency || "S",
        event_from_date: editService.event_from_date
          ? parseAPIDate(editService.event_from_date)
          : "",
        event_to_date: editService.event_to_date
          ? parseAPIDate(editService.event_to_date)
          : "",
        booking_from_date: editService.booking_from_date
          ? parseAPIDate(editService.booking_from_date)
          : "",
        booking_to_date: editService.booking_to_date
          ? parseAPIDate(editService.booking_to_date)
          : "",
        booking_type: editService.booking_type || "E", // Default to Exclusive if not set
      };

      setFormData(initialFormData);

      // Extract existing images from the service data
      const extractImages = (service) => {
        const images = {
          image_file: null,
          image_file_1: null,
          image_file_2: null,
          image_file_3: null,
          image_file_4: null,
          image_file_5: null,
        };

        // Check for main image
        if (service.image_url || service.image || service.main_image) {
          images.image_file =
            service.image_url || service.image || service.main_image;
        }

        // Check for additional images
        const imageFields = [
          "image_file_1",
          "image_file_2",
          "image_file_3",
          "image_file_4",
          "image_file_5",
        ];
        imageFields.forEach((field, index) => {
          const serviceField =
            service[field] ||
            service[`image_${index + 1}`] ||
            service[`photo_${index + 1}`];
          if (serviceField) {
            images[field] = serviceField;
          }
        });

        // Check image_list or images array
        if (service.image_list && Array.isArray(service.image_list)) {
          service.image_list.forEach((img, index) => {
            if (index < 5 && img) {
              const field = index === 0 ? "image_file" : `image_file_${index}`;
              images[field] = img;
            }
          });
        }

        // Check additional_field_list for images
        if (service.additional_field_list) {
          Object.entries(service.additional_field_list).forEach(
            ([key, value]) => {
              if (key.includes("image") && value && typeof value === "string") {
                const fieldIndex = key.match(/\d+/);
                if (fieldIndex) {
                  const field =
                    fieldIndex[0] === "0"
                      ? "image_file"
                      : `image_file_${fieldIndex[0]}`;
                  if (field in images) {
                    images[field] = value;
                  }
                }
              }
            }
          );
        }

        return images;
      };

      const existingImgs = extractImages(editService);
      setExistingImages(existingImgs);
    } else {
      setIsEditing(false);
      setServiceId("");
      setFormData({
        name: "",
        service_type:
          serviceType === "PUJA"
            ? "PUJA"
            : serviceType === "EVENT"
            ? "EVENT"
            : "Hall",
        description: "",
        capacity: serviceType === "PUJA" || serviceType === "EVENT" ? "" : "",
        duration_minutes: serviceType === "PUJA" ? "" : "0",
        // Default EVENT-specific fields
        frequency: "S",
        event_from_date: "",
        event_to_date: "",
        booking_from_date: "",
        booking_to_date: "",
        booking_type: "E", // Default to Exclusive
      });
      setExistingImages({
        image_file: null,
        image_file_1: null,
        image_file_2: null,
        image_file_3: null,
        image_file_4: null,
        image_file_5: null,
      });
    }
  }, [editService, serviceType]);

  const [imageFiles, setImageFiles] = useState({
    image_file: null,
    image_file_1: null,
    image_file_2: null,
    image_file_3: null,
    image_file_4: null,
    image_file_5: null,
  });

  const [existingImages, setExistingImages] = useState({
    image_file: null,
    image_file_1: null,
    image_file_2: null,
    image_file_3: null,
    image_file_4: null,
    image_file_5: null,
  });

  const steps = [
    {
      id: 0,
      label:
        serviceType === "PUJA"
          ? "Service Details"
          : serviceType === "EVENT"
          ? "Event Information"
          : "Hall Information",
      icon:
        serviceType === "PUJA" ? "🕉️" : serviceType === "EVENT" ? "🎉" : "🏛️",
    },
    {
      id: 1,
      label: "Media Upload",
      icon: "📸",
    },
  ];

  // Validation for EVENT form
  const canSubmit =
    serviceType === "EVENT"
      ? Boolean(
          formData.name &&
            formData.capacity &&
            formData.event_from_date &&
            formData.event_to_date &&
            formData.booking_from_date &&
            formData.booking_to_date
        )
      : Boolean(formData.name && formData.capacity);

  const handleImageChange = (field, file) => {
    if (file) {
      setImageFiles((prev) => ({ ...prev, [field]: file }));
    }
  };

  const removeImage = (field) => {
    setImageFiles((prev) => ({ ...prev, [field]: null }));
    setExistingImages((prev) => ({ ...prev, [field]: null }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    if (!canSubmit) {
      setError(
        serviceType === "PUJA"
          ? "Please enter the puja name"
          : serviceType === "EVENT"
          ? "Please fill in all required event details"
          : "Please fill in all required fields"
      );
      setSaving(false);
      return;
    }

    try {
      const serviceData = {
        call_mode: isEditing ? "UPDATE" : "ADD",
        temple_id: currentTempleId || templeId,
        name: formData.name.trim(),
        service_type:
          serviceType === "PUJA"
            ? "PUJA"
            : serviceType === "EVENT"
            ? "EVENT"
            : "Hall",
        description: formData.description.trim() || "",
        base_price: 0,
        capacity: Number(formData.capacity),
        duration_minutes: serviceType === "PUJA" ? 0 : 0,
        service_variation_list: [],
      };

      // Add EVENT-specific fields
      if (serviceType === "EVENT") {
        serviceData.frequency = formData.frequency;
        serviceData.event_from_date = formatDateForAPI(
          formData.event_from_date
        );
        serviceData.event_to_date = formatDateForAPI(formData.event_to_date);
        serviceData.booking_from_date = formatDateForAPI(
          formData.booking_from_date
        );
        serviceData.booking_to_date = formatDateForAPI(
          formData.booking_to_date
        );
        serviceData.booking_type = formData.booking_type; // Add booking_type
      }

      // Add service_id for UPDATE mode to prevent duplicates
      if (isEditing && serviceId) {
        serviceData.service_id = serviceId;
      }

      const response = await processTempleServiceData(serviceData);

      if (isEditing) {
        setSuccess(
          serviceType === "PUJA"
            ? "Puja service updated successfully!"
            : serviceType === "EVENT"
            ? "Event updated successfully!"
            : "Hall updated successfully!"
        );

        if (onInlineUpdate && serviceId) {
          onInlineUpdate(serviceId);
        }

        setTimeout(() => {
          if (onSuccess) onSuccess(serviceId);
        }, 1000);
      } else {
        let newServiceId =
          response?.service_id ||
          response?.id ||
          response?.data?.service_id ||
          response?.service_data?.service_id ||
          response?.service?.service_id ||
          response?.data?.id;

        if (!newServiceId) {
          try {
            const listResp = await getTempleServicesList();
            const raw = Array.isArray(listResp)
              ? listResp
              : Array.isArray(listResp?.data)
              ? listResp.data
              : Array.isArray(listResp?.results)
              ? listResp.results
              : [];
            const candidates = raw
              .filter(
                (s) =>
                  String(s?.temple_id) === String(currentTempleId || templeId)
              )
              .filter(
                (s) =>
                  String(s?.service_type || "").toUpperCase() ===
                  (serviceType === "PUJA"
                    ? "PUJA"
                    : serviceType === "EVENT"
                    ? "EVENT"
                    : "HALL")
              )
              .filter((s) => String(s?.name || "").trim() === serviceData.name);
            if (candidates.length > 0) {
              newServiceId = candidates[0].service_id || candidates[0].id;
            }
          } catch {}
        }
        if (!newServiceId)
          throw new Error("Service ID not returned by API. Please try again.");
        setServiceId(newServiceId);

        try {
          if (onInlineUpdate)
            await onInlineUpdate({
              _inlineInsert: true,
              service_id: newServiceId,
              temple_id: currentTempleId || templeId,
              name: serviceData.name,
              service_type: serviceData.service_type,
              description: serviceData.description,
              is_active: true,
              capacity: serviceData.capacity,
              base_price: serviceData.base_price,
              service_variation_list: [],
              // Include EVENT fields for inline update
              ...(serviceType === "EVENT" && {
                frequency: serviceData.frequency,
                event_from_date: serviceData.event_from_date,
                event_to_date: serviceData.event_to_date,
                booking_from_date: serviceData.booking_from_date,
                booking_to_date: serviceData.booking_to_date,
                booking_type: serviceData.booking_type, // Include booking_type
              }),
            });
        } catch {}

        setSuccess(
          serviceType === "PUJA"
            ? "Puja service created successfully! Now add some beautiful images."
            : serviceType === "EVENT"
            ? "Event created successfully! Now add some stunning photos."
            : "Hall created successfully! Now add some stunning photos."
        );

        setTimeout(() => {
          setCurrentStep(1);
          setSuccess("");
        }, 1000);
      }
    } catch (err) {
      setError(
        err.message ||
          err.detail ||
          `Failed to ${
            isEditing ? "update" : "create"
          } service. Please try again.`
      );
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async () => {
    if (!serviceId) {
      setError(
        "Please create the service first (Step 1) before uploading images."
      );
      return;
    }
    const hasMainImage = imageFiles.image_file || existingImages.image_file;
    if (!hasMainImage) {
      setError("Please upload at least one image to showcase your space.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const imageData = {
        service_id: serviceId,
      };

      // Add new/updated images to the API call
      Object.keys(imageFiles).forEach((key) => {
        if (imageFiles[key]) {
          imageData[key] = imageFiles[key];
        }
      });

      // Only call API if there are new images to upload
      const hasNewImages = Object.values(imageFiles).some(
        (file) => file !== null
      );
      if (hasNewImages) {
        await processTempleServiceImages(imageData);
      }

      setSuccess(
        isEditing
          ? "Images updated successfully!"
          : "Images uploaded successfully! You can now clone policies."
      );

      // For newly created services, open clone modal instead of immediate success navigation
      if (!isEditing) {
        setShowCloneModal(true);
      } else {
        setTimeout(() => {
          if (onSuccess) onSuccess(serviceId);
        }, 1200);
      }
    } catch (err) {
      setError(
        err.message ||
          "Image Size must be less than 1MB. Please check your files and try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const renderImageSlot = (field, index, isPrimary = false) => {
    const file = imageFiles[field];
    const existingImage = existingImages[field];
    const hasImage = !!file || !!existingImage;
    const inputId = `image-${field}`;

    return (
      <ImageSlot
        key={field}
        hasFile={hasImage}
        isPrimary={isPrimary}
        className={`${isPrimary ? "primary-image" : ""} ${
          hasImage ? "has-file" : ""
        }`}
        onClick={() => !hasImage && document.getElementById(inputId).click()}
      >
        <HiddenInput
          id={inputId}
          type="file"
          accept="image/*"
          onChange={(e) => handleImageChange(field, e.target.files[0])}
        />

        {hasImage && (
          <>
            <ImagePreview>
              <img
                src={file ? URL.createObjectURL(file) : existingImage}
                alt={file ? "New upload" : "Existing image"}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </ImagePreview>
            <RemoveButton
              onClick={(e) => {
                e.stopPropagation();
                removeImage(field);
              }}
            >
              ×
            </RemoveButton>
          </>
        )}

        <ImageContent>
          <ImageIcon isPrimary={isPrimary}>
            {hasImage ? "✓" : isPrimary ? "📸" : "➕"}
          </ImageIcon>
          <ImageText hasFile={hasImage} isPrimary={isPrimary}>
            {file
              ? file.name.length > (isPrimary ? 30 : 20)
                ? file.name.substring(0, isPrimary ? 30 : 20) + "..."
                : file.name
              : existingImage
              ? isPrimary
                ? "Current Image"
                : `Existing ${index}`
              : isPrimary
              ? "Main Photo"
              : `Photo ${index}`}
          </ImageText>
          <ImageSubtext isPrimary={isPrimary}>
            {file
              ? `${(file.size / 1024 / 1024).toFixed(1)}MB`
              : existingImage
              ? "Existing"
              : isPrimary
              ? "Required • Best quality"
              : "Optional"}
          </ImageSubtext>
        </ImageContent>
      </ImageSlot>
    );
  };

  return (
    <Container>
      <Header>
        <HeaderClose onClick={() => onCancel && onCancel()} aria-label="Close">
          <X size={18} />
        </HeaderClose>
        <TitleSection>
          <IconContainer>{steps[currentStep].icon}</IconContainer>
          <TitleContent>
            <Title>
              {isEditing
                ? `Edit ${
                    serviceType === "PUJA"
                      ? "Puja"
                      : serviceType === "EVENT"
                      ? "Event"
                      : "Hall"
                  }`
                : `Create New ${
                    serviceType === "PUJA"
                      ? "Puja"
                      : serviceType === "EVENT"
                      ? "Event"
                      : "Hall"
                  }`}
            </Title>
            <Subtitle>
              {currentStep === 0
                ? "Fill in the basic details to get started"
                : "Add high-quality images to attract more bookings"}
            </Subtitle>
          </TitleContent>
        </TitleSection>

        <ProgressContainer>
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <ProgressStep>
                <StepIndicator
                  active={currentStep === index}
                  completed={currentStep > index}
                >
                  {currentStep > index ? "✓" : index + 1}
                </StepIndicator>
                <StepLabel active={currentStep === index}>
                  {step.label}
                </StepLabel>
              </ProgressStep>
              {index < steps.length - 1 && (
                <ProgressLine progress={currentStep > index ? 100 : 0} />
              )}
            </React.Fragment>
          ))}
        </ProgressContainer>
      </Header>

      <Content hasBackground={currentStep === 1}>
        {error && <Alert className="error">{error}</Alert>}
        {success && <Alert className="success">{success}</Alert>}

        {currentStep === 0 && (
          <FormSection>
            <SectionTitle>Basic Information</SectionTitle>
            <SectionDescription>
              {serviceType === "PUJA"
                ? "Provide essential details about your puja service to help devotees understand what you offer."
                : serviceType === "EVENT"
                ? "Tell us about your event so we can help you attract the right attendees."
                : "Tell us about your hall space so we can help you attract the right events."}
            </SectionDescription>

            <FormGrid>
              <FormGroup>
                <Label required>
                  {serviceType === "PUJA"
                    ? "Puja Name"
                    : serviceType === "EVENT"
                    ? "Event Name"
                    : "Hall Name"}
                </Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={
                    serviceType === "PUJA"
                      ? "e.g., Ganesha Puja, Satyanarayan Katha"
                      : serviceType === "EVENT"
                      ? "e.g., Diwali Celebration, Community Festival"
                      : "e.g., Grand Wedding Hall, Meditation Hall"
                  }
                  required
                />
              </FormGroup>

              {(serviceType === "HALL" ||
                serviceType === "PUJA" ||
                serviceType === "EVENT") && (
                <FormGroup>
                  <Label required>
                    {serviceType === "EVENT"
                      ? "Seats Available"
                      : serviceType === "PUJA"
                      ? "Max Participants"
                      : "Guest Capacity"}
                  </Label>
                  <Input
                    name="capacity"
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={handleChange}
                    placeholder={
                      serviceType === "EVENT"
                        ? "e.g., 200 seats"
                        : serviceType === "PUJA"
                        ? "e.g., 50 participants"
                        : "e.g., 200 guests"
                    }
                    required
                  />
                </FormGroup>
              )}

              {/* EVENT-specific fields */}
              {serviceType === "EVENT" && (
                <>
                  <FormGroup>
                    <Label required>Event Start Date</Label>
                    <Input
                      name="event_from_date"
                      type="date"
                      value={formData.event_from_date}
                      onChange={handleChange}
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label required>Event End Date</Label>
                    <Input
                      name="event_to_date"
                      type="date"
                      value={formData.event_to_date}
                      onChange={handleChange}
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label required>Booking Start Date</Label>
                    <Input
                      name="booking_from_date"
                      type="date"
                      value={formData.booking_from_date}
                      onChange={handleChange}
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label required>Booking End Date</Label>
                    <Input
                      name="booking_to_date"
                      type="date"
                      value={formData.booking_to_date}
                      onChange={handleChange}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label required>Frequency</Label>
                    <Select
                      name="frequency"
                      value={formData.frequency}
                      onChange={handleChange}
                    >
                      <option value="S">Single Event</option>
                      <option value="D">Daily</option>
                      <option value="W">Weekly</option>
                      <option value="M">Monthly</option>
                      <option value="Y">Yearly</option>
                    </Select>
                  </FormGroup>

                  <FormGroup>
                    <Label required>Booking Type</Label>
                    <Select
                      name="booking_type"
                      value={formData.booking_type}
                      onChange={handleChange}
                    >
                      <option value="E">Exclusive (Private Event)</option>
                      <option value="S">
                        Shared (Multiple Bookings Allowed)
                      </option>
                    </Select>
                    <HelpText>
                      {formData.booking_type === "E"
                        ? "Exclusive: Only one booking allowed at a time. Perfect for private events."
                        : "Shared: Multiple bookings can happen simultaneously. Ideal for community events."}
                    </HelpText>
                  </FormGroup>
                </>
              )}

              <FormGroup className="full-width">
                <Label>Description</Label>
                <TextArea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder={
                    serviceType === "PUJA"
                      ? "Describe the puja rituals, duration, what's included, special arrangements..."
                      : serviceType === "EVENT"
                      ? "Describe your event details, activities, what's included, special arrangements..."
                      : "Describe your hall's unique features, amenities, ideal events, special services..."
                  }
                />
              </FormGroup>
            </FormGrid>
          </FormSection>
        )}

        {currentStep === 1 && (
          <FormSection>
            <ImageSection>
              <SectionTitle>Upload Photos</SectionTitle>
              <SectionDescription>
                Showcase your{" "}
                {serviceType === "PUJA"
                  ? "puja setup"
                  : serviceType === "EVENT"
                  ? "event"
                  : "hall"}{" "}
                with high-quality images. The main photo will be featured
                prominently in search results.
              </SectionDescription>

              <ImageGrid>
                {renderImageSlot("image_file", 0, true)}
                {[1, 2, 3, 4, 5].map((num) =>
                  renderImageSlot(`image_file_${num}`, num, false)
                )}
              </ImageGrid>
            </ImageSection>
          </FormSection>
        )}
      </Content>

      <Footer>
        <Button
          className="secondary"
          onClick={() => {
            if (currentStep === 0) {
              if (onCancel) onCancel();
            } else {
              setCurrentStep(0);
              setError("");
              setSuccess("");
            }
          }}
        >
          {currentStep === 0 ? "Cancel" : "← Back"}
        </Button>

        <div style={{ display: "flex", gap: "16px" }}>
          {currentStep === 0 && isEditing && (
            <>
              <Button
                className="secondary"
                onClick={async () => {
                  setError("");
                  setSuccess("");
                  setCurrentStep(1);
                }}
              >
                Skip to Photos →
              </Button>
            </>
          )}

          <Button
            className="primary"
            onClick={currentStep === 0 ? handleSubmit : handleImageUpload}
            disabled={
              saving ||
              (currentStep === 0
                ? !canSubmit
                : !(imageFiles.image_file || existingImages.image_file))
            }
          >
            {currentStep === 0 ? (
              saving ? (
                <>
                  <span
                    style={{
                      display: "inline-block",
                      width: "16px",
                      height: "16px",
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTop: "2px solid white",
                      borderRadius: "50%",
                      animation: "pulse 1s linear infinite",
                      marginRight: "8px",
                    }}
                  ></span>
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : (
                `${isEditing ? "Update" : "Create"} ${
                  serviceType === "PUJA"
                    ? "Puja"
                    : serviceType === "EVENT"
                    ? "Event"
                    : "Hall"
                }`
              )
            ) : saving ? (
              <>
                <span
                  style={{
                    display: "inline-block",
                    width: "16px",
                    height: "16px",
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTop: "2px solid white",
                    borderRadius: "50%",
                    animation: "pulse 1s linear infinite",
                    marginRight: "8px",
                  }}
                ></span>
                Uploading...
              </>
            ) : (
              "Complete Setup ✨"
            )}
          </Button>
        </div>
      </Footer>

      {showCloneModal && (
        <CloneFromExistingModal
          isOpen={showCloneModal}
          onClose={() => {
            setShowCloneModal(false);
            if (onSuccess) onSuccess(serviceId);
          }}
          targetService={{
            service_id: serviceId,
            name: formData.name,
            description: formData.description,
          }}
          serviceType={serviceType}
          templeId={currentTempleId}
          onCloned={() => {
            setShowCloneModal(false);
            if (onSuccess) onSuccess(serviceId);
          }}
        />
      )}
    </Container>
  );
}
