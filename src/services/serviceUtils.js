// Shared utilities for service data normalization and cloning safety

// Remove keys whose values are null or undefined before API call
export const pruneNulls = (obj) => {
  const out = { ...obj };
  Object.keys(out).forEach((k) => {
    if (out[k] == null) delete out[k];
  });
  return out;
};

// Create a normalized signature for reliable duplicate detection
export const normalizeSignature = (pkg, isPuja = false) => {
  const typeKey = isPuja
    ? String(pkg.slot_name || pkg.price_type || "")
        .trim()
        .toUpperCase()
    : String(pkg.price_type || "")
        .trim()
        .toUpperCase();
  const normalizeTime = (t) => {
    if (!t) return "";
    const [h, m] = String(t).split(":");
    const hh = String(h ?? "").padStart(2, "0");
    const mm = String(m ?? "00").padStart(2, "0");
    return `${hh}:${mm}`;
  };
  const start = normalizeTime(pkg.start_time);
  const end = normalizeTime(pkg.end_time);
  const hours =
    pkg.no_hours == null || pkg.no_hours === ""
      ? ""
      : String(parseInt(pkg.no_hours));
  const maxPerDay =
    pkg.max_no_per_day == null ? "" : String(parseInt(pkg.max_no_per_day));
  const maxParticipant =
    pkg.max_participant == null ? "" : String(parseInt(pkg.max_participant));
  const base = (() => {
    const n = Number(pkg.base_price);
    return Number.isFinite(n) ? n.toFixed(2) : String(pkg.base_price || "");
  })();
  const ruleId = pkg.pricing_rule_id ?? pkg.pricing_rule_data?.id ?? "";
  return isPuja
    ? `${typeKey}|${start}|${end}|${hours}|${maxPerDay}|${maxParticipant}|${base}|${ruleId}`
    : `${typeKey}|${start}|${end}|${hours}|${maxPerDay}|${maxParticipant}|${base}|${ruleId}`;
};

// Helper function to clean package/variation data for API
export const cleanPackageForAPI = (
  pkg,
  fallbackPricingRuleId,
  isPuja = false
) => {
  const resolvedPricingRuleId =
    pkg.pricing_rule_id ??
    pkg.pricing_rule_data?.id ??
    fallbackPricingRuleId ??
    null;
  const base =
    typeof pkg.base_price === "string"
      ? parseFloat(pkg.base_price)
      : pkg.base_price;
  const maxPerDay =
    typeof pkg.max_no_per_day === "string"
      ? parseInt(pkg.max_no_per_day)
      : pkg.max_no_per_day;
  const maxParticipant =
    typeof pkg.max_participant === "string"
      ? parseInt(pkg.max_participant)
      : pkg.max_participant;
  if (isPuja) {
    const slotName = pkg.slot_name ?? pkg.price_type ?? "";
    let shortPriceType = "FIXED";
    if (slotName) {
      if (slotName.includes("Joint")) shortPriceType = "Joint-10";
      else if (slotName.includes("Individual")) shortPriceType = "Individual-1";
      else if (slotName.includes("Partner")) shortPriceType = "Partner-2";
      else if (slotName.includes("Family")) shortPriceType = "Family-5";
      else shortPriceType = slotName.substring(0, 20);
    }
    let durationMinutes = 0;
    if (pkg.start_time && pkg.end_time) {
      const startTime = new Date(`2000-01-01T${pkg.start_time}:00`);
      const endTime = new Date(`2000-01-01T${pkg.end_time}:00`);
      if (endTime > startTime) {
        durationMinutes = Math.round((endTime - startTime) / (1000 * 60));
      }
    }
    const out = {
      id: pkg.id ?? null,
      slot_name: slotName,
      price_type: shortPriceType,
      base_price: base,
      pricing_rule_id: resolvedPricingRuleId,
      start_time: pkg.start_time,
      end_time: pkg.end_time,
      max_no_per_day: maxPerDay ?? 1,
      max_participant: maxParticipant,
      no_hours: null,
      duration_minutes: durationMinutes,
    };
    if (Array.isArray(pkg.available_priests)) {
      out.available_priests = pkg.available_priests;
    }
    return out;
  }
  return {
    id: pkg.id ?? null,
    price_type: pkg.price_type,
    base_price: base,
    pricing_rule_id: resolvedPricingRuleId,
    start_time: pkg.start_time,
    end_time: pkg.end_time,
    no_hours: pkg.no_hours ?? null,
    max_no_per_day: maxPerDay,
    max_participant: maxParticipant,
  };
};

// Dedupe packages by normalized signature
export const dedupePackagesBySignature = (packages, isPuja = false) => {
  const seen = new Set();
  const result = [];
  for (const pkg of packages || []) {
    const sig = normalizeSignature(pkg, isPuja);
    if (!seen.has(sig)) {
      seen.add(sig);
      result.push(pkg);
    }
  }
  return result;
};

