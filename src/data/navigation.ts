import {
  faHome,
  faFolderOpen,
  faBriefcase,
  faRoute,
  faGamepad,
  faTerminal,
} from "@fortawesome/free-solid-svg-icons";

const baseNavItems = [
  { path: "/terminal", label: "Terminal", icon: faTerminal },
  { path: "/", label: "Home", icon: faHome },
  { path: "/projects", label: "Projects", icon: faFolderOpen },
  { path: "/work", label: "Work", icon: faBriefcase },
  { path: "/journey", label: "Journey", icon: faRoute },
  { path: "/games", label: "Games", icon: faGamepad },
];

export const navItems = baseNavItems;
