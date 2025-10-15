import React from "react";
import styled from "styled-components";

// Import Inter font with optimized weights
const FontImport = styled.div`
  @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");

  * {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

const Panel = styled.div`
  background: #fafafa;
  border-radius: 14px;
  padding: 16px;
  min-height: 0;
  border: 1px solid rgba(0, 0, 0, 0.04);
`;

const SuccessBanner = styled.div`
  padding: 10px 12px;
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 10px;
  color: #065f46;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 2px 12px rgba(16, 185, 129, 0.08);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: #1d1d1f;
  margin: 0;
  letter-spacing: -0.02em;
`;

const Subtitle = styled.p`
  font-size: 12px;
  color: #6e6e73;
  margin: 0;
  font-weight: 400;
  letter-spacing: -0.01em;
`;

const PrimaryButton = styled.button`
  padding: 8px 14px;
  background: linear-gradient(135deg, #007aff 0%, #0056d6 100%);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 6px rgba(0, 122, 255, 0.18);
  letter-spacing: -0.01em;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 122, 255, 0.24);
  }

  &:active {
    transform: translateY(0);
    transition: all 0.1s;
  }
`;

const Grid = styled.div`
  display: grid;
  gap: 14px;
  margin-bottom: 8px;

  /* Dynamic grid based on package count */
  &.single-package {
    grid-template-columns: 1fr;
    max-width: 380px;
    margin: 0 auto 20px auto;
  }

  &.two-packages {
    grid-template-columns: repeat(2, 1fr);
    max-width: 780px;
    margin: 0 auto 20px auto;
  }

  &.multiple-packages {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr !important;
    max-width: none !important;
    margin: 0 0 20px 0 !important;
    gap: 14px;
  }

  @media (max-width: 1024px) and (min-width: 769px) {
    &.multiple-packages {
      grid-template-columns: repeat(2, 1fr);
    }
    gap: 16px;
  }