// Resolve current temple id from login/localStorage
export const getCurrentTempleId = () => {
  try {
    const directKeys = [
      "templeId",
      "temple_id",
      "adminTempleId",
      "tenantTempleId",
      "activeTempleId",
      "selectedTempleId",
    ];
    for (const k of directKeys) {
      const v =
        localStorage.getItem(k) ||
        (typeof sessionStorage !== "undefined"
          ? sessionStorage.getItem(k)
          : null);
      if (v) return String(v);
    }
    // Try common JSON blobs
    const candidates = [
      "auth",
      "user",
      "profile",
      "login",
      "loginData",
      "adminUser",
      "admin",
      "session",
      "currentUser",
    ];
    for (const k of candidates) {
      const raw =
        localStorage.getItem(k) ||
        (typeof sessionStorage !== "undefined"
          ? sessionStorage.getItem(k)
          : null);
      if (!raw) continue;
      try {
        const obj = JSON.parse(raw);
        const id =
          obj?.temple_id ||
          obj?.templeId ||
          obj?.user?.temple_id ||
          obj?.profile?.temple_id ||
          obj?.admin?.temple_id;
        if (id) return String(id);
      } catch {}
    }
  } catch {}
  return null;
};
export function toAPIDate(dateKey) {
  const [y, m, d] = dateKey.split("-").map((v) => Number.parseInt(v, 10));
  const dt = new Date(y, m - 1, d);
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  const day = String(dt.getDate()).padStart(2, "0");
  return `${day}-${months[dt.getMonth()]}-${dt.getFullYear()}`;
}
export const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
export const indianStates = [
  { name: "Andhra Pradesh", short: "AP", code: "AP", number: "37" },
  { name: "Arunachal Pradesh", short: "AR", code: "AR", number: "12" },
  { name: "Assam", short: "AS", code: "AS", number: "18" },
  { name: "Bihar", short: "BR", code: "BR", number: "10" },
  { name: "Chhattisgarh", short: "CG", code: "CG", number: "22" },
  { name: "Goa", short: "GA", code: "GA", number: "30" },
  { name: "Gujarat", short: "GJ", code: "GJ", number: "24" },
  { name: "Haryana", short: "HR", code: "HR", number: "06" },
  { name: "Himachal Pradesh", short: "HP", code: "HP", number: "02" },
  { name: "Jharkhand", short: "JH", code: "JH", number: "20" },
  { name: "Karnataka", short: "KA", code: "KA", number: "29" },
  { name: "Kerala", short: "KL", code: "KL", number: "32" },
  { name: "Madhya Pradesh", short: "MP", code: "MP", number: "23" },
  { name: "Maharashtra", short: "MH", code: "MH", number: "27" },
  { name: "Manipur", short: "MN", code: "MN", number: "14" },
  { name: "Meghalaya", short: "ML", code: "ML", number: "17" },
  { name: "Mizoram", short: "MZ", code: "MZ", number: "15" },
  { name: "Nagaland", short: "NL", code: "NL", number: "13" },
  { name: "Odisha", short: "OD", code: "OD", number: "21" },
  { name: "Punjab", short: "PB", code: "PB", number: "03" },
  { name: "Rajasthan", short: "RJ", code: "RJ", number: "08" },
  { name: "Sikkim", short: "SK", code: "SK", number: "11" },
  { name: "Tamil Nadu", short: "TN", code: "TN", number: "33" },
  { name: "Telangana", short: "TS", code: "TS", number: "36" },
  { name: "Tripura", short: "TR", code: "TR", number: "16" },
  { name: "Uttar Pradesh", short: "UP", code: "UP", number: "09" },
  { name: "Uttarakhand", short: "UK", code: "UK", number: "05" },
  { name: "West Bengal", short: "WB", code: "WB", number: "19" },
  {
    name: "Andaman and Nicobar Islands",
    short: "AN",
    code: "AN",
    number: "35",
  },
  { name: "Chandigarh", short: "CH", code: "CH", number: "04" },
  {
    name: "Dadra and Nagar Haveli and Daman and Diu",
    short: "DN",
    code: "DN",
    number: "26",
  },
  { name: "Delhi", short: "DL", code: "DL", number: "07" },
  { name: "Jammu and Kashmir", short: "JK", code: "JK", number: "01" },
  { name: "Ladakh", short: "LA", code: "LA", number: "38" },
  { name: "Lakshadweep", short: "LD", code: "LD", number: "31" },
  { name: "Puducherry", short: "PY", code: "PY", number: "34" },
  { name: "Puducherry", short: "PY", code: "PY", number: "34" },
];
