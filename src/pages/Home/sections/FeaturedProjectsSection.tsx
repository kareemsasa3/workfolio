import { motion, MotionStyle } from "framer-motion";
import { forwardRef, ForwardedRef } from "react";
import { Link } from "react-router-dom";
import { caseStudyCards } from "../../../data/caseStudies";
import { featuredProjectIds } from "../../../data/siteContent";

const featuredProjects = featuredProjectIds
  .map((id) => caseStudyCards.find((caseStudy) => caseStudy.projectId === id))
  .filter((caseStudy): caseStudy is NonNullable<typeof caseStudy> => caseStudy !== undefined);

interface FeaturedProjectsSectionProps {
  onNavigateToCaseStudies: () => void;
  isNavigating: boolean;
  style?: MotionStyle;
}

export const FeaturedProjectsSection = forwardRef(
  (
    {
      onNavigateToCaseStudies,
      isNavigating,
      style,
    }: FeaturedProjectsSectionProps,
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
          Featured Systems
        </motion.h2>
        <motion.div
          className="featured-projects-grid"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {featuredProjects.map((caseStudy, index) => (
            <motion.article
              key={caseStudy.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              whileHover={{
                y: -8,
                transition: { duration: 0.3 },
              }}
            >
              <Link
                to={`/case-studies/${caseStudy.slug}`}
                className="featured-project-card interactive-card featured-project-link"
                aria-label={`Read the ${caseStudy.title} case study`}
              >
                <div className="project-header">
                  <h3 className="project-title">{caseStudy.title}</h3>
                  <div className="project-badges">
                    <span
                      className={`complexity-badge ${caseStudy.project.complexity.toLowerCase()}`}
                    >
                      {caseStudy.project.complexity}
                    </span>
                    <span
                      className={`status-badge ${caseStudy.project.status.toLowerCase()}`}
                    >
                      {caseStudy.project.status}
                    </span>
                  </div>
                </div>
                <p className="project-description">
                  {caseStudy.shortDescription}
                </p>
                <div className="project-tech">
                  {caseStudy.focusAreas.map((focusArea) => (
                    <span key={focusArea} className="tech-tag">
                      {focusArea}
                    </span>
                  ))}
                </div>
                <div className="featured-project-footer">
                  <span className="featured-project-link-text">
                    Read case study →
                  </span>
                </div>
              </Link>
            </motion.article>
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
            onClick={onNavigateToCaseStudies}
            disabled={isNavigating}
            aria-label="View all case studies"
          >
            {isNavigating ? "Loading..." : "View All Case Studies →"}
          </button>
        </motion.div>
      </motion.section>
    );
  }
);

FeaturedProjectsSection.displayName = "FeaturedProjectsSection";
