import React from "react";
import "./ProjectDetails.css";
import { Project } from "../../data/projects";

interface ProjectDetailsProps {
  project: Project;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project }) => {
  return (
    <div className="project-container">
      <a
        className="project-link"
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="project-category">{project.category}</div>
        <div className="project-text large-font">{project.title}</div>
        <div className="project-date">{project.date}</div>
      </a>
    </div>
  );
};

export default ProjectDetails;
