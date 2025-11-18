import React from 'react';
import styled from 'styled-components';
import { Check, Plus, Info } from 'lucide-react';
import { AttributeEditor } from './AttributeEditor';

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

  ${({ success }) => success && `
    background: #10b981; color: white; border: none;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
    &:hover { background: #059669; }
  `}
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

export const VariationStepOne = ({
  variationMode,
  attributes,
  variationList,
  primaryAttribute,
  primaryIndex,
  canProceed,
  hasAttributeChanges,
  onAddAttribute,
  onUpdateAttribute,
  onToggleValue,
  onTogglePriceSettings,
  onToggleDiscountSettings,
  onUpdateValuePrice,
  onUpdateValueDiscount,
  onSetPrimaryAttribute,
  onProceed
}) => {
  // console.log(attributes)
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <FormHeader>{variationMode === "edit" ? "Edit" : "Manage"} Product Variations</FormHeader>
        {primaryAttribute && (
          <span style={{ background: '#dbeafe', color: '#1e40af', padding: '4px 12px', borderRadius: 20, fontSize: 12 }}>
            Primary: {primaryAttribute.name}
          </span>
        )}
      </div>

      <InfoBox>
        <InfoIconWrapper>
          <Info size={20} />
        </InfoIconWrapper>
        <InfoContent>
          <strong style={{fontSize: "16px"}}>Configuration Guidelines</strong>
          <br />
          • <strong>Pricing and discount</strong> settings are <strong>optional</strong> for each variation.
          <br />
          • Please <strong>check the primary variation</strong>, if you want to <strong>add variation-specific images</strong>.
          <br />
          • Image assignment functionality becomes available after primary variation selection.
        </InfoContent>
      </InfoBox>

      {attributes.map((attr, idx) => (
        <AttributeEditor
          key={idx}
          attr={attr}
          idx={idx}
          updateAttribute={onUpdateAttribute}
          variationList={variationList}
          toggleValue={onToggleValue}
          togglePriceSettings={onTogglePriceSettings}
          toggleDiscountSettings={onToggleDiscountSettings}
          updateValuePrice={onUpdateValuePrice}
          updateValueDiscount={onUpdateValueDiscount}
          attributes={attributes}
          isPrimary={primaryIndex === idx}
          onPrimaryChange={onSetPrimaryAttribute}
          prioritizeSelectedValues={variationMode === "edit"}
        />
      ))}

      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <Button onClick={onAddAttribute}>
          <Plus size={16} /> Add Attribute
        </Button>
        {canProceed && (
          <Button success onClick={onProceed}>
            <Check size={16} />
            {variationMode === "add"
              ? "Generate Variations"
              : hasAttributeChanges
                ? "Update Variations"
                : "Next Step"}
          </Button>
        )}
      </div>
    </Card>
  );
};

