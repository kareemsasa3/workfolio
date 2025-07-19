import { motion, useScroll } from "framer-motion";
import { useLocation } from "react-router-dom";
import "./GlobalScrollProgress.css";

const GlobalScrollProgress = () => {
  const location = useLocation();

  // Get scroll progress for the entire page
  const { scrollYProgress } = useScroll();

  // Only show on certain pages (you can customize this)
  const shouldShow =
    location.pathname === "/" || location.pathname === "/projects";

  if (!shouldShow) {
    return null;
  }

  return (
    <motion.div
      className="global-scroll-progress-bar"
      style={{
        scaleX: scrollYProgress,
        transformOrigin: "0%",
      }}
    />
  );
};

export default GlobalScrollProgress;
