import { motion, MotionStyle } from "framer-motion";
import { forwardRef, ForwardedRef } from "react";
import { aboutContent } from "../../../data/siteContent";

interface AboutSectionProps {
  style?: MotionStyle; // Framer Motion style prop
}

export const AboutSection = forwardRef(
  ({ style }: AboutSectionProps, ref: ForwardedRef<HTMLElement>) => {
    return (
      <motion.section
        ref={ref}
        className="about-section"
        role="region"
        aria-labelledby="about-title"
        style={style}
      >
        <div className="about-content">
          <motion.h2
            id="about-title"
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {aboutContent.title}
          </motion.h2>
          <motion.ul
            className="about-grid"
            aria-label="Service areas"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {aboutContent.items.map((item, index) => (
              <motion.li
                key={index}
                className="about-card interactive-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.3 },
                }}
              >
                <div className="card-icon" aria-hidden="true">
                  {item.icon}
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </motion.section>
    );
  }
);

AboutSection.displayName = "AboutSection";
