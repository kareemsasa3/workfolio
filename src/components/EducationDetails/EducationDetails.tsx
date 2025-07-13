import React from "react";
import "./EducationDetails.css";

interface EducationDetailsProps {
  smallText: string;
  largeText: string;
}

const EducationDetails: React.FC<EducationDetailsProps> = ({
  smallText,
  largeText,
}) => {
  return (
    <div className="education-details-container">
      <div className="education-text large-font">{largeText}</div>
      <div className="education-text small-font">{smallText}</div>
    </div>
  );
};

export default EducationDetails;
