import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useLayoutContext } from "../../contexts/LayoutContext";
import "./GlobalSectionNavigation.css";

const GlobalSectionNavigation = () => {
  const { sections, activeSection, setActiveSection } = useLayoutContext();

  // Use a ref to track the active section without causing re-renders
  const activeSectionRef = useRef(activeSection);
  useEffect(() => {
    // Keep the ref synchronized with the state on every render
    activeSectionRef.current = activeSection;
  }, [activeSection]);

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

        // If no section has a significant intersection ratio, find the section closest to the top
        if (maxRatio < 0.1) {
          let closestToTop = "";
          let minDistance = Infinity;

          sections.forEach((section) => {
            const element = document.getElementById(section.id);
            if (element) {
              const rect = element.getBoundingClientRect();
              const distance = Math.abs(rect.top);
              if (distance < minDistance) {
                minDistance = distance;
                closestToTop = section.id;
              }
            }
          });

          if (closestToTop && closestToTop !== activeSectionRef.current) {
            mostVisibleSection = closestToTop;
          }
        }

        // Compare against the ref's current value, not the stale state from the closure.
        // This prevents unnecessary state updates and breaks the loop.
        if (
          mostVisibleSection &&
          mostVisibleSection !== activeSectionRef.current
        ) {
          setActiveSection(mostVisibleSection);
        }
      },
      {
        // More sensitive thresholds for better detection
        threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9],
        // Adjusted rootMargin to be more balanced
        rootMargin: "-10% 0px -10% 0px",
      }
    );

    // Observe all section elements
    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    // Set initial active section to the first section if none is set
    if (!activeSection && sections.length > 0) {
      setActiveSection(sections[0].id);
    }

    return () => {
      observer.disconnect();
    };
  }, [sections, setActiveSection, activeSection]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // For the first section, scroll to the very top
      if (sectionId === sections[0]?.id) {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } else {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      // Force update active section after a short delay to ensure scroll completes
      setTimeout(() => {
        if (activeSectionRef.current !== sectionId) {
          setActiveSection(sectionId);
        }
      }, 500);
    }
  };

  // No longer need to check isHomePage here, it's implicit
  if (sections.length === 0) {
    return null;
  }

  return (
    <motion.nav
      className="global-section-navigation"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      <ul className="nav-dots">
        {sections.map((section) => (
          <li key={section.id}>
            <motion.button
              className={`nav-dot ${
                activeSection === section.id ? "active" : ""
              }`}
              onClick={() => scrollToSection(section.id)}
              aria-label={`Go to ${section.label} section`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.95 }}
              animate={
                activeSection === section.id ? { scale: 1.1 } : { scale: 1 }
              }
              transition={{ duration: 0.2 }}
            >
              <span className="dot-tooltip">{section.label}</span>
            </motion.button>
          </li>
        ))}
      </ul>
    </motion.nav>
  );
};

export default GlobalSectionNavigation;
