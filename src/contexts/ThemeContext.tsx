import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage first, then system preference, default to dark
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme) {
      return savedTheme;
    }

    // Check system preference
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches
    ) {
      return "light";
    }

    return "dark";
  });

  useEffect(() => {
    // Save theme to localStorage
    localStorage.setItem("theme", theme);

    // Apply theme to document
    document.documentElement.setAttribute("data-theme", theme);

    // Update CSS custom properties with softer colors
    const root = document.documentElement;
    if (theme === "light") {
      // Softer light theme colors - less bright
      root.style.setProperty("--background-color", "#f5f5f5");
      root.style.setProperty("--background-color-secondary", "#fafafa");
      root.style.setProperty("--background-color-tertiary", "#e8e8e8");
      root.style.setProperty(
        "--background-color-transparent",
        "rgba(245, 245, 245, 0.7)"
      );
      root.style.setProperty(
        "--background-color-overlay",
        "rgba(245, 245, 245, 0.95)"
      );
      root.style.setProperty("--text-color", "#2c2c2c");
      root.style.setProperty("--text-color-secondary", "#5a5a5a");
      root.style.setProperty("--text-color-muted", "#8a8a8a");
      root.style.setProperty("--border-color", "#d0d0d0");
      root.style.setProperty("--shadow-color", "rgba(0, 0, 0, 0.08)");
    } else {
      // Soft dark theme colors
      root.style.setProperty("--background-color", "#1a1a1a");
      root.style.setProperty("--background-color-secondary", "#2d2d2d");
      root.style.setProperty("--background-color-tertiary", "#404040");
      root.style.setProperty(
        "--background-color-transparent",
        "rgba(26, 26, 26, 0.7)"
      );
      root.style.setProperty(
        "--background-color-overlay",
        "rgba(26, 26, 26, 0.95)"
      );
      root.style.setProperty("--text-color", "#f8f9fa");
      root.style.setProperty("--text-color-secondary", "#adb5bd");
      root.style.setProperty("--text-color-muted", "#6c757d");
      root.style.setProperty("--border-color", "#495057");
      root.style.setProperty("--shadow-color", "rgba(0, 0, 0, 0.3)");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