`;

const PackageCard = styled.div`
  background: linear-gradient(180deg, #ffffff 0%, #f9fafb 100%);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  padding: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  box-shadow: 0 3px 16px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04);

  /* Enhanced styling for single package view */
  .single-package &,
  .two-packages & {
    padding: 18px;
    border-radius: 16px;
  }

  .single-package & {
    text-align: center;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
    border-color: rgba(0, 0, 0, 0.08);
  }
`;

const PackageTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 10px 0;
  line-height: 1.2;
  letter-spacing: -0.01em;
`;

const PackagePrice = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #30d158;
  margin-bottom: 14px;
  line-height: 1;
  letter-spacing: -0.02em;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 28px;
    height: 2px;
    background: linear-gradient(90deg, #30d158 0%, #34c759 100%);
    border-radius: 1px;
  }

  /* Center the price accent line when in single-package layout */
  .single-package &::after {
    left: 50%;
    transform: translateX(-50%);
  }
`;

const PackageInfo = styled.div`
  margin-bottom: 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #6e6e73;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: -0.004em;
  padding: 7px 10px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
`;

const InfoIcon = styled.svg`
  width: 16px;
  height: 16px;
  color: #6e6e73;
  stroke-width: 1.5;
  flex-shrink: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  padding-top: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
`;

const EditButton = styled.button`
  flex: 1;
  padding: 9px 12px;
  background: #ffffff;
  border: 1.5px solid #007aff;
  border-radius: 8px;
  color: #007aff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: -0.004em;

  &:hover {
    background: rgba(0, 122, 255, 0.06);
    border-color: #0056d6;
    color: #0056d6;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
    transition: all 0.1s;
  }
`;

const DeleteButton = styled.button`
  flex: 1;
  padding: 9px 12px;
  background: linear-gradient(135deg, #ff3b30 0%, #d70015 100%);
  border: none;
  border-radius: 8px;
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: -0.004em;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(215, 0, 21, 0.24);
  }

  &:active {
    transform: translateY(0);
    transition: all 0.1s;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6e6e73;
  animation: fadeIn 0.6s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(16px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const EmptyIcon = styled.div`
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.06);
`;

const EmptyTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #1d1d1f;
  margin: 0 0 8px 0;
  letter-spacing: -0.02em;
`;

const EmptyDescription = styled.p`
  font-size: 14px;
  color: #6e6e73;
  margin: 0 0 24px 0;
  line-height: 1.5;
  letter-spacing: -0.01em;
  max-width: 360px;
  margin-left: auto;
  margin-right: auto;
`;

const MorePackages = styled.div`
  text-align: center;
  padding: 10px;
  margin-top: 6px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 12px;
  color: #6e6e73;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.01em;
`;

const PackagesPanel = ({
  hall,
  selectedHall,
  successMessage,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const rawList = Array.isArray(selectedHall?.service_variation_list)
    ? selectedHall.service_variation_list
    : Array.isArray(hall?.service_variation_list)
    ? hall.service_variation_list
    : [];

  const serviceType = String(
    (selectedHall || hall)?.service_type || ""
  ).toUpperCase();
  const isPuja = serviceType === "PUJA";
  const isEvent = serviceType === "EVENT";

  // Collapse duplicates for EVENT by ignoring pricing_rule in the key
  const list = (() => {
    if (isEvent) {
      const buckets = new Map();
      for (const pkg of rawList || []) {
        const key = (() => {
          const typeKey = String(pkg.slot_name || pkg.price_type || "")
            .trim()
            .toUpperCase();
          const norm = (t) => {
            if (!t) return "";
            const [h, m] = String(t).split(":");
            const hh = String(h ?? "").padStart(2, "0");
            const mm = String(m ?? "00").padStart(2, "0");
            return `${hh}:${mm}`;
          };
          const start = norm(pkg.start_time);
          const end = norm(pkg.end_time);
          const maxP =
            pkg.max_participant == null
              ? ""
              : String(parseInt(pkg.max_participant));
          const base = (() => {
            const n = Number(pkg.base_price);
            return Number.isFinite(n)
              ? n.toFixed(2)
              : String(pkg.base_price || "");
          })();
          return `${typeKey}|${start}|${end}|${maxP}|${base}`;
        })();
        const existing = buckets.get(key);
        if (!existing) {
          buckets.set(key, pkg);
        } else {
          // Prefer one with explicit pricing_rule_data, otherwise with id, otherwise keep existing
          const pick = pkg?.pricing_rule_data
            ? pkg
            : existing?.pricing_rule_data
            ? existing
            : pkg?.id != null && (existing?.id == null || pkg.id > existing.id)
            ? pkg
            : existing;
          buckets.set(key, pick);
        }
      }
      return Array.from(buckets.values());
    }
    // For PUJA/HALL, keep API rows; only remove exact duplicate IDs
    return rawList.filter((pkg, idx, arr) => {
      const id = pkg?.id;
      if (id == null) return true;
      const firstIdx = arr.findIndex((p) => p?.id === id);
      return firstIdx === idx;
    });
  })();

  const formatPackageType = (priceType, slotName) => {
    if (isPuja) {
      // For PUJA, prioritize slotName (full name) over priceType (short name)
      if (slotName && slotName.trim()) {
        return slotName.trim();
      }
      // Fallback to mapping short price_type to full names
      switch (priceType) {
        case "Individual-1":
          return "Individual Puja (1 person)";
        case "Partner-2":
          return "Partner Puja (2 person)";
        case "Family-5":
          return "Family Puja (5 person)";
        case "Joint-10":
          return "Joint Family Puja (10 person)";
        default:
          return priceType || "Puja Slot";
      }
    }
    if (isEvent) {
      // For EVENT, prioritize slotName (full name) over priceType (short name)
      if (slotName && slotName.trim()) {
        return slotName.trim();
      }
      // Fallback to mapping short price_type to full names
      switch (priceType) {
        case "Individual-1":
          return "Individual Event (1 person)";
        case "Partner-2":
          return "Partner Event (2 person)";
        case "Family-5":
          return "Family Event (5 person)";
        case "Joint-10":
          return "Joint Family Event (10 person)";
        default:
          return priceType || "Event Slot";
      }
    }
    switch (priceType) {
      case "HOURLY":
        return "Hourly Package";
      case "HALF_DAY":
        return "Half Day Package";
      case "FULL_DAY":
        return "Full Day Package";
      default:
        return `${priceType} Package`;
    }
  };

  const formatPrice = (price) => {
    return price?.toLocaleString("en-IN") || price;
  };

  return (
    <>
      <FontImport />
      <Panel>
        {successMessage && (
          <SuccessBanner>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            {successMessage}
          </SuccessBanner>
        )}

        <Header>
          <HeaderLeft>
            <Title>
              {list.length}{" "}
              {isEvent ? "Event Slot" : isPuja ? "Puja Slot" : "Package"}
              {list.length !== 1 ? "s" : ""}
            </Title>
            <Subtitle>
              {isEvent
                ? "Manage event slots and pricing variations"
                : isPuja
                ? "Manage puja slots and pricing variations"
                : "Manage time slots and pricing variations"}
            </Subtitle>
          </HeaderLeft>
          <PrimaryButton onClick={() => onAdd(hall)}>
            {isEvent
              ? "Add Event Slot"
              : isPuja
              ? "Add Puja Slot"
              : "Add Package"}
          </PrimaryButton>
        </Header>

        {list.length > 0 ? (
          <>
            <Grid
              className={
                list.length === 1
                  ? "single-package"
                  : list.length === 2
                  ? "two-packages"
                  : "multiple-packages"
              }
            >
              {list.slice(0, 6).map((pkg, index) => (
                <PackageCard key={pkg.id || index}>
                  <PackageTitle>
                    {formatPackageType(pkg.price_type, pkg.slot_name)}
                  </PackageTitle>

                  <PackagePrice>₹{formatPrice(pkg.base_price)}</PackagePrice>

                  <PackageInfo>
                    <InfoItem>
                      <InfoIcon
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12,6 12,12 16,14" />
                      </InfoIcon>
                      {pkg.start_time} - {pkg.end_time}
                    </InfoItem>
                    <InfoItem>
                      <InfoIcon
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </InfoIcon>
                      Max {pkg.max_participant} Participants
                    </InfoItem>
                  </PackageInfo>

                  <ButtonGroup>
                    <EditButton onClick={() => onEdit(hall, pkg)}>
                      Edit
                    </EditButton>
                    <DeleteButton onClick={() => onDelete(hall, pkg.id)}>
                      Delete
                    </DeleteButton>
                  </ButtonGroup>
                </PackageCard>
              ))}
            </Grid>

            {list.length > 6 && (
              <MorePackages>
                +{list.length - 6} more{" "}
                {isEvent ? "event slot" : isPuja ? "puja slot" : "package"}
                {list.length - 6 !== 1 ? "s" : ""}
              </MorePackages>
            )}
          </>
        ) : (
          <EmptyState>
            <EmptyIcon>
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
              </svg>
            </EmptyIcon>
            <EmptyTitle>
              {isEvent
                ? "No event slots defined"
                : isPuja
                ? "No puja slots defined"
                : "No packages defined"}
            </EmptyTitle>
            <EmptyDescription>
              {isEvent
                ? "Add your first event slot to get started with pricing and availability"
                : isPuja
                ? "Add your first puja slot to get started with pricing and availability"
                : "Add your first package to get started with pricing and availability"}
            </EmptyDescription>
          </EmptyState>
        )}
      </Panel>
    </>
  );
};

export default PackagesPanel;
