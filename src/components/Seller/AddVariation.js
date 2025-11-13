import React, { useCallback, useEffect, useMemo, useState } from 'react';
import CustomerLayout from '../Customer/CustomerLayout';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { getVariationList, processProductVariations, ProcessProductImages, getProductDetailList } from '../../services/customerServices';
import { toast } from 'react-toastify';
import { ConfirmationModal } from './Modal/Modal2';

// Components
import { ProductInfoCard } from './ReusableComponents/ProductInfoCard';
import { StepIndicator } from './ReusableComponents/StepIndicator';
import { VariationStepOne } from './ReusableComponents/VariationStepOne';
import { VariationStepTwo } from './ReusableComponents/VariationStepTwo';

// Hooks
import { useVariationAttributes } from './hooks/useVariationAttributes';
import { useVariationImages } from './hooks/useVariationImages';

// Utils
import { buildFormDataForValue, generateVariationPayload, deepCompareAttributes } from './utils/variationUtils';

const AddVariation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    productData = {}, 
    mode = null,
    step: initialStep = 1,
    selectedVariationIds = []
  } = location.state || {};

  const [currentProductData, setCurrentProductData] = useState(productData);
  const [step, setStep] = useState(initialStep);
  const [variationList, setVariationList] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  // Determine variation mode
  const variationMode = useMemo(() => {
    if (mode === 'image_update') return 'edit';
    if (mode === 'edit') return 'edit';
    if (mode === 'add_new') return 'add';
    return (currentProductData?.variations?.length ?? 0) > 0 ? "edit" : "add";
  }, [currentProductData, mode]);

  // Fetch variation list
  useEffect(() => {
    const fetchVariations = async () => {
      try {
        const response = await getVariationList();
        setVariationList(response || []);
      } catch (error) {
        console.error(error.message)
      }
    };
    fetchVariations();
  }, []);

  // Use custom hooks
  const {
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
  } = useVariationAttributes({
    variationMode,
    currentProductData,
    variationList,
    mode,
    selectedVariationIds
  });

  const {
    imagesByValue,
    activeImageByValue,
    hasImageChanges,
    handleImageUpload,
    handleSetActiveImage,
    setImagesByValue
  } = useVariationImages({
    variationMode,
    mode,
    currentProductData,
    attributes,
    primaryIndex
  });

  /**
   * Snapshot of original attributes for change detection
   */
  const originalAttributesSnapshot = useMemo(() => {
    if (variationMode !== "edit" || !currentProductData?.variations || variationList.length === 0) return null;

    let variationsToSnapshot = currentProductData.variations;
    if ((mode === 'edit' || mode === 'image_update') && selectedVariationIds.length > 0) {
      variationsToSnapshot = currentProductData.variations.filter(v => selectedVariationIds.includes(v.id));
    }

    return variationsToSnapshot.map((v) => {
      const meta = variationList.find((m) => m.name === v.name);
      const valueList = (v.product_variations || []).map((pv) => ({
        id: pv.id ?? null,
        value: pv.value,
        additional_price: Number(pv.additional_price) || 0,
        discount: Number(pv.discount) || 0,
        is_discounted: Number(pv.discount) > 0 || pv.is_discounted === true,
        is_active: pv.is_active !== false,
      }));

      return {
        name: v.name,
        variation_name_id: meta?.id ?? null,
        is_primary_one: v.is_primary_one === true,
        v_value_list: valueList,
      };
    });
  }, [currentProductData, variationList, variationMode, mode, selectedVariationIds]);

  /**
   * Check if there are attribute changes
   */
  const hasAttributeChanges = useMemo(() => {
    if (variationMode !== "edit") {
      return attributes.some((a) => a.selectedValues.length > 0);
    }

    if (!originalAttributesSnapshot || originalAttributesSnapshot.length === 0) {
      return attributes.some((a) => a.selectedValues.length > 0);
    }

    const simplifiedCurrent = attributes
      .filter((a) => a.name && a.selectedValues.length > 0)
      .map((a, idx) => ({
        name: a.name,
        variation_name_id: a.variation_name_id ?? null,
        is_primary_one: primaryIndex === idx,
        v_value_list: a.selectedValues.map((value) => {
          const additionalPrice = Number(a.valuePrices?.[value]) || 0;
          const discount = Number(a.valueDiscounts?.[value]) || 0;
          return {
            id: vValIdByValue?.[a.name]?.[value] ?? null,
            value,
            additional_price: additionalPrice,
            discount,
            is_discounted: (a.enabledDiscount && discount > 0) || discount > 0,
            is_active: true,
          };
        }),
      }));

    return !deepCompareAttributes(simplifiedCurrent, originalAttributesSnapshot);
  }, [attributes, originalAttributesSnapshot, variationMode, primaryIndex, vValIdByValue]);

  /**
   * Handle variation generation (ADD/UPDATE)
   */
  const handleGenerateConfirmAdd = async () => {
    if (!canProceed) {
      toast.info("Please select at least one variation value before continuing.");
      return;
    }

    const payload = generateVariationPayload({
      attributes,
      primaryIndex,
      variationMode,
      currentProductData
    });

    try {
      const res = await processProductVariations(payload);
      
      if (res?.status !== 200 && res?.status !== undefined) {
        throw new Error("Variation processing failed. Please try again.");
      }

      // console.log(payload)

      toast.success(
        variationMode === "add" 
          ? "Variations added successfully!" 
          : "Variations updated successfully!"
      );

      const refreshedData = await getProductDetailList("product_code", currentProductData.product_code);
      const product = Array.isArray(refreshedData) ? refreshedData[0] : refreshedData;
      if (product) {
        setCurrentProductData(product);
        // Refresh will trigger hooks to reload attributes and images
      }
      
      setStep(2);
      setShowConfirmModal(false);
    } catch (e) {
      console.error("Variation processing failed → ", e);
      toast.error(e?.message || "Failed to process variations. Please try again.");
    }
  };

  /**
   * Handle image upload for variation values
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
      const primaryVariation = (currentProductData?.variations || []).find(
        v => v.name === primary.name
      );
      
      if (!primaryVariation) {
        toast.error(`Primary variation "${primary.name}" not found in product data.`);
        return;
      }
      
      for (let valueIndex = 0; valueIndex < primary.selectedValues.length; valueIndex++) {
        const value = primary.selectedValues[valueIndex];
        const imgs = imagesByValue[value] || [];
        
        let originalProductVariation = primaryVariation.product_variations?.find(
          pv => String(pv.value).trim() === String(value).trim()
        );
        
        if (!originalProductVariation && primaryVariation.product_variations?.length > valueIndex) {
          const byIndex = primaryVariation.product_variations[valueIndex];
          if (String(byIndex?.value).trim() === String(value).trim()) {
            originalProductVariation = byIndex;
          }
        }
        
        if (!originalProductVariation && variationMode === "edit") {
          continue;
        }
        
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
        
        if (!hasNewFiles && !hasRemovedImages && !hasReordered && imgs.length === originalImages.length) {
          continue;
        }

        hasChanges = true;
        const image_id = originalProductVariation?.id;
        
        if (!image_id && variationMode === "edit") {
          continue;
        }
        
        const call_mode = variationMode === "edit" && image_id 
          ? "UPDATE_VARIATION" 
          : "ADD_VARIATION";

        const formData = buildFormDataForValue({
          call_mode,
          image_id: image_id || undefined,
          images: imgs,
          originalImages: originalImages,
        });

        try {
          await ProcessProductImages(formData);

          // Console log formData entries
          console.log("FormData contents:");
          for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
          }
          
          successCount++;
        } catch (error) {
          console.error(`Failed to upload images for ${value}:`, error);
          errorCount++;
        }
            }

            if (successCount > 0) {
        toast.success(`Successfully uploaded images for ${successCount} variation(s).`);
        setTimeout(() => {
          navigate("/sellers/products");
        }, 2000);
        const refreshedData = await getProductDetailList("product_code", currentProductData.product_code);
        const product = Array.isArray(refreshedData) ? refreshedData[0] : refreshedData;
        if (product) {
          setCurrentProductData(product);
          // Refresh will trigger hooks to reload images
        }
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

  /**
   * Handle step 1 proceed button
   */
  const handleStepOneProceed = useCallback(() => {
    if (variationMode === "add" || mode === 'add_new') {
      return setShowConfirmModal(true);
    }
    if (variationMode === "edit") {
      if (hasAttributeChanges) {
        return setShowConfirmModal(true);
      } else {
        setStep(2);
      }
    }
  }, [variationMode, mode, hasAttributeChanges]);


  return (
    <CustomerLayout>
      <AnimatePresence>
        <ProductInfoCard productData={currentProductData} />
      </AnimatePresence>

      <StepIndicator currentStep={step} />

      {step === 1 && (
        <VariationStepOne
          variationMode={variationMode}
          attributes={attributes}
          variationList={variationList}
          primaryAttribute={primaryAttribute}
          primaryIndex={primaryIndex}
          canProceed={canProceed}
          hasAttributeChanges={hasAttributeChanges}
          onAddAttribute={addAttribute}
          onUpdateAttribute={updateAttribute}
          onToggleValue={toggleValue}
          onTogglePriceSettings={togglePriceSettings}
          onToggleDiscountSettings={toggleDiscountSettings}
          onUpdateValuePrice={updateValuePrice}
          onUpdateValueDiscount={updateValueDiscount}
          onSetPrimaryAttribute={setPrimaryAttribute}
          onProceed={handleStepOneProceed}
        />
      )}

      {step === 2 && (
        <VariationStepTwo
          primaryAttribute={primaryAttribute}
          imagesByValue={imagesByValue}
          activeImageByValue={activeImageByValue}
          variationMode={variationMode}
          hasImageChanges={hasImageChanges}
          onBack={() => setStep(1)}
          onImageUpload={handleImageUpload}
          onSetActiveImage={handleSetActiveImage}
          onSaveImages={handleSaveImages}
        />
      )}

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleGenerateConfirmAdd}
        title={variationMode === "add" ? "Generate Variations" : "Update Variations"}
        message={
          variationMode === "add" 
            ? "Are you sure you want to generate these variations? This will create all combinations."
            : "Are you sure you want to update these variations? This will modify the existing variations."
        }
        ShowWarning={primaryIndex === null}
        warningMessage="No primary variation selected. Variation-wise image uploads will remain disabled."
      />

    </CustomerLayout>
  );
};

export default AddVariation;
