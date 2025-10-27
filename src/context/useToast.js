// src/context/useToast.js
import { useContext } from 'react';
import { ToastContext } from './ToastContext'; // Importar con llaves

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe usarse dentro de ToastProvider');
  }
  return context;
};
