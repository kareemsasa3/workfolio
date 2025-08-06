import React, { useState, ReactNode, useEffect } from "react";
import { SettingsContext } from "./SettingsContextTypes";

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({
  children,
}) => {
  // Initialize state from localStorage if available
  const [isSettingsOpen, setIsSettingsOpen] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("workfolio-settings-open");
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  // Save to localStorage whenever the state changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "workfolio-settings-open",
        JSON.stringify(isSettingsOpen)
      );
    }
  }, [isSettingsOpen]);

  const toggleSettings = () => setIsSettingsOpen((prev: boolean) => !prev);
  const closeSettings = () => setIsSettingsOpen(false);

  return (
    <SettingsContext.Provider
      value={{ isSettingsOpen, toggleSettings, closeSettings }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

// Re-export the useSettings hook
// eslint-disable-next-line react-refresh/only-export-components
export { useSettings } from "./useSettings";
