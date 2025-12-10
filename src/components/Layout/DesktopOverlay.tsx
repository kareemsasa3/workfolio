import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSettings } from "../../contexts/SettingsContext";
import { useWindowManager } from "../../contexts/WindowManagerContext";
import "./DesktopOverlay.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const useClock = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
};

const DesktopOverlay: React.FC = () => {
  const { osMode, toggleOsMode } = useSettings();
  const { windows, restoreWindow, getAppDefinition } = useWindowManager();
  const now = useClock();
  if (!osMode) return null;

  const dateStr = now.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const timeStr = now.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="desktop-overlay" aria-hidden={!osMode}>
      <div className="desktop-topbar" role="banner">
        <div className="desktop-left">
          <motion.button
            className="desktop-os-badge"
            onClick={toggleOsMode}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-pressed={osMode}
            aria-label="OS mode enabled. Click to toggle."
            title="OS mode enabled — click to toggle"
          >
            OS
          </motion.button>
        </div>
        <div className="desktop-center" />
        <div className="desktop-right" aria-label="Date and time">
          <span className="desktop-date">{dateStr}</span>
          <span className="desktop-time">{timeStr}</span>
        </div>
      </div>
      {/* Stage Manager - minimized windows list */}
      <div
        className="desktop-stage"
        role="navigation"
        aria-label="Minimized windows stage"
      >
        {windows
          .filter((w) => w.isMinimized)
          .map((w) => {
            const def = getAppDefinition(w.appId);
            if (!def) return null;
            return (
              <button
                key={w.id}
                className="stage-item"
                title={`Restore ${def.title}`}
                aria-label={`Restore ${def.title}`}
                onClick={() => restoreWindow(w.id)}
              >
                <span className="stage-item-icon">
                  <FontAwesomeIcon icon={(def as any).icon} />
                </span>
                <span className="stage-item-title">{def.title}</span>
              </button>
            );
          })}
      </div>
    </div>
  );
};

export default DesktopOverlay;
