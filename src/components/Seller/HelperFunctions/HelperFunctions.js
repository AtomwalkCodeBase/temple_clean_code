import { useEffect, useMemo } from "react";
import { getSellerCategory } from "../../../services/customerServices";
import { toast } from "react-toastify";

export function useProductInfoNotes(productData, isEditMode) {
  return useMemo(() => {
    if (!isEditMode)
      return {
        shouldShowInfoBox: true,
        showVariationNote: true,
        showImageNote: true,
      };

    const noVariations = !productData?.variations?.length;
    const noImages = !productData?.c_images?.length;

    return {
      shouldShowInfoBox: noVariations || noImages,
      showVariationNote: noVariations,
      showImageNote: noImages,
    };
  }, [productData, isEditMode]);
}

export function useImagePreview(activeImage, previewImage) {
  const getUrl = (image) =>
    typeof image === "string"
      ? image
      : image?.url || (image?.file ? URL.createObjectURL(image.file) : "");

  return previewImage || getUrl(activeImage);
}

export function useCategoryName(categories = [], selectedCategoryId) {
  return useMemo(() => {
    return (
      categories.find((c) => c.id == selectedCategoryId)?.name || "Category"
    );
  }, [categories, selectedCategoryId]);
}

export const detectAdditionalImageChanges = (additionalImages, originalImages) => {
  const hasNewFiles = additionalImages.some(img => img?.file instanceof File);

  const hasRemovedImages = additionalImages.length < originalImages.length;

  const hasReorderedImages =
    additionalImages.length === originalImages.length &&
    additionalImages.some((img, idx) => {
      const newUrl = img?.url ?? img;
      const oldUrl = originalImages[idx]?.url;
      return newUrl !== oldUrl;
    });

  return {
    hasNewFiles,
    hasRemovedImages,
    hasReorderedImages,
    hasAnyChanges: hasNewFiles || hasRemovedImages || hasReorderedImages,
  };
};

export const buildFormDataForProductImages = ({
  call_mode,
  image_id,
  images = [],
  originalImages = [],
}) => {
  const fd = new FormData();

  fd.append("call_mode", call_mode);
  if (image_id) fd.append("image_id", image_id);

  const getUrl = (img) =>
    typeof img === "string"
      ? img
      : img?.url || (img?.file ? URL.createObjectURL(img.file) : "");

  images.slice(0, 10).forEach((img, index) => {
    if (!img) return;

    const key = index === 0 ? "image_file" : `image_file_${index}`;
    const currentUrl = getUrl(img);
    const originalUrl = getUrl(originalImages[index]);
    const isNewFile = img?.file instanceof File;
    const isUnchanged = currentUrl && currentUrl === originalUrl;

    if (isNewFile) fd.append(key, img.file);
    else fd.append(key, currentUrl);
  });

  return fd;
};

export const useInitializeProductEdit = (
  productData,
  setAdditionalImages,
  setOriginalAdditionalImages
) => {
  useEffect(() => {
    if (!productData?.c_images) return;

    const primaryImageUrl = productData.image;

    const preparedImages = productData.c_images
      .filter((img) => img !== primaryImageUrl)
      .map((url) => ({
        url,
        file: null,
        type: "EXISTING",
      }));

    setAdditionalImages(preparedImages);
    setOriginalAdditionalImages(preparedImages);
  }, [productData, setAdditionalImages, setOriginalAdditionalImages]);
};

export const useFetchCategoryAndAssign = (
  productData,
  setCategory,
  setFormData,
  setLoading
) => {
  useEffect(() => {
    const loadCategoryData = async () => {
      try {
        setLoading(true);

        const response = await getSellerCategory();
        setCategory(response);

        // Auto-select category in edit mode
        if (productData?.category && response.length > 0) {
          const match = response.find(
            (cat) => cat.name.toLowerCase() === productData.category.toLowerCase()
          );

          if (match) {
            setFormData((prev) => ({ ...prev, category_id: match.id }));
          }
        }
      } catch (err) {
        toast.error("Failed to fetch categories. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCategoryData();
  }, [productData, setCategory, setFormData, setLoading]);
};