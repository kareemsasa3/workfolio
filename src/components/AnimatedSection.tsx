import { motion } from "framer-motion";
import { forwardRef, ForwardedRef } from "react";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  role?: string;
  "aria-labelledby"?: string;
  "aria-label"?: string;
  style?: React.CSSProperties;
  delay?: number;
  y?: number;
}

export const AnimatedSection = forwardRef(
  (
    { children, className, delay = 0, y = 50, ...rest }: AnimatedSectionProps,
    ref: ForwardedRef<HTMLElement>
  ) => {
    return (
      <motion.section
        ref={ref}
        className={className}
        initial={{ opacity: 0, y }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut", delay }}
        {...rest}
      >
        {children}
      </motion.section>
    );
  }
);

AnimatedSection.displayName = "AnimatedSection";
