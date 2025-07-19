import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect } from "react";
import { useLayoutContext } from "../../contexts/LayoutContext";
import "./GlobalSectionNavigation.css";

const GlobalSectionNavigation = () => {
  const { sections, activeSection, setActiveSection } = useLayoutContext();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  // The IntersectionObserver logic is now foolproof because it only runs when `sections` are provided by the active page
  useEffect(() => {
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the section with the highest intersection ratio
        let maxRatio = 0;
        let mostVisibleSection = "";

        entries.forEach((entry) => {
          if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            mostVisibleSection = entry.target.id;
          }
        });

        // Only update if we have a visible section and it's different from current
        if (mostVisibleSection && mostVisibleSection !== activeSection) {
          setActiveSection(mostVisibleSection);
        }
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        rootMargin: "-10% 0px -10% 0px", // Adjust the trigger area
      }
    );

    // Observe all section elements
    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [sections, setActiveSection, activeSection]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // No longer need to check isHomePage here, it's implicit
  if (sections.length === 0) {
    return null;
  }

  return (
    <motion.nav
      className="global-section-navigation"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 1 }}
      style={{ y }}
    >
      <ul className="nav-dots">
        {sections.map((section) => (
          <motion.li key={section.id}>
            <motion.button
              className={`nav-dot ${
                activeSection === section.id ? "active" : ""
              }`}
              onClick={() => scrollToSection(section.id)}
              aria-label={`Go to ${section.label} section`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="dot-tooltip">{section.label}</span>
            </motion.button>
          </motion.li>
        ))}
      </ul>
    </motion.nav>
  );
};

export default GlobalSectionNavigation;
