import "./Resume.css";
import resume from "../../assets/resume.png";

const Resume = () => {
  return (
    <div className="page-content">
      <div className="resume-container">
        <img src={resume} alt="resume" className="resume-image" />
      </div>
    </div>
  );
};

export default Resume;
