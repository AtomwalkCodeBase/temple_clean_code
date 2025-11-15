import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;

  h2 {
    margin: 0 0 1rem 0;
    color: #1f2937;
    font-size: 1.5rem;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
    color: #1f2937;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.875rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 120px;
  margin-bottom: 1rem;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
`;

const Button = styled(motion.button)`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const RemarkModal = ({ isOpen, onClose, onSubmit, action, seller, isSubmitting = false }) => {
  const [remark, setRemark] = useState('');

  const handleSubmit = () => {
    onSubmit(remark);
    setRemark('');
  };

  // Reset remark when modal closes
  useEffect(() => {
    if (!isOpen) {
      setRemark('');
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <Modal
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <ModalContent
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <CloseButton onClick={onClose}>
              <X size={20} />
            </CloseButton>
            <h2>{action} - {seller?.name}</h2>
            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
              Seller Code: {seller?.seller_ref_code}
            </p>
            <TextArea
              placeholder="Enter your remark..."
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
            <ModalActions>
              <Button
                onClick={onClose}
                style={{ background: '#6b7280', color: 'white' }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                disabled={isSubmitting}
                style={{ 
                  background: '#3b82f6', 
                  color: 'white',
                  opacity: isSubmitting ? 0.6 : 1, 
                  cursor: isSubmitting ? 'not-allowed' : 'pointer' 
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </ModalActions>
          </ModalContent>
        </Modal>
      )}
    </AnimatePresence>
  );
};

