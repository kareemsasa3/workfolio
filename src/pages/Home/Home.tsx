import "./Home.css";
import { useNavigation } from "../../hooks/useNavigation";
import { useState, useRef, useEffect, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLayoutContext, PageSection } from "../../contexts/LayoutContext";
import { useIsMobile } from "../../hooks/useIsMobile";

import {
  HeroSection,
  FeaturedProjectsSection,
  SkillsSection,
  AboutSection,
  SocialLinksSection,
} from "./sections";

const Home = () => {
  const { navigateToProjects } = useNavigation();
  const { setSections } = useLayoutContext();

  // Define the sections for this page
  const homeSections: PageSection[] = useMemo(
    () => [
      { id: "hero", label: "Hero" },
      { id: "projects", label: "Projects" },
      { id: "skills", label: "Skills" },
      { id: "about", label: "About" },
      { id: "social", label: "Social" },
    ],
    []
  );

  // Dynamic section refs management
  const sectionRefs = useRef(new Map<string, HTMLElement>());

  // Ref getter function for dynamic ref assignment
  const getSectionRef = (id: string) => (el: HTMLElement | null) => {
    if (el) {
      sectionRefs.current.set(id, el);
    } else {
      sectionRefs.current.delete(id);
    }
  };

  // Announce our sections when the component mounts
  useEffect(() => {
    setSections(homeSections);
    return () => setSections([]);
  }, [homeSections, setSections]); // homeSections is stable via useMemo, setSections is stable from context

  // Check if home intro has been shown before
  const [hasShownHomeIntro, setHasShownHomeIntro] = useState(() => {
    return localStorage.getItem("home-intro-shown") === "true";
  });

  // Consolidated loading states for navigation buttons
  const [loadingStates, setLoadingStates] = useState({
    projects: false,
  });

  // Optimized parallax implementation using a single scroll container
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    container: containerRef,
    offset: ["start end", "end start"],
  });

  // Map scroll progress to different parallax effects for each section
  // These ranges are approximate and can be fine-tuned based on actual content
  const isMobile = useIsMobile();
  const heroYMotion = useTransform(scrollYProgress, [0, 0.2], [0, -100]);
  const projectsYMotion = useTransform(scrollYProgress, [0.2, 0.4], [0, -50]);
  const skillsYMotion = useTransform(scrollYProgress, [0.4, 0.6], [0, -50]);

  // Navigation handlers - simplified and more robust
  const handleNavigateToProjects = () => {
    setLoadingStates((prev) => ({ ...prev, projects: true }));
    navigateToProjects();
  };

  const handleIntroComplete = () => {
    setHasShownHomeIntro(true);
    localStorage.setItem("home-intro-shown", "true");
  };

  return (
    <div className="page-content home-page" ref={containerRef}>
      <div className="home-container">
        {/* Hero Section */}
        <motion.div
          id="hero"
          ref={getSectionRef("hero")}
          style={{ y: isMobile ? 0 : heroYMotion }}
        >
          <HeroSection
            hasShownHomeIntro={hasShownHomeIntro}
            onIntroComplete={handleIntroComplete}
            onNavigateToProjects={handleNavigateToProjects}
            isNavigatingToProjects={loadingStates.projects}
          />
        </motion.div>

        {/* Featured Projects Section */}
        <motion.div
          id="projects"
          ref={getSectionRef("projects")}
          style={{ y: isMobile ? 0 : projectsYMotion }}
        >
          <FeaturedProjectsSection
            onNavigateToProjects={handleNavigateToProjects}
            isNavigating={loadingStates.projects}
          />
        </motion.div>

        {/* Skills Section */}
        <motion.div
          id="skills"
          ref={getSectionRef("skills")}
          style={{ y: isMobile ? 0 : skillsYMotion }}
        >
          <SkillsSection />
        </motion.div>

        {/* About Section */}
        <div id="about" ref={getSectionRef("about")}>
          <AboutSection />
        </div>

        {/* Social Links Section */}
        <div id="social" ref={getSectionRef("social")}>
          <SocialLinksSection />
        </div>
      </div>
    </div>
  );
};

export default Home;
