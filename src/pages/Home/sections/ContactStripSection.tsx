import { motion, MotionStyle } from "framer-motion";
import { forwardRef, ForwardedRef } from "react";
import { socialContent } from "../../../data/siteContent";

interface ContactStripSectionProps {
  style?: MotionStyle;
}

export const ContactStripSection = forwardRef(
  ({ style }: ContactStripSectionProps, ref: ForwardedRef<HTMLElement>) => {
    return (
      <motion.section
        ref={ref}
        className="contact-strip-section"
        role="region"
        aria-labelledby="contact-title"
        style={style}
      >
        <div className="contact-strip-content interactive-card">
          <motion.h2
            id="contact-title"
            className="contact-strip-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {socialContent.title}
          </motion.h2>
          <motion.div
            className="contact-strip-links"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {socialContent.links.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.url}
                target={link.url.startsWith("mailto:") ? undefined : "_blank"}
                rel={
                  link.url.startsWith("mailto:")
                    ? undefined
                    : "noopener noreferrer"
                }
                className="contact-strip-link"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.45, delay: 0.3 + index * 0.08 }}
                whileHover={{ y: -2 }}
              >
                <span aria-hidden="true">{link.icon}</span>
                <span>{link.name}</span>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </motion.section>
    );
  }
);

ContactStripSection.displayName = "ContactStripSection";
