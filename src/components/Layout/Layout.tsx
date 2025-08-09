import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Suspense, useMemo, useState, useEffect } from "react";
import MatrixBackground from "../MatrixBackground/MatrixBackground";
import Dock from "../Dock/Dock";
import GlobalSectionNavigation from "./GlobalSectionNavigation";
import GlobalScrollProgress from "./GlobalScrollProgress";
import { PageLoader } from "../common";
import ErrorBoundary from "../common/ErrorBoundary";
import { useLayoutContext } from "../../contexts/LayoutContext";
import { useSettings } from "../../contexts/SettingsContext";
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
  duration: 0.4, // Slightly longer duration to allow sections to settle
};

const Layout = () => {
  const location = useLocation();
  const { mainContentAreaRef } = useLayoutContext();
  const { isSettingsOpen } = useSettings();
  const [isLoading, setIsLoading] = useState(false);

  // Memoize the key to prevent unnecessary re-renders
  const pageKey = useMemo(() => location.pathname, [location.pathname]);

  // Show loading state on route change
  useEffect(() => {
    setIsLoading(true);
    // Hide loading after at least 500ms to ensure consistent loading experience
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Route-aware document title
  useEffect(() => {
    const routeTitles: Record<string, string> = {
      "/": "Kareem Sasa — Portfolio",
      "/projects": "Projects — Kareem Sasa",
      "/games": "Games — Kareem Sasa",
      "/games/snake": "Snake Game — Kareem Sasa",
      "/work": "Work — Kareem Sasa",
      "/journey": "Journey — Kareem Sasa",
      "/ai-conversations": "AI Conversations — Kareem Sasa",
      "/terminal": "Terminal — Kareem Sasa",
    };
    const title = routeTitles[location.pathname] || "Kareem Sasa — Portfolio";
    if (document.title !== title) document.title = title;
  }, [location.pathname]);

  return (
    // Use a simple fragment, or a div with NO positioning/transform styles
    <>
      <MatrixBackground />

      {/* This is now the top-level container for all INTERACTIVE content */}
      <div className="layout-foreground">
        <GlobalScrollProgress />
        <Dock />
        <GlobalSectionNavigation isSettingsOpen={isSettingsOpen} />

        <main
          ref={mainContentAreaRef}
          id="main-content-area"
          className="app-content"
        >
          <ErrorBoundary>
            {isLoading ? (
              <PageLoader />
            ) : (
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
            )}
          </ErrorBoundary>
        </main>
      </div>
    </>
  );
};

export default Layout;
