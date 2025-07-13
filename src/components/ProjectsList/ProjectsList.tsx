import "./ProjectsList.css";
import ProjectDetails from "../ProjectDetails";

const ProjectsList = () => {
  return (
    <div className="projects-list-content">
      <ul className="projects-directory">
        <li className="item">
          <ProjectDetails
            smallText="July 2024 / Portfolio"
            largeText="WORKFOLIO"
            url={"https://github.com/kareemsasa3/workfolio"}
          />
        </li>
        <li className="item">
          <ProjectDetails
            smallText="Jan. 2024 / E-Commerce"
            largeText="CURATED COLLECTIBLES"
            url={"https://github.com/kareemsasa3/react-ecommerce"}
          />
        </li>
        <li className="item">
          <ProjectDetails
            smallText="Jan. 2023 / Freelance"
            largeText="KING OF DIAMONDS"
            url={"https://github.com/kareemsasa3/KingOfDiamonds"}
          />
        </li>
        <li className="item">
          <ProjectDetails
            smallText="Dec. 2022 / Contributor"
            largeText="FACE MASK DETECTOR"
            url={"https://github.com/kareemsasa3/face-mask-detector"}
          />
        </li>
        <li className="item">
          <ProjectDetails
            smallText="June 2022 / Freelance"
            largeText="PATIENT MANAGEMENT"
            url={"https://github.com/kareemsasa3/patient-management-system"}
          />
        </li>
      </ul>
    </div>
  );
};

export default ProjectsList;
