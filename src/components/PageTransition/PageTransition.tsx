// src/components/PageTransition.jsx
import React, { ReactNode } from "react";
import "./PageTransition.css";

interface PageTransitionProps {
  children: ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  return <div className="page-transition">{children}</div>;
};

export default PageTransition;
