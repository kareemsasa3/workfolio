import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Suspense, useMemo, useState, useEffect, useRef } from "react";
import MatrixBackground from "../MatrixBackground/MatrixBackground";
import StaticBackground from "../StaticBackground/StaticBackground";
import Dock from "../Dock/Dock";
import GlobalSectionNavigation from "./GlobalSectionNavigation";
import GlobalScrollProgress from "./GlobalScrollProgress";
import { PageLoader } from "../common";
import ErrorBoundary from "../common/ErrorBoundary";
import { useLayoutContext } from "../../contexts/LayoutContext";
import { useSettings } from "../../contexts/SettingsContext";
import { useTheme } from "../../contexts/ThemeContext";
import { caseStudiesData } from "../../data/caseStudies";
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

interface RouteMeta {
  title: string;
  description: string;
  canonicalPath: string;
}

const BASE_URL = "https://kareemsasa.dev";
const DEFAULT_IMAGE_URL = `${BASE_URL}/src/assets/logo.svg`;
const DEFAULT_IMAGE_ALT = "Kareem Sasa logo";

const Layout = () => {
  const location = useLocation();
  const { mainContentAreaRef } = useLayoutContext();
  const { isSettingsOpen } = useSettings();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const hasMarkedAppReady = useRef(false);
  const isInitialLoad = useRef(true);

  // Memoize the key to prevent unnecessary re-renders
  const pageKey = useMemo(() => location.pathname, [location.pathname]);

  // Show loading state on route change
  useEffect(() => {
    setIsLoading(true);
    const minimumLoadDuration = isInitialLoad.current ? 300 : 500;

    // Use a shorter minimum on first load while preserving the existing route transition timing.
    const timer = setTimeout(() => {
      setIsLoading(false);
      isInitialLoad.current = false;
    }, minimumLoadDuration);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    if (!isLoading && !hasMarkedAppReady.current) {
      document.documentElement.classList.add("app-ready");
      hasMarkedAppReady.current = true;
    }
  }, [isLoading]);

  // Route-aware metadata
  useEffect(() => {
    const defaultMeta: RouteMeta = {
      title: "Kareem Sasa — Systems Engineer",
      description:
        "Systems engineer and consultant building production software across backend, infrastructure, and product experience.",
      canonicalPath: "/",
    };

    const caseStudyMeta = caseStudiesData.reduce<Record<string, RouteMeta>>(
      (accumulator, caseStudy) => {
        accumulator[`/case-studies/${caseStudy.slug}`] = {
          title: `${caseStudy.title} Case Study — Kareem Sasa`,
          description: caseStudy.shortDescription,
          canonicalPath: `/case-studies/${caseStudy.slug}`,
        };
        return accumulator;
      },
      {}
    );

    const routeMeta: Record<string, RouteMeta> = {
      "/": defaultMeta,
      "/projects": {
        title: "Projects — Kareem Sasa",
        description:
          "Flagship systems and backend projects spanning Linux infrastructure, autonomous research workflows, and interactive product engineering.",
        canonicalPath: "/projects",
      },
      "/case-studies": {
        title: "Case Studies — Kareem Sasa",
        description:
          "Engineering case studies documenting system architecture, constraints, and implementation decisions across flagship projects.",
        canonicalPath: "/case-studies",
      },
      "/work": {
        title: "Work — Kareem Sasa",
        description:
          "Professional work across consulting, platform modernization, frontend stabilization, and backend architecture for business-critical software.",
        canonicalPath: "/work",
      },
      "/journey": {
        title: "Background & Journey — Kareem Sasa",
        description:
          "Context behind the work: the experiences and turning points that shaped how Kareem Sasa approaches software engineering.",
        canonicalPath: "/journey",
      },
      "/games": {
        title: "Games & Experiments — Kareem Sasa",
        description:
          "A lighter side area for interactive experiments, gameplay ideas, and frontend exploration outside the main portfolio proof path.",
        canonicalPath: "/games",
      },
      "/games/snake": {
        title: "Snake Game — Kareem Sasa",
        description:
          "A browser-based Snake implementation from the games and experiments section of Kareem Sasa's portfolio.",
        canonicalPath: "/games/snake",
      },
      "/games/spider": {
        title: "Spider Solitaire — Kareem Sasa",
        description:
          "A browser-based Spider Solitaire implementation from the games and experiments section of Kareem Sasa's portfolio.",
        canonicalPath: "/games/spider",
      },
      "/terminal": {
        title: "Terminal — Kareem Sasa",
        description:
          "An interactive terminal layer for exploring portfolio content, projects, and work history through a command-driven interface.",
        canonicalPath: "/terminal",
      },
      ...caseStudyMeta,
    };

    const meta = routeMeta[location.pathname] || defaultMeta;
    const canonicalUrl = `${BASE_URL}${meta.canonicalPath}`;

    if (document.title !== meta.title) document.title = meta.title;

    const setMetaContent = (selector: string, content: string) => {
      const element = document.querySelector<HTMLMetaElement>(selector);
      if (element && element.content !== content) {
        element.content = content;
      }
    };

    const canonicalElement = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]'
    );
    if (canonicalElement && canonicalElement.href !== canonicalUrl) {
      canonicalElement.href = canonicalUrl;
    }

    setMetaContent('meta[name="description"]', meta.description);
    setMetaContent('meta[property="og:title"]', meta.title);
    setMetaContent('meta[property="og:description"]', meta.description);
    setMetaContent('meta[property="og:url"]', canonicalUrl);
    setMetaContent('meta[property="og:image"]', DEFAULT_IMAGE_URL);
    setMetaContent('meta[property="og:image:alt"]', DEFAULT_IMAGE_ALT);
    setMetaContent('meta[name="twitter:title"]', meta.title);
    setMetaContent('meta[name="twitter:description"]', meta.description);
    setMetaContent('meta[name="twitter:image"]', DEFAULT_IMAGE_URL);
    setMetaContent('meta[name="twitter:image:alt"]', DEFAULT_IMAGE_ALT);
  }, [location.pathname]);

  return (
    // Use a simple fragment, or a div with NO positioning/transform styles
    <>
      {theme === "dark" ? <MatrixBackground /> : <StaticBackground />}

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
