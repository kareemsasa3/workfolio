import React, { useState, useEffect } from 'react';
import './WelcomeScreen.css';
import TypeWriterText from '../TypeWriterText';
import BionicBackground from '../BionicBackground';
import SnakeGame from '../SnakeGame';

const WelcomeScreen = ({ onAnimationEnd }) => {
  const [fadeOutWelcome, setFadeOutWelcome] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflowX = 'hidden';
      document.body.style.overflowY = 'auto';
    };
  }, []);

  const handleButtonClick = () => {
    setFadeOutWelcome(true);
    setTimeout(() => {
      onAnimationEnd();
    });
  };

  return (
    <div className={`welcome-screen ${fadeOutWelcome ? 'fade-out' : ''}`}>
      <BionicBackground />
      <SnakeGame />
      <div className="content">
        <div className="title">
          <TypeWriterText text="Kareem Sasa" delay={0} />
        </div>
        <div className="portfolio-text">
          <TypeWriterText text="Portfolio" delay={1400} />
        </div>
      </div>
      <button className="start-button" onClick={handleButtonClick}>
        <TypeWriterText text="EXPLORE" delay={2300} /> 
      </button>
    </div>
  );
};

export default WelcomeScreen;
