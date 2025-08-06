import { motion } from "framer-motion";
import { forwardRef, ForwardedRef } from "react";
import TypeWriterText from "../../../components/TypeWriterText";

interface HeroSectionProps {
  hasShownHomeIntro: boolean;
  onIntroComplete: () => void;
  onNavigateToProjects: () => void;
  isNavigatingToProjects: boolean;
  style?: any; // Framer Motion style prop
}

export const HeroSection = forwardRef(
  (
    {
      hasShownHomeIntro,
      onIntroComplete,
      onNavigateToProjects,
      isNavigatingToProjects,
      style,
    }: HeroSectionProps,
    ref: ForwardedRef<HTMLElement>
  ) => {
    return (
      <motion.section
        ref={ref}
        className="hero-section"
        role="banner"
        aria-label="Hero section"
        style={style}
      >
        <div className="hero-content">
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {!hasShownHomeIntro ? (
              <TypeWriterText
                text="Hello, I'm a Full-Stack Developer"
                speed={80}
                onComplete={onIntroComplete}
              />
            ) : (
              "Hello, I'm a Full-Stack Developer"
            )}
          </motion.h1>
          <motion.div
            className="hero-subtitle"
            role="doc-subtitle"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {!hasShownHomeIntro ? (
              <TypeWriterText
                text="Building production-ready systems with modern technologies"
                delay={2000}
                speed={60}
                onComplete={onIntroComplete}
              />
            ) : (
              "Building production-ready systems with modern technologies"
            )}
          </motion.div>
          <motion.p
            className="hero-description"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            I specialize in creating scalable, high-performance applications
            across the full stack. From enterprise-grade Go services to modern
            React applications, I bring ideas to life with clean code, robust
            architecture, and exceptional user experiences.
          </motion.p>
          <motion.div
            className="hero-buttons"
            role="group"
            aria-label="Primary actions"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <button
              className="btn btn-primary"
              onClick={onNavigateToProjects}
              disabled={isNavigatingToProjects}
              aria-label="View my projects and work portfolio"
            >
              {isNavigatingToProjects ? "Loading..." : "View My Work"}
            </button>
          </motion.div>
        </div>
      </motion.section>
    );
  }
);

HeroSection.displayName = "HeroSection";
