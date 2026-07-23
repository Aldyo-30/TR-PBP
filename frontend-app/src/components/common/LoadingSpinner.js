

const LoadingSpinner = ({ message = 'Memuat...' }) => {
  return (
    <div className="loading-spinner-overlay">
      <div className="loading-spinner-container">

        <div className="spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring spinner-ring-2"></div>
          <div className="spinner-dot"></div>
        </div>

        {message && <p className="loading-message">{message}</p>}
      </div>
    </div>
  );
};

export default LoadingSpinner;
