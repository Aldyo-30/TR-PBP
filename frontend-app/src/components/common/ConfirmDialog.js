/**
 * ============================================
 * Confirm Dialog Component
 * ============================================
 * A modal overlay for confirming destructive or
 * important actions (delete, logout, etc.).
 * - Smooth fade-in animation
 * - Click outside to cancel
 * - Keyboard accessible (Escape to cancel)
 * ============================================
 */

import { useEffect } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

const ConfirmDialog = ({
  isOpen,
  title = 'Konfirmasi',
  message = 'Apakah Anda yakin?',
  confirmText = 'Ya, Lanjutkan',
  cancelText = 'Batal',
  onConfirm,
  onCancel,
  variant = 'danger', // 'danger' | 'warning' | 'info'
}) => {
  // Handle Escape key to close
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onCancel]);

  // Prevent body scroll when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div
        className="confirm-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className={`confirm-icon confirm-icon-${variant}`}>
          <FiAlertTriangle size={28} />
        </div>

        {/* Title */}
        <h3 className="confirm-title">{title}</h3>

        {/* Message */}
        <p className="confirm-message">{message}</p>

        {/* Action Buttons */}
        <div className="confirm-actions">
          <button
            className="btn btn-secondary"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className={`btn btn-${variant}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
