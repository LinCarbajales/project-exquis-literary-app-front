import React from 'react';
import './Toast.css';

const Toast = ({ toast, onClose }) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return '✓';
      case 'error':
        return '⚠️';
      case 'warning':
        return '⚡';
      case 'info':
        return 'ℹ️';
      default:
        return '✓';
    }
  };

  return (
    <div className={`toast toast-${toast.type}`}>
      <div className="toast-content">
        <span className="toast-icon">{getIcon()}</span>
        <p className="toast-message">{toast.message}</p>
      </div>
      <button 
        className="toast-close" 
        onClick={() => onClose(toast.id)}
        aria-label="Cerrar notificación"
      >
        ×
      </button>
    </div>
  );
};

export default Toast;