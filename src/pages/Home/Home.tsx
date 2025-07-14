import "./Home.css";
import TypeWriterText from "../../components/TypeWriterText";
import SkillItem from "../../components/SkillItem";
import { useNavigation } from "../../hooks/useNavigation";
import { useState, useMemo } from "react";

// Define constants outside the component for better performance
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

const featuredProjects = [
  {
    title: "Arachne",
    description:
      "Production-ready web scraping service with 92.5% success rate",
    tech: ["Go", "Redis", "Docker"],
    complexity: "Expert",
    status: "Live",
  },
  {
    title: "Digital Garage",
    description:
      "Complete car management platform with real-time authentication",
    tech: ["Next.js", "TypeScript", "Supabase"],
    complexity: "Advanced",
    status: "Development",
  },
  {
    title: "Pop Mart Bot",
    description: "Sophisticated e-commerce monitoring with Slack integration",
    tech: ["Python", "Playwright", "Redis"],
    complexity: "Expert",
    status: "Live",
  },
];

const Home = () => {
  const { navigateToProjects, navigateToContact, openResume } = useNavigation();

  // Check if home intro has been shown before
  const [hasShownHomeIntro, setHasShownHomeIntro] = useState(() => {
    return localStorage.getItem("home-intro-shown") === "true";
  });

  // Loading states for navigation buttons
  const [isNavigatingToProjects, setIsNavigatingToProjects] = useState(false);
  const [isNavigatingToContact, setIsNavigatingToContact] = useState(false);
  const [isOpeningResume, setIsOpeningResume] = useState(false);

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

  // Navigation handlers with loading states
  const handleNavigateToProjects = () => {
    setIsNavigatingToProjects(true);
    setTimeout(() => {
      navigateToProjects();
    }, 300);
  };

  const handleNavigateToContact = () => {
    setIsNavigatingToContact(true);
    setTimeout(() => {
      navigateToContact();
    }, 300);
  };

  const handleOpenResume = () => {
    setIsOpeningResume(true);
    setTimeout(() => {
      openResume();
      setIsOpeningResume(false);
    }, 300);
  };

  return (
    <div className="page-content home-page">
      <div className="home-container">
        {/* Hero Section */}
        <section
          className="hero-section"
          role="banner"
          aria-label="Hero section"
        >
          <div className="hero-content">
            <h1 className="hero-title">
              {!hasShownHomeIntro ? (
                <TypeWriterText
                  text="Hello, I'm a Full-Stack Developer"
                  speed={80}
                  onComplete={() => {
                    setHasShownHomeIntro(true);
                    localStorage.setItem("home-intro-shown", "true");
                  }}
                />
              ) : (
                "Hello, I'm a Full-Stack Developer"
              )}
            </h1>
            <div className="hero-subtitle" role="doc-subtitle">
              {!hasShownHomeIntro ? (
                <TypeWriterText
                  text="Building production-ready systems with modern technologies"
                  delay={2000}
                  speed={60}
                  onComplete={() => {
                    setHasShownHomeIntro(true);
                    localStorage.setItem("home-intro-shown", "true");
                  }}
                />
              ) : (
                "Building production-ready systems with modern technologies"
              )}
            </div>
            <p className="hero-description">
              I specialize in creating scalable, high-performance applications
              across the full stack. From enterprise-grade Go services to modern
              React applications, I bring ideas to life with clean code, robust
              architecture, and exceptional user experiences.
            </p>
            <div
              className="hero-buttons"
              role="group"
              aria-label="Primary actions"
            >
              <button
                className="btn btn-primary"
                onClick={handleNavigateToProjects}
                disabled={isNavigatingToProjects}
                aria-label="View my projects and work portfolio"
              >
                {isNavigatingToProjects ? "Loading..." : "View My Work"}
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleOpenResume}
                disabled={isOpeningResume}
                aria-label="Download my resume in a new tab"
              >
                {isOpeningResume ? "Opening..." : "Download Resume"}
              </button>
            </div>
          </div>
        </section>

        {/* Featured Projects Section */}
        <section
          className="featured-projects-section"
          role="region"
          aria-labelledby="featured-projects-title"
        >
          <h2 id="featured-projects-title" className="section-title">
            Featured Projects
          </h2>
          <div className="featured-projects-grid">
            {featuredProjects.map((project) => (
              <div key={project.title} className="featured-project-card">
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
                  {project.tech.map((tech, techIndex) => (
                    <span key={techIndex} className="tech-tag">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="featured-projects-cta">
            <button
              className="btn btn-outline"
              onClick={handleNavigateToProjects}
              disabled={isNavigatingToProjects}
              aria-label="View all projects"
            >
              {isNavigatingToProjects ? "Loading..." : "View All Projects →"}
            </button>
          </div>
        </section>

        {/* Skills Section */}
        <section
          className="skills-section"
          role="region"
          aria-labelledby="skills-title"
        >
          <h2 id="skills-title" className="section-title">
            Technologies I Work With
          </h2>
          <div className="skills-categories">
            {skillCategories.map((category) => (
              <div key={category} className="skill-category">
                <h3 className="category-title">{category}</h3>
                <ul className="skills-grid" aria-label={`${category} skills`}>
                  {skills
                    .filter((skill) => skill.category === category)
                    .map((skill, index) => (
                      <SkillItem
                        key={skill.name}
                        name={skill.name}
                        icon={skill.icon}
                        index={index}
                      />
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* About Section */}
        <section
          className="about-section"
          role="region"
          aria-labelledby="about-title"
        >
          <div className="about-content">
            <h2 id="about-title" className="section-title">
              What I Do
            </h2>
            <ul className="about-grid" aria-label="Service areas">
              <li className="about-card">
                <div className="card-icon" aria-hidden="true">
                  ⚙️
                </div>
                <h3>Backend & Systems Architecture</h3>
                <p>
                  Designing scalable architectures with Go, Python, and .NET.
                  Building production-ready services with Redis, PostgreSQL, and
                  automated CI/CD pipelines. Creating HIPAA-compliant systems
                  and enterprise integrations.
                </p>
              </li>
              <li className="about-card">
                <div className="card-icon" aria-hidden="true">
                  🎨
                </div>
                <h3>Frontend & User Experience</h3>
                <p>
                  Crafting modern web applications with React, TypeScript, and
                  Next.js. Implementing responsive designs with Tailwind CSS,
                  smooth animations with Framer Motion, and interactive 3D
                  experiences with Three.js.
                </p>
              </li>
              <li className="about-card">
                <div className="card-icon" aria-hidden="true">
                  🚀
                </div>
                <h3>DevOps & Infrastructure</h3>
                <p>
                  Deploying with Docker, GitHub Actions, and cloud platforms.
                  Managing production environments with Nginx, monitoring
                  systems, and automated testing. Ensuring high availability and
                  performance optimization.
                </p>
              </li>
              <li className="about-card">
                <div className="card-icon" aria-hidden="true">
                  🤖
                </div>
                <h3>Automation & AI</h3>
                <p>
                  Building sophisticated automation systems with Python and
                  Playwright. Creating intelligent bots with state management,
                  Slack integration, and advanced retry logic for reliable
                  production systems.
                </p>
              </li>
            </ul>
          </div>
        </section>

        {/* CTA Section */}
        <section
          className="cta-section"
          role="region"
          aria-labelledby="cta-title"
        >
          <div className="cta-content">
            <h2 id="cta-title">Ready to Build Something Amazing?</h2>
            <p>
              Let's discuss how we can bring your ideas to life with modern
              technologies and best practices
            </p>
            <button
              className="btn btn-primary btn-large"
              onClick={handleNavigateToContact}
              disabled={isNavigatingToContact}
              aria-label="Contact me to start a project"
            >
              {isNavigatingToContact ? "Loading..." : "Get In Touch"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
