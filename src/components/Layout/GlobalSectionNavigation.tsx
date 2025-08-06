import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLayoutContext } from "../../contexts/LayoutContext";
import { useWindowSize } from "../../hooks/useWindowSize";
import "./GlobalSectionNavigation.css";

interface GlobalSectionNavigationProps {
  isSettingsOpen: boolean;
}

const GlobalSectionNavigation = ({
  isSettingsOpen,
}: GlobalSectionNavigationProps) => {
  const { sections, activeSection, setActiveSection } = useLayoutContext();
  const [shiftAmount, setShiftAmount] = useState(0);
  const { width: windowWidth } = useWindowSize();

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
    if (!activeSectionRef.current && sections.length > 0) {
      setActiveSection(sections[0].id);
    }

    return () => {
      observer.disconnect();
    };
  }, [sections, setActiveSection]); // Using ref to avoid dependency on activeSection

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
      // Trust the IntersectionObserver to handle the active section update
      // No manual setTimeout needed - the observer will see the scroll and update automatically
    }
  };

  // Handle responsive shift amount for settings panel using the superior useWindowSize hook
  useEffect(() => {
    const calculateShift = () => {
      if (!isSettingsOpen) return 0;
      if (windowWidth > 1200) return -385; // Increased to account for 400px panel + margin
      if (windowWidth > 768) return -250; // Increased for better clearance
      return 0;
    };

    const newShiftAmount = calculateShift();
    setShiftAmount(newShiftAmount);
  }, [isSettingsOpen, windowWidth]); // More declarative and uses the superior hook

  // No longer need to check isHomePage here, it's implicit
  if (sections.length === 0) {
    return null;
  }

  return (
    <motion.nav
      className={`global-section-navigation ${
        isSettingsOpen ? "settings-open" : ""
      }`}
      initial={{ opacity: 0, x: 50 }}
      animate={{
        opacity: 1,
        x: shiftAmount,
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
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
