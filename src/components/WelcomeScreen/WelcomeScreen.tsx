import React, { useState, useEffect } from "react";
import "./WelcomeScreen.css";
import TypeWriterText from "../TypeWriterText";
import BionicBackground from "../BionicBackground";

interface WelcomeScreenProps {
  onAnimationEnd: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onAnimationEnd }) => {
  const [fadeOutWelcome, setFadeOutWelcome] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflowX = "hidden";
      document.body.style.overflowY = "auto";
    };
  }, []);

  const handleButtonClick = () => {
    setFadeOutWelcome(true);
    setTimeout(() => {
      onAnimationEnd();
    }, 2000);
  };

  return (
    <div className={`welcome-screen ${fadeOutWelcome ? "fade-out" : ""}`}>
      <BionicBackground />
      <div className="content">
        <div className="title">
          <TypeWriterText text="Kareem Sasa" delay={0} speed={60} />
        </div>
        <div className="portfolio-text">
          <TypeWriterText text="Portfolio" delay={800} speed={60} />
        </div>
      </div>
      <button className="start-button" onClick={handleButtonClick}>
        EXPLORE
      </button>
    </div>
  );
};

export default WelcomeScreen;
