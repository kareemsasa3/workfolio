import "./Home.css";
import TypeWriterText from "../../components/TypeWriterText";
import SkillItem from "../../components/SkillItem";
import { useNavigation } from "../../hooks/useNavigation";

// Define constants outside the component for better performance
const skills = [
  { name: "Python", icon: "🐍" },
  { name: "REST APIs", icon: "🔗" },
  { name: "React", icon: "⚛️" },
  { name: "Docker", icon: "🐳" },
  { name: "PostgreSQL", icon: "🐘" },
  { name: "Embedded Systems", icon: "🔧" },
  { name: "Azure", icon: "☁️" },
  { name: "GitHub Actions", icon: "⚡" },
  { name: "TypeScript", icon: "📘" },
  { name: "Next.js", icon: "▲" },
  { name: "MongoDB", icon: "🍃" },
  { name: "Linux", icon: "🐧" },
  { name: "HIPAA Compliance", icon: "🔒" },
  { name: ".NET", icon: "🟣" },
  { name: "Nginx", icon: "🌐" },
  { name: "Go", icon: "🐹" },
];

const Home = () => {
  const { navigateToProjects, navigateToContact, openResume } = useNavigation();

  return (
    <div className="page-content">
      <div className="home-container">
        {/* Hero Section */}
        <section
          className="hero-section"
          role="banner"
          aria-label="Hero section"
        >
          <div className="hero-content">
            <h1 className="hero-title">
              <TypeWriterText
                text="Hello, I'm a Full-Stack Developer"
                speed={80}
              />
            </h1>
            <div className="hero-subtitle" role="doc-subtitle">
              <TypeWriterText
                text="Crafting digital experiences with passion and precision"
                delay={2000}
                speed={60}
              />
            </div>
            <p className="hero-description">
              My journey in web development is driven by a desire to blend
              aesthetics with functionality, ensuring every project I undertake
              is both visually appealing and highly performant.
            </p>
            <div
              className="hero-buttons"
              role="group"
              aria-label="Primary actions"
            >
              <button
                className="btn btn-primary"
                onClick={navigateToProjects}
                aria-label="View my projects and work portfolio"
              >
                View My Work
              </button>
              <button
                className="btn btn-secondary"
                onClick={openResume}
                aria-label="Download my resume in a new tab"
              >
                Download Resume
              </button>
            </div>
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
          <ul className="skills-grid" aria-label="Technical skills">
            {skills.map((skill, index) => (
              <SkillItem
                key={skill.name}
                name={skill.name}
                icon={skill.icon}
                index={index}
              />
            ))}
          </ul>
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
                  Designing layered architectures with Python, .NET, Go, and
                  REST APIs. Building HIPAA-compliant systems, SharePoint
                  integrations, and event-driven microservices for enterprise
                  clients on Azure.
                </p>
              </li>
              <li className="about-card">
                <div className="card-icon" aria-hidden="true">
                  🔧
                </div>
                <h3>Automation & Hardware Integration</h3>
                <p>
                  Creating programmable car platforms, OBD-II data loggers, and
                  IoT solutions. From CAN bus sniffing to GPIO automation,
                  bridging software and hardware seamlessly.
                </p>
              </li>
              <li className="about-card">
                <div className="card-icon" aria-hidden="true">
                  🚀
                </div>
                <h3>DevOps & Infrastructure</h3>
                <p>
                  Deploying with Docker, GitHub Actions, and Linux systemd.
                  Managing cloud infrastructure on Azure and configuring
                  production-ready environments with Nginx.
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
            <h2 id="cta-title">Ready to Start a Project?</h2>
            <p>Let's discuss how we can bring your ideas to life</p>
            <button
              className="btn btn-primary btn-large"
              onClick={navigateToContact}
              aria-label="Contact me to start a project"
            >
              Get In Touch
            </button>
          </div>
        </section>
      </div>

      {/* Floating Action Button */}
      <button
        className="floating-action-btn"
        onClick={navigateToContact}
        aria-label="Quick contact - Get in touch"
        title="Get in touch"
      >
        💬
      </button>
    </div>
  );
};

export default Home;
