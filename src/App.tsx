import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import WelcomeScreen from "./components/WelcomeScreen";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Games from "./pages/Games";
import SnakeGame from "./pages/SnakeGame";
import Info from "./pages/Info";
import Work from "./pages/Work";
import Education from "./pages/Education";
import Certifications from "./pages/Certifications";
import Resume from "./pages/Resume";
import Contact from "./pages/Contact";
import BionicBackground from "./components/BionicBackground";

const App = () => {
  const [showWelcome, setShowWelcome] = useState(true);

  const handleAnimationEnd = () => {
    setShowWelcome(false);
  };

  useEffect(() => {
    if (!showWelcome) {
      // Enable vertical scrolling only
      document.body.style.overflowX = "hidden";
      document.body.style.overflowY = "auto";
    }
  }, [showWelcome]);

  if (showWelcome) {
    return (
      <div className="App">
        <BionicBackground />
        <WelcomeScreen onAnimationEnd={handleAnimationEnd} />
      </div>
    );
  }

  return (
    <div className="App">
      <BionicBackground />
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="projects" element={<Projects />} />
            <Route path="games" element={<Games />} />
            <Route path="games/snake" element={<SnakeGame />} />
            <Route path="work" element={<Work />} />
            <Route path="education" element={<Education />} />
            <Route path="certifications" element={<Certifications />} />
            <Route path="resume" element={<Resume />} />
            <Route path="contact" element={<Contact />} />
            <Route path="info" element={<Info />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
