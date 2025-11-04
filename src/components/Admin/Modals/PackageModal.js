import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { X, Clock, Users, Calendar, CheckCircle, Package } from "lucide-react";
import { getPricingRuleList } from "../../../services/templeServices";

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
  animation: ${fadeIn} 0.2s cubic-bezier(0.16, 1, 0.3, 1);
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 40px -8px rgba(0, 86, 214, 0.15),
    0 0 0 1px rgba(0, 86, 214, 0.05);
  display: flex;
  flex-direction: column;
  animation: ${slideUp} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
`;

const ModalHeader = styled.div`
  padding: 20px 24px 16px;
  border-bottom: 1px solid rgba(0, 86, 214, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #fafcff 0%, #f8faff 100%);
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      #0056d6 50%,
      transparent 100%
    );
    opacity: 0.3;
  }
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #0056d6;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: "";
    width: 4px;
    height: 18px;
    background: linear-gradient(135deg, #0056d6, #0066e6);
    border-radius: 2px;
  }
`;

const CloseButton = styled.button`
  background: rgba(0, 86, 214, 0.08);
  border: none;
  color: #0056d6;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(0, 86, 214, 0.12);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const ModalBody = styled.div`
  padding: 20px 24px;
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  overflow: hidden;
`;

const ScrollContainer = styled.div`
  overflow-y: auto;
  flex: 1;
  padding-right: 4px;

  /* Hide scrollbar across browsers while preserving scroll */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    /* Chrome, Safari, Opera */
    width: 0px;
    height: 0px;
    background: transparent; /* Hide any default color (e.g., yellow) */
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #0056d6;
  display: flex;
  align-items: center;
  gap: 6px;

  svg {
    color: #0056d6;
    width: 16px;
    height: 16px;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 4px;

  &::after {
    content: ${(props) => (props.required ? '"*"' : '""')};
    color: #ff4757;
    font-weight: 500;
  }
`;

const inputStyles = `
  padding: 12px 14px;
  border: 1.5px solid #e8ecf4;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  background: white;
  color: #1a1a1a;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  
  &::placeholder {
    color: #8892a4;
    font-weight: 400;
  }
  
  &:focus {
    outline: none;
    border-color: #0056d6;
    box-shadow: 0 0 0 2px rgba(0, 86, 214, 0.08);
  }
  
  &:hover:not(:focus) {
    border-color: #c1c9d7;
  }
`;

const Input = styled.input`
  ${inputStyles}
`;

const Select = styled.select`
  ${inputStyles}
  cursor: pointer;

  option {
    padding: 8px;
    font-weight: 500;
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid rgba(0, 86, 214, 0.08);
  margin-top: 8px;
  flex-shrink: 0;
`;

const RuleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 10px;
  margin-top: 10px;
`;

const RuleCard = styled.button`
  text-align: left;
  border: 1.5px solid ${(props) => (props.$selected ? "#0056d6" : "#e8ecf4")};
  background: ${(props) =>
    props.$selected ? "rgba(0, 86, 214, 0.04)" : "white"};
  color: #1a1a1a;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: ${(props) =>
      props.$selected
        ? "linear-gradient(90deg, #0056d6, #0066e6)"
        : "transparent"};
    transition: all 0.2s ease;
  }

  &:hover {
    border-color: ${(props) => (props.$selected ? "#0056d6" : "#0056d6")};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px -2px rgba(0, 86, 214, 0.12);

    &::before {
      background: linear-gradient(90deg, #0056d6, #0066e6);
    }
  }

  .title {
    font-size: 13px;
    font-weight: 700;
    color: ${(props) => (props.$selected ? "#0056d6" : "#1a1a1a")};
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .desc {
    font-size: 12px;
    color: #6b7280;
    line-height: 1.3;
  }

  .meta {
    font-size: 11px;
    color: #8892a4;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    align-items: center;
  }

  .chips {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
    margin-top: 4px;
  }

  .chip {
    font-size: 10px;
    font-weight: 600;
    color: #0056d6;
    background: rgba(0, 86, 214, 0.08);
    border: 1px solid rgba(0, 86, 214, 0.16);
    padding: 3px 8px;
    border-radius: 12px;
    white-space: nowrap;
  }
`;

const Button = styled.button`
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1.5px solid transparent;
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 100px;
  justify-content: center;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }

  &.primary {
    background: linear-gradient(135deg, #0056d6 0%, #0066e6 100%);
    color: white;
    border-color: #0056d6;

    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #0049c2 0%, #0056d6 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px -2px rgba(0, 86, 214, 0.3);
    }
  }

  &.secondary {
    background: white;
    color: #6b7280;
    border-color: #e8ecf4;

    &:hover {
      background: #f8faff;
      border-color: #c1c9d7;
      color: #4b5563;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 24px 16px;
  color: #8892a4;

  svg {
    margin-bottom: 10px;
    opacity: 0.6;
    width: 32px;
    height: 32px;
  }

  .title {
    font-size: 13px;
    font-weight: 600;
    color: #6b7280;
    margin-bottom: 4px;
  }

  .desc {
    font-size: 12px;
    line-height: 1.3;
  }
`;

const CheckIcon = styled(CheckCircle)`
  color: #0056d6;
  flex-shrink: 0;
  width: 14px;
  height: 14px;
`;

const PackageModal = ({
  isOpen,
  onClose,
  hall,
  onSave,
  onDelete,
  isSaving,
  initialPackage,
  isEditing,
}) => {
  const [editingPackage, setEditingPackage] = useState(null);
  const [pricingRules, setPricingRules] = useState([]);
  const lastSubmitRef = useRef({ at: 0, snapshot: null });
  const [localSubmitting, setLocalSubmitting] = useState(false);
  const serviceType = String(hall?.service_type || "").toUpperCase();
  const isPuja = serviceType === "PUJA";
  const isEvent = serviceType === "EVENT";

  const mapPriceTypeToFullLabel = (priceType) => {
    if (isEvent) {
      switch (String(priceType || "").trim()) {
        case "Individual-1":
          return "Individual Event (1 person)";
        case "Partner-2":
          return "Partner Event (2 person)";
        case "Family-5":
          return "Family Event (5 person)";
        case "Joint-10":
          return "Joint Family Event (10 person)";
        default:
          return "";
      }
    }
    switch (String(priceType || "").trim()) {
      case "Individual-1":
        return "Individual Puja (1 person)";
      case "Partner-2":
        return "Partner Puja (2 person)";
      case "Family-5":
        return "Family Puja (5 person)";
      case "Joint-10":
        return "Joint Family Puja (10 person)";
      default:
        return "";
    }
  };

  const [formData, setFormData] = useState({
    price_type: "HOURLY",
    slot_name: "",
    base_price: "",
    start_time: "",
    end_time: "",
    no_hours: "",
    max_participant: "",
    pricing_rule_id: null,
  });

  useEffect(() => {
    if (!isOpen) {
      setEditingPackage(null);
      resetForm();
      setLocalSubmitting(false);
      return;
    }

    (async () => {
      try {
        const resp = await getPricingRuleList();
        const list = Array.isArray(resp?.data)
          ? resp.data
          : Array.isArray(resp)
          ? resp
          : [];
        const templeId = hall?.temple_id ?? hall?.templeId ?? null;
        const filtered = list.filter(
          (service) =>
            !templeId || String(service.temple_id) === String(templeId)
        );
        const normalize = (r) => ({
          id: r?.id ?? r?.rule_id ?? r?.value ?? r?.code ?? null,
          name: r?.name ?? r?.title ?? r?.label ?? `Rule ${r?.id ?? ""}`,
          description: r?.description ?? r?.desc ?? "",
          start_date:
            r?.start_date ?? r?.startDate ?? r?.from_date ?? r?.fromDate ?? "",
          end_date: r?.end_date ?? r?.endDate ?? r?.to_date ?? r?.toDate ?? "",
          date_price:
            r?.date_price ??
            r?.datePrice ??
            r?.special_date_price ??
            r?.specialDatePrice ??
            null,
          time_price:
            r?.time_price ??
            r?.timePrice ??
            r?.slot_price ??
            r?.slotPrice ??
            null,
          week_day_price:
            r?.week_day_price ??
            r?.weekday_price ??
            r?.weekDayPrice ??
            r?.weekdayPrice ??
            null,
        });
        setPricingRules(filtered.map(normalize));
      } catch (e) {
        setPricingRules([]);
      }
    })();

    if (initialPackage !== undefined) {
      const pkg = initialPackage || {};
      setEditingPackage(pkg.id ? pkg : isEditing ? pkg : null);
      const resolvedSlotName =
        isPuja || isEvent
          ? pkg.slot_name || mapPriceTypeToFullLabel(pkg.price_type)
          : "";
      const resolvedPricingRuleId =
        pkg.pricing_rule_id != null
          ? pkg.pricing_rule_id
          : pkg.pricing_rule_data?.id != null
          ? pkg.pricing_rule_data.id
          : null;
      setFormData({
        price_type: pkg.price_type || "HOURLY",
        slot_name: resolvedSlotName || "",
        base_price: pkg.base_price != null ? String(pkg.base_price) : "",
        start_time: pkg.start_time || "",
        end_time: pkg.end_time || "",
        no_hours: pkg.no_hours != null ? String(pkg.no_hours) : "",
        max_participant:
          pkg.max_participant != null ? String(pkg.max_participant) : "",
        pricing_rule_id:
          resolvedPricingRuleId != null ? Number(resolvedPricingRuleId) : null,
      });
    } else {
      // Opening for a fresh add: ensure completely clean form
      setEditingPackage(null);
      resetForm();
      setLocalSubmitting(false);
    }
  }, [isOpen, initialPackage]);

  const resetForm = () => {
    setFormData({
      price_type: "HOURLY",
      slot_name: "",
      base_price: "",
      start_time: "",
      end_time: "",
      no_hours: "",
      max_participant: "",
      pricing_rule_id: null,
    });
  };

  // Helper: derive max participants from slot_name or price_type
  const deriveMaxParticipants = (slotName, priceType) => {
    const fromSlot =
      typeof slotName === "string" ? slotName.match(/(\d+)/)?.[1] || "" : "";
    if (fromSlot) {
      const n = parseInt(fromSlot, 10);
      if (Number.isFinite(n) && n > 0) return n;
    }
    const key = String(priceType || "").trim();
    if (key === "Individual-1") return 1;
    if (key === "Partner-2") return 2;
    if (key === "Family-5") return 5;
    if (key === "Joint-10") return 10;
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Guard against rapid double-submit from user clicks or keypresses
    const now = Date.now();
    const snapshot = JSON.stringify(formData);
    if (localSubmitting) return;
    if (
      lastSubmitRef.current.snapshot === snapshot &&
      now - lastSubmitRef.current.at < 1200
    ) {
      return;
    }
    lastSubmitRef.current = { at: now, snapshot };
    setLocalSubmitting(true);

    const derivedMax =
      isPuja || isEvent
        ? deriveMaxParticipants(formData.slot_name, formData.price_type)
        : null;

    const packageData =
      isPuja || isEvent
        ? {
            id: editingPackage?.id || null,
            slot_name: formData.slot_name || formData.price_type,
            price_type: (() => {
              const slotName = formData.slot_name || formData.price_type || "";
              if (slotName.includes("Joint")) return "Joint-10";
              if (slotName.includes("Individual")) return "Individual-1";
              if (slotName.includes("Partner")) return "Partner-2";
              if (slotName.includes("Family")) return "Family-5";
              return slotName || "FIXED";
            })(),
            base_price: parseFloat(formData.base_price),
            pricing_rule_id:
              formData.pricing_rule_id != null
                ? parseInt(formData.pricing_rule_id)
                : null,
            start_time: formData.start_time,
            end_time: formData.end_time,
            max_no_per_day: 10,
            max_participant:
              derivedMax != null
                ? derivedMax
                : parseInt(formData.max_participant || "0") || 0,
            no_hours: null,
            duration_minutes: (() => {
              if (formData.start_time && formData.end_time) {
                const startTime = new Date(
                  `2000-01-01T${formData.start_time}:00`
                );
                const endTime = new Date(`2000-01-01T${formData.end_time}:00`);
                if (endTime > startTime) {
                  return Math.round((endTime - startTime) / (1000 * 60));
                }
              }
              return 0;
            })(),
          }
        : {
            id: editingPackage?.id || null,
            price_type: formData.price_type,
            base_price: parseFloat(formData.base_price),
            pricing_rule_id:
              formData.pricing_rule_id != null
                ? parseInt(formData.pricing_rule_id)
                : null,
            start_time: formData.start_time,
            end_time: formData.end_time,
            no_hours: formData.no_hours ? parseInt(formData.no_hours) : null,
            max_no_per_day: 10,
            max_participant: parseInt(formData.max_participant),
          };

    try {
      onSave(packageData);
    } finally {
      setEditingPackage(null);
      resetForm();
      // keep button disabled until parent closes or saving prop toggles
      setTimeout(() => setLocalSubmitting(false), 1200);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            {editingPackage || isEditing ? "Edit Package" : "Add New Package"}
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={16} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <ScrollContainer>
              <Section>
                <SectionTitle>
                  <Package size={16} />
                  Package Details
                </SectionTitle>
                <FormRow>
                  {!(isPuja || isEvent) && (
                    <FormGroup>
                      <Label required>Package Type</Label>
                      <Select
                        value={formData.price_type}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            price_type: e.target.value,
                          })
                        }
                        required
                      >
                        <option value="HOURLY">Hourly Booking</option>
                        <option value="HALF_DAY">Half Day Package</option>
                        <option value="FULL_DAY">Full Day Package</option>
                      </Select>
                    </FormGroup>
                  )}
                  {(isPuja || isEvent) && (
                    <FormGroup>
                      <Label required>Package Name</Label>
                      <Select
                        value={formData.slot_name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            slot_name: e.target.value,
                          })
                        }
                        required
                      >
                        <option value="">
                          Choose a {isEvent ? "event" : "puja"} package
                        </option>
                        {isEvent ? (
                          <>
                            <option value="Individual Event (1 person)">
                              Individual Event (1 person)
                            </option>
                            <option value="Partner Event (2 person)">
                              Partner Event (2 person)
                            </option>
                            <option value="Family Event (5 person)">
                              Family Event (5 person)
                            </option>
                            <option value="Joint Family Event (10 person)">
                              Joint Family Event (10 person)
                            </option>
                          </>
                        ) : (
                          <>
                            <option value="Individual Puja (1 person)">
                              Individual Puja (1 person)
                            </option>
                            <option value="Partner Puja (2 person)">
                              Partner Puja (2 person)
                            </option>
                            <option value="Family Puja (5 person)">
                              Family Puja (5 person)
                            </option>
                            <option value="Joint Family Puja (10 person)">
                              Joint Family Puja (10 person)
                            </option>
                          </>
                        )}
                      </Select>
                    </FormGroup>
                  )}

                  <FormGroup>
                    <Label required>Base Price (₹)</Label>
                    <Input
                      type="number"
                      value={formData.base_price}
                      placeholder="Enter base price"
                      onChange={(e) =>
                        setFormData({ ...formData, base_price: e.target.value })
                      }
                      min="0"
                      step="0.01"
                      required
                    />
                  </FormGroup>
                </FormRow>
              </Section>

              <Section>
                <SectionTitle>
                  <Clock size={16} />
                  Time & Duration
                </SectionTitle>
                <FormRow>
                  <FormGroup>
                    <Label required>Start Time</Label>
                    <Input
                      type="time"
                      value={formData.start_time}
                      onChange={(e) =>
                        setFormData({ ...formData, start_time: e.target.value })
                      }
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label required>End Time</Label>
                    <Input
                      type="time"
                      value={formData.end_time}
                      onChange={(e) =>
                        setFormData({ ...formData, end_time: e.target.value })
                      }
                      required
                    />
                  </FormGroup>

                  {!(isPuja || isEvent) && formData.price_type === "HOURLY" && (
                    <FormGroup>
                      <Label>Number of Hours</Label>
                      <Input
                        type="number"
                        value={formData.no_hours}
                        placeholder="Duration in hours"
                        onChange={(e) =>
                          setFormData({ ...formData, no_hours: e.target.value })
                        }
                        min="1"
                      />
                    </FormGroup>
                  )}
                </FormRow>
              </Section>

              {!(isPuja || isEvent) && (
                <Section>
                  <SectionTitle>
                    <Users size={16} />
                    Capacity
                  </SectionTitle>
                  <FormRow>
                    <FormGroup>
                      <Label required>Maximum Participants</Label>
                      <Input
                        type="number"
                        value={formData.max_participant}
                        placeholder="Max number of people"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            max_participant: e.target.value,
                          })
                        }
                        min="1"
                        required
                      />
                    </FormGroup>
                  </FormRow>
                </Section>
              )}

              <Section>
                <SectionTitle>
                  <Calendar size={16} />
                  Pricing Rules
                </SectionTitle>
                <RuleGrid>
                  {(pricingRules || []).map((rule) => {
                    const id = Number(rule.id ?? 0);
                    const title = rule.name ?? `Rule ${id}`;
                    const description = rule.description ?? "";
                    const metaParts = [];
                    if (rule?.start_date || rule?.end_date) {
                      metaParts.push(
                        `${rule.start_date || ""} → ${rule.end_date || ""}`
                      );
                    }
                    const selected = Number(formData.pricing_rule_id) === id;

                    return (
                      <RuleCard
                        key={id}
                        type="button"
                        $selected={selected}
                        onClick={() => {
                          setFormData({
                            ...formData,
                            pricing_rule_id: selected ? null : id, // 👈 Toggle selection
                          });
                        }}
                        aria-pressed={selected}
                      >
                        <div className="title">
                          {title}
                          {selected && <CheckIcon size={14} />}
                        </div>
                        {description && (
                          <div className="desc">{description}</div>
                        )}
                        {metaParts.length > 0 && (
                          <div className="meta">{metaParts.join(" • ")}</div>
                        )}
                        <div className="chips">
                          {rule?.date_price != null &&
                            Number(rule.date_price) > 0 && (
                              <span className="chip">
                                Date ₹{Number(rule.date_price)}
                              </span>
                            )}
                          {rule?.time_price != null &&
                            Number(rule.time_price) > 0 && (
                              <span className="chip">
                                Time ₹{Number(rule.time_price)}
                              </span>
                            )}
                          {rule?.week_day_price != null &&
                            Number(rule.week_day_price) > 0 && (
                              <span className="chip">
                                Weekday ₹{Number(rule.week_day_price)}
                              </span>
                            )}
                        </div>
                      </RuleCard>
                    );
                  })}
                  {(pricingRules || []).length === 0 && (
                    <EmptyState>
                      <Calendar size={32} />
                      <div className="title">No Pricing Rules Found</div>
                      <div className="desc">
                        Create pricing rules to set up dynamic pricing for your
                        packages.
                      </div>
                    </EmptyState>
                  )}
                </RuleGrid>
              </Section>
            </ScrollContainer>

            <FormActions>
              <Button
                type="button"
                className="secondary"
                onClick={() => {
                  setEditingPackage(null);
                  resetForm();
                  onClose();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="primary"
                disabled={isSaving || localSubmitting}
              >
                {isSaving
                  ? "Saving..."
                  : editingPackage
                  ? "Update Package"
                  : "Create Package"}
              </Button>
            </FormActions>
          </Form>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

export default PackageModal;
