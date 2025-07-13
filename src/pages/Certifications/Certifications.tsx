import "./Certifications.css";
import CertificationDetails from "../../components/CertificationDetails";

const Certifications = () => {
  return (
    <div className="page-content">
      <div className="certifications-title">Certifications</div>
      <CertificationDetails
        largeText="AWS Certified Solutions Architect"
        smallText="Amazon Web Services, 2023"
      />
    </div>
  );
};

export default Certifications;
