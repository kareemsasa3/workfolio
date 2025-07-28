import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "../contexts/ThemeContext";
import { LayoutContextProvider } from "../contexts/LayoutContext";
import { SettingsProvider } from "../contexts/SettingsContext";

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <LayoutContextProvider>
        <SettingsProvider>
          <BrowserRouter>{children}</BrowserRouter>
        </SettingsProvider>
      </LayoutContextProvider>
    </ThemeProvider>
  );
};
