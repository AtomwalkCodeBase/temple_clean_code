// Utility functions for variation management

// Build FormData for image upload with positional indices

export const buildFormDataForValue = ({ call_mode, image_id, images = [], originalImages = [] }) => {
  const fd = new FormData();
  fd.append("call_mode", call_mode);
  if (image_id) fd.append("image_id", image_id);
  
  images.slice(0, 10).forEach((img, index) => {
    if (!img) return;
    
    const key = index === 0 ? "image_file" : `image_file_${index}`;
    const imgUrl = typeof img === 'string' ? img : img?.url;
    const originalImg = originalImages[index];
    const originalUrl = typeof originalImg === 'string' ? originalImg : originalImg?.url;
    
    if (img.file instanceof File) {
      fd.append(key, img.file);
    } else if (imgUrl && typeof imgUrl === 'string' && imgUrl === originalUrl) {
      fd.append(key, imgUrl);
    } else if (imgUrl && typeof imgUrl === 'string' && !originalUrl) {
      fd.append(key, imgUrl);
    } else if (typeof img === 'string') {
      fd.append(key, img);
    }
  });
  
  return fd;
};

// Generate payload for both ADD and UPDATE modes

export const generateVariationPayload = ({
  attributes,
  primaryIndex,
  variationMode,
  currentProductData
}) => {
  const isEdit = variationMode === "edit";

  // Build mapping of original variation data for UPDATE mode
  const original = (currentProductData?.variations || []).reduce((acc, v) => {
    acc[v.name] = {
      id: v.id,
      values: Object.fromEntries((v.product_variations || []).map(pv => [pv.value, pv.id]))
    };
    return acc;
  }, {});

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
        baseValue.id = originalValues?.[value] ?? null;
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
            is_primary_one: attributes[primaryIndex]?.name === attr.name,
            v_value_list: buildValueList(attr, original?.[attr.name]?.values)
          };

          if (isEdit) {
            baseAttr.id = original?.[attr.name]?.id ?? null;
            if (original?.[attr.name]?.id) {
              baseAttr.is_active = true;
            }
          }

          return baseAttr;
        })
    }
  };
};

// Deep comparison helper for change detection

export const deepCompareAttributes = (current, original) => {
  if (!Array.isArray(current) || !Array.isArray(original)) {
    return false;
  }

  if (current.length !== original.length) {
    return false;
  }

  const normalizeList = (list) =>
    [...list]
      .map((item) => ({
        name: item.name ?? "",
        variation_name_id: item.variation_name_id ?? null,
        is_primary_one: !!item.is_primary_one,
        v_value_list: [...(item.v_value_list || [])]
          .map((value) => ({
            id: value.id ?? null,
            value: value.value,
            additional_price: Number(value.additional_price) || 0,
            discount: Number(value.discount) || 0,
            is_discounted: !!value.is_discounted,
            is_active: value.is_active !== false,
          }))
          .sort((a, b) => (a.value || "").localeCompare(b.value || "")),
      }))
      .sort((a, b) => {
        const left = a.variation_name_id ?? a.name ?? "";
        const right = b.variation_name_id ?? b.name ?? "";
        return String(left).localeCompare(String(right));
      });

  const normalizedCurrent = normalizeList(current);
  const normalizedOriginal = normalizeList(original);

  for (let i = 0; i < normalizedCurrent.length; i++) {
    const curr = normalizedCurrent[i];
    const orig = normalizedOriginal[i];

    if (curr.variation_name_id !== orig.variation_name_id) return false;
    if (curr.is_primary_one !== orig.is_primary_one) return false;
    if (curr.v_value_list.length !== orig.v_value_list.length) return false;

    for (let j = 0; j < curr.v_value_list.length; j++) {
      const currValue = curr.v_value_list[j];
      const origValue = orig.v_value_list[j];

      if (currValue.value !== origValue.value) return false;
      if (currValue.additional_price !== origValue.additional_price) return false;
      if (currValue.discount !== origValue.discount) return false;
      if (currValue.is_discounted !== origValue.is_discounted) return false;
      if (currValue.is_active !== origValue.is_active) return false;
      if ((currValue.id ?? null) !== (origValue.id ?? null)) return false;
    }
  }

  return true;
};

