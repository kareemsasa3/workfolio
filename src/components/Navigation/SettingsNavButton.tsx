import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { navItemVariants, navIconVariants } from "../../animations/navigation";

interface SettingsNavButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const SettingsNavButton = ({ isOpen, onClick }: SettingsNavButtonProps) => {
  return (
    <motion.li className="nav-item" variants={navItemVariants}>
      <motion.button
        className={`nav-link settings-nav-button ${isOpen ? "active" : ""}`}
        onClick={onClick}
        aria-label="Open settings"
        variants={navIconVariants}
        whileHover="hover"
        whileTap="tap"
      >
        <motion.div className="nav-icon-container">
          <FontAwesomeIcon icon={faCog} className="nav-icon" />
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="nav-dot"
                layoutId="active-nav-dot"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  type: "spring",
                  damping: 15,
                  stiffness: 300,
                }}
              />
            )}
          </AnimatePresence>
        </motion.div>
        <span className="nav-tooltip">Settings</span>
      </motion.button>
    </motion.li>
  );
};

export default SettingsNavButton;
