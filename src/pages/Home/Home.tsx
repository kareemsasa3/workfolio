import "./Home.css";
import { useNavigation } from "../../hooks/useNavigation";
import { useState, useRef, useEffect } from "react";
import { useScroll, useTransform } from "framer-motion";
import { useLayoutContext, PageSection } from "../../contexts/LayoutContext"; // Import the context hook and PageSection type
import {
  HeroSection,
  FeaturedProjectsSection,
  SkillsSection,
  AboutSection,
  CtaSection,
} from "./sections";

const Home = () => {
  const { navigateToProjects, navigateToContact, openResume } = useNavigation();

  // Get the main scrolling container's ref and section management from our context
  const { setSections } = useLayoutContext();

  // Define the sections for this page
  const homeSections: PageSection[] = [
    { id: "hero", label: "Hero" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
  ];

  // Announce our sections when the component mounts
  useEffect(() => {
    setSections(homeSections);

    return () => setSections([]);
  }, [setSections]);

  // Check if home intro has been shown before
  const [hasShownHomeIntro, setHasShownHomeIntro] = useState(() => {
    return localStorage.getItem("home-intro-shown") === "true";
  });

  // Loading states for navigation buttons
  const [isNavigatingToProjects, setIsNavigatingToProjects] = useState(false);
  const [isNavigatingToContact, setIsNavigatingToContact] = useState(false);
  const [isOpeningResume, setIsOpeningResume] = useState(false);

  // Refs for sections
  const heroRef = useRef(null);
  const projectsRef = useRef(null);
  const skillsRef = useRef(null);
  const aboutRef = useRef(null);
  const ctaRef = useRef(null);

  // Use window scroll since body is the scrolling container
  const { scrollYProgress } = useScroll();

  // Parallax transforms
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  const projectsY = useTransform(scrollYProgress, [0.2, 0.7], [0, -50]);
  const skillsY = useTransform(scrollYProgress, [0.4, 0.9], [0, -50]);

  // Navigation handlers - simplified without setTimeout
  const handleNavigateToProjects = () => {
    setIsNavigatingToProjects(true);
    navigateToProjects();
  };

  const handleNavigateToContact = () => {
    setIsNavigatingToContact(true);
    navigateToContact();
  };

  const handleOpenResume = () => {
    setIsOpeningResume(true);
    openResume();
    // Reset state after a short delay to prevent flash
    setTimeout(() => setIsOpeningResume(false), 500);
  };

  const handleIntroComplete = () => {
    setHasShownHomeIntro(true);
    localStorage.setItem("home-intro-shown", "true");
  };

  return (
    <div className="page-content home-page">
      <div className="home-container">
        {/* Hero Section */}
        <div id="hero">
          <HeroSection
            ref={heroRef}
            hasShownHomeIntro={hasShownHomeIntro}
            onIntroComplete={handleIntroComplete}
            onNavigateToProjects={handleNavigateToProjects}
            onOpenResume={handleOpenResume}
            isNavigatingToProjects={isNavigatingToProjects}
            isOpeningResume={isOpeningResume}
            style={{ y: heroY }}
          />
        </div>

        {/* Featured Projects Section */}
        <div id="projects">
          <FeaturedProjectsSection
            ref={projectsRef}
            onNavigateToProjects={handleNavigateToProjects}
            isNavigating={isNavigatingToProjects}
            style={{ y: projectsY }}
          />
        </div>

        {/* Skills Section */}
        <div id="skills">
          <SkillsSection ref={skillsRef} style={{ y: skillsY }} />
        </div>

        {/* About Section */}
        <div id="about">
          <AboutSection ref={aboutRef} />
        </div>

        {/* CTA Section */}
        <div id="contact">
          <CtaSection
            ref={ctaRef}
            onNavigateToContact={handleNavigateToContact}
            isNavigating={isNavigatingToContact}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
