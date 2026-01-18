import { motion, MotionStyle } from "framer-motion";
import { forwardRef, ForwardedRef } from "react";
import SkillItem from "../../../components/SkillItem";
import { skills, skillCategories } from "../../../data/siteContent";

interface SkillsSectionProps {
  style?: MotionStyle;
}

export const SkillsSection = forwardRef(
  ({ style }: SkillsSectionProps, ref: ForwardedRef<HTMLElement>) => {
    return (
      <motion.section
        ref={ref}
        className="skills-section"
        role="region"
        aria-labelledby="skills-title"
        style={style}
      >
        <motion.h2
          id="skills-title"
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Technologies I Work With
        </motion.h2>
        <motion.div
          className="skills-categories"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {skillCategories.map((category, index) => (
            <motion.div
              key={category}
              className="skill-category interactive-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              whileHover={{
                y: -4,
                transition: { duration: 0.3 },
              }}
            >
              <h3 className="category-title">{category}</h3>
              <ul className="skills-grid" aria-label={`${category} skills`}>
                {skills
                  .filter((skill) => skill.category === category)
                  .map((skill, skillIndex) => (
                    <SkillItem
                      key={skill.name}
                      name={skill.name}
                      icon={skill.icon}
                      index={skillIndex}
                    />
                  ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
    );
  }
);

SkillsSection.displayName = "SkillsSection";