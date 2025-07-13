import React from "react";
import "./ProjectDetails.css";

interface ProjectDetailsProps {
  smallText: string;
  largeText: string;
  url: string;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({
  smallText,
  largeText,
  url,
}) => {
  return (
    <div className="project-container">
      <div className="project-text large-font">
        <a
          className="project-link"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {largeText}
        </a>
      </div>
      <div className="project-text small-font">{smallText}</div>
    </div>
  );
};

export default ProjectDetails;
