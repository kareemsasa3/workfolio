import "./Home.css";
import { useNavigation } from "../../hooks/useNavigation";
import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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

  // Consolidated loading states for navigation buttons
  const [loadingStates, setLoadingStates] = useState({
    projects: false,
    contact: false,
    resume: false,
  });

  // Refs for sections
  const heroRef = useRef(null);
  const projectsRef = useRef(null);
  const skillsRef = useRef(null);
  const aboutRef = useRef(null);
  const ctaRef = useRef(null);

  // Section-specific scroll progress for optimized performance
  const { scrollYProgress: heroScrollY } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });

  const { scrollYProgress: projectsScrollY } = useScroll({
    target: projectsRef,
    offset: ["start end", "end start"],
  });

  const { scrollYProgress: skillsScrollY } = useScroll({
    target: skillsRef,
    offset: ["start end", "end start"],
  });

  // Optimized parallax transforms - only calculate when section is in viewport
  const heroY = useTransform(heroScrollY, [0, 1], [0, -100]);
  const projectsY = useTransform(projectsScrollY, [0, 1], [0, -50]);
  const skillsY = useTransform(skillsScrollY, [0, 1], [0, -50]);

  // Navigation handlers - simplified without setTimeout
  const handleNavigateToProjects = () => {
    setLoadingStates((prev) => ({ ...prev, projects: true }));
    navigateToProjects();
  };

  const handleNavigateToContact = () => {
    setLoadingStates((prev) => ({ ...prev, contact: true }));
    navigateToContact();
  };

  const handleOpenResume = () => {
    setLoadingStates((prev) => ({ ...prev, resume: true }));
    openResume();
    // Reset state after a short delay to prevent flash
    setTimeout(
      () => setLoadingStates((prev) => ({ ...prev, resume: false })),
      500
    );
  };

  const handleIntroComplete = () => {
    setHasShownHomeIntro(true);
    localStorage.setItem("home-intro-shown", "true");
  };

  return (
    <div className="page-content home-page">
      <div className="home-container">
        {/* Hero Section */}
        <motion.div id="hero" ref={heroRef} style={{ y: heroY }}>
          <HeroSection
            hasShownHomeIntro={hasShownHomeIntro}
            onIntroComplete={handleIntroComplete}
            onNavigateToProjects={handleNavigateToProjects}
            onOpenResume={handleOpenResume}
            isNavigatingToProjects={loadingStates.projects}
            isOpeningResume={loadingStates.resume}
          />
        </motion.div>

        {/* Featured Projects Section */}
        <motion.div id="projects" ref={projectsRef} style={{ y: projectsY }}>
          <FeaturedProjectsSection
            onNavigateToProjects={handleNavigateToProjects}
            isNavigating={loadingStates.projects}
          />
        </motion.div>

        {/* Skills Section */}
        <motion.div id="skills" ref={skillsRef} style={{ y: skillsY }}>
          <SkillsSection />
        </motion.div>

        {/* About Section */}
        <div id="about" ref={aboutRef}>
          <AboutSection />
        </div>

        {/* CTA Section */}
        <div id="contact" ref={ctaRef}>
          <CtaSection
            onNavigateToContact={handleNavigateToContact}
            isNavigating={loadingStates.contact}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
