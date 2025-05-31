/**
 * Node modules
 */
import { useContext } from 'react';

/**
 * Components
 */
import { type ToastInput } from '@/components/ui/Toast';

/**
 * Providers
 */
import { ToastContext } from '@/providers/ToastProvider';

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider!');
  }

  const { addToast, removeToast, dismissAll } = context;

  const toast = (input: ToastInput) => {
    const toastData: ToastInput = input;
    return addToast(toastData);
  };

  toast.success = (input: ToastInput) => {
    const toastData: ToastInput = {
      ...input,
      variant: 'success',
    };
    return addToast(toastData);
  };

  toast.error = (input: ToastInput) => {
    const toastData: ToastInput = {
      ...input,
      variant: 'error',
    };
    return addToast(toastData);
  };

  toast.warning = (input: ToastInput) => {
    const toastData: ToastInput = {
      ...input,
      variant: 'warning',
    };
    return addToast(toastData);
  };

  toast.info = (input: ToastInput) => {
    const toastData: ToastInput = {
      ...input,
      variant: 'info',
    };
    return addToast(toastData);
  };

  toast.dismiss = (id?: string): void => {
    if (id) {
      removeToast(id);
    } else {
      dismissAll();
    }
  };

  return {
    toast: {
      default: toast,
      success: toast.success,
      error: toast.error,
      warning: toast.warning,
      info: toast.info,
      dismiss: toast.dismiss,
    },
  };
};
