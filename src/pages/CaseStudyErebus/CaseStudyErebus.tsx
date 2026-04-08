import CaseStudyPage from "../../components/CaseStudyPage";
import { caseStudyBySlug } from "../../data/caseStudies";

const CaseStudyErebus = () => {
  return <CaseStudyPage caseStudy={caseStudyBySlug.erebus} />;
};

export default CaseStudyErebus;
