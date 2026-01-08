import React from 'react';
import './imageModal.css';

const ImageModal = ({ src, alt, isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    // ปิด modal เมื่อคลิกพื้นหลัง
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    // ปิด modal เมื่อกด Escape
    if (e.key === 'Escape') {
      onClose();
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // ป้องกันการ scroll ของ body
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <div className="image-modal" onClick={handleBackdropClick}>
      <div className="close-button" onClick={onClose}>
        ×
      </div>
      <img src={src} alt={alt} onClick={(e) => e.stopPropagation()} />
    </div>
  );
};

export default ImageModal;