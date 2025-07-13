import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import TypeWriterText from "../TypeWriterText";
import Logo from "../Logo";
import "./Navigation.css";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 769);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 769);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
};

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/projects", label: "Projects" },
    { path: "/work", label: "Work" },
    { path: "/education", label: "Education" },
    { path: "/certifications", label: "Certifications" },
    { path: "/games", label: "Games" },
    { path: "/resume", label: "Resume" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="nav-toggle"
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
      >
        <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
      </button>

      {/* Navigation Menu */}
      <nav className={`navigation ${isOpen ? "nav-open" : ""}`}>
        {/* Header Brand - Desktop Only */}
        <div className="nav-brand">
          <Logo small />
          <div className="nav-brand-text">
            <div className="nav-name">
              <TypeWriterText text="Kareem Sasa" delay={0} speed={80} />
            </div>
            <div className="nav-title">Designer & Developer</div>
          </div>
        </div>

        <ul className="nav-list">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const activeClass = isActive
              ? `active ${isMobile ? "mobile-active" : "desktop-active"}`
              : "";
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive: navIsActive }) =>
                    `nav-link ${navIsActive ? activeClass : ""}`
                  }
                  onClick={closeMenu}
                >
                  {item.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Overlay for mobile */}
      {isOpen && <div className="nav-overlay" onClick={closeMenu} />}
    </>
  );
};

export default Navigation;
