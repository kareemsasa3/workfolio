import { createContext } from "react";

interface SettingsContextType {
  isSettingsOpen: boolean;
  toggleSettings: () => void;
  closeSettings: () => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);
