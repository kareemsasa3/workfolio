import { motion } from "framer-motion";
import { forwardRef, ForwardedRef } from "react";

// Define about data here
const aboutItems = [
  {
    icon: "⚙️",
    title: "Backend & Systems Architecture",
    description:
      "Designing scalable architectures with Go, Python, and .NET. Building production-ready services with Redis, PostgreSQL, and automated CI/CD pipelines. Creating HIPAA-compliant systems and enterprise integrations.",
  },
  {
    icon: "🎨",
    title: "Frontend & User Experience",
    description:
      "Crafting modern web applications with React, TypeScript, and Next.js. Implementing responsive designs with Tailwind CSS, smooth animations with Framer Motion, and interactive 3D experiences with Three.js.",
  },
  {
    icon: "🚀",
    title: "DevOps & Infrastructure",
    description:
      "Deploying with Docker, GitHub Actions, and cloud platforms. Managing production environments with Nginx, monitoring systems, and automated testing. Ensuring high availability and performance optimization.",
  },
  {
    icon: "🤖",
    title: "Automation & AI",
    description:
      "Building sophisticated automation systems with Python and Playwright. Creating intelligent bots with state management, Slack integration, and advanced retry logic for reliable production systems.",
  },
];

interface AboutSectionProps {
  style?: any; // Framer Motion style prop
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
            What I Do
          </motion.h2>
          <motion.ul
            className="about-grid"
            aria-label="Service areas"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {aboutItems.map((item, index) => (
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
