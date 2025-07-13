import React from "react";
import "./WorkDetails.css";

interface WorkDetailsProps {
  smallText: string;
  largeText: string;
}

const WorkDetails: React.FC<WorkDetailsProps> = ({ smallText, largeText }) => {
  return (
    <div className="work-details-container">
      <div className="work-text large-font">{largeText}</div>
      <div className="work-text small-font">{smallText}</div>
    </div>
  );
};

export default WorkDetails;
