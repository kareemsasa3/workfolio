import React from "react";
import { Terminal } from "../components/Terminal";
import { lazyWithMinTime } from "../utils/lazyWithMinTime";

// Helper for route object typing
interface AppRoute {
  path: string;
  element: React.ReactElement;
  index?: boolean;
}

// Lazy load all page components with a minimum display time for the loader
const Home = lazyWithMinTime(() => import("../pages/Home"));
const Projects = lazyWithMinTime(() => import("../pages/Projects"));
const Games = lazyWithMinTime(() => import("../pages/Games"));
const SnakeGame = lazyWithMinTime(() => import("../pages/SnakeGame"));
const Work = lazyWithMinTime(() => import("../pages/Work"));
const Journey = lazyWithMinTime(() => import("../pages/Journey"));
const DataStructures = lazyWithMinTime(() => import("../pages/DataStructures"));

const AiConversations = lazyWithMinTime(
  () => import("../pages/AiConversations")
);
const NotFound = lazyWithMinTime(() => import("../pages/NotFound"));

// Main routes that use the Layout component
const routes: AppRoute[] = [
  { path: "projects", element: React.createElement(Projects) },
  { path: "games", element: React.createElement(Games) },
  { path: "games/snake", element: React.createElement(SnakeGame) },
  { path: "work", element: React.createElement(Work) },
  { path: "journey", element: React.createElement(Journey) },

  { path: "ai-conversations", element: React.createElement(AiConversations) },
  {
    path: "terminal",
    element: React.createElement(Terminal, { isIntro: false }),
  },
];

if (!import.meta.env.PROD) {
  routes.push({
    path: "visualizer",
    element: React.createElement(DataStructures),
  });
}

export const mainRoutes: AppRoute[] = routes;

// Top-level routes that don't use the main Layout
export const topLevelRoutes: AppRoute[] = [];

// Default and catch-all routes
export const defaultRoute: AppRoute = {
  path: "/",
  element: React.createElement(Home),
  index: true,
};
export const notFoundRoute: AppRoute = {
  path: "*",
  element: React.createElement(NotFound),
};
