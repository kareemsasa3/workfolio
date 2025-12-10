import React, { useRef, useLayoutEffect, useState } from "react";
import {
  motion,
  useSpring,
  useTransform,
  MotionValue,
  AnimatePresence,
} from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import "./Dock.css";
import { useWindowManager } from "../../contexts/WindowManagerContext";
import { useSettings } from "../../contexts/SettingsContext";

const MAGNIFICATION_RANGE = 100; // How far from the center the magnification extends

interface DockIconProps {
  path: string;
  icon: IconDefinition;
  label: string;
  mouseX: MotionValue<number | null>;
  stiffness: number;
  magnification: number; // percentage (0-100)
  baseSize: number;
}

const DockIcon: React.FC<DockIconProps> = ({
  path,
  icon,
  label,
  mouseX,
  stiffness,
  magnification,
  baseSize,
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const { openWindow } = useWindowManager();
  const { osMode } = useSettings();
  const navigate = useNavigate();

  // State to hold the measured position of the icon's center
  const [iconCenter, setIconCenter] = useState<number | null>(null);

  // Tooltip visibility state
  const [isHovered, setIsHovered] = useState(false);

  // Re-measure the icon's position whenever its size or the window layout changes
  useLayoutEffect(() => {
    const measure = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setIconCenter(rect.left + rect.width / 2);
      }
    };
    measure(); // Measure on mount and on deps change

    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [baseSize]); // Re-measure if baseSize changes

  // Calculate distance from mouse to icon center using a transform
  const distance = useTransform(mouseX, (val) => {
    if (val === null || iconCenter === null) {
      return Infinity; // No magnification if mouse is not over dock or position not measured
    }
    return Math.abs(val - iconCenter);
  });

  // Calculate the new size based on the distance.
  // We use a cosine wave for a smooth falloff.
  const size = useTransform(
    distance,
    [0, MAGNIFICATION_RANGE],
    [baseSize * (1 + magnification / 100), baseSize]
  );

  // Use a spring to make the size animation smooth
  const sizeSpring = useSpring(size, {
    stiffness,
    damping: 15,
    mass: 0.1,
  });

  // Derive font size from the animated size for scalability
  const fontSizeSpring = useTransform(sizeSpring, (s) => s * 0.6);

  // Tooltip position
  const tooltipX = iconCenter ?? 0;
  const tooltipY = ref.current
    ? ref.current.getBoundingClientRect().top - 10
    : 0;

  return (
    <div className="dock-icon-container">
      <button
        ref={ref}
        className="dock-nav-link"
        aria-label={label}
        type="button"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => {
          if (osMode) {
            const appId =
              path === "/"
                ? "home"
                : path === "/terminal"
                ? "terminal"
                : path === "/projects"
                ? "projects"
                : path === "/work"
                ? "work"
                : path === "/journey"
                ? "journey"
                : path === "/games"
                ? "games"
                : path === "/ai-conversations"
                ? "ai"
                : path === "/visualizer"
                ? "visualizer"
                : undefined;
            if (appId) openWindow(appId);
          } else {
            navigate(path);
          }
        }}
      >
        <motion.div
          className="dock-icon"
          style={{
            width: sizeSpring,
            height: sizeSpring,
            fontSize: fontSizeSpring,
          }}
        >
          <FontAwesomeIcon icon={icon} />
        </motion.div>
      </button>

      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="dock-tooltip"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{
              left: tooltipX,
              top: tooltipY,
            }}
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DockIcon;
