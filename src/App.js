import React, { useState, useEffect } from 'react';
import './App.css';
import WelcomeScreen from './components/WelcomeScreen';
import MainContent from './components/MainContent/MainContent';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Info from './pages/Info';
import Work from './pages/Work';
import Education from './pages/Education';
import Certifications from './pages/Certifications';
import Resume from './pages/Resume';
import BionicBackground from './components/BionicBackground';

const App = () => {
  const [showWelcome, setShowWelcome] = useState(true);

  const handleAnimationEnd = () => {
    setShowWelcome(false);
  };

  useEffect(() => {
    if (!showWelcome) {
      // Enable vertical scrolling only
      document.body.style.overflowX = 'hidden';
      document.body.style.overflowY = 'auto';
    }
  }, [showWelcome]);

  return (
    <div className='App'>
      <BionicBackground />
      {showWelcome && <WelcomeScreen onAnimationEnd={handleAnimationEnd} />}
      {!showWelcome && (
        <>
          <MainContent />
          <Home />
          <Projects />
          <Info />
          <Work />
          <Education />
          <Certifications />
          <Resume />
        </>
      )}
    </div>
  );
};

export default App;
