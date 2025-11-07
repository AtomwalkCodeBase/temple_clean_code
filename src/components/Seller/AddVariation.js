// AddVariation.jsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import CustomerLayout from '../Customer/CustomerLayout';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { Plus, Check, ChevronRight, AlertCircle, Info, X as XIcon } from 'lucide-react';
import { getProductDetailList, getVariationList, processProductVariations, ProcessProductImages } from '../../services/customerServices';
import { useLocation } from 'react-router-dom';
import { AttributeEditor } from './ReusableComponents/AttributeEditor';
import { ImageUploader } from './ReusableComponents/ImageUploader';
import { BulkUpdateModal, ConfirmationModal } from './Modal/Modal2';
import { toast } from 'react-toastify';

// Styled Components (same as before, only new ones added)
const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  margin-bottom: 16px;

  @media (min-width: 768px) {
    padding: 24px;
    margin-bottom: 24px;
  }
`;

const FormHeader = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #2b2b2b;
  margin: 0 0 16px;

  @media (min-width: 768px) {
    font-size: 18px;
  }
`;

const Button = styled.button`
  padding: 10px 16px;
  border: 1px solid #b4bcff;
  background: #fff;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #05124b;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: 0.2s;

  &:hover { background: #f0f4ff; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }

  ${({ primary }) => primary && `
    background: #0008ff; color: white; border: none;
    box-shadow: 0 4px 12px rgba(0, 136, 255, 0.25);
    &:hover { background: #0046dd; }
  `}

  ${({ success }) => success && `
    background: #10b981; color: white; border: none;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
    &:hover { background: #059669; }
  `}
`;

const WarningBox = styled.div`
  background: #fef3c7;
  border: 1px solid #fbbf24;
  color: #92400e;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
`;

const ProductInfoContainer = styled.div`
  display: flex;
  gap: 20px;
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 12px;
  border: 1px solid #e5e7eb;

  @media (min-width: 768px) {
    width: 200px;
    height: 200px;
  }
`;

const ProductDetails = styled.div`
  flex: 1;
`;

const ProductTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px;
`;

const ProductCode = styled.span`
  display: inline-block;
  background: #f3f4f6;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 12px;
`;

const ProductDescription = styled.p`
  font-size: 14px;
  color: #4b5563;
  line-height: 1.6;
  margin: 0 0 16px;
`;

const ProductMetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 12px;
`;

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MetaLabel = styled.span`
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
`;

const MetaValue = styled.span`
  font-size: 14px;
  color: #111827;
  font-weight: 600;
`;

const Badge = styled.span`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  
  ${({ variant }) => {
    if (variant === 'active') return `background: #d1fae5; color: #065f46;`;
    if (variant === 'category') return `background: #dbeafe; color: #1e40af;`;
    if (variant === 'primary') return `background: #dbeafe; color: #1e40af;`;
    return `background: #f3f4f6; color: #6b7280;`;
  }}
`;

const InfoBox = styled.div`
  background: #eff6ff;
  border: 1px solid #93c5fd;
  color: #1e40af;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
  line-height: 1.5;
`;

const InfoIconWrapper = styled.div`
  flex-shrink: 0;
  margin-top: 2px;
`;

const InfoContent = styled.div`
  flex: 1;
`;

// Image Modal Styled Components
const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 16px;
  max-width: 90vw;
  max-height: 90vh;
  position: relative;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #e5e7eb;
`;

const ModalImageContainer = styled.div`
  padding: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  max-height: 70vh;
  overflow: auto;
`;

const ModalImage = styled.img`
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  border-radius: 8px;
`;

const ModalThumbnails = styled.div`
  display: flex;
  gap: 8px;
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
  overflow-x: auto;
`;

const Thumbnail = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid ${props => props.$active ? '#0008ff' : 'transparent'};
  
  &:hover {
    opacity: 0.8;
  }
