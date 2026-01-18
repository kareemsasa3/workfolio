import { motion, MotionStyle } from "framer-motion";
import { forwardRef, ForwardedRef } from "react";
import TypeWriterText from "../../../components/TypeWriterText";
import { heroContent } from "../../../data/siteContent";

interface HeroSectionProps {
  hasShownHomeIntro: boolean;
  onIntroComplete: () => void;
  onNavigateToProjects: () => void;
  isNavigatingToProjects: boolean;
  style?: MotionStyle; // Framer Motion style prop
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
            viewport={{ once: true, margin: "0px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {!hasShownHomeIntro ? (
              <TypeWriterText
                text={heroContent.title}
                speed={80}
                onComplete={onIntroComplete}
              />
            ) : (
              heroContent.title
            )}
          </motion.h1>
          <motion.div
            className="hero-subtitle"
            role="doc-subtitle"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {!hasShownHomeIntro ? (
              <TypeWriterText
                text={heroContent.subtitle}
                delay={2000}
                speed={60}
                onComplete={onIntroComplete}
              />
            ) : (
              heroContent.subtitle
            )}
          </motion.div>
          <motion.p
            className="hero-description"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px" }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {heroContent.description}
          </motion.p>
          <motion.div
            className="hero-buttons"
            role="group"
            aria-label="Primary actions"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px" }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <button
              className="btn btn-primary"
              onClick={onNavigateToProjects}
              disabled={isNavigatingToProjects}
              aria-label="View my projects and work portfolio"
            >
              {isNavigatingToProjects ? "Loading..." : heroContent.cta}
            </button>
          </motion.div>
        </div>
      </motion.section>
    );
  }
);

HeroSection.displayName = "HeroSection";
