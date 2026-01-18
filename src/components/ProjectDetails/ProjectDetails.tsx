import React, { useState } from "react";
import "./ProjectDetails.css";
import { Project } from "../../data/projects";

interface ProjectDetailsProps {
  project: Project;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Expert":
        return "#ff6b6b";
      case "Advanced":
        return "#4ecdc4";
      case "Intermediate":
        return "#45b7d1";
      case "Beginner":
        return "#96ceb4";
      default:
        return "#ddd";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Live":
        return "#51cf66";
      case "Development":
        return "#ffd43b";
      case "Completed":
        return "#74c0fc";
      default:
        return "#ddd";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Live":
        return "🟢";
      case "Development":
        return "🟡";
      case "Completed":
        return "🔵";
      default:
        return "⚪";
    }
  };

  return (
    <div className={`project-card ${isExpanded ? "expanded" : ""}`}>
      <div
        className="project-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="project-main-info">
          <div className="project-category">{project.category}</div>
          <h3 className="project-title">{project.title}</h3>
          <div className="project-date">{project.date}</div>
        </div>

        <div className="project-status">
          <span
            className="status-badge"
            style={{ backgroundColor: getStatusColor(project.status) }}
          >
            {getStatusIcon(project.status)} {project.status}
          </span>
          <span
            className="complexity-badge"
            style={{ backgroundColor: getComplexityColor(project.complexity) }}
          >
            {project.complexity}
          </span>
          <button className="expand-btn">{isExpanded ? "−" : "+"}</button>
        </div>
      </div>

      {isExpanded && (
        <div className="project-details">
          <p className="project-description">{project.description}</p>

          <div className="project-tech-stack">
            <h4>Tech Stack</h4>
            <div className="tech-tags">
              {project.techStack.map((tech, index) => (
                <span key={index} className="tech-tag">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="project-features">
            <h4>Key Features</h4>
            <ul className="features-list">
              {project.features.map((feature, index) => (
                <li key={index} className="feature-item">
                  • {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="project-highlights">
            <h4>Highlights</h4>
            <div className="highlights-grid">
              {project.highlights.map((highlight, index) => (
                <span key={index} className="highlight-tag">
                  ✨ {highlight}
                </span>
              ))}
            </div>
          </div>

          <div className="project-links">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-link github-link"
              >
                📁 View Code
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-link live-link"
              >
                🌐 Live Demo
              </a>
            )}
            {project.url &&
              project.url !== "#" &&
              project.url !== project.githubUrl && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link primary-link"
                >
                  🔗 View Project
                </a>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