`;

// Reusable Variation Row
const VariationRow = ({ v, attributes, selectedVariations, toggleVariationSelect, updateVariation, calculateAdditionalPrice, primaryAttribute, imagesByValue }) => {
  const add = calculateAdditionalPrice(v);
  const primaryValue = primaryAttribute ? v[primaryAttribute.name] : null;
  const imageCount = primaryValue && imagesByValue[primaryValue] ? imagesByValue[primaryValue].length : 0;

  return (
    <tr key={v.id} style={{ borderBottom: "1px solid #eee" }}>
      <td style={{ padding: "8px 4px" }}>
        <input type="checkbox" checked={selectedVariations.includes(v.id)} onChange={() => toggleVariationSelect(v.id)} />
      </td>
      {attributes.map((a) => (
        <td key={a.name} style={{ padding: "8px 4px" }}>{v[a.name]}</td>
      ))}
      <td style={{ padding: "8px 4px" }}>
        <input
          type="number"
          value={v.price}
          onChange={(e) => updateVariation(v.id, "price", e.target.value)}
          style={{ width: 90, padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
        />
      </td>
      <td style={{ padding: "8px 4px", color: "#059669" }}>
        {add > 0 ? `+${add}` : '—'}
      </td>
      <td style={{ padding: "8px 4px", fontWeight: 600 }}>₹{v.totalPrice || 0}</td>
      <td style={{ padding: "8px 4px" }}>
        <input
          type="number"
          value={v.stock}
          onChange={(e) => updateVariation(v.id, "stock", e.target.value)}
          style={{ width: 70, padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
        />
      </td>
      <td style={{ padding: "8px 4px" }}>
        <span style={{ background: '#e0e7ff', color: '#4338ca', padding: '4px 8px', borderRadius: 6, fontSize: 12 }}>
          {imageCount} {imageCount === 1 ? 'image' : 'images'}
        </span>
      </td>
    </tr>
  );
};

/**
 * ✅ Build FormData maintaining positional indices
 * IMPORTANT: Only send File objects for images that were actually updated
 * For unchanged existing images, send the URL string
 * 
 * Rules:
 * - If image has File object → it was updated → send File
 * - If image has URL but no File → it's unchanged → send URL string
 * - Maintain positional indices: image_file (0), image_file_1 (1), ..., image_file_9 (9)
 * 
 * @param {Object} params
 * @param {string} params.call_mode - "ADD_VARIATION" or "UPDATE_VARIATION"
 * @param {number} params.image_id - Variation value ID (optional)
 * @param {Array} params.images - Array of image objects/strings
 * @param {Array} params.originalImages - Original images for comparison (optional)
 * @returns {FormData} FormData with positional image keys
 */
const buildFormDataForValue = ({ call_mode, image_id, images = [], originalImages = [] }) => {
  const fd = new FormData();
  fd.append("call_mode", call_mode);
  if (image_id) fd.append("image_id", image_id);
  
  // Process up to 10 images maintaining their positional index
  images.slice(0, 10).forEach((img, index) => {
    // Skip null/undefined/empty images
    if (!img) return;
    
    const key = index === 0 ? "image_file" : `image_file_${index}`;
    
    // Extract current image URL
    const imgUrl = typeof img === 'string' ? img : img?.url;
    
    // Extract original image URL (for comparison)
    const originalImg = originalImages[index];
    const originalUrl = typeof originalImg === 'string' ? originalImg : originalImg?.url;
    
    // ✅ RULE: If image has a File object → it was updated → send File only
    if (img.file instanceof File) {
      fd.append(key, img.file);
    }
    // ✅ RULE: If image is unchanged (has URL, no File, matches original) → send URL string
    else if (imgUrl && typeof imgUrl === 'string' && imgUrl === originalUrl) {
      fd.append(key, imgUrl);
    }
    // ✅ RULE: If it's a new image (has URL but no original at this position) → send URL string
    else if (imgUrl && typeof imgUrl === 'string' && !originalUrl) {
      fd.append(key, imgUrl);
    }
    // ✅ Fallback: Handle direct string URLs
    else if (typeof img === 'string') {
      fd.append(key, img);
    }
  });
  
  return fd;
};

/**
 * Upload variation images using ProcessProductImages API
 * @param {FormData} formData - FormData with call_mode, image_id, and image files
 * @returns {Promise} API response
 */
const uploadVariationImagesAPI = async (formData) => {
  try {
    const response = await ProcessProductImages(formData);
    return response;
    // console.log("FORM DATA SENT TO SERVER:");
    // for (let p of formData.entries()) console.log(p[0], " => ", p[1]);
    // return Promise.resolve({ status: 200 });
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error;
  }
};

const AddVariation = () => {
  const location = useLocation();
  const productData = useMemo(() => location.state?.productData || {}, [location.state?.productData]);
  const [currentProductData, setCurrentProductData] = useState(productData);
  
  // ✅ Compute variationMode based on currentProductData (updates after API refresh)
  const variationMode = useMemo(() => {
    return (currentProductData?.variations?.length ?? 0) > 0 ? "edit" : "add";
  }, [currentProductData]);
  
  const basePrice = parseFloat(currentProductData.selling_price) || 0;

  const [step, setStep] = useState(1);
  const [attributes, setAttributes] = useState([]);
  const [variations, setVariations] = useState([]);
  const [variationList, setVariationList] = useState([]);
  const [selectedVariations, setSelectedVariations] = useState([]);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkAction, setBulkAction] = useState("price");
  const [bulkValue, setBulkValue] = useState("");
  const [primaryIndex, setPrimaryIndex] = useState(null);
  const [imagesByValue, setImagesByValue] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [vValIdByValue, setVValIdByValue] = useState({});
  const [activeImageByValue, setActiveImageByValue] = useState({});
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [modalValue, setModalValue] = useState(null);
  // console.log(JSON.stringify(productData))
  // console.log(variationMode)

  useEffect(() => {
    const fetchVariations = async () => {
      const response = await getVariationList();
      setVariationList(response || []);
    };
    fetchVariations();
  }, []);



/**
 * Initialize attributes from productData when in EDIT mode
 * Updates when currentProductData or variationList changes
 */
useEffect(() => {
  if (variationMode !== "edit" || !currentProductData?.variations || variationList.length === 0) return;

  const vValMap = {};
  const formattedAttributes = currentProductData.variations.map(variation => {
    const meta = variationList.find(v => v.name === variation.name);

    const allValues = [
      ...(meta?.v_list?.map(v => v[1]).filter(v => v && v !== "Not Selected") || []),
      ...variation.product_variations.map(v => v.value),
    ];

    const selectedValues = variation.product_variations
      .filter(v => v.is_active !== false)
      .map(v => v.value);

    const valuePrices = {};
    const valueDiscounts = {};
    
    variation.product_variations.forEach(v => {
      valuePrices[v.value] = parseFloat(v.additional_price) || 0;
      valueDiscounts[v.value] = parseFloat(v.discount) || 0;
      vValMap[v.value] = v.id; // ✅ store backend v_val_id mapping
    });

    return {
      name: variation.name,
      variation_name_id: meta?.id || null,
      allValues: [...new Set(allValues)],
      selectedValues,
      enabled: variation.product_variations.some(v => Number(v.additional_price) > 0),
      enabledDiscount: variation.product_variations.some(v => Number(v.discount) > 0),
      valuePrices,
      valueDiscounts,
      valueImages: {},
    };
  });

  setAttributes(formattedAttributes);
  setVValIdByValue(vValMap);          // ✅ assign v_val_id mapping
  setPrimaryIndex(0);                 // default first attr as primary

}, [variationMode, currentProductData, variationList]);

/**
 * Load existing images from productData when in EDIT mode
 * Normalizes AWS URLs to proper format for ImageUploader
 * ✅ FIX: Only load images from the PRIMARY variation attribute to avoid conflicts
 */
useEffect(() => {
  if (variationMode !== "edit" || !currentProductData?.variations || attributes.length === 0) return;

  const map = {};
  const primaryAttr = attributes[primaryIndex !== null ? primaryIndex : 0];
  
  // Only load images from the primary variation attribute
  if (primaryAttr) {
    const primaryVariation = currentProductData.variations.find(
      v => v.name === primaryAttr.name
    );
    
    if (primaryVariation) {
      primaryVariation.product_variations.forEach(vv => {
        const value = vv.value;

        if (!map[value]) map[value] = [];

        if (Array.isArray(vv.c_images)) {
          vv.c_images.forEach(imgUrl => {
            // Normalize AWS URLs - ImageUploader handles string URLs
            // Store as object with url property for consistency
            map[value].push({
              url: imgUrl,
              type: "EXISTING",
              image_id: vv.id,
              file: null, // No file for existing images
            });
          });
        }
      });
    }
  }

  setImagesByValue(map);
}, [variationMode, currentProductData, attributes, primaryIndex]);

/**
 * Snapshot of original attributes for change detection in EDIT mode
 */
const originalAttributesSnapshot = useMemo(() => {
  if (variationMode !== "edit") return null;

  return currentProductData.variations?.map((v) => {
    const meta = variationList.find((m) => m.name === v.name);

    const selected = v.product_variations
      .filter((pv) => pv.is_active !== false)
      .map((pv) => pv.value);

    const prices = {};
    const discounts = {};
    const enabledDiscount = v.product_variations.some(
      (pv) => Number(pv.discount) > 0
    );

    v.product_variations.forEach((pv) => {
      prices[pv.value] = parseFloat(pv.additional_price) || 0;
      discounts[pv.value] = parseFloat(pv.discount) || 0;
    });

    return {
      name: v.name,
      variation_name_id: meta?.id,
      selectedValues: selected,
      valuePrices: prices,
      valueDiscounts: discounts,
      enabledDiscount,
      enabled: v.product_variations.some((pv) => Number(pv.additional_price) > 0),
    };
  });
}, [currentProductData, variationList, variationMode]);


/**
 * ✅ Deep comparison helper for change detection
 * Sorts arrays and compares values, prices, discounts, and flags
 */
const deepCompareAttributes = (current, original) => {
  if (!original || original.length !== current.length) return false;

  // Sort by name for consistent comparison
  const sortedCurrent = [...current].sort((a, b) => a.name.localeCompare(b.name));
  const sortedOriginal = [...original].sort((a, b) => a.name.localeCompare(b.name));

  for (let i = 0; i < sortedCurrent.length; i++) {
    const curr = sortedCurrent[i];
    const orig = sortedOriginal[i];

    // Compare basic properties
    if (curr.name !== orig.name || 
        curr.variation_name_id !== orig.variation_name_id ||
        curr.enabled !== orig.enabled ||
        curr.enabledDiscount !== orig.enabledDiscount) {
      return false;
    }

    // Compare selectedValues (sorted)
    const currValues = [...curr.selectedValues].sort();
    const origValues = [...orig.selectedValues].sort();
    if (JSON.stringify(currValues) !== JSON.stringify(origValues)) {
      return false;
    }

    // Compare valuePrices (all values must match)
    const allValueKeys = [...new Set([...Object.keys(curr.valuePrices), ...Object.keys(orig.valuePrices)])];
    for (const key of allValueKeys) {
      const currPrice = Number(curr.valuePrices[key] || 0);
      const origPrice = Number(orig.valuePrices[key] || 0);
      if (currPrice !== origPrice) {
        return false;
      }
    }

    // Compare valueDiscounts (all values must match)
    const allDiscountKeys = [...new Set([...Object.keys(curr.valueDiscounts), ...Object.keys(orig.valueDiscounts)])];
    for (const key of allDiscountKeys) {
      const currDiscount = Number(curr.valueDiscounts[key] || 0);
      const origDiscount = Number(orig.valueDiscounts[key] || 0);
      if (currDiscount !== origDiscount) {
        return false;
      }
    }
  }

  return true;
};

/**
 * ✅ Smart change detection - only detects real changes
 * Handles unchecking and re-checking the same values correctly
 */
const hasAttributeChanges = useMemo(() => {
  if (variationMode !== "edit") {
    return attributes.some((a) => a.selectedValues.length > 0);
  }

  if (!originalAttributesSnapshot || originalAttributesSnapshot.length === 0) {
    return attributes.some((a) => a.selectedValues.length > 0);
  }

  const simplifiedCurrent = attributes.map((a) => ({
    name: a.name,
    variation_name_id: a.variation_name_id,
    selectedValues: a.selectedValues,
    valuePrices: a.valuePrices,
    valueDiscounts: a.valueDiscounts,
    enabled: a.enabled,
    enabledDiscount: a.enabledDiscount,
  }));

  return !deepCompareAttributes(simplifiedCurrent, originalAttributesSnapshot);
}, [attributes, originalAttributesSnapshot, variationMode]);




  // Update attribute
  const updateAttribute = useCallback((idx, field, value) => {
    setAttributes(attrs =>
      attrs.map((a, i) => {
        if (i !== idx) return a;
        if (field === "remove") return null;
        if (field === "name") {
          const selected = variationList.find(v => v.name === value);
          return {
            ...a,
            name: value,
            variation_name_id: selected?.id || null,
            allValues: [],
            selectedValues: [],
            valuePrices: {},
            valueDiscounts: {},
            enabled: false,
            enabledDiscount: false,
            enabledImages: false,
            valueImages: {},
          };
        }
        if (field === "allValues") return { ...a, allValues: value };
        return { ...a, [field]: value };
})
        .filter(Boolean)
    );
  }, [variationList]);

  const toggleValue = useCallback((attrIdx, value) => {
    setAttributes(attrs =>
      attrs.map((a, i) => {
        if (i !== attrIdx) return a;
        const selected = a.selectedValues.includes(value)
          ? a.selectedValues.filter(v => v !== value)
          : [...a.selectedValues, value];

        const valuePrices = { ...a.valuePrices };
        const valueDiscounts = { ...a.valueDiscounts };
        const valueImages = { ...a.valueImages };

        if (!selected.includes(value)) {
          delete valuePrices[value];
          delete valueDiscounts[value];
          delete valueImages[value];
        }

        return { ...a, selectedValues: selected, valuePrices, valueDiscounts, valueImages };
})
    );
  }, []);

  const togglePriceSettings = (idx) => {
    setAttributes(attrs => attrs.map((a, i) => i === idx ? { ...a, enabled: !a.enabled } : a));
  };

  const toggleDiscountSettings = (idx) => {
    setAttributes(attrs => attrs.map((a, i) => i === idx ? { ...a, enabledDiscount: !a.enabledDiscount } : a));
  };

  const updateValuePrice = (attrIdx, value, price) => {
    setAttributes(attrs =>
      attrs.map((a, i) =>
        i === attrIdx  ? { ...a, valuePrices: { ...a.valuePrices, [value]: price } } : a
      )
    );
  };

  const updateValueDiscount = (attrIdx, value, discount) => {
    setAttributes(attrs =>
      attrs.map((a, i) =>
        i === attrIdx ? { ...a, valueDiscounts: { ...a.valueDiscounts, [value]: discount } } : a
      )
    );
  };

  const updateValueImages = (attrIdx, value, images) => {
    setAttributes(attrs =>
      attrs.map((a, i) =>
        i === attrIdx
          ? { ...a, valueImages: { ...a.valueImages, [value]: images } }
          : a
      )
    );
  };

  const setPrimaryAttribute = (index, isPrimary) => { setPrimaryIndex(isPrimary ? index : null);};

  const generateVariations = useCallback(() => {
    const validAttrs = attributes.filter(a => a.name && a.selectedValues.length > 0);
    if (validAttrs.length === 0) return;

    const combos = validAttrs.reduce((acc, attr) => {
      if (acc.length === 0) return attr.selectedValues.map(v => ({ [attr.name]: v }));
      return acc.flatMap(c => attr.selectedValues.map(v => ({ ...c, [attr.name]: v })));
    }, []);

    const newVars = combos.map((c, i) => ({
      id: Date.now() + i,
      ...c,
      price: basePrice,
      stock: "",
      sku: `${currentProductData.product_code || 'PRD'}-${i + 1}`,
    }));

    setVariations(newVars);
    setStep(2);
}, [attributes, basePrice, currentProductData]);

  const calculateAdditionalPrice = useCallback((variation) => {
    return attributes.reduce((sum, attr) => {
      if (!attr.enabled) return sum;
      const val = variation[attr.name];
      return sum + (parseFloat(attr.valuePrices[val]) || 0);
    }, 0);
}, [attributes]);

  const toggleVariationSelect = (id) => {
    setSelectedVariations(prev => prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]);
  };

  const updateVariation = useCallback((id, field, value) => {
    setVariations(vars =>
      vars.map(v =>
        v.id === id
          ? {
              ...v,
              [field]: value,
              totalPrice: (parseFloat(field === "price" ? value : v.price) || 0) + calculateAdditionalPrice(v),
            }
          : v
      )
    );
}, [calculateAdditionalPrice]);

  const applyBulkUpdate = () => {
    if (!bulkValue) return;
    setVariations(vars =>
      vars.map(v =>
        selectedVariations.includes(v.id)
          ? {
              ...v,
              [bulkAction]: bulkValue,
              totalPrice: (parseFloat(bulkAction === "price" ? bulkValue : v.price) || 0) + calculateAdditionalPrice(v),
            }
          : v
      )
    );
    setShowBulkModal(false);
    setSelectedVariations([]);
    setBulkValue("");
  };

  const handleImageUpload = (value, images) => { setImagesByValue(prev => ({ ...prev, [value]: images }));};

  // Generate API Payload
// ✅ DRY function to build value list for ADD / UPDATE
// const buildValueList = (attr, originalValues, isEdit) =>
//   attr.selectedValues.map(value => ({
//     id: isEdit ? (originalValues[value] ?? null) : undefined,
//     value,
//     additional_price: Number(attr.valuePrices[value]) || 0,
//     is_discounted: attr.enabledDiscount && Number(attr.valueDiscounts[value]) > 0,
//     discount: Number(attr.valueDiscounts[value]) || 0,
//     ...(isEdit && originalValues[value] !== undefined && { is_active: true })
//   }));

/**
 * ✅ DRY Payload Generator
 * Generates payload for both ADD and UPDATE modes according to API specification
 */
const generatePayload = useCallback(() => {
  const isEdit = variationMode === "edit";

  // Build mapping of original variation data for UPDATE mode
  const original = (currentProductData?.variations || []).reduce((acc, v) => {
    acc[v.name] = {
      id: v.id,
      values: Object.fromEntries((v.product_variations || []).map(pv => [pv.value, pv.id]))
    };
    return acc;
  }, {});

  /**
   * Build value list for a single attribute
   * In ADD mode: no id field
   * In UPDATE mode: includes id for existing values, null for new values
   */
  const buildValueList = (attr, originalValues) =>
    attr.selectedValues.map(value => {
      const baseValue = {
        value,
        additional_price: Number(attr.valuePrices[value]) || 0,
        is_discounted: !!(
          attr.enabledDiscount &&
          Number(attr.valueDiscounts?.[value]) > 0
        ),
        discount: Number(attr.valueDiscounts?.[value]) || 0,
      };

      if (isEdit) {
        // UPDATE mode: include id (null for new values, existing id for updates)
        baseValue.id = originalValues?.[value] ?? null;
        // Include is_active for existing values
        if (originalValues?.[value] !== undefined) {
          baseValue.is_active = true;
        }
      }

      return baseValue;
    });

  return {
    variation_data: {
      call_mode: isEdit ? "UPDATE" : "ADD",
      product_code: currentProductData.product_code,
      product_variation_list: attributes
        .filter(a => a.selectedValues.length > 0)
        .map(attr => {
          const baseAttr = {
            variation_name_id: attr.variation_name_id,
            is_primary_one: attr.name === attributes[primaryIndex]?.name,
            v_value_list: buildValueList(attr, original?.[attr.name]?.values)
          };

          if (isEdit) {
            // UPDATE mode: include id and is_active
            baseAttr.id = original?.[attr.name]?.id ?? null;
            if (original?.[attr.name]?.id) {
              baseAttr.is_active = true;
            }
          }

          return baseAttr;
        })
    }
  };
}, [attributes, primaryIndex, variationMode, currentProductData]);



/**
 * Show confirmation modal before generating variations
 */
const handleGenerateConfirm = () => setShowConfirmModal(true);

/**
 * ✅ Confirm and process variation generation
 * Handles both ADD and UPDATE modes
 */
const confirmGenerate = async () => {
  const payload = generatePayload();
  // console.log("PAYLOAD SENT:", JSON.stringify(payload, null, 2));

  try {
    const res = await processProductVariations(payload);
    
    // Check response status
    if (res?.status !== 200 && res?.status !== undefined) {
      throw new Error("Variation processing failed. Please try again.");
    }

    toast.success(
      variationMode === "add" 
        ? "Variations added successfully!" 
        : "Variations updated successfully!"
    );

    // ✅ Refresh product data with proper parameters
    const refreshedData = await getProductDetailList(
      "product_code", 
      currentProductData.product_code
    );
    
    setCurrentProductData(refreshedData);
    
    // ✅ Update vValIdByValue mapping after refresh
    if (refreshedData?.variations) {
      const vValMap = {};
      refreshedData.variations.forEach(variation => {
        variation.product_variations.forEach(vv => {
          vValMap[vv.value] = vv.id;
        });
      });
      setVValIdByValue(vValMap);
    }
    
    // Move to step 2 and generate variations table
    setStep(2);
    generateVariations();
    setShowConfirmModal(false);

  } catch (e) {
    console.error("Variation processing failed → ", e);
    toast.error(e?.message || "Failed to process variations. Please try again.");
  }
};

/**
 * ✅ Upload variation images for primary attribute values
 * Maintains positional indices: image_file (0), image_file_1 (1), ..., image_file_9 (9)
 * Sends File objects for updated images, URL strings for unchanged existing images
 */
const handleSaveImages = async () => {
  const primary = attributes[primaryIndex];
  if (!primary) {
    toast.warning("Please select a primary variation first.");
    return;
  }

  let successCount = 0;
  let errorCount = 0;
  let hasChanges = false;

  try {
    // ✅ FIX: Filter by PRIMARY variation attribute name first
    const primaryVariation = (currentProductData?.variations || []).find(
      v => v.name === primary.name
    );
    
    if (!primaryVariation) {
      toast.error(`Primary variation "${primary.name}" not found in product data.`);
      return;
    }
    
    // ✅ Process each value with its index to ensure correct matching
    for (let valueIndex = 0; valueIndex < primary.selectedValues.length; valueIndex++) {
      const value = primary.selectedValues[valueIndex];
      const imgs = imagesByValue[value] || [];
      
      // ✅ CRITICAL FIX: Get original product_variation for THIS specific value
      // First try exact match, then try by index position as fallback
      let originalProductVariation = primaryVariation.product_variations?.find(
        pv => String(pv.value).trim() === String(value).trim()
      );
      
      // Fallback: If exact match fails, try by index position (in case values are reordered)
      if (!originalProductVariation && primaryVariation.product_variations?.length > valueIndex) {
        const byIndex = primaryVariation.product_variations[valueIndex];
        if (String(byIndex?.value).trim() === String(value).trim()) {
          originalProductVariation = byIndex;
        }
      }
      
      if (!originalProductVariation && variationMode === "edit") {
        console.error(`❌ No product_variation found for value "${value}" (index ${valueIndex}) in primary "${primary.name}"`);
        console.error('Current value:', value);
        console.error('Available product_variations:', primaryVariation.product_variations?.map((pv, idx) => ({
          index: idx,
          id: pv.id,
          value: pv.value
        })));
        toast.error(`Cannot find variation for "${value}". Please refresh and try again.`);
        continue; // Skip this value
      }
      
      const originalImages = originalProductVariation?.c_images?.map(url => ({ 
        url, 
        type: "EXISTING" 
      })) || [];
      
      // Check if there are any changes (new files, removed images, or reordered images)
      const hasNewFiles = imgs.some(img => img?.file instanceof File);
      
      // Check if images were removed (current count < original count)
      const hasRemovedImages = imgs.length < originalImages.length;
      
      // Check if images were reordered (positions changed)
      const hasReordered = imgs.length === originalImages.length && 
        imgs.some((img, idx) => {
          const imgUrl = img?.url || img;
          const origUrl = originalImages[idx]?.url;
          return imgUrl !== origUrl;
        });
      
      // Skip if no changes at all (no new files, no removals, no reordering)
      if (!hasNewFiles && !hasRemovedImages && !hasReordered && imgs.length === originalImages.length) {
        continue;
      }

      hasChanges = true;

      // ✅ CRITICAL FIX: Get v_val_id for THIS specific variation value
      // MUST use originalProductVariation.id - this is the correct ID for this value
      const image_id = originalProductVariation?.id;
      
      if (!image_id && variationMode === "edit") {
        console.error(`❌ CRITICAL: No image_id found for value "${value}" in primary variation "${primary.name}"`);
        console.error('Available product_variations:', primaryVariation.product_variations?.map(pv => ({
          id: pv.id,
          value: pv.value
        })));
        toast.error(`Cannot find variation ID for "${value}". Please refresh and try again.`);
        continue;
      }
      
      // Determine call_mode based on variation mode and whether image_id exists
      const call_mode = variationMode === "edit" && image_id 
        ? "UPDATE_VARIATION" 
        : "ADD_VARIATION";

      // Debug logging
      console.log(`Uploading images for variation:`, {
        primaryAttribute: primary.name,
        value: value,
        image_id: image_id,
        call_mode: call_mode,
        imagesCount: imgs.length,
        hasNewFiles: hasNewFiles
      });

      // Build FormData with all images maintaining positional indices
      // Only sends File objects for updated images, URL strings for unchanged ones
      const formData = buildFormDataForValue({
        call_mode,
        image_id: image_id || undefined, // Only include if exists
        images: imgs, // Current images (may include updated Files)
        originalImages: originalImages, // Original images for comparison
      });
      
      // Debug: Log FormData contents
      console.log(`FormData for ${value}:`);
      for (let [key, val] of formData.entries()) {
        console.log(`  ${key}:`, val instanceof File ? `File(${val.name})` : val);
      }

      try {
        await uploadVariationImagesAPI(formData);
        successCount++;
      } catch (error) {
        console.error(`Failed to upload images for ${value}:`, error);
        errorCount++;
      }
    } // End of for loop

    if (successCount > 0) {
      toast.success(`Successfully uploaded images for ${successCount} variation(s).`);
      
      // Refresh product data to get updated image URLs
      const refreshedData = await getProductDetailList(
        "product_code", 
        currentProductData.product_code
      );
      setCurrentProductData(refreshedData);
    }

    if (errorCount > 0) {
      toast.warning(`Failed to upload images for ${errorCount} variation(s).`);
    }

    if (!hasChanges) {
      toast.info("No image changes detected.");
    }

  } catch (error) {
    console.error("Image upload process failed:", error);
    toast.error("Failed to upload images. Please try again.");
  }
};

  const primaryAttribute = primaryIndex !== null ? attributes[primaryIndex] : null;
  const canProceed = attributes.some(a => a.selectedValues.length > 0);

  /**
   * ✅ Check if there are any image changes across all variation values
   * Returns true if any variation value has: new files, removed images, or reordered images
   */
  const hasImageChanges = useMemo(() => {
    if (!primaryAttribute) return false;

    // In ADD mode: Show button if any images have been uploaded (have File objects)
    if (variationMode === "add") {
      return primaryAttribute.selectedValues.some(value => {
        const imgs = imagesByValue[value] || [];
        return imgs.length > 0 && imgs.some(img => img?.file instanceof File);
      });
    }

    // In EDIT mode: Compare with original images to detect changes
    if (variationMode === "edit" && !currentProductData?.variations) {
      return false;
    }

    const primaryVariation = currentProductData.variations.find(
      v => v.name === primaryAttribute.name
    );

    if (!primaryVariation) return false;

    // Check each variation value for changes
    for (const value of primaryAttribute.selectedValues) {
      const imgs = imagesByValue[value] || [];
      
      const originalProductVariation = primaryVariation.product_variations?.find(
        pv => String(pv.value).trim() === String(value).trim()
      );
      
      const originalImages = originalProductVariation?.c_images?.map(url => ({ 
        url, 
        type: "EXISTING" 
      })) || [];

      // Check for new files (uploaded images)
      const hasNewFiles = imgs.some(img => img?.file instanceof File);
      
      // Check if images were removed
      const hasRemovedImages = imgs.length < originalImages.length;
      
      // Check if images were reordered (positions changed)
      const hasReordered = imgs.length === originalImages.length && 
        imgs.some((img, idx) => {
          const imgUrl = img?.url || img;
          const origUrl = originalImages[idx]?.url;
          return imgUrl !== origUrl;
        });

      // If any change detected, return true
      if (hasNewFiles || hasRemovedImages || hasReordered) {
        return true;
      }
    }

    return false;
  }, [primaryAttribute, imagesByValue, currentProductData, variationMode]);

  return (
    <CustomerLayout>
      {/* Product Info */}
<AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <FormHeader>Product Information</FormHeader>
              <ProductInfoContainer>
                <ProductImage 
                  src={currentProductData.image} 
                  alt={currentProductData.product_name}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/200?text=No+Image';
                  }}
                />
                <ProductDetails>
                  <ProductTitle>{currentProductData.product_name}</ProductTitle>
                  <ProductCode>{currentProductData.product_code}</ProductCode>
                  <ProductDescription>{currentProductData.description}</ProductDescription>
                  
                  <ProductMetaRow>
                    <MetaItem>
                      <MetaLabel>Base Price</MetaLabel>
                      <MetaValue>₹{currentProductData.selling_price}</MetaValue>
                    </MetaItem>
                    
                    <MetaItem>
                      <MetaLabel>Category</MetaLabel>
                      <Badge variant="category">{currentProductData.category}</Badge>
                    </MetaItem>
                    
                    <MetaItem>
                      <MetaLabel>Status</MetaLabel>
                      <Badge variant={currentProductData.is_active ? 'active' : ''}>
                        {currentProductData.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </MetaItem>

                    {currentProductData.discount > 0 && (
                      <MetaItem>
                        <MetaLabel>Discount</MetaLabel>
                        <MetaValue>{currentProductData.discount}%</MetaValue>
                      </MetaItem>
                    )}
                  </ProductMetaRow>
                </ProductDetails>
              </ProductInfoContainer>
            </Card>
          </motion.div>
        </AnimatePresence>

      {/* Step Indicator */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: 16,
        background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', borderRadius: 12, marginBottom: 24
      }}>
        <div style={{ flex: 1, textAlign: 'center', padding: '8px 16px', background: step === 1 ? '#0008ff' : 'white', color: step === 1 ? 'white' : '#64748b', borderRadius: 20, fontWeight: 500 }}>
          <span style={{ width: 24, height: 24, borderRadius: '50%', background: step === 1 ? 'white' : '#e2e8f0', color: step === 1 ? '#0008ff' : '#64748b', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, marginRight: 8 }}>1</span>
          Define Variations
        </div>
        <ChevronRight size={20} color="#94a3b8" />
        <div style={{ flex: 1, textAlign: 'center', padding: '8px 16px', background: step === 2 ? '#0008ff' : 'white', color: step === 2 ? 'white' : '#64748b', borderRadius: 20, fontWeight: 500 }}>
          <span style={{ width: 24, height: 24, borderRadius: '50%', background: step === 2 ? 'white' : '#e2e8f0', color: step === 2 ? '#0008ff' : '#64748b', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, marginRight: 8 }}>2</span>
          Upload Images & Review
        </div>
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <FormHeader>{variationMode === "edit" ? "Edit" : "Manage" } Product Variations</FormHeader>
            {primaryAttribute && <span style={{ background: '#dbeafe', color: '#1e40af', padding: '4px 12px', borderRadius: 20, fontSize: 12 }}>Primary: {primaryAttribute.name}</span>}
          </div>

          <InfoBox>
            <InfoIconWrapper>
              <Info size={20} />
            </InfoIconWrapper>
            <InfoContent>
              <strong>Configuration Guidelines</strong>
              <br />
              • Pricing and discount settings are optional for each variation.
              <br />
              • please checked the primary variation, if you want to add variation-specific images.
              {/* • Primary variation designation is mandatory for variation-specific image management */}
              <br />
              • Image assignment functionality becomes available after primary variation selection.
            </InfoContent>
          </InfoBox>

          {attributes.map((attr, idx) => (
            <AttributeEditor
              key={idx}
              attr={attr}
              idx={idx}
              updateAttribute={updateAttribute}
              variationList={variationList}
              toggleValue={toggleValue}
              togglePriceSettings={togglePriceSettings}
              toggleDiscountSettings={toggleDiscountSettings}
              updateValuePrice={updateValuePrice}
              updateValueDiscount={updateValueDiscount}
              updateValueImages={updateValueImages}
              attributes={attributes}
              isPrimary={primaryIndex === idx}
              onPrimaryChange={setPrimaryAttribute}
            />
          ))}

          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <Button onClick={() => setAttributes([...attributes, {
              name: "", variation_name_id: null, allValues: [], selectedValues: [], enabled: false, enabledDiscount: false, valuePrices: {}, valueDiscounts: {}, valueImages: {}
            }])}>
              <Plus size={16} /> Add Attribute
            </Button>
            {canProceed && (
              <Button
  success
  onClick={() => {
    if (variationMode === "add") return handleGenerateConfirm();     // ADD → always call API
    if (variationMode === "edit" && hasAttributeChanges) return handleGenerateConfirm(); // EDIT + changes → call API
    setStep(2);  // EDIT + no changes → skip API
  }}
>
  <Check size={16} />
  {variationMode === "add"
    ? "Generate Variations"
    : hasAttributeChanges
      ? "Generate Variations"
      : "Next Step"}
</Button>
            )}
          </div>
        </Card>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <>
          {/* Image Upload */}
          {primaryAttribute ? (
            <Card>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <FormHeader>Upload Variation Images</FormHeader>
                <Button onClick={() => {
                  // ✅ When going back from Step 2, ensure Edit mode is active
                  // variationMode will automatically be "edit" if variations exist
                  setStep(1);
                }}>← Back</Button>
              </div>
              <p style={{ color: '#64748b', marginBottom: 20 }}>
                Upload images for each <strong>{primaryAttribute.name}</strong> variation.
              </p>
              {primaryAttribute.selectedValues.map(value => (
                <div key={value} style={{ marginBottom: 16, padding: 16, background: '#f8fafc', borderRadius: 12, border: '2px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <strong>{primaryAttribute.name}: {value}</strong>
                    <span style={{ background: '#e0e7ff', color: '#4338ca', padding: '4px 8px', borderRadius: 6, fontSize: 12 }}>
                      {(imagesByValue[value] || []).length} images
                    </span>
                  </div>
                  <ImageUploader
                    images={imagesByValue[value] || []}
                    onChange={(updater) => {
                      const current = imagesByValue[value] || [];
                      const updated = typeof updater === 'function' ? updater(current) : updater;
                      handleImageUpload(value, updated);
                    }}
                    max={6}
                    activeImage={activeImageByValue[value] || null}
                    setActiveImage={(url) => {
                      setActiveImageByValue(prev => ({ ...prev, [value]: url }));
                      // Open modal when image is clicked
                      const allImages = imagesByValue[value] || [];
                      setModalImages(allImages);
                      setModalValue(value);
                      setShowImageModal(true);
                    }}
                    uniqueId={value} // ✅ Pass value as uniqueId to make input IDs unique per variation
                  />
                </div>
              ))}
              
              {/* ✅ Show save button only if there are image changes */}
              {hasImageChanges && (
                <div style={{ marginTop: 16, textAlign: 'center' }}>
                  <Button primary onClick={handleSaveImages} style={{ padding: "14px 32px", fontSize: 16 }}>
                    {variationMode === "edit" ? "Update All Images" : "Save All Images"}
                  </Button>
                </div>
              )}
            </Card>
          ) : (
            <Card>
              <Button style={{marginLeft: "auto"}} onClick={() => setStep(1)}>← Back</Button>
              <WarningBox>
                <AlertCircle size={20} />
                <div>
                  <strong>No primary variation selected.</strong> Images will be assigned to each variation individually later.
                  <br />
                  <em>To upload images now, please select a Primary Variation in Step 1.</em>
                </div>
              </WarningBox>
            </Card>
          )}

          {/* Variations Table */}
          {variations.length > 0 && (
            <Card>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <FormHeader>Generated Variations ({variations.length})</FormHeader>
                <div style={{ display: 'flex', gap: 8 }}>
                  {selectedVariations.length > 0 && (
                    <Button onClick={() => setShowBulkModal(true)}>
                      Bulk Update ({selectedVariations.length})
                    </Button>
                  )}
                </div>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 600 }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #b4d5ff" }}>
                      <th style={{ padding: "8px 4px" }}><input type="checkbox" onChange={(e) => setSelectedVariations(e.target.checked ? variations.map(v => v.id) : [])} /></th>
                      {attributes.filter(a => a.selectedValues.length > 0).map(a => (
                        <th key={a.name} style={{ padding: "8px 4px", textAlign: "left" }}>{a.name}</th>
                      ))}
                      <th style={{ padding: "8px 4px" }}>Price</th>
                      <th style={{ padding: "8px 4px" }}>Add'l</th>
                      <th style={{ padding: "8px 4px" }}>Total</th>
                      <th style={{ padding: "8px 4px" }}>Stock</th>
                      <th style={{ padding: "8px 4px" }}>Images</th>
                    </tr>
                  </thead>
                  <tbody>
                    {variations.map(v => (
                      <VariationRow
                        key={v.id}
                        v={v}
                        attributes={attributes.filter(a => a.selectedValues.length > 0)}
                        selectedVariations={selectedVariations}
                        toggleVariationSelect={toggleVariationSelect}
                        updateVariation={updateVariation}
                        calculateAdditionalPrice={calculateAdditionalPrice}
                        primaryAttribute={primaryAttribute}
                        imagesByValue={imagesByValue}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* <div style={{ marginTop: 24, textAlign: 'center' }}>
                <Button primary style={{ padding: '14px 32px', fontSize: 16 }}>
                  Save All Variations
                </Button>
              </div> */}
            </Card>
          )}
        </>
      )}

      {/* Modals */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmGenerate}
        title="Generate Variations"
        message="Are you sure you want to generate these variations? This will create all combinations."
      />

      <BulkUpdateModal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        onApply={applyBulkUpdate}
        action={bulkAction}
        setAction={setBulkAction}
        value={bulkValue}
        setValue={setBulkValue}
      />

      {/* Image Modal */}
      <AnimatePresence>
        {showImageModal && modalImages.length > 0 && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowImageModal(false)}
          >
            <ModalContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
                  {modalValue ? `Images for ${modalValue}` : 'Image Preview'}
                </h3>
                <button
                  onClick={() => setShowImageModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 8,
                  }}
                >
                  <XIcon size={24} color="#6b7280" />
                </button>
              </ModalHeader>
              <ModalImageContainer>
                <ModalImage
                  src={modalValue && activeImageByValue[modalValue] 
                    ? activeImageByValue[modalValue] 
                    : (typeof modalImages[0] === 'string' ? modalImages[0] : modalImages[0]?.url || modalImages[0])}
                  alt="Preview"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400?text=Image+Not+Found';
                  }}
                />
              </ModalImageContainer>
              {modalImages.length > 1 && (
                <ModalThumbnails>
                  {modalImages.map((img, idx) => {
                    const imgUrl = typeof img === 'string' ? img : img?.url;
                    const isActive = modalValue && activeImageByValue[modalValue] === imgUrl;
                    return (
                      <Thumbnail
                        key={idx}
                        src={imgUrl}
                        alt={`Thumbnail ${idx + 1}`}
                        $active={isActive}
                        onClick={() => {
                          if (modalValue) {
                            setActiveImageByValue(prev => ({ ...prev, [modalValue]: imgUrl }));
                          }
                        }}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/60?text=Error';
                        }}
                      />
                    );
                  })}
                </ModalThumbnails>
              )}
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </CustomerLayout>
  );
};

export default AddVariation;