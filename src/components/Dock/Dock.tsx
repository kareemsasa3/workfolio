import { motion } from "framer-motion";
import { navItems } from "../../data/navigation";
import DockIcon from "./DockIcon";
import DockSettingsButton from "./DockSettingsButton";
import SettingsPanel from "../SettingsPanel";
import { useDock } from "./useDock";
import { useLayoutContext } from "../../contexts/LayoutContext";
import "./Dock.css";

const Dock = () => {
  const {
    // State
    isSettingsOpen,
    dockSize,
    dockStiffness,
    magnification,
    shiftAmount,
    mouseX,

    // Actions
    toggleSettings,
    closeSettings,
    handleDockSizeChange,
    handleDockStiffnessChange,
    handleMagnificationChange,
  } = useDock();

  const { isAnimationPaused, setIsAnimationPaused } = useLayoutContext();

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
          x: shiftAmount,
        }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 200,
          x: { duration: 0.3, ease: "easeInOut" },
        }}
      >
        {navItems.map((item) => (
          <DockIcon
            key={item.path}
            {...item}
            mouseX={mouseX}
            stiffness={dockStiffness}
            magnification={magnification}
            baseSize={dockSize}
          />
        ))}
        <div className="dock-icon-container">
          <DockSettingsButton
            isOpen={isSettingsOpen}
            onClick={toggleSettings}
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
