import { useState, useEffect } from "react";
import { motion, useMotionValue } from "framer-motion";
import { navItems } from "../../data/navigation";
import DockIcon from "./DockIcon";
import DockSettingsButton from "./DockSettingsButton";
import SettingsPanel from "../SettingsPanel";
import "./Dock.css";

const Dock = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [dockSize, setDockSize] = useState(40);
  const [dockStiffness, setDockStiffness] = useState(400);
  const [magnification, setMagnification] = useState(40); // 40% = 32px max size
  const [shiftAmount, setShiftAmount] = useState(0);
  const mouseX = useMotionValue<number | null>(null);

  // Load saved settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("dockSettings");
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        if (settings.dockSize) {
          setDockSize(settings.dockSize);
          document.documentElement.style.setProperty(
            "--dock-icon-size",
            `${settings.dockSize}px`
          );
        }
        if (settings.dockStiffness) setDockStiffness(settings.dockStiffness);
        if (settings.magnification) setMagnification(settings.magnification);
      } catch (error) {
        console.warn("Failed to parse saved dock settings:", error);
      }
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = (settings: {
    dockSize: number;
    dockStiffness: number;
    magnification: number;
  }) => {
    try {
      localStorage.setItem("dockSettings", JSON.stringify(settings));
    } catch (error) {
      console.warn("Failed to save dock settings:", error);
    }
  };

  // Calculate shift amount based on screen size and settings state
  useEffect(() => {
    const calculateShift = () => {
      if (!isSettingsOpen) return 0;

      if (window.innerWidth > 1200) {
        return -420; // Full shift for large screens
      } else if (window.innerWidth > 768) {
        return -200; // Reduced shift for medium screens
      } else {
        return 0; // No shift for mobile
      }
    };

    setShiftAmount(calculateShift());
  }, [isSettingsOpen]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (isSettingsOpen) {
        const calculateShift = () => {
          if (window.innerWidth > 1200) {
            return -420;
          } else if (window.innerWidth > 768) {
            return -200;
          } else {
            return 0;
          }
        };
        setShiftAmount(calculateShift());
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isSettingsOpen]);

  const toggleSettings = () => setIsSettingsOpen(!isSettingsOpen);
  const closeSettings = () => setIsSettingsOpen(false);

  const handleDockSizeChange = (newSize: number) => {
    setDockSize(newSize);
    document.documentElement.style.setProperty(
      "--dock-icon-size",
      `${newSize}px`
    );
    saveSettings({
      dockSize: newSize,
      dockStiffness,
      magnification,
    });
  };

  const handleDockStiffnessChange = (newStiffness: number) => {
    setDockStiffness(newStiffness);
    saveSettings({
      dockSize,
      dockStiffness: newStiffness,
      magnification,
    });
  };

  const handleMagnificationChange = (newMagnification: number) => {
    setMagnification(newMagnification);
    saveSettings({
      dockSize,
      dockStiffness,
      magnification: newMagnification,
    });
  };

  return (
    <>
      <motion.div
        id="dock-container"
        className={`dock-container ${isSettingsOpen ? "settings-open" : ""}`}
        // THIS IS THE KEY CHANGE: Use the viewport-relative clientX.
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
        isOpen={isSettingsOpen}
        onClose={closeSettings}
      />
    </>
  );
};

export default Dock;
