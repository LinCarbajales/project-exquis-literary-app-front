import React, { useState, useCallback } from 'react';
import { ToastContext } from './ToastContext';
import ToastContainer from '../components/toast/ToastContainer';
import ConfirmDialog from '../components/ConfirmDialog/ConfirmDialog';

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState(null);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now();
    const newToast = { id, message, type, duration };
    setToasts(prev => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
  }, [removeToast]);

  const showConfirm = useCallback((message, onConfirm, onCancel) => {
    return new Promise((resolve) => {
      setConfirmDialog({
        message,
        onConfirm: () => {
          if (onConfirm) onConfirm();
          setConfirmDialog(null);
          resolve(true);
        },
        onCancel: () => {
          if (onCancel) onCancel();
          setConfirmDialog(null);
          resolve(false);
        }
      });
    });
  }, []);

  const value = { toasts, confirmDialog, showToast, removeToast, showConfirm };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer />
      {/* 👇 ESTA ES LA LÍNEA CLAVE QUE FALTABA */}
      {confirmDialog && (
        <ConfirmDialog
          message={confirmDialog.message}
          onConfirm={confirmDialog.onConfirm}
          onCancel={confirmDialog.onCancel}
        />
      )}
    </ToastContext.Provider>
  );
};