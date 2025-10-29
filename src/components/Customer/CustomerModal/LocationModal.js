"use client";

import { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { FiMapPin, FiCheck, FiX } from "react-icons/fi";

const INDIAN_STATES = [
  { name: "Andhra Pradesh", image: "🏛️" },
  { name: "Arunachal Pradesh", image: "⛰️" },
  { name: "Assam", image: "🦏" },
  { name: "Bihar", image: "🕉️" },
  { name: "Chhattisgarh", image: "🌳" },
  { name: "Goa", image: "🏖️" },
  { name: "Gujarat", image: "🦁" },
  { name: "Haryana", image: "🌾" },
  { name: "Himachal Pradesh", image: "🏔️" },
  { name: "Jharkhand", image: "⛰️" },
  { name: "Karnataka", image: "🏛️" },
  { name: "Kerala", image: "🌴" },
  { name: "Madhya Pradesh", image: "🐅" },
  { name: "Maharashtra", image: "🏰" },
  { name: "Manipur", image: "🎭" },
  { name: "Meghalaya", image: "☔" },
  { name: "Mizoram", image: "🌄" },
  { name: "Nagaland", image: "🎪" },
  { name: "Odisha", image: "🏛️" },
  { name: "Punjab", image: "🌾" },
  { name: "Rajasthan", image: "🐪" },
  { name: "Sikkim", image: "🏔️" },
  { name: "Tamil Nadu", image: "🕉️" },
  { name: "Telangana", image: "💎" },
  { name: "Tripura", image: "🎋" },
  { name: "Uttar Pradesh", image: "🕌" },
  { name: "Uttarakhand", image: "🏔️" },
  { name: "West Bengal", image: "🐯" },
  { name: "Ladakh", image: "❄️" },
  { name: "Jammu and Kashmir", image: "🌸" },
];

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(8px);
  padding: 1rem;
`;

const ModalContainer = styled(motion.div)`
  background: white;
  border-radius: 32px;
  padding: 0;
  max-width: 650px;
  width: 100%;
  max-height: 90vh;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.4);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const HeaderSection = styled.div`
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  padding: 2.5rem 2rem 2rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: -50%;
    right: -10%;
    width: 300px;
    height: 300px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -30%;
    left: -5%;
    width: 200px;
    height: 200px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 50%;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  color: white;
  font-size: 1.3rem;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: rotate(90deg);
  }
`;

const HeaderContent = styled.div`
  text-align: center;
  position: relative;
  z-index: 1;

  .icon-wrapper {
    width: 80px;
    height: 80px;
    background: rgba(255, 255, 255, 0.25);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;
    backdrop-filter: blur(10px);
    border: 3px solid rgba(255, 255, 255, 0.3);
  }

  .icon {
    font-size: 2.5rem;
    color: white;
  }

  h2 {
    font-size: 2rem;
    font-weight: 800;
    color: white;
    margin: 0 0 0.75rem 0;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  p {
    color: rgba(255, 255, 255, 0.95);
    font-size: 1rem;
    margin: 0;
    line-height: 1.6;
  }
`;

const ContentSection = styled.div`
  padding: 2rem;
  overflow-y: auto;
  flex: 1;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #ff6b35, #f7931e);
    border-radius: 10px;

    &:hover {
      background: linear-gradient(135deg, #f7931e, #ff6b35);
    }
  }
`;

const StateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
`;

const StateCard = styled(motion.button)`
  padding: 1.25rem;
  border: 2px solid ${(props) => (props.selected ? "#ff6b35" : "#e2e8f0")};
  background: ${(props) =>
    props.selected
      ? "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)"
      : "white"};
  color: ${(props) => (props.selected ? "white" : "#1e293b")};
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  position: relative;
  box-shadow: ${(props) =>
    props.selected
      ? "0 8px 25px rgba(255, 107, 53, 0.3)"
      : "0 2px 8px rgba(0, 0, 0, 0.05)"};

  &:hover {
    border-color: #ff6b35;
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(255, 107, 53, 0.2);
  }

  .emoji {
    font-size: 2.5rem;
    filter: ${(props) => (props.selected ? "grayscale(0)" : "grayscale(0)")};
  }

  .state-name {
    font-weight: 600;
    font-size: 0.9rem;
    text-align: center;
    line-height: 1.3;
  }

  .check-icon {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    width: 24px;
    height: 24px;
    background: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ff6b35;
    font-size: 0.9rem;
    opacity: ${(props) => (props.selected ? "1" : "0")};
    transition: opacity 0.3s ease;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1.5rem 2rem;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
`;

const Button = styled(motion.button)`
  flex: 1;
  padding: 1rem;
  border: none;
  border-radius: 16px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  ${(props) =>
    props.primary
      ? `
    background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `
      : `
    background: white;
    color: #64748b;
    border: 2px solid #e2e8f0;

    &:hover {
      background: #f1f5f9;
      border-color: #cbd5e1;
    }
  `}
`;

const LocationModal = ({ isOpen, onClose, onSelectLocation }) => {
  const [selectedState, setSelectedState] = useState("");

  const handleConfirm = () => {
    if (selectedState) {
      localStorage.setItem("selectedState", selectedState);
      if (onSelectLocation) {
        onSelectLocation(selectedState);
      }
      window.location.reload();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <ModalContainer
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <HeaderSection>
              <CloseButton onClick={onClose}>
                <FiX />
              </CloseButton>
              <HeaderContent>
                <div className="icon-wrapper">
                  <div className="icon">
                    <FiMapPin />
                  </div>
                </div>
                <h2>Select Your Location</h2>
                <p>Choose your state to discover temples and services nearby</p>
              </HeaderContent>
            </HeaderSection>

            <ContentSection>
              <StateGrid>
                {INDIAN_STATES.map((state) => (
                  <StateCard
                    key={state.name}
                    selected={selectedState === state.name}
                    onClick={() => setSelectedState(state.name)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div className="emoji">{state.image}</div>
                    <div className="state-name">{state.name}</div>
                    <div className="check-icon">
                      <FiCheck />
                    </div>
                  </StateCard>
                ))}
              </StateGrid>
            </ContentSection>

            <ActionButtons>
              <Button
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </Button>
              <Button
                primary
                onClick={handleConfirm}
                disabled={!selectedState}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Confirm
              </Button>
            </ActionButtons>
          </ModalContainer>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default LocationModal;
