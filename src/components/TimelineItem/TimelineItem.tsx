import React from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TimelineEvent } from "../../data/timelineData";
import "./TimelineItem.css";

interface TimelineItemProps {
  data: TimelineEvent;
  isLeft: boolean;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ data, isLeft }) => {
  const { date, title, description, icon, category } = data;

  const itemVariants = {
    hidden: { opacity: 0, x: isLeft ? -100 : 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      className={`timeline-item ${isLeft ? "left" : "right"}`}
      variants={itemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
    >
      <div className={`timeline-icon-wrapper ${category}`}>
        <FontAwesomeIcon icon={icon} />
      </div>
      <div className="timeline-content">
        <span className="timeline-date">{date}</span>
        <h3 className="timeline-item-title">{title}</h3>
        <p className="timeline-item-description">{description}</p>
      </div>
    </motion.div>
  );
};

export default TimelineItem;
