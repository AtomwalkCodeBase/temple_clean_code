import React from 'react';
import styled from 'styled-components';
import { AlertCircle, Image } from 'lucide-react';
import { ImageUploader } from './ImageUploader';
import { useNavigate } from 'react-router-dom';

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
  margin-top: 16px;
`;

export const VariationStepTwo = ({
  primaryAttribute,
  imagesByValue,
  activeImageByValue,
  variationMode,
  hasImageChanges,
  onBack,
  onImageUpload,
  onSetActiveImage,
  onSaveImages
}) => {
  const navigate = useNavigate();
  if (!primaryAttribute) {
    return (
      <Card>
        <Button style={{marginLeft: "auto"}} onClick={onBack}>← Back</Button>
        <WarningBox>
          <AlertCircle size={20} />
          <div>
            <strong>No primary variation selected.</strong> Images will be assigned to each variation individually later.
            <br />
            <em>To upload images now, please select a Primary Variation in Step 1.</em>
          </div>
        </WarningBox>
        <div style={{ display: "flex",justifyContent: "flex-end" }}>
          <Button primary onClick={() => navigate("/sellers/products")} style={{ padding: "14px 32px", fontSize: 16 }}>
           Done
          </Button>

        </div>
      </Card>
    );
  }

  
  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <FormHeader>Upload Variation Images</FormHeader>
        <Button onClick={onBack}>← Back</Button>
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
              onImageUpload(value, updated);
            }}
            max={10}
            activeImage={activeImageByValue[value] || null}
            setActiveImage={(url) => {
              onSetActiveImage(value, url);
            }}
            uniqueId={value}
            valueLabel={`${primaryAttribute.name}: ${value}`}
          />
        </div>
      ))}
      
      {hasImageChanges && (
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <Button primary onClick={onSaveImages} style={{ padding: "14px 32px", fontSize: 16 }}>
            {variationMode === "edit" ? "Update All Images" : "Save All Images"}
          </Button>
        </div>
      )}
        <div style={{ display: "flex",justifyContent: "flex-end" }}>
          <Button primary onClick={() => navigate("/sellers/products")} style={{ padding: "14px 32px", fontSize: 16 }}>
           Done
          </Button>

        </div>

    </Card>
  );
};

