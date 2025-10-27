import React, { useState, useCallback } from 'react';
import { ToastContext } from './ToastContext';
import ToastContainer from '../components/toast/ToastContainer';

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
      {/* Renderizamos el ToastContainer */}
      <ToastContainer />
      {/* Si luego quieres un ConfirmDialog, también puedes renderizarlo aquí */}
    </ToastContext.Provider>
  );
};
