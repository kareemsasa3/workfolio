import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import "./Dock.css";

interface DockSettingsButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const DockSettingsButton = ({ isOpen, onClick }: DockSettingsButtonProps) => {
  return (
    <motion.button
      className={`dock-settings-button ${isOpen ? "active" : ""}`}
      onClick={onClick}
      aria-label="Open settings"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div className="dock-icon">
        <FontAwesomeIcon icon={faCog} />
      </motion.div>
      {isOpen && (
        <motion.div
          className="dock-active-indicator"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{
            type: "spring",
            damping: 15,
            stiffness: 300,
          }}
        />
      )}
    </motion.button>
  );
};

export default DockSettingsButton;
