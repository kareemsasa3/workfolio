import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion, AnimatePresence } from "framer-motion";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { navItemVariants, navIconVariants } from "../../animations/navigation";

interface NavItemProps {
  path: string;
  label: string;
  icon: IconDefinition;
  onClick: () => void;
}

const NavItem = ({ path, label, icon, onClick }: NavItemProps) => {
  return (
    <motion.li className="nav-item" variants={navItemVariants}>
      <NavLink
        to={path}
        className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
        onClick={onClick}
      >
        {({ isActive }) => (
          <>
            <motion.div
              className="nav-icon-container"
              variants={navIconVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <FontAwesomeIcon icon={icon} className="nav-icon" />
              <AnimatePresence>
                {isActive && (
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
            <span className="nav-tooltip">{label}</span>
          </>
        )}
      </NavLink>
    </motion.li>
  );
};

export default NavItem;
