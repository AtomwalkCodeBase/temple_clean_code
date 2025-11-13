import React, { useMemo, useState } from 'react'
import CustomerLayout from '../Customer/CustomerLayout'
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { ImageUploader } from './ReusableComponents/ImageUploader';
import { toast } from 'react-toastify';
import { processProductData, ProcessProductImages } from '../../services/customerServices';
import { Edit2, Info, Plus, Upload } from 'lucide-react';
import { detectAdditionalImageChanges, useCategoryName, useFetchCategoryAndAssign, useImagePreview, useInitializeProductEdit, useProductInfoNotes } from './HelperFunctions/HelperFunctions';

const ResponsiveGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 400px;
  }
`;

const Button = styled.button`
  flex: 1;
  padding: 14px 16px;
  border: 1px solid #b4bcff;
  background: #fff;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  color: #05124b;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: 0.2s;

  &:hover {
    background: #0008ff;
    color: white;
  }
    
    &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  ${({ primary }) =>
    primary &&
    `
    background: #4a50fbff;
    color: white;
    border: none;
    box-shadow: 0 4px 12px rgba(0, 136, 255, 0.25);
    
    &:hover {
      background: #0008ff;
      color: white;
    }
  `}
`;

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
`;

const Label = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #05304b;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #b4c9ff;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;

  &:focus {
    border-color: #0077ff;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #b4c9ff;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  cursor: pointer;

  &:focus {
    border-color: #0077ff;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #b4c9ff;
  border-radius: 8px;
  font-size: 14px;
  min-height: 100px;
  resize: vertical;
  box-sizing: border-box;

  &:focus {
    border-color: #0059ff;
  }
`;

const ToggleLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #05124b;
  cursor: pointer;
`;

const ImagePreview = styled.div`
  border: 2px dashed #b4d1ff;
  border-radius: 12px;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f6f3ff;
  overflow: hidden;
 /* cursor: pointer; */

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
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

const AddProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const productData = location.state?.productData || null;
  const isEditMode = !!productData;
  const [formData, setFormData] = useState({
    product_name: productData?.product_name || "",
    category_id: "",
    product_id: productData?.id || "",
    base_unit: productData?.base_unit || "",
    selling_price: productData?.selling_price || "",
    stock: productData?.stock || "",
    description: productData?.description || "",
    price_inclusive_tax: productData?.price_inclusive_tax ?? false,
    activeImage: productData?.image || null,
  });
  console.log(productData)
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState([]);

  const base_unit = ["Piece", "Packet", "Kg", "Litre"];

  const [previewImage, setPreviewImage] = useState(null);

  const [additionalImages, setAdditionalImages] = useState([]);
  const [originalAdditionalImages, setOriginalAdditionalImages] = useState([]);

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const { shouldShowInfoBox, showVariationNote, showImageNote } = useProductInfoNotes(productData, isEditMode);
  const currentPreview = useImagePreview(formData.activeImage, previewImage);
  const selectedCategoryName = useCategoryName(category, formData.category_id);
  useInitializeProductEdit(productData, setAdditionalImages, setOriginalAdditionalImages);
  useFetchCategoryAndAssign(productData, setCategory, setFormData, setLoading);

  // Check has Additional Image Changes or not
  const hasAdditionalImageChanges = useMemo(() => {
    if (!formData.product_id) return false;
    const { hasAnyChanges } = detectAdditionalImageChanges(additionalImages, originalAdditionalImages);
    return hasAnyChanges;

  }, [additionalImages, originalAdditionalImages, formData.product_id,]);

  // helper function for build the api for Additional images
  const buildFormDataForProductImages = ({ call_mode, image_id, images = [], originalImages = [], }) => {
    const fd = new FormData();

    fd.append("call_mode", call_mode);
    if (image_id) fd.append("image_id", image_id);

    const getUrl = (img) =>
      typeof img === "string" ? img : img?.url || null;

    images.slice(0, 10).forEach((img, index) => {
      if (!img) return;

      const key = index === 0 ? "image_file" : `image_file_${index}`;
      const currentUrl = getUrl(img);
      const originalUrl = getUrl(originalImages[index]);

      const isNewFile = img?.file instanceof File;
      const isUnchanged = currentUrl && currentUrl === originalUrl;

      if (isNewFile) {
        fd.append(key, img.file);     // Send File when updated
      } else if (isUnchanged || currentUrl) {
        fd.append(key, currentUrl);   // Send URL when unchanged or new URL
      }
    });

    return fd;
  };

  // Add Additional Images Api
  const handleSaveAdditionalImages = async () => {
    if (!formData.product_id) {
      toast.error("Please save the product first before adding additional images.");
      return;
    }
    try {
      setLoading(true);
      const { hasAnyChanges } = detectAdditionalImageChanges(additionalImages, originalAdditionalImages);
      if (!hasAnyChanges) {
        toast.info("No image changes detected.");
        return;
      }
      const call_mode = isEditMode && originalAdditionalImages.length > 0 ? "UPDATE" : "ADD";
      const formDataForImages = buildFormDataForProductImages({
        call_mode,
        image_id: formData.product_id,
        images: additionalImages,
        originalImages: originalAdditionalImages,
      });

      await ProcessProductImages(formDataForImages);

      toast.success("Additional images saved successfully!");
      setTimeout(() => {
          navigate("/sellers/products");
        }, 2000);
      setOriginalAdditionalImages([...additionalImages]);

    } catch (error) {
      console.error("Failed to save additional images:", error);
      toast.error(error?.message || "Failed to save additional images. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  //check the required filed
  const isFormValid = useMemo(() => {
    const requiredFields = [
      "product_name",
      "category_id",
      "base_unit",
      "selling_price",
      "description",
      "activeImage"
    ];

    // Check empty text/number fields
    const isMissingRequiredField = requiredFields.some(
      (field) => !formData[field] || formData[field].toString().trim() === ""
    );

    // Check primary image (activeImage)
    const isPrimaryImageMissing =
      !formData.activeImage || formData.activeImage === "";

    return !isMissingRequiredField && !isPrimaryImageMissing;
  }, [formData]);

  const fileFromUrl = (url) => {
    if (!url) return null;
    const name = url.split("/").pop().split("?")[0];
    return { uri: url, name };
  };

  //  handle Submit for Add product
  const handleSubmit = async (e) => {
    // Granular required-field validation with specific toast
    const requiredFieldChecks = [
      { key: "product_name", label: "Product Name", value: formData.product_name },
      { key: "category_id", label: "Category", value: formData.category_id },
      { key: "base_unit", label: "Unit", value: formData.base_unit },
      { key: "selling_price", label: "Base Price", value: formData.selling_price },
      { key: "description", label: "Description", value: formData.description },
      { key: "activeImage", label: "Primary Image", value: formData.activeImage },
    ];
    const firstMissing = requiredFieldChecks.find(({ value }) => {
      if (typeof value === "string") return value.toString().trim() === "";
      return value == null || value === false;
    });
    if (firstMissing) {
      toast.error(`${firstMissing.label} is required.`);
      return;
    }
    e.preventDefault();
    setLoading(true);

    try {
      const sellerRefCode = localStorage.getItem("customerRefCode");
      if (!sellerRefCode) {
        throw new Error("Seller reference code not found. Please login again.");
      }

      const formDatas = new FormData();
      formDatas.append("product_name", formData.product_name);
      formDatas.append("category_id", parseInt(formData.category_id));
      formDatas.append("call_mode", isEditMode ? "UPDATE" : "ADD");
      if (isEditMode) {
        formDatas.append("product_id", formData.product_id);
      }
      formDatas.append("selling_price", parseInt(formData.selling_price));
      formDatas.append("description", formData.description);
      formDatas.append("base_unit", formData.base_unit);
      formDatas.append("price_inclusive_tax", formData.price_inclusive_tax ? "True" : "False");
      formDatas.append("seller_ref_code", sellerRefCode);

      if (formData.activeImage.file instanceof File) {
        formDatas.append("primary_image", formData.activeImage.file);
      }else if(formData.activeImage && typeof formData.activeImage === 'string'){
      
          // formDatas.append("primary_image", fileFromUrl(formData.activeImage));
          formDatas.append("primary_image", null);
        
      }

      // if (formData.activeImage) {
      //       if (formData.activeImage.file instanceof File) {
      //         // If it's a new file upload
      //         formDatas.append("primary_image", formData.activeImage.file);
      //       } else if (typeof formData.activeImage === 'string') {
      //         // If it's a URL string (existing image)
      //         formDatas.append("primary_image", null);
      //       } else if (formData.activeImage.url && typeof formData.activeImage.url === 'string') {
      //         // If it's an object with url property
      //         formDatas.append("primary_image", formData.activeImage.url);
      //       }
      //     }

      console.log("FormData contents:");
          for (let [key, value] of formDatas.entries()) {
            console.log(`${key}:`, value);
          }
      await processProductData(formDatas);
          
      toast.success(isEditMode ? "Product Updated Successfully!" : "Product Added Successfully!");
      setTimeout(() => {
          navigate("/sellers/products");
        }, 2000);

    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ----- Notes display logic -----
  // const shouldShowInfoBox = useMemo(() => {
  //   if (!isEditMode) return true; // Always true in add mode

  //   const noVariations = !productData?.variations?.length;
  //   const noImages = !productData?.c_images?.length;

  //   return noVariations || noImages; // Show only if either one is missing
  // }, [isEditMode, productData]);

  // const showVariationNote = shouldShowInfoBox && (!productData?.variations?.length);
  // const showImageNote = shouldShowInfoBox && (!productData?.c_images?.length);

  // ----- Image URL resolver -----
  const getImageUrl = (image) =>
    typeof image === "string"
      ? image
      : image?.url || (image?.file ? URL.createObjectURL(image.file) : "");

  // const currentPreview = previewImage || getImageUrl(formData.activeImage);

  // Category name match and show in the product preview
  // const selectedCategoryName = useMemo(
  //   () => category.find((c) => c.id == formData.category_id)?.name ?? "Category",
  //   [category, formData.category_id]
  // );

  return (
    <CustomerLayout>
      <div style={{ minHeight: "100vh", background: "#f3f6ff", fontFamily: "-apple-system, sans-serif" }}>
        <header style={{ background: "#fff", borderBottom: "1px solid #b4baff", padding: "12px 16px", position: "sticky", top: 0, zIndex: 100, }}>
          <div style={{ maxWidth: 1400, margin: "0 auto" }}>
            <div style={{ fontSize: 12, color: "#999", marginBottom: 4 }}>
              Dashboard → Products → Add Product
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>{formData.product_id ? "Edit " : "Add New "}Product</h1>
            </div>
          </div>
        </header>

        <main style={{ maxWidth: 1400, margin: "0 auto", padding: "16px" }}>
          <ResponsiveGrid>
            <div>
              <Card>
                <FormHeader>Basic Information</FormHeader>
                <div style={{ display: "grid", gap: 16 }}>
                  <div>
                    <Label>Product Name *</Label>
                    <Input
                      placeholder="e.g., Premium Incense Sticks"
                      value={formData.product_name}
                      onChange={(e) => handleInputChange("product_name", e.target.value)}
                      required
                    />
                  </div>
                  <Grid>
                    <div>
                      <Label>Category *</Label>
                      <Select
                        value={formData.category_id}
                        onChange={(e) => handleInputChange("category_id", e.target.value)}
                        required
                      >
                        <option value="">Select</option>
                        {category.map((value, index) => (
                          <option key={index} value={value.id}>{value.name}</option>
                        ))}
                      </Select>
                    </div>
                    <div>
                      <Label>Unit *</Label>
                      <Select
                        value={formData.base_unit}
                        onChange={(e) => handleInputChange("base_unit", e.target.value)}
                        required
                      >
                        <option value="">Select</option>
                        {base_unit.map((u) => (
                          <option key={u} value={u}>{u}</option>
                        ))}
                      </Select>
                    </div>
                  </Grid>
                  <div>
                    <FormHeader>Pricing & Inventory</FormHeader>
                    <Grid>
                      <div>
                        <Label>Base Price (₹) *</Label>
                        <Input
                          type="number"
                          value={formData.selling_price}
                          onChange={(e) => handleInputChange("selling_price", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label>Stock *</Label>
                        <Input
                          type="number"
                          value={formData.stock}
                          onChange={(e) => handleInputChange("stock", e.target.value)}
                        />
                      </div>
                    </Grid>
                  </div>
                  <div>
                    <Label>Description *</Label>
                    <TextArea
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <ToggleLabel>
                      <input
                        type="checkbox"
                        checked={formData.price_inclusive_tax}
                        onChange={(e) => handleInputChange("price_inclusive_tax", e.target.checked)}
                      />
                      Price inclusive tax ?
                    </ToggleLabel>
                  </div>
                  <div>
                    <Label>Primary Image *</Label>
                    <ImageUploader
                      images={formData.activeImage ? [formData.activeImage] : []}
                      onChange={(updater) =>
                        setFormData((prev) => {
                          const images = updater(prev.activeImage ? [prev.activeImage] : []);
                          const newActiveImage = images[0] || null;
                          return {
                            ...prev,
                            activeImage: newActiveImage,
                          };
                        })
                      }
                      max={1}
                      activeImage={formData.activeImage?.url || formData.activeImage}
                      setActiveImage={(url) => setPreviewImage(url)}
                      uniqueId="primary"
                    />
                  </div>

                  {/* ✅ Additional Images Section */}
                  {formData.product_id && (
                    <div>
                      <FormHeader>Additional Images</FormHeader>
                      <Label style={{ marginBottom: 12 }}>
                        Upload up to 10 additional images for this product
                      </Label>
                      <ImageUploader
                        images={additionalImages}
                        onChange={(updater) => {
                          const updated = typeof updater === 'function' ? updater(additionalImages) : updater;
                          setAdditionalImages(updated);
                        }}
                        max={10}
                        uniqueId="additional"
                      />

                      {/* ✅ Show save button only if there are changes */}
                      {hasAdditionalImageChanges && (
                        <div style={{ marginTop: 16, textAlign: 'center' }}>
                          <Button primary onClick={handleSaveAdditionalImages} disabled={loading}>
                            {isEditMode ? "Update Additional Images" : "Save Additional Images"}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", flex: 1 }}>
                     <Button primary onClick={handleSubmit} disabled={loading}>
                     {formData.product_id ? <Edit2 size={18} /> : <Plus size={18} />}{formData.product_id ? "Edit" : "Add"} Product
                    </Button>
                  </div>

                  {shouldShowInfoBox && (
                    <InfoBox>
                      <InfoIconWrapper>
                        <Info size={20} />
                      </InfoIconWrapper>

                      <InfoContent>
                        <strong>Note</strong>

                        {showVariationNote && (
                          <>
                            <br />
                            • If this product has variations then you can add them in the product list
                          </>
                        )}

                        {showImageNote && (
                          <>
                            <br />
                            • You can add additional images after updating the product.
                          </>
                        )}
                      </InfoContent>
                    </InfoBox>
                  )}
                </div>
              </Card>
            </div>

            <div>
              <Card>
                <Label>Product Preview</Label>
                <ImagePreview>
                  {currentPreview ? (
                    <img
                      src={currentPreview}
                      alt="Preview"
                    />
                  ) : (
                    <div style={{ textAlign: "center", color: "#999" }}>
                      <Upload size={32} />
                      <div style={{ fontSize: 13 }}>No Image</div>
                    </div>
                  )}
                </ImagePreview>

                {additionalImages.length > 0 && (
                  <div style={{ display: 'flex', overflowX: 'auto', gap: 8, marginTop: 12 }}>
                    {[formData.activeImage, ...additionalImages].filter(img => img != null).map((img, idx) => (
                      <div key={idx} style={{ flexShrink: 0 }}>
                        <img
                          src={getImageUrl(img)}
                          alt={`Thumbnail ${idx + 1}`}
                          style={{
                            width: 60,
                            height: 60,
                            objectFit: 'cover',
                            borderRadius: 8,
                            cursor: 'pointer',
                            border: getImageUrl(img) === currentPreview ? '2px solid #0077ff' : '1px solid #ddd'
                          }}
                          onClick={() => setPreviewImage(getImageUrl(img))}
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ padding: 12, background: "#f3f7ff", borderRadius: 8, marginTop: 12 }}>
                  <div style={{ fontWeight: 600, fontSize: 16 }}>{formData.product_name || "Product Name"}</div>
                  <div style={{ fontSize: 12, color: "#666", margin: "4px 0" }}>
                    {selectedCategoryName} • {formData.base_unit || "Unit"}
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "#0022ff" }}>
                    ₹{formData.selling_price || "0.00"}
                  </div>
                  <div style={{ fontSize: 14, color: "#666", margin: "4px 0" }}>
                    {formData.description || "Product Description"}
                  </div>
                </div>
              </Card>
            </div>
          </ResponsiveGrid>
        </main>
      </div>
    </CustomerLayout>
  )
}

export default AddProduct;