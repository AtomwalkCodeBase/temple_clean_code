import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, Download } from 'lucide-react';

const DocumentsModal = styled(motion.div)`
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

const DocumentsModalContent = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;

  h2 {
    margin: 0 0 1.5rem 0;
    color: #1f2937;
    font-size: 1.5rem;
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

const DocumentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const DocumentItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    border-color: #3b82f6;
    background: #f9fafb;
  }
`;

const DocumentInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  span {
    color: #374151;
    font-weight: 500;
  }
`;

const DocumentIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${props => props.$type === 'image' ? '#dbeafe' : '#fef3c7'};
  color: ${props => props.$type === 'image' ? '#3b82f6' : '#f59e0b'};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DocumentButton = styled(motion.button)`
  padding: 0.5rem;
  border: 2px solid #3b82f6;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  color: #3b82f6;
  transition: all 0.2s ease;

  &:hover {
    background: #3b82f6;
    color: white;
  }

  svg {
    display: block;
  }
`;

export const DocumentsPreviewModal = ({ isOpen, onClose, documents, sellerName }) => {
  const handleDocumentAction = (document) => {
    if (document.type === 'image') {
      window.open(document.url, '_blank');
    } else {
      const link = window.document.createElement('a');
      link.href = document.url;
      link.download = document.url.split('/').pop();
      link.click();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <DocumentsModal
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <DocumentsModalContent
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <CloseButton onClick={onClose}>
              <X size={20} />
            </CloseButton>
            <h2>Documents - {sellerName}</h2>
            <DocumentList>
              {documents.map((doc, index) => (
                <DocumentItem key={index}>
                  <DocumentInfo>
                    <DocumentIcon $type={doc.type}>
                      {doc.type === 'image' ? <Eye size={20} /> : <Download size={20} />}
                    </DocumentIcon>
                    <span>
                      {doc.type === 'image' ? 'Image' : 'PDF'} Document {index + 1}
                    </span>
                  </DocumentInfo>
                  <DocumentButton
                    onClick={() => handleDocumentAction(doc)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {doc.type === 'image' ? <Eye size={18} /> : <Download size={18} />}
                  </DocumentButton>
                </DocumentItem>
              ))}
            </DocumentList>
          </DocumentsModalContent>
        </DocumentsModal>
      )}
    </AnimatePresence>
  );
};

