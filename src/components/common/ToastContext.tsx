import { createContext } from "react";

export interface ToastContextType {
  showToast: (
    toast: Omit<import("./Toast").ToastProps, "id" | "onClose">
  ) => void;
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
  showWarning: (title: string, message?: string) => void;
  showInfo: (title: string, message?: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined
);
