import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { navItems } from "../../data/navigation";
import DockIcon from "./DockIcon";
import DockSettingsButton from "./DockSettingsButton";
import SettingsPanel from "../SettingsPanel";
import { useDock } from "./useDock";
import { useLayoutContext } from "../../contexts/LayoutContext";
import { useSettings } from "../../contexts/SettingsContext";
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
  const { isAnimationPaused, setIsAnimationPaused } = useLayoutContext();

  // State for settings panel shift animation
  const [settingsShiftAmount, setSettingsShiftAmount] = useState(0);

  // Handle responsive shift amount for settings panel
  useEffect(() => {
    const calculateShift = () => {
      if (!isSettingsOpen) return 0;
      if (window.innerWidth > 1200) return -385; // Increased to account for 400px panel + margin
      if (window.innerWidth > 768) return -250; // Increased for better clearance
      return 0;
    };

    // Set initial value
    const newShiftAmount = calculateShift();
    setSettingsShiftAmount(newShiftAmount);

    // Handle resize events
    const handleResize = () => {
      const newShiftAmount = calculateShift();
      setSettingsShiftAmount(newShiftAmount);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isSettingsOpen]);

  // Combine dock shift and settings shift
  const totalShiftAmount = dockShiftAmount + settingsShiftAmount;

  return (
    <>
      <motion.div
        id="dock-container"
        className={`dock-container ${isSettingsOpen ? "settings-open" : ""}`}
        role="toolbar"
        aria-label="Application Dock"
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(null)}
        onHoverEnd={() => mouseX.set(null)} // Add this for robustness
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
            magnification={magnification}
            baseSize={dockSize} // Pass down the base size
          />
        ))}
        <div className="dock-icon-container">
          <DockSettingsButton
            isOpen={isSettingsOpen}
            onClick={toggleSettings}
            baseSize={dockSize} // Pass down the base size
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
      />
    </>
  );
};

export default Dock;
