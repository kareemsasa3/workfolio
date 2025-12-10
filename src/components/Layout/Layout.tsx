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
import WindowLayer from "../WindowManager/WindowLayer";
import DesktopOverlay from "./DesktopOverlay";

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
  const { isSettingsOpen, osMode } = useSettings();
  const [isLoading, setIsLoading] = useState(false);

  // Memoize the key to prevent unnecessary re-renders
  const pageKey = useMemo(() => location.pathname, [location.pathname]);

  // Show loading state on route change (disabled in OS mode)
  useEffect(() => {
    if (osMode) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [location.pathname, osMode]);

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

  // Disable body scroll when OS mode is enabled
  useEffect(() => {
    if (osMode) {
      const prevOverflow = document.body.style.overflow;
      const prevOverflowY = document.body.style.overflowY;
      const prevOverflowX = document.body.style.overflowX;
      const prevOverscroll = (document.body.style as any).overscrollBehavior;
      document.body.style.overflow = "hidden";
      document.body.style.overflowY = "hidden";
      document.body.style.overflowX = "hidden";
      (document.body.style as any).overscrollBehavior = "none";
      return () => {
        document.body.style.overflow = prevOverflow;
        document.body.style.overflowY = prevOverflowY;
        document.body.style.overflowX = prevOverflowX;
        (document.body.style as any).overscrollBehavior = prevOverscroll;
      };
    }
  }, [osMode]);

  return (
    // Use a simple fragment, or a div with NO positioning/transform styles
    <>
      <MatrixBackground />

      {/* This is now the top-level container for all INTERACTIVE content */}
      <div className={`layout-foreground ${osMode ? "os-mode" : ""}`}>
        <DesktopOverlay />
        {!osMode && <GlobalScrollProgress />}
        <Dock />
        {!osMode && <GlobalSectionNavigation isSettingsOpen={isSettingsOpen} />}
        <WindowLayer />

        <main
          ref={mainContentAreaRef}
          id="main-content-area"
          className="app-content"
        >
          <ErrorBoundary>
            {isLoading ? (
              <PageLoader />
            ) : !osMode ? (
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
            ) : (
              <div style={{ width: "100%", minHeight: "100%" }} />
            )}
          </ErrorBoundary>
        </main>
      </div>
    </>
  );
};

export default Layout;
