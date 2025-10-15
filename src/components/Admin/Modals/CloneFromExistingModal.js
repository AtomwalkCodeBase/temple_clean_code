import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Check, X } from "lucide-react";
import {
  getTempleServicesList,
  processTempleServiceData,
} from "../../../services/templeServices";
import {
  cleanPackageForAPI,
  dedupePackagesBySignature,
  pruneNulls,
} from "../../../services/serviceUtils";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1200;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(
      1200px 600px at 20% -10%,
      rgba(0, 86, 214, 0.2),
      transparent
    ),
    radial-gradient(
      1200px 600px at 120% 110%,
      rgba(0, 86, 214, 0.18),
      transparent
    ),
    rgba(15, 23, 42, 0.55);
`;

const Modal = styled.div`
  width: 100%;
  max-width: 980px;
  max-height: 90vh;
  overflow: hidden;
  border-radius: 20px;
  position: relative;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.85),
    rgba(255, 255, 255, 0.92)
  );
  backdrop-filter: blur(16px);
  box-shadow: 0 30px 80px rgba(2, 6, 23, 0.3);
  border: 1px solid rgba(226, 232, 240, 0.6);
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #0056d6 0%, #1e67df 50%, #3b7ff0 100%);
  color: #fff;
  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 800;
    letter-spacing: -0.01em;
  }
  p {
    margin: 4px 0 0 0;
    opacity: 0.9;
    font-size: 12px;
  }
`;

const CloseBtn = styled.button`
  border: 1px solid rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(6px);
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }
`;

const Body = styled.div`
  padding: 20px 24px;
  overflow: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Row = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
`;

const Select = styled.select`
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #ffffff;
  min-width: 320px;
`;

// Removed search box for a cleaner, focused flow

const Toggles = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    border: 1px solid #e5e7eb;
    border-radius: 999px;
    background: #fff;
    cursor: pointer;
    font-weight: 600;
    color: #334155;
  }
`;

