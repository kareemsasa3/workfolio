import React from "react";
import "./CertificationDetails.css";

interface CertificationDetailsProps {
  smallText: string;
  largeText: string;
}

const CertificationDetails: React.FC<CertificationDetailsProps> = ({
  smallText,
  largeText,
}) => {
  return (
    <div className="certification-details-container">
      <div className="certification-text large-font">{largeText}</div>
      <div className="certification-text small-font">{smallText}</div>
    </div>
  );
};

export default CertificationDetails;
