import "./Work.css";
import { motion } from "framer-motion";
import { workExperienceData } from "../../data/workExperience";
import WorkDetails from "../../components/WorkDetails";
import React, { useEffect } from "react";
import { useLayoutContext, PageSection } from "../../contexts/LayoutContext";

// Create sections outside the component to prevent recreation on every render
const workSections: PageSection[] = workExperienceData.map((exp) => ({
  id: `work-${exp.id}`,
  label: exp.company,
}));

const Work = () => {
  console.log(
    "Work component rendering, data length:",
    workExperienceData?.length
  );

  // Check if data is available
  if (!workExperienceData || workExperienceData.length === 0) {
    return (
      <motion.div
        className="page-content work-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>Loading work experience data...</div>
      </motion.div>
    );
  }

  // Get the section management from our context
  const { setSections } = useLayoutContext();

  // Announce our sections when the component mounts
  useEffect(() => {
    setSections(workSections);
  }, [setSections, workSections]);

  return (
    <motion.div
      className="page-content work-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <header className="work-header">
        <h1 className="work-title">Work Experience</h1>
      </header>
      <div className="work-timeline-container">
        {workExperienceData.map((exp, index) => (
          <React.Fragment key={exp.id}>
            <div className="timeline-item">
              <div
                className={`timeline-node ${exp.type
                  .toLowerCase()
                  .replace("/", "-")}`}
              ></div>
              {index < workExperienceData.length - 1 && (
                <div className="timeline-line"></div>
              )}
            </div>
            <div id={`work-${exp.id}`} className="timeline-content">
              <WorkDetails {...exp} />
            </div>
          </React.Fragment>
        ))}
      </div>
    </motion.div>
  );
};

export default Work;
