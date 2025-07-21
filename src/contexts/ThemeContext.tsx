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
      // Softer light theme colors - less bright with improved contrast
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
      root.style.setProperty("--text-color-secondary", "#4a4a4a"); // Darker for better contrast
      root.style.setProperty("--text-color-muted", "#6a6a6a"); // Darker for better contrast
      root.style.setProperty("--text-muted-color", "#6a6a6a"); // Darker for better contrast
      root.style.setProperty("--border-color", "#d0d0d0");
      root.style.setProperty("--shadow-color", "rgba(0, 0, 0, 0.08)");
      root.style.setProperty("--card-background", "#ffffff");
      root.style.setProperty("--panel-bg-color", "#ffffff");

      // Improved primary colors for light theme with better contrast
      root.style.setProperty("--primary-color", "#007a00"); // Darker green for better contrast
      root.style.setProperty("--primary-color-light", "#e6f3e6");
      root.style.setProperty("--primary-color-medium", "#4caf50");
      root.style.setProperty("--primary-color-dark", "#005a00");
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
      root.style.setProperty("--text-muted-color", "#6c757d");
      root.style.setProperty("--border-color", "#495057");
      root.style.setProperty("--shadow-color", "rgba(0, 0, 0, 0.3)");
      root.style.setProperty("--card-background", "#2d2d2d");
      root.style.setProperty("--panel-bg-color", "#2d2d2d");

      // Dark theme primary colors
      root.style.setProperty("--primary-color", "#00ff00"); // Classic Matrix green
      root.style.setProperty("--primary-color-light", "rgba(0, 255, 0, 0.1)");
      root.style.setProperty("--primary-color-medium", "#00cc00");
      root.style.setProperty("--primary-color-dark", "#00aa00");
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
