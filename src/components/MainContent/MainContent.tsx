import React, { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import "./MainContent.css";
import Logo from "../Logo";
import TypeWriterText from "../TypeWriterText";

interface MainContentProps {
  children: ReactNode;
}

const MainContent: React.FC<MainContentProps> = ({ children }) => {
  const location = useLocation();
  const isGamePage = location.pathname.includes("/games/");

  return (
    <div className="main-content">
      <Logo />
      <div className="h1-text">
        <TypeWriterText text="Kareem Sasa" delay={0} speed={80} />
      </div>
      <div className="p-text">Designer & Developer</div>
      <div className={`page-content ${isGamePage ? "game-page" : ""}`}>
        {children}
      </div>
    </div>
  );
};

export default MainContent;
