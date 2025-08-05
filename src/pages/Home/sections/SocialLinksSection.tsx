import { motion } from "framer-motion";
import { forwardRef, ForwardedRef } from "react";
import TypeWriterText from "../../../components/TypeWriterText";

interface SocialLinksSectionProps {
  style?: any; // Framer Motion style prop
}

export const SocialLinksSection = forwardRef(
  ({ style }: SocialLinksSectionProps, ref: ForwardedRef<HTMLElement>) => {
    const socialLinks = [
      {
        name: "GitHub",
        url: "https://github.com/kareemsasa3",
        icon: "🐙",
      },
      {
        name: "LinkedIn",
        url: "https://linkedin.com/in/kareemsasa",
        icon: "💼",
      },
      {
        name: "YouTube",
        url: "https://youtube.com/@kareemsasa",
        icon: "📺",
      },
      {
        name: "Instagram",
        url: "https://instagram.com/kareemsasa",
        icon: "📸",
      },
      {
        name: "X",
        url: "https://x.com/kareemsasa",
        icon: "🐦",
      },
    ];

    return (
      <motion.section
        ref={ref}
        className="social-links-section"
        role="region"
        aria-labelledby="social-title"
        style={style}
      >
        <div className="social-content">
          <motion.div
            id="social-title"
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <TypeWriterText text="Connect With Me" delay={0} speed={80} />
          </motion.div>
          <motion.div
            className="social-links-grid"
            aria-label="Social media links"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {socialLinks.map((link, index) => (
              <motion.a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link interactive-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                whileHover={{
                  y: -8,
                  scale: 1.05,
                  transition: { duration: 0.3 },
                }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="social-icon" aria-hidden="true">
                  {link.icon}
                </span>
                <span className="social-name">{link.name}</span>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </motion.section>
    );
  }
);

SocialLinksSection.displayName = "SocialLinksSection";
