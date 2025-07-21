import React, { useRef, useLayoutEffect, useEffect, useState } from "react";
import { motion, useSpring, MotionValue } from "framer-motion";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import "./Dock.css";

const MAGNIFICATION_RANGE = 150;

interface DockIconProps {
  path: string;
  icon: IconDefinition;
  label: string;
  mouseX: MotionValue<number | null>;
  stiffness: number;
  magnification: number; // percentage (20-100)
  baseSize?: number; // Add base size prop
}

const DockIcon: React.FC<DockIconProps> = ({
  path,
  icon,
  label,
  mouseX,
  stiffness,
  magnification,
  baseSize = 40,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Ref to store the icon's static, viewport-relative center position
  const position = useRef({ center: 0 });

  // Calculate the maximum size based on magnification percentage
  const maxSize = baseSize + baseSize * (magnification / 100);

  const size = useSpring(baseSize, {
    stiffness: stiffness,
    damping: 15,
    mass: 0.1,
  });

  // Derive font size from the size motion value
  const fontSize = useSpring(baseSize * 0.6, {
    stiffness: stiffness,
    damping: 15,
    mass: 0.1,
  });

  // Measure the element's viewport position with proper timing
  useLayoutEffect(() => {
    const iconEl = iconRef.current;
    if (!iconEl) return;

    const measurePosition = () => {
      const rect = iconEl.getBoundingClientRect();
      position.current.center = rect.left + rect.width / 2;
    };

    // Use requestAnimationFrame to ensure DOM is ready
    const frameId = requestAnimationFrame(() => {
      measurePosition();

      // Also measure after the dock animation completes (500ms)
      setTimeout(measurePosition, 500);
    });

    // Listen for window resize to update positions
    const handleResize = () => {
      requestAnimationFrame(measurePosition);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Run only once

  // The animation logic now uses perfectly matched coordinates
  useEffect(() => {
    const unsubscribe = mouseX.on("change", (latestMouseX) => {
      if (latestMouseX === null) {
        size.set(baseSize);
        fontSize.set(baseSize * 0.6);
        return;
      }

      const distance = Math.abs(position.current.center - latestMouseX);

      if (distance > MAGNIFICATION_RANGE) {
        size.set(baseSize);
        fontSize.set(baseSize * 0.6);
        return;
      }

      const scaleFactor = maxSize - baseSize;
      const normalizedDistance = distance / MAGNIFICATION_RANGE;
      const newSize =
        (scaleFactor * (Math.cos(normalizedDistance * Math.PI) + 1)) / 2 +
        baseSize;

      size.set(newSize);
      fontSize.set(newSize * 0.6);
    });

    return () => unsubscribe();
  }, [mouseX, size, maxSize, baseSize]);

  // Update size when baseSize changes
  useEffect(() => {
    size.set(baseSize);
    fontSize.set(baseSize * 0.6);
  }, [baseSize, size, fontSize]);

  // Handle tooltip positioning
  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <div ref={containerRef} className="dock-icon-container">
      <NavLink
        to={path}
        className="dock-nav-link"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          ref={iconRef}
          className="dock-icon"
          style={{
            width: size,
            height: size,
            fontSize: fontSize,
          }}
        >
          <FontAwesomeIcon icon={icon} />
        </motion.div>
      </NavLink>

      {/* Tooltip */}
      {showTooltip && (
        <motion.div
          className="dock-tooltip"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
          }}
        >
          {label}
        </motion.div>
      )}
    </div>
  );
};

export default DockIcon;
