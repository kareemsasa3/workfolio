import "./ProjectsList.css";
import ProjectDetails from "../ProjectDetails";
import { Project } from "../../data/projects";

interface ProjectsListProps {
  projects: Project[];
}

const ProjectsList = ({ projects }: ProjectsListProps) => {
  return (
    <div className="projects-list-content">
      <ul className="projects-directory">
        {projects.map((project) => (
          <li className="item" key={project.id}>
            <ProjectDetails project={project} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectsList;
