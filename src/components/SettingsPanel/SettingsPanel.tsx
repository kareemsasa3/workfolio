import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "../ThemeToggle";
import {
  DOCK_SIZE_CONFIG,
  DOCK_STIFFNESS_CONFIG,
  MAGNIFICATION_CONFIG,
} from "./settingsConstants";
import "./SettingsPanel.css";

interface SettingsPanelProps {
  onDockSizeChange: (size: number) => void;
  currentDockSize: number;
  onDockStiffnessChange: (stiffness: number) => void;
  currentDockStiffness: number;
  onMagnificationChange: (magnification: number) => void;
  currentMagnification: number;
  isOpen: boolean;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  onDockSizeChange,
  currentDockSize,
  onDockStiffnessChange,
  currentDockStiffness,
  onMagnificationChange,
  currentMagnification,
  isOpen,
  onClose,
}) => {
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

  return (
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
                <label className="setting-label">Theme</label>
                <div className="setting-control">
                  <ThemeToggle />
                </div>
                <div className="setting-description">
                  Switch between light and dark themes.
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
            </motion.div>
          </motion.div>

          {/* Overlay */}
          <motion.div
            className="settings-overlay"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            aria-hidden="true"
          />
        </>
      )}
    </AnimatePresence>
  );
};

export default SettingsPanel;
