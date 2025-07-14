import { Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect } from "react";
import MatrixBackground from "../MatrixBackground/MatrixBackground";
import Dock from "../Dock/Dock";
import "./Layout.css";

const Layout = () => {
  const location = useLocation();
  const isTerminalPage = location.pathname === "/terminal";

  // Add/remove body class to prevent horizontal scroll
  useEffect(() => {
    if (isTerminalPage) {
      document.body.classList.add("terminal-page-active");
    } else {
      document.body.classList.remove("terminal-page-active");
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove("terminal-page-active");
    };
  }, [isTerminalPage]);

  return (
    <div className="app-layout">
      {/* These components are now ALWAYS present */}
      <MatrixBackground />
      <Dock />

      <main
        id="main-content-area"
        className={`app-content ${isTerminalPage ? "terminal-page" : ""}`}
      >
        {/* 
          The Outlet is the placeholder where React Router will render 
          the matched child route component (e.g., HomePage, AboutPage).
          Using a simple motion.div for smooth transitions without AnimatePresence.
        */}
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

export default Layout;
