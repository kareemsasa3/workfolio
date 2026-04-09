import React, { useState, useEffect, ReactNode } from "react";
import { ThemeContext } from "./ThemeContextTypes";

// Export the Theme type
export type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "theme";

const resolveInitialTheme = (): Theme => {
  try {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }
  } catch {
    // Ignore localStorage failures and continue to other fallbacks.
  }

  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: light)").matches
  ) {
    return "light";
  }

  return "dark";
};

const applyThemeToDocument = (theme: Theme) => {
  const root = document.documentElement;
  const isLight = theme === "light";

  root.setAttribute("data-theme", theme);
  root.style.colorScheme = theme;

  root.style.setProperty("--app-bg", isLight ? "#f5f5f5" : "#1a1a1a");
  root.style.setProperty(
    "--app-bg-secondary",
    isLight ? "#fafafa" : "#2d2d2d"
  );
  root.style.setProperty("--app-surface", isLight ? "#ffffff" : "#2d2d2d");
  root.style.setProperty(
    "--app-surface-elevated",
    isLight ? "#ffffff" : "#404040"
  );
  root.style.setProperty(
    "--app-overlay",
    isLight ? "rgba(245, 245, 245, 0.88)" : "rgba(26, 26, 26, 0.88)"
  );
  root.style.setProperty("--app-text", isLight ? "#2c2c2c" : "#f8f9fa");
  root.style.setProperty(
    "--app-text-secondary",
    isLight ? "#4a4a4a" : "#adb5bd"
  );
  root.style.setProperty(
    "--app-text-muted",
    isLight ? "#6a6a6a" : "#6c757d"
  );
  root.style.setProperty("--app-border", isLight ? "#d0d0d0" : "#495057");
  root.style.setProperty(
    "--app-shadow",
    isLight ? "rgba(0, 0, 0, 0.08)" : "rgba(0, 0, 0, 0.3)"
  );
  root.style.setProperty(
    "--brand-primary",
    isLight ? "#007a00" : "#4CAF50"
  );
  root.style.setProperty(
    "--brand-primary-soft",
    isLight ? "#e6f3e6" : "#81C784"
  );
  root.style.setProperty(
    "--brand-primary-medium",
    isLight ? "#4caf50" : "#66BB6A"
  );
  root.style.setProperty(
    "--brand-primary-dark",
    isLight ? "#005a00" : "#388E3C"
  );
  root.style.setProperty("--bg-canvas-fill", isLight ? "#f5f5f5" : "#0f0f0f");
  root.style.setProperty(
    "--bg-canvas-glyph",
    isLight ? "44, 44, 44" : "0, 255, 0"
  );
  root.style.setProperty(
    "--bg-glow-color",
    isLight ? "rgba(106, 106, 106, 0.10)" : "rgba(108, 117, 125, 0.10)"
  );
  root.style.setProperty(
    "--bg-grid-major",
    isLight ? "rgba(0, 0, 0, 0.095)" : "rgba(129, 199, 132, 0.08)"
  );
  root.style.setProperty(
    "--bg-grid-minor",
    isLight ? "rgba(0, 0, 0, 0.045)" : "rgba(129, 199, 132, 0.03)"
  );
  root.style.setProperty(
    "--bg-topology",
    isLight ? "rgba(0, 122, 0, 0.11)" : "rgba(129, 199, 132, 0.12)"
  );
  root.style.setProperty(
    "--bg-signal",
    isLight ? "rgba(0, 122, 0, 0.14)" : "rgba(129, 199, 132, 0.16)"
  );
  root.style.setProperty(
    "--bg-center-lift",
    isLight ? "rgba(255, 255, 255, 0.18)" : "rgba(255, 255, 255, 0.03)"
  );
  root.style.setProperty(
    "--bg-vignette",
    isLight ? "rgba(18, 24, 32, 0.06)" : "rgba(0, 0, 0, 0.18)"
  );

  // Legacy aliases retained for compatibility during migration.
  root.style.setProperty("--background-color", "var(--app-bg)");
  root.style.setProperty(
    "--background-color-secondary",
    "var(--app-bg-secondary)"
  );
  root.style.setProperty(
    "--background-color-tertiary",
    "var(--app-surface-elevated)"
  );
  root.style.setProperty(
    "--background-color-transparent",
    isLight ? "rgba(245, 245, 245, 0.7)" : "rgba(26, 26, 26, 0.7)"
  );
  root.style.setProperty(
    "--background-color-overlay",
    isLight ? "rgba(245, 245, 245, 0.95)" : "rgba(26, 26, 26, 0.95)"
  );
  root.style.setProperty("--card-background", "var(--app-surface)");
  root.style.setProperty("--panel-bg-color", "var(--app-surface)");
  root.style.setProperty("--text-color", "var(--app-text)");
  root.style.setProperty("--text-color-secondary", "var(--app-text-secondary)");
  root.style.setProperty("--text-secondary", "var(--app-text-secondary)");
  root.style.setProperty("--text-color-muted", "var(--app-text-muted)");
  root.style.setProperty("--text-muted-color", "var(--app-text-muted)");
  root.style.setProperty("--border-color", "var(--app-border)");
  root.style.setProperty("--shadow-color", "var(--app-shadow)");
  root.style.setProperty("--primary-color", "var(--brand-primary)");
  root.style.setProperty("--primary-color-light", "var(--brand-primary-soft)");
  root.style.setProperty(
    "--primary-color-medium",
    "var(--brand-primary-medium)"
  );
  root.style.setProperty("--primary-color-dark", "var(--brand-primary-dark)");
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(resolveInitialTheme);

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore localStorage persistence failures.
    }

    applyThemeToDocument(theme);
  }, [theme]);

  const setTheme = (nextTheme: Theme) => {
    setThemeState(nextTheme);
  };

  const toggleTheme = () => {
    setThemeState((prevTheme: Theme) =>
      prevTheme === "light" ? "dark" : "light"
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Re-export the useTheme hook
// eslint-disable-next-line react-refresh/only-export-components
export { useTheme } from "./useTheme";
