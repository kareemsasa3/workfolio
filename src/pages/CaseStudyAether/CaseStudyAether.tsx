import CaseStudyPage from "../../components/CaseStudyPage";
import { caseStudyBySlug } from "../../data/caseStudies";

const CaseStudyAether = () => {
  return <CaseStudyPage caseStudy={caseStudyBySlug.aether} />;
};

export default CaseStudyAether;
