import CaseStudyPage from "../../components/CaseStudyPage";
import { caseStudyBySlug } from "../../data/caseStudies";

const CaseStudyArachne = () => {
  return <CaseStudyPage caseStudy={caseStudyBySlug.arachne} />;
};

export default CaseStudyArachne;
