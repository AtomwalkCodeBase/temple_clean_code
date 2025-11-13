
import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Edit, ListPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Theme colors
const theme = {
  Primary: "#8B5CF6",
  Accent: "#FACC15",
  Background: "#F9FAFB",
  white: "#FFFFFF",
  Text_Primary: "#1F2937",
  Text_Secondary: "#6B7280",
  Success: "#10B981",
  Warning: "#F59E0B",
  Error: "#EF4444",
  blue: "#667EEA",
  purple: "#764BA2",
  linear_gradient: "linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)",
};

// Styled Components
const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const Modal = styled(motion.div)`
  background: ${theme.white};
  border-radius: 16px;
  max-width: 1200px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  padding: 24px;
  border-bottom: 1px solid #E5E7EB;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: ${theme.white};
  z-index: 10;
`;

const Title = styled.h2`
  color: ${theme.Text_Primary};
  font-size: 24px;
  font-weight: 700;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${theme.Text_Secondary};
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: ${theme.Background};
    color: ${theme.Text_Primary};
  }
`;

const Content = styled.div`
  padding: 24px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ImageSection = styled.div`
  position: relative;
`;

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  background: ${theme.Background};
  border-radius: 12px;
  overflow: hidden;
`;

const CarouselImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const CarouselButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: ${theme.white};
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.2s;
  z-index: 2;

  &:hover {
    background: ${theme.Primary};
    color: ${theme.white};
  }

  &.prev {
    left: 12px;
  }

  &.next {
    right: 12px;
  }
`;

const ImageIndicators = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 16px;
`;

const Indicator = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.active ? theme.Primary : '#D1D5DB'};
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    background: ${props => props.active ? theme.Primary : '#9CA3AF'};
  }
`;

const DetailsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const InfoGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.div`
  color: ${theme.Text_Secondary};
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Value = styled.div`
  color: ${theme.Text_Primary};
  font-size: 16px;
  font-weight: 400;
`;

const Price = styled.div`
  color: ${theme.Primary};
  font-size: 32px;
  font-weight: 700;
`;

const Badge = styled.span`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  background: ${props => props.type === 'success' ? '#D1FAE5' : '#E0E7FF'};
  color: ${props => props.type === 'success' ? theme.Success : theme.Primary};
`;

const Description = styled.p`
  color: ${theme.Text_Primary};
  font-size: 15px;
  line-height: 1.6;
  margin: 0;
`;

const VariationsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const VariationGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const VariationOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const VariationOption = styled.button`
  padding: 10px 16px;
  border: 2px solid ${props => props.selected ? theme.Primary : '#E5E7EB'};
  background: ${props => props.selected ? theme.Primary : theme.white};
  color: ${props => props.selected ? theme.white : theme.Text_Primary};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${theme.Primary};
    background: ${props => props.selected ? theme.Primary : '#F3F4F6'};
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;
`;

const Button = styled.button`
  flex: 1;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;

  &.primary {
    background: ${theme.linear_gradient};
    color: ${theme.white};

    &:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }
  }

  &.secondary {
    background: ${theme.white};
    color: ${theme.Primary};
    border: 2px solid ${theme.Primary};

    &:hover {
      background: ${theme.Background};
    }
  }
`;

const PriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 12px;
`;

const BasePrice = styled.span`
  color: ${theme.Text_Secondary};
  font-size: 16px;
  font-weight: 500;
  text-decoration: ${props => props.hasDiscount ? 'line-through' : 'none'};
`;

const DiscountBadge = styled.span`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  background: ${theme.Error};
  color: ${theme.white};
`;

const PriceBreakdown = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px;
  background: ${theme.Background};
  border-radius: 8px;
  font-size: 14px;
`;

const PriceItem = styled.div`
  display: flex;
  justify-content: space-between;
  color: ${theme.Text_Secondary};
  
  &.total {
    color: ${theme.Text_Primary};
    font-weight: 600;
    padding-top: 6px;
    border-top: 1px solid #E5E7EB;
  }

  &.discount {
    color: ${theme.Success};
  }
`;

const PrimaryTag = styled.span`
  display: inline-block;
  margin-left: 8px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  background: ${theme.linear_gradient};
`;

