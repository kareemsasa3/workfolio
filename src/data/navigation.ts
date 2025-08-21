import {
  faHome,
  faFolderOpen,
  faBriefcase,
  faRoute,
  faGamepad,
  faTerminal,
  faComments,
  faSitemap,
} from "@fortawesome/free-solid-svg-icons";

export const navItems = [
  { path: "/terminal", label: "Terminal", icon: faTerminal },
  { path: "/", label: "Home", icon: faHome },
  { path: "/projects", label: "Projects", icon: faFolderOpen },
  { path: "/work", label: "Work", icon: faBriefcase },
  { path: "/journey", label: "Journey", icon: faRoute },
  { path: "/games", label: "Games", icon: faGamepad },
  { path: "/visualizer", label: "Visualizer", icon: faSitemap },

  { path: "/ai-conversations", label: "AI Chat", icon: faComments },
];
