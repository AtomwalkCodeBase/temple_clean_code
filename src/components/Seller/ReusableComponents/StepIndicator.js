import React from 'react';
import { ChevronRight } from 'lucide-react';

export const StepIndicator = ({ currentStep }) => {
  return (
    <div style={{
      display: 'flex', 
      alignItems: 'center', 
      gap: 12, 
      padding: 16,
      background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', 
      borderRadius: 12, 
      marginBottom: 24
    }}>
      <div style={{ 
        flex: 1, 
        textAlign: 'center', 
        padding: '8px 16px', 
        background: currentStep === 1 ? '#0008ff' : 'white', 
        color: currentStep === 1 ? 'white' : '#64748b', 
        borderRadius: 20, 
        fontWeight: 500 
      }}>
        <span style={{ 
          width: 24, 
          height: 24, 
          borderRadius: '50%', 
          background: currentStep === 1 ? 'white' : '#e2e8f0', 
          color: currentStep === 1 ? '#0008ff' : '#64748b', 
          display: 'inline-flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          fontSize: 12, 
          marginRight: 8 
        }}>
          1
        </span>
        Define Variations
      </div>
      <ChevronRight size={20} color="#94a3b8" />
      <div style={{ 
        flex: 1, 
        textAlign: 'center', 
        padding: '8px 16px', 
        background: currentStep === 2 ? '#0008ff' : 'white', 
        color: currentStep === 2 ? 'white' : '#64748b', 
        borderRadius: 20, 
        fontWeight: 500 
      }}>
        <span style={{ 
          width: 24, 
          height: 24, 
          borderRadius: '50%', 
          background: currentStep === 2 ? 'white' : '#e2e8f0', 
          color: currentStep === 2 ? '#0008ff' : '#64748b', 
          display: 'inline-flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          fontSize: 12, 
          marginRight: 8 
        }}>
          2
        </span>
        Upload Images & Review
      </div>
    </div>
  );
};