// Main Component
const ProductDetailModal = ({ productData, onClose }) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVariations, setSelectedVariations] = useState(() => {
    const initial = {};
    if (productData.variations && productData.variations.length > 0) {
      productData.variations.forEach(variation => {
        const firstActive = variation.product_variations.find(opt => opt.is_active);
        if (firstActive) {
          initial[variation.id] = firstActive.id;
        }
      });
    }
    return initial;
  });

  // console.log(selectedVariations)

  // Calculate prices with discount
  const priceCalculation = useMemo(() => {
    const basePrice = parseFloat(productData.selling_price);
    let variationPrice = 0;

    if (productData.variations) {
      for (const variation of productData.variations) {
        const selectedOption = variation.product_variations.find(
          opt => opt.id === selectedVariations[variation.id]
        );
        if (selectedOption) {
          variationPrice += parseFloat(selectedOption.additional_price || 0);
        }
      }
    }

    const subtotal = basePrice + variationPrice;
    const isDiscounted = productData.is_discounted || false;
    const discountPercent = parseFloat(productData.discount || 0);
    const discountAmount = isDiscounted ? (subtotal * discountPercent) / 100 : 0;
    const finalPrice = subtotal - discountAmount;

    return {
      basePrice,
      variationPrice,
      subtotal,
      isDiscounted,
      discountPercent,
      discountAmount,
      finalPrice
    };
  }, [selectedVariations, productData]);

  // Get images based on selected variations
  // const displayImages = useMemo(() => {
  //     if (!productData.variations || productData.variations.length === 0) {
  //         return productData.c_images || (productData.image ? [productData.image] : []);
  //     }

  //     const selectedVarIds = Object.values(selectedVariations);
  //     if (selectedVarIds.length === 0) {
  //         return productData.c_images || (productData.image ? [productData.image] : []);
  //     }

  //     // Find the selected variation's images
  //     for (const variation of productData.variations) {
  //         const selectedOption = variation.product_variations.find(
  //             opt => opt.id === selectedVariations[variation.id]
  //         );

  //         if (selectedOption && selectedOption.c_images && selectedOption.c_images.length > 0) {
  //             return selectedOption.c_images;
  //         }
  //     }

  //     return productData.c_images || (productData.image ? [productData.image] : []);
  // }, [selectedVariations, productData]);

  const displayImages = useMemo(() => {
    const fallback = productData.c_images || (productData.image ? [productData.image] : []);

    if (!productData.variations || productData.variations.length === 0) {
      return fallback;
    }

    // Prefer images from the primary variation (if present)
    const primaryVar = productData.variations.find(v => v.is_primary_one);
    if (primaryVar) {
      // try selected option for primary variation first
      const selectedOptId = selectedVariations[primaryVar.id];
      const selectedOpt = primaryVar.product_variations.find(opt => opt.id === selectedOptId)
        || primaryVar.product_variations.find(opt => opt.is_active);
      if (selectedOpt && selectedOpt.c_images && selectedOpt.c_images.length > 0) {
        return selectedOpt.c_images;
      }
      // if primary variation exists but its selected/active option has no images, fallback to product images
      return fallback;
    }

    // If no primary variation, fall back to any selected option images (if any)
    for (const variation of productData.variations) {
      const selectedOption = variation.product_variations.find(
        opt => opt.id === selectedVariations[variation.id]
      );
      if (selectedOption && selectedOption.c_images && selectedOption.c_images.length > 0) {
        return selectedOption.c_images;
      }
    }

    return fallback;
  }, [selectedVariations, productData]);

  const handleVariationSelect = (variationId, optionId) => {
    setSelectedVariations(prev => ({
      ...prev,
      [variationId]: optionId
    }));
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === displayImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? displayImages.length - 1 : prev - 1
    );
  };

  const handleVariationNavigation = (product) => {
    const hasVariations = product.variations && product.variations.length > 0;

    if (hasVariations) {
      navigate(`/sellers/ProductVariationManager?product_code=${product.product_code}`, { state: { productData: product } });
    } else {
      navigate("/sellers/addVariation", {
        state: { productData: product }
      });
    }
  };

  return (
    <Overlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <Modal
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <Header>
          <Title>Product Details</Title>
          <CloseButton onClick={onClose}>
            <X size={24} />
          </CloseButton>
        </Header>

        <Content>
          <ImageSection>
            <CarouselContainer>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ width: '100%', height: '100%' }}
                >
                  <CarouselImage
                    src={displayImages[currentImageIndex]}
                    alt={productData.product_name}
                    lazyLoading={true}
                  />
                </motion.div>
              </AnimatePresence>

              {displayImages.length > 1 && (
                <>
                  <CarouselButton className="prev" onClick={prevImage}>
                    <ChevronLeft size={20} />
                  </CarouselButton>
                  <CarouselButton className="next" onClick={nextImage}>
                    <ChevronRight size={20} />
                  </CarouselButton>
                </>
              )}
            </CarouselContainer>

            {displayImages.length > 1 && (
              <ImageIndicators>
                {displayImages.map((_, index) => (
                  <Indicator
                    key={index}
                    active={index === currentImageIndex}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </ImageIndicators>
            )}
          </ImageSection>

          <DetailsSection>
            <div>
              <InfoGroup>
                <Label>Product Name</Label>
                <Value style={{ fontSize: '20px', fontWeight: '600' }}>
                  {productData.product_name}
                </Value>
              </InfoGroup>
            </div>

            <InfoGroup>
              <Label>Price</Label>
              <PriceContainer>
                <PriceRow>
                  <Price>₹{priceCalculation.finalPrice.toFixed(2)}</Price>
                  {priceCalculation.isDiscounted && (
                    <>
                      <BasePrice hasDiscount={true}>
                        ₹{priceCalculation.subtotal.toFixed(2)}
                      </BasePrice>
                      <DiscountBadge>
                        {priceCalculation.discountPercent}% OFF
                      </DiscountBadge>
                    </>
                  )}
                </PriceRow>

                <PriceBreakdown>
                  <PriceItem>
                    <span>Base Price:</span>
                    <span>₹{priceCalculation.basePrice.toFixed(2)}</span>
                  </PriceItem>

                  {priceCalculation.variationPrice > 0 && (
                    <PriceItem>
                      <span>Variation Charge:</span>
                      <span>+₹{priceCalculation.variationPrice.toFixed(2)}</span>
                    </PriceItem>
                  )}

                  {priceCalculation.isDiscounted && (
                    <PriceItem className="discount">
                      <span>Discount ({priceCalculation.discountPercent}%):</span>
                      <span>-₹{priceCalculation.discountAmount.toFixed(2)}</span>
                    </PriceItem>
                  )}

                  <PriceItem className="total">
                    <span>Final Price:</span>
                    <span>₹{priceCalculation.finalPrice.toFixed(2)}</span>
                  </PriceItem>
                </PriceBreakdown>
              </PriceContainer>
            </InfoGroup>

            <InfoGroup>
              <Label>Category</Label>
              <Value>
                <Badge type="success">{productData.category}</Badge>
              </Value>
            </InfoGroup>

            <InfoGroup>
              <Label>Product Code</Label>
              <Value style={{ fontFamily: 'monospace' }}>
                {productData.product_code}
              </Value>
            </InfoGroup>

            {productData.base_unit && (
              <InfoGroup>
                <Label>Base Unit</Label>
                <Value>{productData.base_unit}</Value>
              </InfoGroup>
            )}

            {productData.variations && productData.variations.length > 0 && (
              <VariationsContainer>
                <Label>Variations</Label>
                {[...productData.variations]
                  .sort((a, b) => (b.is_primary_one ? 1 : 0) - (a.is_primary_one ? 1 : 0))
                  .map(variation => (
                    <VariationGroup key={variation.id}>
                      <Value style={{ fontWeight: '600', fontSize: '14px' }}>
                        {variation.name}
                        {variation.is_primary_one && <PrimaryTag>Primary</PrimaryTag>}
                      </Value>
                      <VariationOptions>
                        {variation.product_variations
                          .filter(opt => opt.is_active)
                          .map(option => (
                            <VariationOption
                              key={option.id}
                              selected={selectedVariations[variation.id] === option.id}
                              onClick={() => handleVariationSelect(variation.id, option.id)}
                            >
                              {option.value}
                              {parseFloat(option.additional_price) > 0 &&
                                ` (+₹${option.additional_price})`
                              }
                            </VariationOption>
                          ))}
                      </VariationOptions>
                    </VariationGroup>
                  ))}
              </VariationsContainer>
            )}

            <InfoGroup>
              <Label>Description</Label>
              <Description>{productData.description}</Description>
            </InfoGroup>
            <ActionsContainer>

              <Button className="primary" onClick={() => handleVariationNavigation(productData)}>
                <ListPlus size={18} />
                {productData.variations && productData.variations.length > 0 ? "Manage Product" : "Add"} Variation
              </Button>
              <Button className="secondary" onClick={() => navigate("/sellers/editProduct", { state: { productData } })}>
                <Edit size={18} />
                Edit Product
              </Button>
            </ActionsContainer>
          </DetailsSection>
        </Content>
      </Modal>
    </Overlay>
  );
};

export default ProductDetailModal;