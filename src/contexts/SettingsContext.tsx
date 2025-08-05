import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface SettingsContextType {
  isSettingsOpen: boolean;
  toggleSettings: () => void;
  closeSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

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
