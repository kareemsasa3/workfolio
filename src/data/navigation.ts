import {
  faHome,
  faCode,
  faBriefcase,
  faRoute,
  faCertificate,
  faGamepad,
  faFileAlt,
  faEnvelope,
  faInfo,
  faTerminal,
  faComments,
} from "@fortawesome/free-solid-svg-icons";

export const navItems = [
  { path: "/terminal", label: "Terminal", icon: faTerminal },
  { path: "/", label: "Home", icon: faHome },
  { path: "/projects", label: "Projects", icon: faCode },
  { path: "/work", label: "Work", icon: faBriefcase },
  { path: "/journey", label: "Journey", icon: faRoute },
  { path: "/certifications", label: "Certifications", icon: faCertificate },
  { path: "/games", label: "Games", icon: faGamepad },
  { path: "/resume", label: "Resume", icon: faFileAlt },
  { path: "/contact", label: "Contact", icon: faEnvelope },
  { path: "/ai-conversations", label: "AI Chat", icon: faComments },
  { path: "/info", label: "Info", icon: faInfo },
];
