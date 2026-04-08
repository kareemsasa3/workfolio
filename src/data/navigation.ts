import {
  faHome,
  faFolderOpen,
  faBriefcase,
  faRoute,
  faGamepad,
  faTerminal,
  faBookOpen,
} from "@fortawesome/free-solid-svg-icons";

const baseNavItems = [
  { path: "/", label: "Home", icon: faHome },
  { path: "/projects", label: "Projects", icon: faFolderOpen },
  { path: "/case-studies", label: "Case Studies", icon: faBookOpen },
  { path: "/work", label: "Work", icon: faBriefcase },
  { path: "/terminal", label: "Terminal", icon: faTerminal },
  { path: "/journey", label: "Journey", icon: faRoute },
  { path: "/games", label: "Games", icon: faGamepad },
];

export const navItems = baseNavItems;
