import { useState, useEffect, useCallback, useMemo } from 'react';

/**
 * Hook to manage variation attributes
 */
export const useVariationAttributes = ({
  variationMode,
  currentProductData,
  variationList,
  mode,
  selectedVariationIds
}) => {
  const [attributes, setAttributes] = useState([]);
  const [primaryIndex, setPrimaryIndex] = useState(null);
  const [vValIdByValue, setVValIdByValue] = useState({});

  /**
   * Initialize attributes from productData when in EDIT mode
   */
  useEffect(() => {
    if (variationMode !== "edit" || !currentProductData?.variations || variationList.length === 0) return;

    let variationsToLoad = currentProductData.variations;
    if ((mode === 'edit' || mode === 'image_update') && selectedVariationIds.length > 0) {
      variationsToLoad = currentProductData.variations.filter(v => selectedVariationIds.includes(v.id));
    }

    const vValMap = {};
    const formattedAttributes = variationsToLoad.map((variation) => {
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
        if (!vValMap[variation.name]) {
          vValMap[variation.name] = {};
        }
        vValMap[variation.name][v.value] = v.id;
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
    setVValIdByValue(vValMap);
    
    const primaryVariationIndex = formattedAttributes.findIndex((attr, idx) => {
      const variation = variationsToLoad[idx];
      return variation?.is_primary_one;
    });
    setPrimaryIndex(primaryVariationIndex >= 0 ? primaryVariationIndex : null);
  }, [variationMode, currentProductData, variationList, mode, selectedVariationIds]);

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

  const togglePriceSettings = useCallback((idx) => {
    setAttributes(attrs => attrs.map((a, i) => i === idx ? { ...a, enabled: !a.enabled } : a));
  }, []);

  const toggleDiscountSettings = useCallback((idx) => {
    setAttributes(attrs => attrs.map((a, i) => i === idx ? { ...a, enabledDiscount: !a.enabledDiscount } : a));
  }, []);

  const updateValuePrice = useCallback((attrIdx, value, price) => {
    setAttributes(attrs =>
      attrs.map((a, i) =>
        i === attrIdx ? { ...a, valuePrices: { ...a.valuePrices, [value]: price } } : a
      )
    );
  }, []);

  const updateValueDiscount = useCallback((attrIdx, value, discount) => {
    setAttributes(attrs =>
      attrs.map((a, i) =>
        i === attrIdx ? { ...a, valueDiscounts: { ...a.valueDiscounts, [value]: discount } } : a
      )
    );
  }, []);

  const setPrimaryAttribute = useCallback((index, isPrimary) => {
    setPrimaryIndex(isPrimary ? index : null);
  }, []);

  const addAttribute = useCallback(() => {
    setAttributes(prev => [...prev, {
      name: "",
      variation_name_id: null,
      allValues: [],
      selectedValues: [],
      enabled: false,
      enabledDiscount: false,
      valuePrices: {},
      valueDiscounts: {},
      valueImages: {}
    }]);
  }, []);

  const canProceed = useMemo(() => {
    return attributes.some((a) => a.name && a.selectedValues.length > 0);
  }, [attributes]);

  const primaryAttribute = primaryIndex !== null ? attributes[primaryIndex] : null;

  return {
    attributes,
    primaryIndex,
    primaryAttribute,
    vValIdByValue,
    canProceed,
    updateAttribute,
    toggleValue,
    togglePriceSettings,
    toggleDiscountSettings,
    updateValuePrice,
    updateValueDiscount,
    setPrimaryAttribute,
    addAttribute,
    setAttributes
  };
};

