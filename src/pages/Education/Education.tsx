import "./Education.css";
import EducationDetails from "../../components/EducationDetails";

const Education = () => {
  return (
    <div className="page-content">
      <div className="education-title">Education</div>
      <EducationDetails
        largeText="Bachelor of Science in Computer Science"
        smallText="University of Texas at San Antonio, 2017-2021"
      />
    </div>
  );
};

export default Education;
