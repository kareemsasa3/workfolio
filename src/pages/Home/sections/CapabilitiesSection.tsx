import { motion, MotionStyle } from "framer-motion";
import { forwardRef, ForwardedRef } from "react";
import { capabilitiesContent } from "../../../data/siteContent";

interface CapabilitiesSectionProps {
  style?: MotionStyle;
}

export const CapabilitiesSection = forwardRef(
  ({ style }: CapabilitiesSectionProps, ref: ForwardedRef<HTMLElement>) => {
    return (
      <motion.section
        ref={ref}
        className="capabilities-section"
        role="region"
        aria-labelledby="capabilities-title"
        style={style}
      >
        <div className="capabilities-content">
          <motion.h2
            id="capabilities-title"
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {capabilitiesContent.title}
          </motion.h2>
          <motion.ul
            className="capabilities-grid"
            aria-label="Engineering capabilities"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {capabilitiesContent.items.map((item, index) => (
              <motion.li
                key={item.title}
                className="capability-card interactive-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.08 }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
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

CapabilitiesSection.displayName = "CapabilitiesSection";
