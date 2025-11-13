import { Pencil, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from 'framer-motion';
import { X as XIcon } from 'lucide-react';

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

  &:hover {
    background: #f0f4ff;
  }

    &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  ${({ primary }) =>
    primary &&
    `
    background: #0008ff;
    color: white;
    border: none;
    box-shadow: 0 4px 12px rgba(0, 136, 255, 0.25);
  `}
`;

const ThumbnailGrid = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
`;

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

// Helper function to normalize different input types to a consistent format
const normalizeImage = (image) => {
  if (!image) return null;
  
  // If it's already in our preferred format { url, ... } (with or without file)
  if (typeof image === 'object' && image.url) {
    return {
      url: image.url,
      file: image.file || null,
      ...(image.type && { type: image.type }),
      ...(image.image_id && { image_id: image.image_id }),
    };
  }
  
  // If it's a File object
  if (image instanceof File) {
    return {
      file: image,
      url: URL.createObjectURL(image)
    };
  }
  
  // If it's a string (URL or base64)
  if (typeof image === 'string') {
    return {
      url: image,
      // For external URLs, we don't have the original file
      file: null
    };
  }
  
  // If it's an object with src property
  if (typeof image === 'object' && image.src) {
    return {
      url: image.src,
      file: image.file || null
    };
  }
  
  return null;
};

// Helper to normalize the images array
const normalizeImages = (images) => {
  if (!images) return [];
  
  if (Array.isArray(images)) {
    return images.map(normalizeImage).filter(Boolean);
  }
  
  // If it's a single image
  const normalized = normalizeImage(images);
  return normalized ? [normalized] : [];
};

export const ImageUploader = ({ 
  images, 
  onChange, 
  max = 6, 
  activeImage, 
  setActiveImage,
  uniqueId = '', // ✅ Add uniqueId prop to make input IDs unique
  valueLabel = '' // Optional label for modal title
}) => {
  const fileInputRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const normalizedImages = normalizeImages(images);

  const handleFileChange = (e, replaceIndex = null) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file)
    }));

    onChange((prev) => {
      const previousImages = normalizeImages(prev);
      let updated = [...previousImages];
      
      if (replaceIndex !== null) {
        // Replace specific image
        if (newImages[0]) {
          updated[replaceIndex] = newImages[0];
        }
      } else {
        // Add new images
        updated = [...updated, ...newImages].slice(0, max);
      }
      
      return updated;
    });

    // Reset file input
    e.target.value = '';
  };

  const removeImage = (index, e) => {
    if (e) {
      e.stopPropagation();
    }
    
    onChange((prev) => {
      const previousImages = normalizeImages(prev);
      const updated = previousImages.filter((_, i) => i !== index);
      
      // Revoke object URL to avoid memory leaks (only for blob URLs)
      if (previousImages[index]?.url && previousImages[index]?.file && previousImages[index].url.startsWith('blob:')) {
        URL.revokeObjectURL(previousImages[index].url);
      }
      
      // Update active image if needed
      if (setActiveImage && activeImage === previousImages[index]?.url) {
        setActiveImage(updated[0]?.url || null);
      }
      
      // Close modal if the removed image was selected
      if (selectedImageIndex === index) {
        setShowModal(false);
        setSelectedImageIndex(null);
      }
      
      return updated;
    });
  };

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setShowModal(true);
    if (setActiveImage) {
      setActiveImage(normalizedImages[index]?.url);
    }
  };

  const handleModalThumbnailClick = (index) => {
    setSelectedImageIndex(index);
    if (setActiveImage) {
      setActiveImage(normalizedImages[index]?.url);
    }
  };

  const currentModalImage = selectedImageIndex !== null && normalizedImages[selectedImageIndex] 
    ? normalizedImages[selectedImageIndex].url 
    : (normalizedImages[0]?.url || null);

  const handleDragStart = (e, i) => e.dataTransfer.setData("index", i);
  
  const handleDrop = (e, dropIndex) => {
    const dragIndex = e.dataTransfer.getData("index");
    if (dragIndex === dropIndex) return;
    e.preventDefault();
    
    onChange((prev) => {
      const previousImages = normalizeImages(prev);
      const updated = [...previousImages];
      const [dragged] = updated.splice(dragIndex, 1);
      updated.splice(dropIndex, 0, dragged);
      return updated;
    });
  };

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      normalizedImages.forEach(img => {
        if (img?.file && img.url.startsWith('blob:')) {
          URL.revokeObjectURL(img.url);
        }
      });
    };
  }, []);

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        style={{ display: "none" }}
        />
      <Button 
        onClick={() => fileInputRef.current?.click()} 
        style={{ width: "100%", marginBottom: "12px" }}
        disabled={(normalizedImages || []).length === max}
      >
        <Upload size={16} /> Upload Images ({(normalizedImages || []).length}/{max})
      </Button>

      {normalizedImages?.length > 0 && (
        <ThumbnailGrid>
          {normalizedImages.map((img, i) => (
            <div
              key={i}
              draggable
              onDragStart={(e) => handleDragStart(e, i)}
              onDrop={(e) => handleDrop(e, i)}
              onDragOver={(e) => e.preventDefault()}
              style={{
                position: "relative",
                width: 60,
                height: 60,
                borderRadius: 8,
                overflow: "hidden",
                border: activeImage === img.url ? "2px solid #0059ff" : "1px solid #ccc",
                cursor: "pointer",
              }}
            >
              <img
                src={img.url}
                alt=""
                onClick={() => handleImageClick(i)}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <button
                onClick={(e) => removeImage(i, e)}
                style={{
                  position: "absolute",
                  top: 2,
                  right: 2,
                  background: "rgba(255,255,255,0.9)",
                  border: "none",
                  borderRadius: "50%",
                  padding: 2,
                  cursor: "pointer",
                  zIndex: 10,
                }}
              >
                <X size={12} color="#d33" />
              </button>
              <label
                htmlFor={`replace-${uniqueId}-${i}`}
                style={{
                  position: "absolute",
                  bottom: 2,
                  right: 2,
                  background: "#0059ff",
                  color: "white",
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  fontSize: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <Pencil size={9} />
              </label>
              <input
                id={`replace-${uniqueId}-${i}`}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleFileChange(e, i)}
              />
            </div>
          ))}
        </ThumbnailGrid>
      )}

      {/* Image Preview Modal */}
      <AnimatePresence>
        {showModal && normalizedImages.length > 0 && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <ModalContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
                  {valueLabel ? `Images for ${valueLabel}` : 'Image Preview'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
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
                  src={currentModalImage}
                  alt="Preview"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400?text=Image+Not+Found';
                  }}
                />
              </ModalImageContainer>
              {normalizedImages.length > 1 && (
                <ModalThumbnails>
                  {normalizedImages.map((img, idx) => {
                    const imgUrl = img?.url;
                    const isActive = selectedImageIndex === idx || (selectedImageIndex === null && idx === 0);
                    return (
                      <Thumbnail
                        key={idx}
                        src={imgUrl}
                        alt={`Thumbnail ${idx + 1}`}
                        $active={isActive}
                        onClick={() => handleModalThumbnailClick(idx)}
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
    </div>
  );
};