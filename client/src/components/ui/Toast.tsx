/**
 * Node modules
 */
import { cva } from 'class-variance-authority';
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * Types
 */
type VariantType = 'default' | 'success' | 'error' | 'warning' | 'info';
type StateShowUp = 'entering' | 'visible' | 'leaving';

export type Toast = {
  id: string;
  title: string;
  description?: string;
  variant?: VariantType;
  duration?: number;
};

export type ToastInput = {
  title: string;
  description?: string;
  variant?: VariantType;
  duration?: number;
};

export type ToastContextType = {
  toasts: Toast[];
  addToast: (toast: ToastInput) => string;
  removeToast: (id: string) => void;
  dismissAll: () => void;
};

const toastVariants = cva(
  'flex items-start gap-3 p-4 w-80 rounded-lg border shadow-lg transition-all duration-300 ease-in-out transform bg-white',
  {
    variants: {
      variant: {
        default: 'border-gray-200 bg-white',
        success: 'border-green-200 bg-green-50',
        error: 'border-red-200 bg-red-50',
        warning: 'border-yellow-200 bg-yellow-50',
        info: 'border-blue-200 bg-blue-50',
      },
      state: {
        entering: 'translate-x-full opacity-0',
        visible: 'translate-x-0 opacity-100',
        leaving: 'translate-x-full opacity-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      state: 'entering',
    },
  },
);

const iconVariants = cva('mt-0.5 flex-shrink-0', {
  variants: {
    variant: {
      default: 'text-gray-600',
      success: 'text-green-600',
      error: 'text-red-600',
      warning: 'text-yellow-600',
      info: 'text-blue-600',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const ToastItem = ({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: (id: string) => void;
}) => {
  const [state, setState] = useState<StateShowUp>('entering');

  useEffect(() => {
    const enterTimer = setTimeout(() => setState('visible'), 50);
    let autoRemoveTimer: NodeJS.Timeout | null = null;

    if (toast.duration && toast.duration > 0) {
      autoRemoveTimer = setTimeout(() => {
        handleRemove();
      }, toast.duration);
    }

    return () => {
      clearTimeout(enterTimer);
      if (autoRemoveTimer) {
        clearTimeout(autoRemoveTimer);
      }
    };
  }, []);

  const handleRemove = () => {
    setState('leaving');
    setTimeout(() => {
      onRemove(toast.id);
    }, 300);
  };

  const getIcon = () => {
    const iconProps = {
      size: 20,
    };
    const iconClass = iconVariants({ variant: toast.variant });

    switch (toast.variant) {
      case 'success':
        return <CheckCircle {...iconProps} className={iconClass} />;
      case 'error':
        return <AlertCircle {...iconProps} className={iconClass} />;
      case 'warning':
        return <AlertTriangle {...iconProps} className={iconClass} />;
      case 'info':
        return <Info {...iconProps} className={iconClass} />;
      default:
        return null;
    }
  };

  return (
    <div className={toastVariants({ variant: toast.variant, state })}>
      {getIcon()}
      <div className="min-w-0 flex-1">
        {toast.title && (
          <div className="mb-1 text-sm font-semibold text-gray-900">
            {toast.title}
          </div>
        )}
        {toast.description && (
          <div className="text-sm text-gray-600">{toast.description}</div>
        )}
      </div>
      <button
        onClick={handleRemove}
        aria-label="Close toast"
        className="flex-shrink-0 text-gray-400 transition-colors hover:text-gray-600"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export const Toaster = ({
  toasts,
  onRemove,
}: {
  toasts: Toast[];
  onRemove: (id: string) => void;
}) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex max-w-sm flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};
