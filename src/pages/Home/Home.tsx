import "./Home.css";
import { useNavigation } from "../../hooks/useNavigation";
import { useState, useRef, useEffect, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLayoutContext, PageSection } from "../../contexts/LayoutContext";
import { useIsMobile } from "../../hooks/useIsMobile";

import {
  HeroSection,
  FeaturedProjectsSection,
  CapabilitiesSection,
  ContactStripSection,
} from "./sections";

const Home = () => {
  const { navigateTo, navigateToProjects } = useNavigation();
  const { setSections } = useLayoutContext();

  // Define the sections for this page
  const homeSections: PageSection[] = useMemo(
    () => [
      { id: "hero", label: "Hero" },
      { id: "projects", label: "Systems" },
      { id: "capabilities", label: "Approach" },
      { id: "contact", label: "Contact" },
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
    caseStudies: false,
    work: false,
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
  const capabilitiesYMotion = useTransform(scrollYProgress, [0.4, 0.6], [0, -30]);

  // Navigation handlers - simplified and more robust
  const handleNavigateToProjects = () => {
    setLoadingStates((prev) => ({ ...prev, projects: true }));
    navigateToProjects();
  };

  const handleNavigateToWork = () => {
    setLoadingStates((prev) => ({ ...prev, work: true }));
    navigateTo("/work");
  };

  const handleNavigateToCaseStudies = () => {
    setLoadingStates((prev) => ({ ...prev, caseStudies: true }));
    navigateTo("/case-studies");
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
            onNavigateToWork={handleNavigateToWork}
            isNavigatingToProjects={loadingStates.projects}
            isNavigatingToWork={loadingStates.work}
          />
        </motion.div>

        {/* Featured Projects Section */}
        <motion.div
          id="projects"
          ref={getSectionRef("projects")}
          style={{ y: isMobile ? 0 : projectsYMotion }}
        >
          <FeaturedProjectsSection
            onNavigateToCaseStudies={handleNavigateToCaseStudies}
            isNavigating={loadingStates.caseStudies}
          />
        </motion.div>

        {/* Capabilities Section */}
        <motion.div
          id="capabilities"
          ref={getSectionRef("capabilities")}
          style={{ y: isMobile ? 0 : capabilitiesYMotion }}
        >
          <CapabilitiesSection />
        </motion.div>

        {/* Contact Section */}
        <div id="contact" ref={getSectionRef("contact")}>
          <ContactStripSection />
        </div>
      </div>
    </div>
  );
};

export default Home;
