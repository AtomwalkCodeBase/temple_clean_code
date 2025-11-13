import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { X as XIcon } from 'lucide-react';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 16px;
  max-width: 90vw;
  max-height: 90vh;
  position: relative;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #e5e7eb;
`;

const ModalImageContainer = styled.div`
  padding: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  max-height: 70vh;
  overflow: auto;
`;

const ModalImage = styled.img`
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  border-radius: 8px;
`;

const ModalThumbnails = styled.div`
  display: flex;
  gap: 8px;
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
  overflow-x: auto;
`;

const Thumbnail = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid ${props => props.$active ? '#0008ff' : 'transparent'};
  
  &:hover {
    opacity: 0.8;
  }
`;

export const ImagePreviewModal = ({
  isOpen,
  modalValue,
  modalImages,
  activeImageByValue,
  onClose,
  onSetActiveImage
}) => {
  if (!isOpen || modalImages.length === 0) return null;

  const activeImage = modalValue && activeImageByValue[modalValue] 
    ? activeImageByValue[modalValue] 
    : (typeof modalImages[0] === 'string' ? modalImages[0] : modalImages[0]?.url || modalImages[0]);

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <ModalContent
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
                {modalValue ? `Images for ${modalValue}` : 'Image Preview'}
              </h3>
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 8,
                }}
              >
                <XIcon size={24} color="#6b7280" />
              </button>
            </ModalHeader>
            <ModalImageContainer>
              <ModalImage
                src={activeImage}
                alt="Preview"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400?text=Image+Not+Found';
                }}
              />
            </ModalImageContainer>
            {modalImages.length > 1 && (
              <ModalThumbnails>
                {modalImages.map((img, idx) => {
                  const imgUrl = typeof img === 'string' ? img : img?.url;
                  const isActive = modalValue && activeImageByValue[modalValue] === imgUrl;
                  return (
                    <Thumbnail
                      key={idx}
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      $active={isActive}
                      onClick={() => {
                        if (modalValue) {
                          onSetActiveImage(modalValue, imgUrl);
                        }
                      }}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/60?text=Error';
                      }}
                    />
                  );
                })}
              </ModalThumbnails>
            )}
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

