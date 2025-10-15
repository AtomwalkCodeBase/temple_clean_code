import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import {
  X,
  Sparkles,
  CheckCircle,
  TrendingUp,
  Star,
  Award,
} from "lucide-react";

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-6px);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
`;

const NotificationContainer = styled.div`
  position: relative;
  background: #ffffff;
  border-radius: 20px;
  padding: 28px;
  margin-bottom: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08), 0 8px 16px rgba(0, 0, 0, 0.06),
    0 0 0 1px rgba(0, 0, 0, 0.04);
  animation: ${fadeInUp} 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
  border: 1px solid #f1f5f9;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
        circle at 20% 80%,
        rgba(59, 130, 246, 0.03) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 80% 20%,
        rgba(16, 185, 129, 0.03) 0%,
        transparent 50%
      );
    pointer-events: none;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #3b82f6, #10b981, #f59e0b);
    background-size: 200% 100%;
    animation: ${shimmer} 3s ease-in-out infinite;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10;

  &:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
    color: #475569;
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 5;
  color: #1e293b;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
`;

const IconContainer = styled.div`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 16px;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${float} 3s ease-in-out infinite;
  box-shadow: 0 12px 24px rgba(16, 185, 129, 0.2),
    0 0 0 1px rgba(16, 185, 129, 0.1);
  position: relative;
`;

const TitleSection = styled.div`
  flex: 1;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 6px 0;
  letter-spacing: -0.025em;
  color: #0f172a;
  line-height: 1.3;
`;

const Subtitle = styled.p`
  font-size: 16px;
  margin: 0;
  color: #64748b;
  line-height: 1.4;
  font-weight: 500;
`;

const Description = styled.p`
  font-size: 16px;
  line-height: 1.6;
  margin: 0 0 28px 0;
  color: #475569;
  font-weight: 400;
  max-width: 600px;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 28px;
`;

const FeatureCard = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #3b82f6, #10b981);
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  &:hover {
    background: #ffffff;
    border-color: #cbd5e1;
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08),
      0 0 0 1px rgba(59, 130, 246, 0.1);

    &::before {
      transform: scaleX(1);
    }
  }
`;

const FeatureIcon = styled.div`
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
`;

const FeatureTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #1e293b;
  letter-spacing: -0.01em;
`;

const FeatureDescription = styled.p`
  font-size: 14px;
  margin: 0;
  line-height: 1.5;
  color: #64748b;
  font-weight: 400;
`;

const ActionSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
`;

const SkipButton = styled.button`
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: #ffffff;
  border: none;
  border-radius: 12px;
  padding: 14px 28px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(59, 130, 246, 0.4),
      0 0 0 1px rgba(59, 130, 246, 0.1);

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
  }
`;

const SuccessBadge = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
  animation: ${pulse} 2s ease-in-out infinite;
`;

const FloatingElements = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
`;

const FloatingElement = styled.div`
  position: absolute;
  color: rgba(59, 130, 246, 0.03);
  font-size: 20px;
  animation: ${float} 6s ease-in-out infinite;

  &:nth-child(1) {
    top: 15%;
    left: 8%;
    animation-delay: 0s;
  }

  &:nth-child(2) {
    top: 70%;
    right: 12%;
    animation-delay: 2s;
  }

  &:nth-child(3) {
    bottom: 15%;
    left: 15%;
    animation-delay: 4s;
  }
`;

const AddonsNotification = ({ serviceId, onClose, onSkip }) => {
  const [isDismissed, setIsDismissed] = useState(false);

  const handleClose = () => {
    setIsDismissed(true);
    if (onClose) onClose();
  };

  const handleSkip = () => {
    if (onSkip) onSkip();
  };

  if (isDismissed) return null;

  return (
    <NotificationContainer>
      <FloatingElements>
        <FloatingElement>✨</FloatingElement>
        <FloatingElement>🌟</FloatingElement>
        <FloatingElement>💫</FloatingElement>
      </FloatingElements>

      <CloseButton onClick={handleClose}>
        <X size={16} />
      </CloseButton>

      <Content>
        <Header>
          <IconContainer>
            <Sparkles size={24} color="white" />
            <SuccessBadge>✓</SuccessBadge>
          </IconContainer>
          <TitleSection>
            <Title>Hall Successfully Created</Title>
            <Subtitle>Your sacred space is now ready for devotees</Subtitle>
          </TitleSection>
        </Header>

        <Description>
          Congratulations! Your hall has been successfully configured and is now
          ready to accept bookings. The hall is automatically activated and will
          appear in your temple's booking system.
        </Description>

        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>
              <CheckCircle size={20} color="white" />
            </FeatureIcon>
            <FeatureTitle>Packages</FeatureTitle>
            <FeatureDescription>
              You can now add packages to your hall and start earning from day
              one.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <TrendingUp size={20} color="white" />
            </FeatureIcon>
            <FeatureTitle>Advance Policies</FeatureTitle>
            <FeatureDescription>
              You can now add advance policies to your hall and start earning
              from day one.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <Award size={20} color="white" />
            </FeatureIcon>
            <FeatureTitle>Refund Policies</FeatureTitle>
            <FeatureDescription>
              You can now add refund policies to your hall and start earning
              from day one.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>

        <ActionSection>
          <SkipButton onClick={handleSkip}>
            <Star size={18} />
            Continue to Dashboard
          </SkipButton>
        </ActionSection>
      </Content>
    </NotificationContainer>
  );
};

export default AddonsNotification;
