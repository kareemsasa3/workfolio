import "./Work.css";
import { motion } from "framer-motion";
import { workExperienceData } from "../../data/workExperience";
import WorkDetails from "../../components/WorkDetails";
import React from "react";

// Animation variants
const nodeVariants = {
  hidden: { scale: 0 },
  visible: { scale: 1, transition: { duration: 0.4, ease: "backOut" } },
};

const lineVariants = {
  hidden: { height: 0 },
  visible: { height: "100%", transition: { duration: 0.6, ease: "easeIn" } },
};

const Work = () => {
  return (
    <div className="page-content">
      <h1 className="work-title">Work Experience</h1>
      <div className="work-timeline-container">
        {workExperienceData.map((exp, index) => (
          <React.Fragment key={exp.id}>
            <div className="timeline-item">
              <motion.div
                className={`timeline-node ${exp.type
                  .toLowerCase()
                  .replace("/", "-")}`}
                variants={nodeVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.8 }}
              ></motion.div>
              {index < workExperienceData.length - 1 && (
                <motion.div
                  className="timeline-line"
                  variants={lineVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                ></motion.div>
              )}
            </div>
            <motion.div
              className="timeline-content"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5 }}
            >
              <WorkDetails {...exp} />
            </motion.div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Work;
