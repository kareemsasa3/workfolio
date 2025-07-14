import "./WorkList.css";
import WorkDetails from "../WorkDetails";
import { workExperienceData } from "../../data/workExperience";

const WorkList = () => {
  return (
    <div className="work-list-content">
      <div className="work-experience-list">
        {workExperienceData.map((experience) => (
          <div key={experience.id} className="work-experience-item">
            <WorkDetails {...experience} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkList;
