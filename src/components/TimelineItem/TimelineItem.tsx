import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TimelineEvent } from "../../data/timelineData";
import { useTheme } from "../../contexts/ThemeContext";
import "./TimelineItem.css";

interface TimelineItemProps {
  data: TimelineEvent;
  isLeft: boolean;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ data, isLeft }) => {
  const { date, title, description, icon, category, image } = data;
  const [isFlipped, setIsFlipped] = useState(false);
  const { theme } = useTheme();

  const itemVariants = {
    hidden: { opacity: 0, x: isLeft ? -100 : 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const flipVariants = {
    front: { rotateY: 0 },
    back: { rotateY: 180 },
  };

  const handleMouseEnter = () => {
    if (image) {
      setIsFlipped(true);
    }
  };

  const handleMouseLeave = () => {
    if (image) {
      setIsFlipped(false);
    }
  };

  // Get the appropriate image URL based on theme
  const getImageUrl = () => {
    if (!image) return null;
    if (typeof image === "string") return image;
    return theme === "dark" ? image.dark : image.light;
  };

  const imageUrl = getImageUrl();

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

      <div
        className={`timeline-flip-container ${imageUrl ? "has-image" : ""}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          className="timeline-flip-card"
          variants={flipVariants}
          animate={isFlipped ? "back" : "front"}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front of card */}
          <motion.div
            className="timeline-content timeline-front"
            style={{ backfaceVisibility: "hidden" }}
          >
            <span className="timeline-date">{date}</span>
            <h3 className="timeline-item-title">{title}</h3>
            <p className="timeline-item-description">{description}</p>
          </motion.div>

          {/* Back of card */}
          {imageUrl && (
            <motion.div
              className="timeline-content timeline-back"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            ></motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TimelineItem;
