import { motion } from "framer-motion";
import { forwardRef, ForwardedRef, useMemo } from "react";
import SkillItem from "../../../components/SkillItem";

// Define skills data here
const skills = [
  { name: "Go", icon: "🐹", category: "Backend" },
  { name: "Python", icon: "🐍", category: "Backend" },
  { name: "React", icon: "⚛️", category: "Frontend" },
  { name: "TypeScript", icon: "📘", category: "Frontend" },
  { name: "Next.js", icon: "▲", category: "Frontend" },
  { name: "Docker", icon: "🐳", category: "DevOps" },
  { name: "PostgreSQL", icon: "🐘", category: "Database" },
  { name: "Redis", icon: "🔴", category: "Database" },
  { name: "GitHub Actions", icon: "⚡", category: "DevOps" },
  { name: "Playwright", icon: "🎭", category: "Testing" },
  { name: "Supabase", icon: "🔥", category: "Backend" },
  { name: "Prisma", icon: "🔧", category: "Database" },
  { name: "Tailwind CSS", icon: "🎨", category: "Frontend" },
  { name: "Framer Motion", icon: "✨", category: "Frontend" },
  { name: "Three.js", icon: "🎮", category: "Frontend" },
  { name: "HIPAA Compliance", icon: "🔒", category: "Security" },
  { name: ".NET", icon: "🟣", category: "Backend" },
  { name: "Azure", icon: "☁️", category: "Cloud" },
  { name: "Linux", icon: "🐧", category: "DevOps" },
  { name: "Nginx", icon: "🌐", category: "DevOps" },
];

interface SkillsSectionProps {
  style?: any; // Framer Motion style prop
}

export const SkillsSection = forwardRef(
  ({ style }: SkillsSectionProps, ref: ForwardedRef<HTMLElement>) => {
    // Dynamic category generation
    const skillCategories = useMemo(() => {
      const categories = new Set(skills.map((skill) => skill.category));
      // Define preferred order for consistent display
      const preferredOrder = [
        "Backend",
        "Frontend",
        "DevOps",
        "Database",
        "Testing",
        "Security",
        "Cloud",
      ];
      return preferredOrder.filter((cat) => categories.has(cat));
    }, []);

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
                  .slice(0, 4)
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
