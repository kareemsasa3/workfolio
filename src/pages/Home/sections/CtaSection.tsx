import { motion } from "framer-motion";
import { forwardRef, ForwardedRef } from "react";

interface CtaSectionProps {
  onNavigateToContact: () => void;
  isNavigating: boolean;
  style?: any; // Framer Motion style prop
}

export const CtaSection = forwardRef(
  (
    { onNavigateToContact, isNavigating, style }: CtaSectionProps,
    ref: ForwardedRef<HTMLElement>
  ) => {
    return (
      <motion.section
        ref={ref}
        className="cta-section"
        role="region"
        aria-labelledby="cta-title"
        style={style}
      >
        <div className="cta-content">
          <motion.h2
            id="cta-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Ready to Build Something Amazing?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Let's discuss how we can bring your ideas to life with modern
            technologies and best practices
          </motion.p>
          <motion.button
            className="btn btn-primary btn-large"
            onClick={onNavigateToContact}
            disabled={isNavigating}
            aria-label="Contact me to start a project"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.6 }}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.2 },
            }}
            whileTap={{
              scale: 0.95,
              transition: { duration: 0.1 },
            }}
          >
            {isNavigating ? "Loading..." : "Get In Touch"}
          </motion.button>
        </div>
      </motion.section>
    );
  }
);

CtaSection.displayName = "CtaSection";
