import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faPause,
  faPlay,
  faUndo,
  faDownload,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "../ThemeToggle";
import {
  DOCK_SIZE_CONFIG,
  DOCK_STIFFNESS_CONFIG,
  MAGNIFICATION_CONFIG,
  MATRIX_SPEED_CONFIG,
} from "./settingsConstants";
import {
  resetAllSettings,
  getAllSettings,
  setDockSettings,
  setTheme,
  setAnimationPaused,
  DEFAULT_SETTINGS,
} from "../../utils/settings";
import { Modal, useToast } from "../common";
import "./SettingsPanel.css";

interface SettingsPanelProps {
  onDockSizeChange: (size: number) => void;
  currentDockSize: number;
  onDockStiffnessChange: (stiffness: number) => void;
  currentDockStiffness: number;
  onMagnificationChange: (magnification: number) => void;
  currentMagnification: number;
  isAnimationPaused: boolean;
  onAnimationToggle: (paused: boolean) => void;
  isOpen: boolean;
  onClose: () => void;
  matrixSpeed?: number;
  onMatrixSpeedChange?: (speed: number) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  onDockSizeChange,
  currentDockSize,
  onDockStiffnessChange,
  currentDockStiffness,
  onMagnificationChange,
  currentMagnification,
  isAnimationPaused,
  onAnimationToggle,
  isOpen,
  onClose,
  matrixSpeed,
  onMatrixSpeedChange,
}) => {
  const { showSuccess, showError } = useToast();
  const [showResetModal, setShowResetModal] = useState(false);

  const handleDockSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onDockSizeChange(Number(event.target.value));
  };

  const handleDockStiffnessChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onDockStiffnessChange(Number(event.target.value));
  };

  const handleMagnificationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onMagnificationChange(Number(event.target.value));
  };

  const handleAnimationToggle = () => {
    onAnimationToggle(!isAnimationPaused);
  };

  const handleResetToDefaults = () => {
    setShowResetModal(true);
  };

  const confirmResetToDefaults = () => {
    try {
      // Clear localStorage
      resetAllSettings();

      // Reset all settings to defaults using the provided handlers
      onDockSizeChange(DEFAULT_SETTINGS.dockSize);
      onDockStiffnessChange(DEFAULT_SETTINGS.dockStiffness);
      onMagnificationChange(DEFAULT_SETTINGS.magnification);
      onAnimationToggle(DEFAULT_SETTINGS.isAnimationPaused);
      onMatrixSpeedChange?.(DEFAULT_SETTINGS.matrixSpeed ?? 1);

      // Note: Theme will be reset on next page reload since it's managed by ThemeContext
      // For now, we'll show a message about the theme reset

      showSuccess(
        "Settings Reset",
        "All settings have been reset to defaults. The theme will update on the next page refresh."
      );
    } catch {
      showError("Reset Failed", "Failed to reset settings. Please try again.");
    }
  };

  const handleExportSettings = () => {
    try {
      const settings = getAllSettings();
      const settingsBlob = new Blob([JSON.stringify(settings, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(settingsBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `workfolio-settings-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showSuccess(
        "Settings Exported",
        "Your settings have been exported successfully."
      );
    } catch (_error) {
      console.error("Failed to export settings:", _error);
      showError(
        "Export Failed",
        "Failed to export settings. Please try again."
      );
    }
  };

  const handleImportSettings = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const settings = JSON.parse(e.target?.result as string);

            // Validate and apply settings
            if (
              settings.dockSize &&
              settings.dockStiffness &&
              settings.magnification
            ) {
              setDockSettings({
                dockSize: settings.dockSize,
                dockStiffness: settings.dockStiffness,
                magnification: settings.magnification,
              });
              onDockSizeChange(settings.dockSize);
              onDockStiffnessChange(settings.dockStiffness);
              onMagnificationChange(settings.magnification);
            }

            if (settings.theme) {
              setTheme(settings.theme);
            }

            if (typeof settings.isAnimationPaused === "boolean") {
              setAnimationPaused(settings.isAnimationPaused);
              onAnimationToggle(settings.isAnimationPaused);
            }

            if (typeof settings.matrixSpeed === "number") {
              onMatrixSpeedChange?.(settings.matrixSpeed);
            }

            showSuccess(
              "Settings Imported",
              "Settings have been imported successfully. The theme will update on the next page refresh."
            );
          } catch (error) {
            console.error("Failed to import settings:", error);
            showError(
              "Import Failed",
              "Failed to import settings. Please check the file format."
            );
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Settings Panel */}
            <motion.div
              className="settings-panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 220 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="settings-title"
            >
              <div className="settings-header">
                <h3 id="settings-title">Settings</h3>
                <motion.button
                  className="settings-close"
                  onClick={onClose}
                  aria-label="Close settings"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </motion.button>
              </div>

              <motion.div
                className="settings-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.2 }}
              >
                <div className="settings-row">
                  <div className="setting-group">
                    <label className="setting-label">
                      Background Animation
                    </label>
                    <div className="setting-control">
                      <motion.button
                        className={`animation-toggle ${
                          isAnimationPaused ? "paused" : "playing"
                        }`}
                        onClick={handleAnimationToggle}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label={
                          isAnimationPaused
                            ? "Resume animation"
                            : "Pause animation"
                        }
                      >
                        <FontAwesomeIcon
                          icon={isAnimationPaused ? faPlay : faPause}
                        />
                        <span>{isAnimationPaused ? "Resume" : "Pause"}</span>
                      </motion.button>
                    </div>
                    <div className="setting-description">
                      {isAnimationPaused
                        ? "Background animation is currently paused."
                        : "Background animation is currently running."}
                    </div>
                  </div>

                  <div className="setting-group">
                    <label className="setting-label">Theme</label>
                    <div className="setting-control">
                      <ThemeToggle />
                    </div>
                    <div className="setting-description">
                      Switch between light and dark themes.
                    </div>
                  </div>
                </div>

                <div className="setting-group">
                  <label htmlFor="matrix-speed" className="setting-label">
                    Matrix Speed
                  </label>
                  <div className="setting-control">
                    <input
                      type="range"
                      id="matrix-speed"
                      min={MATRIX_SPEED_CONFIG.min}
                      max={MATRIX_SPEED_CONFIG.max}
                      step={MATRIX_SPEED_CONFIG.step}
                      value={typeof matrixSpeed === "number" ? matrixSpeed : 1}
                      onChange={(e) =>
                        onMatrixSpeedChange?.(parseFloat(e.target.value))
                      }
                      className="magnification-slider"
                    />
                    <div className="magnification-value">
                      {typeof matrixSpeed === "number"
                        ? matrixSpeed.toFixed(1)
                        : "1.0"}
                      ×
                    </div>
                  </div>
                  <div className="setting-description">
                    Adjust the falling speed of the Matrix background.
                  </div>
                </div>

                <div className="setting-group">
                  <label htmlFor="dock-size" className="setting-label">
                    Dock Size
                  </label>
                  <div className="setting-control">
                    <input
                      type="range"
                      id="dock-size"
                      min={DOCK_SIZE_CONFIG.min}
                      max={DOCK_SIZE_CONFIG.max}
                      step={DOCK_SIZE_CONFIG.step}
                      value={currentDockSize}
                      onChange={handleDockSizeChange}
                      className="dock-size-slider"
                    />
                    <div className="dock-size-value">{currentDockSize}px</div>
                  </div>
                  <div className="setting-description">
                    Adjust the base size of the icons in the dock.
                  </div>
                </div>

                <div className="setting-group">
                  <label htmlFor="dock-stiffness" className="setting-label">
                    Dock Stiffness
                  </label>
                  <div className="setting-control">
                    <input
                      type="range"
                      id="dock-stiffness"
                      min={DOCK_STIFFNESS_CONFIG.min}
                      max={DOCK_STIFFNESS_CONFIG.max}
                      step={DOCK_STIFFNESS_CONFIG.step}
                      value={currentDockStiffness}
                      onChange={handleDockStiffnessChange}
                      className="dock-stiffness-slider"
                    />
                    <div className="dock-stiffness-value">
                      {currentDockStiffness}
                    </div>
                  </div>
                  <div className="setting-description">
                    Controls how snappy the dock animations feel.
                  </div>
                </div>

                <div className="setting-group">
                  <label htmlFor="magnification" className="setting-label">
                    Magnification
                  </label>
                  <div className="setting-control">
                    <input
                      type="range"
                      id="magnification"
                      min={MAGNIFICATION_CONFIG.min}
                      max={MAGNIFICATION_CONFIG.max}
                      step={MAGNIFICATION_CONFIG.step}
                      value={currentMagnification}
                      onChange={handleMagnificationChange}
                      className="magnification-slider"
                    />
                    <div className="magnification-value">
                      {currentMagnification}%
                    </div>
                  </div>
                  <div className="setting-description">
                    Controls how large icons become on hover.
                  </div>
                </div>

                <div className="setting-group">
                  <label className="setting-label">Backup & Restore</label>
                  <div className="setting-control">
                    <motion.button
                      className="export-button"
                      onClick={handleExportSettings}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Export settings"
                    >
                      <FontAwesomeIcon icon={faDownload} />
                      <span>Export Settings</span>
                    </motion.button>
                    <motion.button
                      className="import-button"
                      onClick={handleImportSettings}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Import settings"
                    >
                      <FontAwesomeIcon icon={faUpload} />
                      <span>Import Settings</span>
                    </motion.button>
                  </div>
                  <div className="setting-description">
                    Export your current settings to a file or import previously
                    saved settings.
                  </div>
                </div>

                <div className="setting-group">
                  <label className="setting-label">About</label>
                  <div className="setting-description">
                    <strong>Workfolio v1.0</strong>
                    <br />
                    A Mac-inspired portfolio with interactive dock navigation.
                    <br />
                    Built with React, TypeScript, and Framer Motion.
                  </div>
                </div>

                <div className="setting-group">
                  <label className="setting-label">Reset Settings</label>
                  <div className="setting-control">
                    <motion.button
                      className="reset-button"
                      onClick={handleResetToDefaults}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Reset all settings to defaults"
                    >
                      <FontAwesomeIcon icon={faUndo} />
                      <span>Reset to Defaults</span>
                    </motion.button>
                  </div>
                  <div className="setting-description">
                    Reset all settings to their default values.
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Reset Settings"
        type="warning"
        onConfirm={confirmResetToDefaults}
        onCancel={() => setShowResetModal(false)}
        confirmText="Reset"
        cancelText="Cancel"
      >
        <p>
          Are you sure you want to reset all settings to their default values?
          This action cannot be undone.
        </p>
        <p style={{ marginTop: "12px", fontSize: "0.9rem", color: "#b0b0b0" }}>
          Note: The theme setting will update on the next page refresh.
        </p>
      </Modal>
    </>
  );
};

export default SettingsPanel;
