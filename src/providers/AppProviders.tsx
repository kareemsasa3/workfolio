import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "../contexts/ThemeContext";
import { LayoutContextProvider } from "../contexts/LayoutContext";
import { SettingsProvider } from "../contexts/SettingsContext";
import { ToastContainer } from "../components/common";
import { WindowManagerProvider } from "../contexts/WindowManagerContext";

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <LayoutContextProvider>
        <SettingsProvider>
          <ToastContainer>
            <BrowserRouter>
              <WindowManagerProvider>{children}</WindowManagerProvider>
            </BrowserRouter>
          </ToastContainer>
        </SettingsProvider>
      </LayoutContextProvider>
    </ThemeProvider>
  );
};
