import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  startTransition,
  lazy,
} from "react";
import { Terminal } from "../components/Terminal";
import {
  faTerminal,
  faHome,
  faFolderOpen,
  faBriefcase,
  faRoute,
  faGamepad,
  faComments,
  faSitemap,
} from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export type AppId =
  | "terminal"
  | "home"
  | "projects"
  | "work"
  | "journey"
  | "games"
  | "ai"
  | "visualizer";

export interface WindowInstance {
  id: string;
  appId: AppId;
  initialPosition?: { x: number; y: number };
  isMinimized?: boolean;
}

interface AppDefinition {
  id: AppId;
  title: string;
  initialWidth: number;
  initialHeight: number;
  usesInternalWindowChrome?: boolean;
  singleInstance?: boolean;
  icon: IconDefinition;
  renderContent: (
    instanceId: string,
    helpers: { close: () => void }
  ) => React.ReactNode;
}

interface WindowManagerContextValue {
  windows: WindowInstance[];
  openWindow: (appId: AppId, options?: { forceNew?: boolean }) => string;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  tileWindows: () => void;
  getAppDefinition: (appId: AppId) => AppDefinition | undefined;
}

const WindowManagerContext = createContext<
  WindowManagerContextValue | undefined
>(undefined);

const generateId = () => Math.random().toString(36).slice(2, 9);

// Predefine lazies at module scope to keep component identity stable
const LazyHome = lazy(() => import("../pages/Home"));
const LazyProjects = lazy(() => import("../pages/Projects"));
const LazyWork = lazy(() => import("../pages/Work"));
const LazyJourney = lazy(() => import("../pages/Journey"));
const LazyGames = lazy(() => import("../pages/Games"));
const LazyAiConversations = lazy(() => import("../pages/AiConversations"));
const LazyVisualizer = lazy(() => import("../pages/DataStructures"));

// App registry
const appRegistry: Record<AppId, AppDefinition> = {
  terminal: {
    id: "terminal",
    title: "Terminal",
    initialWidth: 800,
    initialHeight: 600,
    usesInternalWindowChrome: true,
    singleInstance: true,
    icon: faTerminal,
    renderContent: (instanceId, { close }) => (
      <Terminal
        key={instanceId}
        isIntro={false}
        onCloseOverride={close}
        useExternalChrome={true}
      />
    ),
  },
  home: {
    id: "home",
    title: "Home",
    initialWidth: 900,
    initialHeight: 650,
    icon: faHome,
    renderContent: (instanceId) => <LazyHome key={instanceId} />,
  },
  projects: {
    id: "projects",
    title: "Projects",
    initialWidth: 900,
    initialHeight: 650,
    icon: faFolderOpen,
    renderContent: (instanceId) => <LazyProjects key={instanceId} />,
  },
  work: {
    id: "work",
    title: "Work",
    initialWidth: 900,
    initialHeight: 650,
    icon: faBriefcase,
    renderContent: (instanceId) => <LazyWork key={instanceId} />,
  },
  journey: {
    id: "journey",
    title: "Journey",
    initialWidth: 900,
    initialHeight: 650,
    icon: faRoute,
    renderContent: (instanceId) => <LazyJourney key={instanceId} />,
  },
  games: {
    id: "games",
    title: "Games",
    initialWidth: 900,
    initialHeight: 650,
    icon: faGamepad,
    renderContent: (instanceId) => <LazyGames key={instanceId} />,
  },
  ai: {
    id: "ai",
    title: "AI Conversations",
    initialWidth: 900,
    initialHeight: 650,
    icon: faComments,
    renderContent: (instanceId) => <LazyAiConversations key={instanceId} />,
  },
  visualizer: {
    id: "visualizer",
    title: "Visualizer",
    initialWidth: 900,
    initialHeight: 650,
    icon: faSitemap,
    renderContent: (instanceId) => <LazyVisualizer key={instanceId} />,
  },
};

export const WindowManagerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [windows, setWindows] = useState<WindowInstance[]>([]);

  const openWindow = useCallback(
    (appId: AppId, options?: { forceNew?: boolean }) => {
      const def = appRegistry[appId];
      const existing = windows.filter((w) => w.appId === appId);
      if (!options?.forceNew && existing.length > 0) {
        const idToFocus = existing[existing.length - 1].id;
        // Restore if minimized and bring to front
        setWindows((prev) => {
          const idx = prev.findIndex((w) => w.id === idToFocus);
          if (idx === -1) return prev;
          const win = { ...prev[idx], isMinimized: false };
          const next = [...prev.slice(0, idx), ...prev.slice(idx + 1), win];
          return next;
        });
        return idToFocus;
      }

      const id = generateId();
      startTransition(() => {
        setWindows((prev) => {
          const n = prev.length;
          const offset = 36;
          const baseX = Math.max(
            20,
            Math.round((window.innerWidth - def.initialWidth) / 3)
          );
          const baseY = Math.max(
            20,
            Math.round((window.innerHeight - def.initialHeight) / 3)
          );
          const position = {
            x: baseX + (n % 5) * offset,
            y: baseY + (n % 5) * offset,
          };
          return [...prev, { id, appId, initialPosition: position }];
        });
      });
      return id;
    },
    [windows]
  );

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const focusWindow = useCallback((id: string) => {
    setWindows((prev) => {
      const index = prev.findIndex((w) => w.id === id);
      if (index === -1) return prev;
      const win = prev[index];
      const next = [...prev.slice(0, index), ...prev.slice(index + 1), win];
      return next;
    });
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    );
  }, []);

  const restoreWindow = useCallback(
    (id: string) => {
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, isMinimized: false } : w))
      );
      focusWindow(id);
    },
    [focusWindow]
  );

  const tileWindows = useCallback(() => {
    // Simple 2x2 tiling for the first four windows (positioning handled in AppWindow via initialPosition)
  }, []);

  const value = useMemo<WindowManagerContextValue>(
    () => ({
      windows,
      openWindow,
      closeWindow,
      focusWindow,
      minimizeWindow,
      restoreWindow,
      tileWindows,
      getAppDefinition: (id) => appRegistry[id],
    }),
    [
      windows,
      openWindow,
      closeWindow,
      focusWindow,
      minimizeWindow,
      restoreWindow,
      tileWindows,
    ]
  );

  return (
    <WindowManagerContext.Provider value={value}>
      {children}
    </WindowManagerContext.Provider>
  );
};

export const useWindowManager = () => {
  const ctx = useContext(WindowManagerContext);
  if (!ctx)
    throw new Error(
      "useWindowManager must be used within WindowManagerProvider"
    );
  return ctx;
};
