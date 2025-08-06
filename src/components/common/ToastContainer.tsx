import React, { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import Toast, { ToastProps } from "./Toast";
import { ToastContext, ToastContextType } from "./ToastContext";
import "./ToastContainer.css";

interface ToastContainerProps {
  children: React.ReactNode;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = useCallback((toast: Omit<ToastProps, "id" | "onClose">) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: ToastProps = {
      ...toast,
      id,
      onClose: (toastId: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== toastId));
      },
    };
    setToasts((prev) => [...prev, newToast]);
  }, []);

  const showSuccess = useCallback(
    (title: string, message?: string) => {
      addToast({ type: "success", title, message });
    },
    [addToast]
  );

  const showError = useCallback(
    (title: string, message?: string) => {
      addToast({ type: "error", title, message });
    },
    [addToast]
  );

  const showWarning = useCallback(
    (title: string, message?: string) => {
      addToast({ type: "warning", title, message });
    },
    [addToast]
  );

  const showInfo = useCallback(
    (title: string, message?: string) => {
      addToast({ type: "info", title, message });
    },
    [addToast]
  );

  const contextValue: ToastContextType = {
    showToast: addToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="toast-container">
        <AnimatePresence>
          {toasts.map((toast) => (
            <Toast key={toast.id} {...toast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