const Section = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
`;

const SectionHeader = styled.div`
  background: linear-gradient(180deg, #f8fafc, #f1f5f9);
  border-bottom: 1px solid #e2e8f0;
  padding: 12px 14px;
  font-weight: 800;
  font-size: 13px;
  color: #0f172a;
`;

const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  padding: 12px;
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const PkgCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #ffffff;
  box-shadow: 0 6px 18px rgba(2, 6, 23, 0.06);
  .title {
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.01em;
  }
  .price {
    color: #16a34a;
    font-weight: 900;
    font-size: 18px;
  }
  .row {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #475569;
    font-size: 12px;
  }
`;

const Footer = styled.div`
  padding: 16px 20px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  background: #fff;
`;

const Btn = styled.button`
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid ${(p) => (p.$primary ? "#2563eb" : "#e5e7eb")};
  background: ${(p) =>
    p.$primary ? "linear-gradient(135deg, #0056d6, #1e67df)" : "#fff"};
  color: ${(p) => (p.$primary ? "#fff" : "#0f172a")};
  font-weight: 800;
  cursor: pointer;
  box-shadow: ${(p) =>
    p.$primary
      ? "0 8px 22px rgba(37,99,235,0.35)"
      : "0 4px 12px rgba(2,6,23,0.06)"};
  transition: all 0.2s ease;
  letter-spacing: 0.01em;
  &:hover {
    transform: translateY(-1px);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid #e5e7eb;
  color: #334155;
  background: #f8fafc;
`;

const formatPrice = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
const timeRange = (s, e) =>
  `${String(s || "").slice(0, 5)} - ${String(e || "").slice(0, 5)}`;

export default function CloneFromExistingModal({
  isOpen,
  onClose,
  targetService,
  serviceType,
  templeId,
  onCloned,
}) {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  // search removed
  const [selectedId, setSelectedId] = useState("");
  const [includePackages, setIncludePackages] = useState(true);
  const [includeAdvance, setIncludeAdvance] = useState(true);
  const [includeRefund, setIncludeRefund] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Friendly label for current service type (no hooks to avoid conditional usage)
  const labelForType = (() => {
    const st = String(serviceType || "").toUpperCase();
    if (st === "PUJA") return "Puja";
    if (st === "EVENT") return "Event";
    return "Hall";
  })();

  useEffect(() => {
    if (!isOpen) return;
    const fetchList = async () => {
      setLoading(true);
      try {
        const resp = await getTempleServicesList();
        const raw = Array.isArray(resp)
          ? resp
          : Array.isArray(resp?.data)
          ? resp.data
          : Array.isArray(resp?.results)
          ? resp.results
          : [];
        const filtered = raw
          .filter((s) => String(s?.temple_id) === String(templeId))
          .filter(
            (s) =>
              String(s?.service_type || "").toUpperCase() ===
              String(serviceType || "").toUpperCase()
          )
          .filter((s) => s?.service_id !== targetService?.service_id);
        setList(filtered);
      } catch (e) {
        setList([]);
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, [isOpen, templeId, serviceType, targetService]);

  const filtered = list;
  const selected = useMemo(
    () => filtered.find((s) => s.service_id === selectedId) || null,
    [filtered, selectedId]
  );

  const previewPackages = useMemo(() => {
    const isPuja = String(serviceType || "").toUpperCase() === "PUJA";
    const pkgs = Array.isArray(selected?.service_variation_list)
      ? selected.service_variation_list
      : [];
    const deduped = dedupePackagesBySignature(pkgs, isPuja);
    return deduped;
  }, [selected, serviceType]);

  const handleClone = async () => {
    if (!selected || submitting) return;
    setSubmitting(true);
    try {
      const isPuja = String(serviceType || "").toUpperCase() === "PUJA";
      const payload = {
        call_mode: "UPDATE",
        temple_id: templeId,
        service_id: targetService?.service_id,
        name: targetService?.name,
        service_type: serviceType,
        description: targetService?.description || "",
      };

      if (includeAdvance) {
        payload.adv_policy_id =
          selected?.adv_policy_id ?? selected?.adv_policy_data?.id ?? null;
      }
      if (includeRefund) {
        payload.refund_policy_id =
          selected?.refund_policy_id ??
          selected?.refund_policy_data?.id ??
          null;
      }

      if (includePackages) {
        // Clean and ensure we DO NOT carry over source variation IDs (they belong to another service)
        const cleaned = (previewPackages || []).map((p) =>
          cleanPackageForAPI(
            p,
            selected?.pricing_rule_id ?? selected?.pricing_rule_data?.id,
            isPuja
          )
        );
        const sanitized = cleaned.map((v) => {
          const out = { ...v };
          // Backend expects the id key to exist with null value for inserts
          out.id = null;
          // Ensure numeric types
          if (typeof out.base_price === "string")
            out.base_price = parseFloat(out.base_price);
          if (typeof out.max_no_per_day === "string")
            out.max_no_per_day = parseInt(out.max_no_per_day);
          if (typeof out.max_participant === "string")
            out.max_participant = parseInt(out.max_participant);
          // Drop pricing_rule_id if not resolvable for this temple
          if (out.pricing_rule_id == null || out.pricing_rule_id === "")
            delete out.pricing_rule_id;
          // Backend expects PUJA variations to have a generic price_type (e.g., FIXED); keep human label in slot_name
          if (isPuja) {
            // Preserve the distinctive price_type values for PUJA (e.g., Joint-10)
            // while still keeping a readable slot_name for UI
            const original = out.slot_name || out.price_type || "";
            out.slot_name = original || "Puja Slot";
            out.price_type = original || "FIXED";
          }
          return out;
        });
        // final dedupe on cleaned set
        const final = dedupePackagesBySignature(sanitized, isPuja).map((v) => ({
          ...v,
          // Ensure minimal fields that backend requires exist
          no_hours: v.no_hours == null ? null : v.no_hours,
          max_no_per_day: v.max_no_per_day == null ? 1 : v.max_no_per_day,
          start_time: v.start_time || "06:00",
          end_time: v.end_time || "09:00",
        }));
        payload.service_variation_list = final;
        // Also set service-level pricing_rule_id if present
        const serviceRule =
          selected?.pricing_rule_id ?? selected?.pricing_rule_data?.id;
        if (serviceRule != null) payload.pricing_rule_id = serviceRule;
        // For PUJA, align capacity to a representative package
        if (isPuja && final.length > 0) {
          const rep = final[0];
          payload.capacity =
            typeof rep.max_participant === "string"
              ? parseInt(rep.max_participant)
              : rep.max_participant || 0;
          payload.duration_minutes = rep.duration_minutes || 0;
        }
      } else {
        // ensure backend accepts empty variations array when not cloning packages
        payload.service_variation_list = [];
      }

      // Ensure core numeric fields exist per backend expectations
      const st = String(serviceType || "").toUpperCase();
      const serviceRule =
        selected?.pricing_rule_id ??
        selected?.pricing_rule_data?.id ??
        targetService?.pricing_rule_id ??
        targetService?.pricing_rule_data?.id;
      payload.pricing_rule_id =
        serviceRule != null ? Number(serviceRule) : undefined;
      payload.base_price = Number(
        targetService?.base_price || selected?.base_price || 0
      );
      if (st === "HALL") {
        payload.capacity =
          payload.capacity != null
            ? Number(payload.capacity)
            : Number(targetService?.capacity || selected?.capacity || 0);
        payload.duration_minutes =
          payload.duration_minutes != null
            ? Number(payload.duration_minutes)
            : Number(
                targetService?.duration_minutes ||
                  selected?.duration_minutes ||
                  0
              );
      } else {
        // PUJA usually expects capacity/duration too
        payload.capacity =
          payload.capacity != null
            ? Number(payload.capacity)
            : Number(targetService?.capacity || selected?.capacity || 0);
        payload.duration_minutes =
          payload.duration_minutes != null
            ? Number(payload.duration_minutes)
            : Number(
                targetService?.duration_minutes ||
                  selected?.duration_minutes ||
                  0
              );
      }

      const res = await processTempleServiceData(pruneNulls(payload));

      if (onCloned)
        onCloned(
          res?.service_data || { service_id: targetService?.service_id }
        );
      onClose?.();
    } catch (e) {
      // basic alert; in production you'd want a nicer error surface
      alert(e?.message || "Failed to clone policies");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Overlay>
      <Modal>
        <Header>
          <div>
            <h3>Clone policies from an existing {labelForType}</h3>
            <p>Select a source to import packages and policies</p>
          </div>
          <CloseBtn onClick={onClose}>
            <X size={16} />
          </CloseBtn>
        </Header>
        <Body>
          <Row>
            <Select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
            >
              <option value="">Select {labelForType} to clone from</option>
              {filtered.map((s) => (
                <option key={s.service_id} value={s.service_id}>
                  {s.name}
                </option>
              ))}
            </Select>
          </Row>

          <Toggles>
            <label>
              <input
                type="checkbox"
                checked={includePackages}
                onChange={(e) => setIncludePackages(e.target.checked)}
              />{" "}
              Packages
            </label>
            <label>
              <input
                type="checkbox"
                checked={includeAdvance}
                onChange={(e) => setIncludeAdvance(e.target.checked)}
              />{" "}
              Advance
            </label>
            <label>
              <input
                type="checkbox"
                checked={includeRefund}
                onChange={(e) => setIncludeRefund(e.target.checked)}
              />{" "}
              Refund
            </label>
          </Toggles>

          {selected && (
            <>
              <Section>
                <SectionHeader>
                  Packages{" "}
                  {Array.isArray(previewPackages)
                    ? `(${previewPackages.length})`
                    : ""}
                </SectionHeader>
                <Cards>
                  {(previewPackages || []).map((p, idx) => (
                    <PkgCard key={idx}>
                      <div className="title">
                        {p.slot_name || p.price_type || "Package"}
                      </div>
                      <div className="price">{formatPrice(p.base_price)}</div>
                      <div className="row">
                        {timeRange(p.start_time, p.end_time)}
                      </div>
                      <div className="row">
                        Max {p.max_participant || p.max_no_per_day || 0}{" "}
                        Participants
                      </div>
                    </PkgCard>
                  ))}
                  {(!previewPackages || previewPackages.length === 0) && (
                    <div style={{ padding: 12, color: "#64748b" }}>
                      No packages available
                    </div>
                  )}
                </Cards>
              </Section>

              <Row style={{ gap: 8 }}>
                <Chip>
                  Advance:{" "}
                  {selected?.adv_policy_data?.name ||
                    selected?.adv_policy_name ||
                    "None"}
                </Chip>
                <Chip>
                  Refund:{" "}
                  {selected?.refund_policy_data?.name ||
                    selected?.refund_policy_name ||
                    "None"}
                </Chip>
              </Row>
            </>
          )}
          {loading && (
            <div style={{ color: "#64748b" }}>Loading services...</div>
          )}
        </Body>
        <Footer>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Chip>Temple: {templeId}</Chip>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <Btn onClick={onClose}>Cancel</Btn>
            <Btn
              $primary
              disabled={!selected || submitting}
              onClick={handleClone}
            >
              <Check size={16} style={{ marginRight: 6 }} />
              Clone
            </Btn>
          </div>
        </Footer>
      </Modal>
    </Overlay>
  );
}
