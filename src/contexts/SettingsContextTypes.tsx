import { createContext } from "react";

interface SettingsContextType {
  isSettingsOpen: boolean;
  toggleSettings: () => void;
  closeSettings: () => void;
  osMode: boolean;
  setOsMode: (enabled: boolean) => void;
  toggleOsMode: () => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);
