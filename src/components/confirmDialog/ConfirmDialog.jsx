import React from 'react';
import './ConfirmDialog.css';

const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="confirm-overlay">
      <div className="confirm-dialog">
        <div className="confirm-header">
          <span className="confirm-icon">⚠️</span>
        </div>
        
        <div className="confirm-content">
          <p className="confirm-message">{message}</p>
        </div>

        <div className="confirm-actions">
          <button 
            className="confirm-button confirm-cancel"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button 
            className="confirm-button confirm-accept"
            onClick={onConfirm}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;