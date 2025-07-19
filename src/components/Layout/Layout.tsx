import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Suspense, useMemo } from "react";
import MatrixBackground from "../MatrixBackground/MatrixBackground";
import Dock from "../Dock/Dock";
import GlobalSectionNavigation from "./GlobalSectionNavigation";
import GlobalScrollProgress from "./GlobalScrollProgress";
import { PageLoader } from "../common";
import ErrorBoundary from "../common/ErrorBoundary";
import { useLayoutContext } from "../../contexts/LayoutContext";
import "./Layout.css";

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -20,
  },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.3, // Reduced duration for snappier transitions
};

const Layout = () => {
  const location = useLocation();
  const { mainContentAreaRef } = useLayoutContext();

  // Memoize the key to prevent unnecessary re-renders
  const pageKey = useMemo(() => location.pathname, [location.pathname]);

  return (
    // Use a simple fragment, or a div with NO positioning/transform styles
    <>
      <MatrixBackground />

      {/* This is now the top-level container for all INTERACTIVE content */}
      <div className="layout-foreground">
        <GlobalScrollProgress />
        <Dock />
        <GlobalSectionNavigation />

        <main
          ref={mainContentAreaRef}
          id="main-content-area"
          className="app-content"
        >
          <ErrorBoundary>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={pageKey}
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                style={{ width: "100%", minHeight: "100%" }}
              >
                <Suspense fallback={<PageLoader />}>
                  <Outlet />
                </Suspense>
              </motion.div>
            </AnimatePresence>
          </ErrorBoundary>
        </main>
      </div>
    </>
  );
};

export default Layout;
