import React from "react";
import "./WorkDetails.css";
import { WorkExperience } from "../../data/workExperience";

type WorkDetailsProps = WorkExperience;

const WorkDetails: React.FC<WorkDetailsProps> = ({
  company,
  role,
  dates,
  description,
  techStack,
  location,
  highlights,
  achievements,
  projects,
}) => {
  return (
    <div className="work-details-container">
      <div className="work-header">
        <div className="work-dates">{dates}</div>
        <div className="work-company-info">
          <h3 className="work-company">{company}</h3>
          <div className="work-role">{role}</div>
          {location && <div className="work-location">{location}</div>}
        </div>
      </div>

      <div className="work-content">
        <div className="work-description">
          <h4 className="section-title">Key Responsibilities</h4>
          <ul className="work-achievements">
            {description.map((achievement, index) => (
              <li key={index} className="achievement-item">
                {achievement}
              </li>
            ))}
          </ul>
        </div>

        {achievements && achievements.length > 0 && (
          <div className="work-achievements-section">
            <h4 className="section-title">Key Achievements</h4>
            <ul className="work-achievements">
              {achievements.map((achievement, index) => (
                <li key={index} className="achievement-item">
                  {achievement}
                </li>
              ))}
            </ul>
          </div>
        )}

        {projects && projects.length > 0 && (
          <div className="work-projects-section">
            <h4 className="section-title">Notable Projects</h4>
            <ul className="work-projects">
              {projects.map((project, index) => (
                <li key={index} className="project-item">
                  {project}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="work-tech-stack">
          <h4 className="tech-stack-title">Technologies</h4>
          <div className="tech-tags">
            {techStack.map((tech, index) => (
              <span key={index} className="tech-tag">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {highlights && highlights.length > 0 && (
          <div className="work-highlights">
            <h4 className="highlights-title">Key Highlights</h4>
            <div className="highlights-tags">
              {highlights.map((highlight, index) => (
                <span key={index} className="highlight-tag">
                  {highlight}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkDetails;
