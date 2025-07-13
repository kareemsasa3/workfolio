import {
  faHome,
  faCode,
  faBriefcase,
  faGraduationCap,
  faCertificate,
  faGamepad,
  faFileAlt,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

export const navItems = [
  { path: "/", label: "Home", icon: faHome },
  { path: "/projects", label: "Projects", icon: faCode },
  { path: "/work", label: "Work", icon: faBriefcase },
  { path: "/education", label: "Education", icon: faGraduationCap },
  { path: "/certifications", label: "Certifications", icon: faCertificate },
  { path: "/games", label: "Games", icon: faGamepad },
  { path: "/resume", label: "Resume", icon: faFileAlt },
  { path: "/contact", label: "Contact", icon: faEnvelope },
];
