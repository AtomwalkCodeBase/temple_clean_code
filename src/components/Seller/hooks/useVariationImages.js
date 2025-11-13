import { useState, useEffect, useMemo, useCallback } from 'react';

/**
 * Hook to manage variation images
 */
export const useVariationImages = ({
  variationMode,
  mode,
  currentProductData,
  attributes,
  primaryIndex
}) => {
  const [imagesByValue, setImagesByValue] = useState({});
  const [activeImageByValue, setActiveImageByValue] = useState({});

  /**
   * Load existing images from productData when in EDIT/IMAGE_UPDATE mode
   */
  useEffect(() => {
    if ((variationMode !== "edit" && mode !== 'image_update') || !currentProductData?.variations || attributes.length === 0) return;

    const map = {};
    const primaryAttr = attributes[primaryIndex !== null ? primaryIndex : 0];
    
    if (primaryAttr) {
      const primaryVariation = currentProductData.variations.find(v => v.name === primaryAttr.name);
      
      if (primaryVariation) {
        primaryVariation.product_variations.forEach(vv => {
          const value = vv.value;
          if (!map[value]) map[value] = [];

          if (Array.isArray(vv.c_images)) {
            vv.c_images.forEach(imgUrl => {
              map[value].push({
                url: imgUrl,
                type: "EXISTING",
                image_id: vv.id,
                file: null,
              });
            });
          }
        });
      }
    }

    setImagesByValue(map);
  }, [variationMode, currentProductData, attributes, primaryIndex, mode]);

  const handleImageUpload = useCallback((value, images) => {
    setImagesByValue(prev => ({ ...prev, [value]: images }));
  }, []);

  const handleSetActiveImage = useCallback((value, url) => {
    setActiveImageByValue(prev => ({ ...prev, [value]: url }));
  }, []);

  /**
   * Check if there are image changes
   */
  const hasImageChanges = useMemo(() => {
    const primaryAttribute = attributes[primaryIndex !== null ? primaryIndex : null];
    if (!primaryAttribute) return false;

    if (variationMode === "add") {
      return primaryAttribute.selectedValues.some(value => {
        const imgs = imagesByValue[value] || [];
        return imgs.length > 0 && imgs.some(img => img?.file instanceof File);
      });
    }

    if (variationMode === "edit" && !currentProductData?.variations) {
      return false;
    }

    const primaryVariation = currentProductData?.variations?.find(
      v => v.name === primaryAttribute.name
    );

    if (!primaryVariation) return false;

    for (const value of primaryAttribute.selectedValues) {
      const imgs = imagesByValue[value] || [];
      
      const originalProductVariation = primaryVariation.product_variations?.find(
        pv => String(pv.value).trim() === String(value).trim()
      );
      
      const originalImages = originalProductVariation?.c_images?.map(url => ({ 
        url, 
        type: "EXISTING" 
      })) || [];

      const hasNewFiles = imgs.some(img => img?.file instanceof File);
      const hasRemovedImages = imgs.length < originalImages.length;
      const hasReordered = imgs.length === originalImages.length && 
        imgs.some((img, idx) => {
          const imgUrl = img?.url || img;
          const origUrl = originalImages[idx]?.url;
          return imgUrl !== origUrl;
        });

      if (hasNewFiles || hasRemovedImages || hasReordered) {
        return true;
      }
    }

    return false;
  }, [attributes, primaryIndex, imagesByValue, currentProductData, variationMode]);

  return {
    imagesByValue,
    activeImageByValue,
    hasImageChanges,
    handleImageUpload,
    handleSetActiveImage,
    setImagesByValue
  };
};

