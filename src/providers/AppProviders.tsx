import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "../contexts/ThemeContext";
import { LayoutContextProvider } from "../contexts/LayoutContext";

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <LayoutContextProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </LayoutContextProvider>
    </ThemeProvider>
  );
};
