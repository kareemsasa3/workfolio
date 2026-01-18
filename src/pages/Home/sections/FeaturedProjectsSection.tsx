import { motion, MotionStyle } from "framer-motion";
import { forwardRef, ForwardedRef } from "react";
import { projectsData } from "../../../data/projects";
import { featuredProjectIds } from "../../../data/siteContent";

const featuredProjects = featuredProjectIds
  .map(id => projectsData.find(p => p.id === id))
  .filter((project): project is NonNullable<typeof project> => project !== undefined);

interface FeaturedProjectsSectionProps {
  onNavigateToProjects: () => void;
  isNavigating: boolean;
  style?: MotionStyle; // Framer Motion style prop
}

export const FeaturedProjectsSection = forwardRef(
  (
    { onNavigateToProjects, isNavigating, style }: FeaturedProjectsSectionProps,
    ref: ForwardedRef<HTMLElement>
  ) => {
    return (
      <motion.section
        ref={ref}
        className="featured-projects-section"
        role="region"
        aria-labelledby="featured-projects-title"
        style={style}
      >
        <motion.h2
          id="featured-projects-title"
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Featured Projects
        </motion.h2>
        <motion.div
          className="featured-projects-grid"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.title}
              className="featured-project-card interactive-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              whileHover={{
                y: -8,
                transition: { duration: 0.3 },
              }}
            >
              <div className="project-header">
                <h3 className="project-title">{project.title}</h3>
                <div className="project-badges">
                  <span
                    className={`complexity-badge ${project.complexity.toLowerCase()}`}
                  >
                    {project.complexity}
                  </span>
                  <span
                    className={`status-badge ${project.status.toLowerCase()}`}
                  >
                    {project.status}
                  </span>
                </div>
              </div>
              <p className="project-description">{project.description}</p>
              <div className="project-tech">
                {project.techStack
                  .slice(0, 3)
                  .map((tech: string, techIndex: number) => (
                  <span key={techIndex} className="tech-tag">
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          className="featured-projects-cta"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <button
            className="btn btn-outline"
            onClick={onNavigateToProjects}
            disabled={isNavigating}
            aria-label="View all projects"
          >
            {isNavigating ? "Loading..." : "View All Projects →"}
          </button>
        </motion.div>
      </motion.section>
    );
  }
);

FeaturedProjectsSection.displayName = "FeaturedProjectsSection";
