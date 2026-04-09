// Settings utility for managing all user preferences with local storage

export interface UserSettings {
  // Dock settings
  dockSize: number;
  dockStiffness: number;
  magnification: number;

  // Animation settings
  isAnimationPaused: boolean;
  matrixSpeed?: number;

  // UI settings
  isSettingsOpen: boolean;

  // Theme can be included in exported settings, but runtime ownership
  // lives in ThemeContext rather than this persistence utility.
  theme?: "light" | "dark";
}

// Default settings
export const DEFAULT_SETTINGS: UserSettings = {
  dockSize: 40,
  dockStiffness: 400,
  magnification: 40,
  isAnimationPaused: false,
  isSettingsOpen: false,
  matrixSpeed: 1,
};

// Local storage keys
const STORAGE_KEYS = {
  DOCK_SETTINGS: "dockSettings",
  ANIMATION_PAUSED: "workfolio-animation-paused",
  SETTINGS_OPEN: "workfolio-settings-open",
  MATRIX_SPEED: "workfolio-matrix-speed",
} as const;

// Settings validation schema
const validateDockSettings = (settings: unknown) => {
  if (!settings || typeof settings !== "object") return false;

  const settingsObj = settings as Record<string, unknown>;
  const { dockSize, dockStiffness, magnification } = settingsObj;

  return (
    typeof dockSize === "number" &&
    dockSize >= 20 &&
    dockSize <= 80 &&
    typeof dockStiffness === "number" &&
    dockStiffness >= 50 &&
    dockStiffness <= 1000 &&
    typeof magnification === "number" &&
    magnification >= 0 &&
    magnification <= 100
  );
};

const validateBoolean = (value: unknown): boolean => {
  return typeof value === "boolean";
};

// Settings getters
export const getDockSettings = (): Partial<UserSettings> => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.DOCK_SETTINGS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (validateDockSettings(parsed)) {
        return {
          dockSize: parsed.dockSize,
          dockStiffness: parsed.dockStiffness,
          magnification: parsed.magnification,
        };
      }
    }
  } catch (error) {
    console.warn("Failed to load dock settings:", error);
  }
  return {};
};

export const getAnimationPaused = (): boolean => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.ANIMATION_PAUSED);
    if (saved && validateBoolean(JSON.parse(saved))) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.warn("Failed to load animation paused setting:", error);
  }
  return false;
};

export const getSettingsOpen = (): boolean => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS_OPEN);
    if (saved && validateBoolean(JSON.parse(saved))) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.warn("Failed to load settings open state:", error);
  }
  return false;
};

// Settings setters
export const setDockSettings = (
  settings: Partial<
    Pick<UserSettings, "dockSize" | "dockStiffness" | "magnification">
  >
) => {
  try {
    const current = getDockSettings();
    const updated = { ...current, ...settings };

    if (validateDockSettings(updated)) {
      localStorage.setItem(STORAGE_KEYS.DOCK_SETTINGS, JSON.stringify(updated));
    }
  } catch (error) {
    console.warn("Failed to save dock settings:", error);
  }
};

export const setAnimationPaused = (paused: boolean) => {
  try {
    if (validateBoolean(paused)) {
      localStorage.setItem(
        STORAGE_KEYS.ANIMATION_PAUSED,
        JSON.stringify(paused)
      );
    }
  } catch (error) {
    console.warn("Failed to save animation paused setting:", error);
  }
};

export const setSettingsOpen = (open: boolean) => {
  try {
    if (validateBoolean(open)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS_OPEN, JSON.stringify(open));
    }
  } catch (error) {
    console.warn("Failed to save settings open state:", error);
  }
};

// Get all non-theme settings. Theme can be passed in by the caller when exporting.
export const getAllSettings = (
  theme?: "light" | "dark"
): UserSettings => {
  return {
    ...DEFAULT_SETTINGS,
    ...getDockSettings(),
    isAnimationPaused: getAnimationPaused(),
    isSettingsOpen: getSettingsOpen(),
    ...(theme ? { theme } : {}),
    matrixSpeed: (() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEYS.MATRIX_SPEED);
        if (saved != null) {
          const parsed = parseFloat(saved);
          if (!isNaN(parsed)) return parsed;
        }
    } catch {
      // ignore localStorage read failures
    }
      return DEFAULT_SETTINGS.matrixSpeed;
    })(),
  };
};

// Reset all settings to defaults
export const resetAllSettings = () => {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.warn("Failed to reset settings:", error);
  }
};

// Export storage keys for external use
export { STORAGE_KEYS };
