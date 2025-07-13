import "./Projects.css";
import ProjectsList from "../../components/ProjectsList";
import { projectsData } from "../../data/projects";

const Projects = () => {
  return (
    <div className="page-content">
      <h1 className="projects-title">Projects</h1>
      <ProjectsList projects={projectsData} />
    </div>
  );
};

export default Projects;
