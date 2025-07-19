import React, { lazy } from "react";
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
const Info = lazyWithMinTime(() => import("../pages/Info"));
const Work = lazyWithMinTime(() => import("../pages/Work"));
const Education = lazyWithMinTime(() => import("../pages/Education"));
const Certifications = lazyWithMinTime(() => import("../pages/Certifications"));
const Resume = lazyWithMinTime(() => import("../pages/Resume"));
const Contact = lazyWithMinTime(() => import("../pages/Contact"));
const AiConversations = lazyWithMinTime(
  () => import("../pages/AiConversations")
);
const NotFound = lazyWithMinTime(() => import("../pages/NotFound"));

// Main routes that use the Layout component
export const mainRoutes: AppRoute[] = [
  { path: "projects", element: React.createElement(Projects) },
  { path: "games", element: React.createElement(Games) },
  { path: "games/snake", element: React.createElement(SnakeGame) },
  { path: "work", element: React.createElement(Work) },
  { path: "education", element: React.createElement(Education) },
  { path: "certifications", element: React.createElement(Certifications) },
  { path: "resume", element: React.createElement(Resume) },
  { path: "contact", element: React.createElement(Contact) },
  { path: "ai-conversations", element: React.createElement(AiConversations) },
  { path: "info", element: React.createElement(Info) },
  {
    path: "terminal",
    element: React.createElement(Terminal, { isIntro: false }),
  },
];

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
