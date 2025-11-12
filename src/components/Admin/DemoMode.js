import React, { useState, useEffect } from "react";
import styled from "styled-components";

const DemoModeContainer = styled.div`
  padding: 24px;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ToggleCard = styled.div`
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
  text-align: center;
  max-width: 400px;
  width: 100%;
`;

const Title = styled.h1`
  color: #1f2937;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 16px;
  margin-bottom: 32px;
`;

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 24px;
`;

const ToggleLabel = styled.span`
  color: #374151;
  font-weight: 600;
  font-size: 16px;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: #10b981;
  }

  &:checked + span:before {
    transform: translateX(26px);
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #6b7280;
  transition: 0.4s;
  border-radius: 34px;

  &:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
`;

const StatusMessage = styled.div`
  padding: 12px 16px;
  border-radius: 8px;
  font-weight: 600;
  background-color: ${(props) => (props.isDemo ? "#d1fae5" : "#f3f4f6")};
  color: ${(props) => (props.isDemo ? "#065f46" : "#374151")};
  border: 1px solid ${(props) => (props.isDemo ? "#a7f3d0" : "#e5e7eb")};
`;

const InfoText = styled.p`
  color: #6b7280;
  font-size: 14px;
  margin-top: 24px;
  text-align: center;
`;

const DemoMode = () => {
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Load demo mode status from localStorage on component mount
  useEffect(() => {
    const savedDemoMode = localStorage.getItem("demoMode");
    if (savedDemoMode) {
      setIsDemoMode(JSON.parse(savedDemoMode));
    }
  }, []);

  // Save demo mode status to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("demoMode", JSON.stringify(isDemoMode));
  }, [isDemoMode]);

  const handleToggle = () => {
    setIsDemoMode(!isDemoMode);
  };

  return (
    <DemoModeContainer>
      <ToggleCard>
        <Title>Demo Mode</Title>
        <Subtitle>
          Toggle demo mode to enable testing features and sample data
        </Subtitle>

        <ToggleWrapper>
          <ToggleLabel>Demo Mode</ToggleLabel>
          <ToggleSwitch>
            <ToggleInput
              type="checkbox"
              checked={isDemoMode}
              onChange={handleToggle}
            />
            <ToggleSlider />
          </ToggleSwitch>
        </ToggleWrapper>

        <StatusMessage isDemo={isDemoMode}>
          {isDemoMode ? "🎉 Demo Mode is ACTIVE" : "⚡ Live Mode is ACTIVE"}
        </StatusMessage>

        <InfoText>
          {isDemoMode
            ? "You are currently in demo mode. Sample data and testing features are enabled."
            : "You are in live mode. All features are using real data."}
        </InfoText>
      </ToggleCard>
    </DemoModeContainer>
  );
};

export default DemoMode;
