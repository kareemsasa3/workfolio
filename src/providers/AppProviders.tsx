import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "../contexts/ThemeContext";
import { LayoutContextProvider } from "../contexts/LayoutContext";
import { SettingsProvider } from "../contexts/SettingsContext";
import { ToastContainer } from "../components/common";

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <LayoutContextProvider>
        <SettingsProvider>
          <ToastContainer>
            <BrowserRouter>{children}</BrowserRouter>
          </ToastContainer>
        </SettingsProvider>
      </LayoutContextProvider>
    </ThemeProvider>
  );
};
