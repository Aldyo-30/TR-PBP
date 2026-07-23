/**
 * ============================================
 * Reusable Modal Component
 * ============================================
 * A generic modal component that matches the styling
 * system of the application.
 * ============================================
 */

import { useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const Modal = ({ isOpen, onClose, title, children, maxWidth = '500px' }) => {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Close modal when clicking on the overlay backdrop
  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal" style={{ maxWidth, width: '95%' }}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose} type="button">
            <FiX size={20} />
          </button>
        </div>
        <div className="modal-body" style={{ padding: '1.5rem' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
