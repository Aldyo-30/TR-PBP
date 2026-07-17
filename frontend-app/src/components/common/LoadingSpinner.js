/**
 * ============================================
 * Loading Spinner Component
 * ============================================
 * A beautiful, centered loading indicator with
 * animated gradient ring and optional message.
 * ============================================
 */

const LoadingSpinner = ({ message = 'Memuat...' }) => {
  return (
    <div className="loading-spinner-overlay">
      <div className="loading-spinner-container">
        {/* Animated spinner ring */}
        <div className="spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring spinner-ring-2"></div>
          <div className="spinner-dot"></div>
        </div>

        {/* Optional loading message */}
        {message && <p className="loading-message">{message}</p>}
      </div>
    </div>
  );
};

export default LoadingSpinner;
