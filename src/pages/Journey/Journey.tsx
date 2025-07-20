import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { timelineData, TimelineEvent } from "../../data/timelineData";
import TimelineItem from "../../components/TimelineItem";
import TypeWriterText from "../../components/TypeWriterText";
import { useLayoutContext, PageSection } from "../../contexts/LayoutContext";
import "./Journey.css";

// Helper function to group events by era
const groupEventsByEra = (events: TimelineEvent[]) => {
  return events.reduce((acc, event) => {
    const { era } = event;
    if (!acc[era]) {
      acc[era] = [];
    }
    acc[era].push(event);
    return acc;
  }, {} as Record<string, TimelineEvent[]>);
};

const Journey = () => {
  const { setSections } = useLayoutContext();

  // Group the timeline data by era. useMemo prevents recalculating on every render.
  const eras = useMemo(() => groupEventsByEra(timelineData), []);
  const eraNames = useMemo(() => Object.keys(eras), [eras]);

  useEffect(() => {
    // Dynamically generate sections from our era names (excluding intro)
    const journeySections: PageSection[] = eraNames.map((name) => ({
      id: name.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-"),
      label: name,
    }));

    setSections(journeySections);

    return () => setSections([]);
  }, [setSections, eraNames]);

  let eventCounter = 0; // To keep track of the global index for `isLeft`

  return (
    <motion.div
      className="page-content journey-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <header id="journey-intro" className="journey-header">
        <h1 className="journey-title">
          <TypeWriterText text="MY JOURNEY" speed={80} delay={200} />
        </h1>
        <p className="journey-subtitle">
          <TypeWriterText
            text="A timeline of the key moments that have shaped my path as a developer and individual, from present to past."
            speed={50}
            delay={1000}
          />
        </p>
      </header>

      <div className="timeline-container">
        {eraNames.map((eraName) => (
          <section
            key={eraName}
            id={eraName.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}
            className="timeline-era"
          >
            <h2 className="timeline-era-header">{eraName}</h2>
            {eras[eraName].map((item) => {
              const isLeft = eventCounter % 2 === 0;
              eventCounter++;
              return <TimelineItem key={item.id} data={item} isLeft={isLeft} />;
            })}
          </section>
        ))}
      </div>
    </motion.div>
  );
};

export default Journey;
