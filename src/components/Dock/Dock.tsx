import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { navItems } from "../../data/navigation";
import DockIcon from "./DockIcon";
import DockSettingsButton from "./DockSettingsButton";
import SettingsPanel from "../SettingsPanel";
import { useDock } from "./useDock";
import { useLayoutContext } from "../../contexts/LayoutContext";
import { useSettings } from "../../contexts/SettingsContext";
import { useWindowSize } from "../../hooks";
import "./Dock.css";

const Dock = () => {
  const {
    // State
    dockSize,
    dockStiffness,
    magnification,
    shiftAmount: dockShiftAmount,
    mouseX,

    // Actions
    handleDockSizeChange,
    handleDockStiffnessChange,
    handleMagnificationChange,
  } = useDock();

  const { isSettingsOpen, toggleSettings, closeSettings } = useSettings();
  const {
    isAnimationPaused,
    setIsAnimationPaused,
    matrixSpeed,
    setMatrixSpeed,
  } = useLayoutContext();
  const { width: windowWidth } = useWindowSize();
  const isMobile = windowWidth <= 768;

  // State for settings panel shift animation
  const [settingsShiftAmount, setSettingsShiftAmount] = useState(0);

  // Handle responsive shift amount for settings panel
  useEffect(() => {
    const calculateShift = () => {
      if (!isSettingsOpen) return 0;
      const PANEL_WIDTH = 400;
      const GUTTER = 20; // px, match dots gutter
      const RIGHT_OFFSET = windowWidth > 768 ? 20 : 10; // matches .dock-container right
      if (windowWidth > 1200) return -(PANEL_WIDTH + GUTTER + RIGHT_OFFSET); // full panel + gutter + offset
      if (windowWidth > 768)
        return -(Math.round(PANEL_WIDTH * 0.85) + GUTTER + RIGHT_OFFSET);
      return 0;
    };

    const newShiftAmount = calculateShift();
    setSettingsShiftAmount(newShiftAmount);
  }, [isSettingsOpen, windowWidth]);

  // Combine dock shift and settings shift
  const totalShiftAmount = dockShiftAmount + settingsShiftAmount;

  // Mobile-specific presentation adjustments
  const effectiveMagnification = isMobile ? 0 : magnification;
  const effectiveDockSize = isMobile ? Math.min(dockSize, 36) : dockSize;

  return (
    <>
      <motion.div
        id="dock-container"
        className={`dock-container ${isSettingsOpen ? "settings-open" : ""}`}
        role="toolbar"
        aria-label="Application Dock"
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(null)}
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: 1,
          y: 0,
          x: totalShiftAmount,
        }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 200,
          // Use a different transition for x for a smoother slide
          x: { type: "spring", damping: 30, stiffness: 220 },
        }}
      >
        {navItems.map((item) => (
          <DockIcon
            key={item.path}
            {...item}
            mouseX={mouseX}
            stiffness={dockStiffness}
            magnification={effectiveMagnification}
            baseSize={effectiveDockSize} // Pass down the base size
          />
        ))}
        <div className="dock-icon-container">
          <DockSettingsButton
            isOpen={isSettingsOpen}
            onClick={toggleSettings}
            baseSize={effectiveDockSize} // Pass down the base size
          />
        </div>
      </motion.div>

      <SettingsPanel
        onDockSizeChange={handleDockSizeChange}
        currentDockSize={dockSize}
        onDockStiffnessChange={handleDockStiffnessChange}
        currentDockStiffness={dockStiffness}
        onMagnificationChange={handleMagnificationChange}
        currentMagnification={magnification}
        isAnimationPaused={isAnimationPaused}
        onAnimationToggle={setIsAnimationPaused}
        isOpen={isSettingsOpen}
        onClose={closeSettings}
        matrixSpeed={matrixSpeed}
        onMatrixSpeedChange={setMatrixSpeed}
      />
    </>
  );
};

export default Dock;
