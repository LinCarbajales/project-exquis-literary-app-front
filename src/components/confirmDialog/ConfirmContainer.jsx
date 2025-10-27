import React from 'react';
import { useToast } from '../../context/useToast';
import ConfirmDialog from './ConfirmDialog';

const ConfirmContainer = () => {
  const { confirmDialog } = useToast();

  if (!confirmDialog) return null;

  return (
    <ConfirmDialog
      message={confirmDialog.message}
      onConfirm={confirmDialog.onConfirm}
      onCancel={confirmDialog.onCancel}
    />
  );
};

export default ConfirmContainer;