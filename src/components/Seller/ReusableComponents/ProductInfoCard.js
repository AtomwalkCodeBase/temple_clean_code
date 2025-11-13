import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

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

export const ProductInfoCard = ({ productData }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card>
        <FormHeader>Product Information</FormHeader>
        <ProductInfoContainer>
          <ProductImage
            src={productData.image}
            alt={productData.product_name}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/200?text=No+Image';
            }}
          />
          <ProductDetails>
            <ProductTitle>{productData.product_name}</ProductTitle>
            <ProductCode>{productData.product_code}</ProductCode>
            <ProductDescription>{productData.description}</ProductDescription>

            <ProductMetaRow>
              <MetaItem>
                <MetaLabel>Base Price</MetaLabel>
                <MetaValue>₹{productData.selling_price}</MetaValue>
              </MetaItem>

              <MetaItem>
                <MetaLabel>Category</MetaLabel>
                <Badge variant="category">{productData.category}</Badge>
              </MetaItem>

              <MetaItem>
                <MetaLabel>Status</MetaLabel>
                <Badge variant={productData.is_active ? 'active' : ''}>
                  {productData.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </MetaItem>

              {productData.discount > 0 && (
                <MetaItem>
                  <MetaLabel>Discount</MetaLabel>
                  <MetaValue>{productData.discount}%</MetaValue>
                </MetaItem>
              )}
            </ProductMetaRow>
          </ProductDetails>
        </ProductInfoContainer>
      </Card>
    </motion.div>
  );
};

