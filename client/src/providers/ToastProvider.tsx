/**
 * Node modules
 */
import { createContext, useState } from "react";

/**
 * Components
 */
import { Toaster, type Toast, type ToastContextType, type ToastInput } from "@/components/ui/Toast";

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined,
);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (input: ToastInput): string => {
    const id = generateId();

    const toast: Toast = {
      id,
      variant: 'default',
      duration: 5000,
      ...input,
    };

    setToasts((prev) => [...prev, toast]);

    return id;
  };

  const removeToast = (id: string): void => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const dismissAll = (): void => {
    setToasts([]);
  };

  return (
    <ToastContext.Provider
      value={{ toasts, addToast, removeToast, dismissAll }}
    >
      {children}
      <Toaster toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

// Generate unique ID
const generateId = (): string => {
  return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
