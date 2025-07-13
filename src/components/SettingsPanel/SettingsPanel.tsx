import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "../ThemeToggle";
import "./SettingsPanel.css";

interface SettingsPanelProps {
  onDockSizeChange: (size: number) => void;
  currentDockSize: number;
  isOpen: boolean;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  onDockSizeChange,
  currentDockSize,
  isOpen,
  onClose,
}) => {
  const handleDockSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(event.target.value);
    onDockSizeChange(newSize);
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
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 200,
              duration: 0.3,
            }}
          >
            <motion.div
              className="settings-header"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <h3>Settings</h3>
              <motion.button
                className="settings-close"
                onClick={onClose}
                aria-label="Close settings"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </motion.button>
            </motion.div>

            <motion.div
              className="settings-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <motion.div
                className="setting-group"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <label htmlFor="dock-size" className="setting-label">
                  Dock Size
                </label>
                <div className="setting-control">
                  <input
                    type="range"
                    id="dock-size"
                    min="20"
                    max="60"
                    value={currentDockSize}
                    onChange={handleDockSizeChange}
                    className="dock-size-slider"
                  />
                </div>
                <div className="setting-description">
                  Adjust the size of navigation icons in the dock
                </div>
              </motion.div>

              <motion.div
                className="setting-group"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                <label className="setting-label">Theme</label>
                <div className="setting-control">
                  <ThemeToggle />
                </div>
                <div className="setting-description">
                  Switch between light and dark themes
                </div>
              </motion.div>
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
          />
        </>
      )}
    </AnimatePresence>
  );
};

export default SettingsPanel;
