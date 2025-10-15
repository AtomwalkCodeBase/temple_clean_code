"use client";

import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import { IndianRupee } from "lucide-react";

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: grid;
  place-items: center;
  z-index: 1000;
  padding: 1rem;
`;

const Modal = styled(motion.div)`
  background: white;
  width: min(750px, 100%);
  max-height: 85vh;
  border-radius: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  overflow: hidden;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea, #764ba2, #f093fb, #f5576c);
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e5e7eb;
  font-weight: 800;
  color: #111827;
`;

const Body = styled.div`
  padding: 1rem 1.25rem;
  display: grid;
  gap: 0.75rem;
`;

const VariationCard = styled(motion.button)`
  text-align: left;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 0.9rem;
  background: #fafafa;
  cursor: pointer;
  display: grid;
  gap: 0.15rem;

  .title {
    font-weight: 700;
    color: #111827;
  }
  .meta {
    color: #6b7280;
    font-size: 0.9rem;
  }
  .price {
    color: #059669;
    font-weight: 800;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }
`;

const Footer = styled.div`
  padding: 1rem 1.25rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

const CloseButton = styled.button`
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  color: #374151;
  padding: 0.6rem 0.9rem;
  border-radius: 0.6rem;
  font-weight: 700;
  cursor: pointer;
`;

export default function VariationModal({ open, service, onClose, onSelect }) {
  const variations = service?.service_variation_list || [];
  const serviceName = service?.service || 1;
  console.log(service, "serviceName");
  return (
    <AnimatePresence>
      {open && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <Modal
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Header>
              <div>Select a Variation</div>
              <button
                aria-label="Close"
                onClick={onClose}
                style={{
                  background: "transparent",
                  border: 0,
                  cursor: "pointer",
                  color: "#6b7280",
                  fontSize: "1.25rem",
                }}
              >
                <FiX />
              </button>
            </Header>
            <Body>
              {variations.length === 0 ? (
                <div
                  style={{
                    padding: "1rem",
                    background: "#f9fafb",
                    border: "1px dashed #e5e7eb",
                    borderRadius: "0.75rem",
                    color: "#6b7280",
                  }}
                >
                  No variations available. Continue with base price.
                </div>
              ) : (
                variations.map((v, idx) => (
                  <VariationCard
                    key={idx}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelect(v)}
                  >
                    <div className="title">
                      {v.pricing_type_str || "Variation"}
                    </div>
                    <div className="meta">
                      {v.start_time} - {v.end_time}
                    </div>
                    <div className="price">
                      <IndianRupee size={14} />{" "}
                      {(
                        (parseFloat(v.base_price) || 0) +
                        (parseFloat(v.pricing_rule_data?.week_day_price) || 0) +
                        (parseFloat(v.pricing_rule_data?.time_price) || 0) +
                        (parseFloat(v.pricing_rule_data?.date_price) || 0)
                      ).toLocaleString()}
                    </div>
                  </VariationCard>
                ))
              )}
            </Body>
            <Footer>
              <CloseButton onClick={onClose}>Close</CloseButton>
              {variations.length === 0 && (
                <CloseButton onClick={() => onSelect(null)}>
                  Continue
                </CloseButton>
              )}
            </Footer>
          </Modal>
        </Overlay>
      )}
    </AnimatePresence>
  );
}
