import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "../../hooks/useIsMobile";
import { navItems } from "../../data/navigation";
import NavItem from "./NavItem";
import SettingsNavButton from "./SettingsNavButton";
import SettingsPanel from "../SettingsPanel";
import "./Navigation.css";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [dockSize, setDockSize] = useState(50); // Default dock size
  const isMobile = useIsMobile();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const closeSettings = () => {
    setIsSettingsOpen(false);
  };

  const handleDockSizeChange = (newSize: number) => {
    setDockSize(newSize);
    // Update CSS custom property for the dock
    document.documentElement.style.setProperty(
      "--dock-icon-size",
      `${newSize}px`
    );
  };

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        className="nav-toggle"
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
      </motion.button>

      {/* Navigation Menu */}
      <AnimatePresence>
        {(!isMobile || isOpen) && (
          <motion.nav
            className="navigation"
            initial={isMobile ? { x: "100%" } : { x: 0 }}
            animate={{ x: 0 }}
            exit={isMobile ? { x: "100%" } : { x: 0 }}
            transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
          >
            <motion.ul
              className="nav-list"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {navItems.map((item) => (
                <NavItem key={item.path} {...item} onClick={closeMenu} />
              ))}
              <SettingsNavButton
                isOpen={isSettingsOpen}
                onClick={toggleSettings}
              />
            </motion.ul>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Settings Panel */}
      <SettingsPanel
        onDockSizeChange={handleDockSizeChange}
        currentDockSize={dockSize}
        isOpen={isSettingsOpen}
        onClose={closeSettings}
      />

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="nav-overlay"
            onClick={closeMenu}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
