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

  // Create a flat list of all events with their global index.
  // Memoize this as well, as it's a derived calculation.
  const flatEvents = useMemo(() => {
    return eraNames.flatMap((eraName) => eras[eraName]);
  }, [eras, eraNames]);

  useEffect(() => {
    // Dynamically generate sections from our era names (excluding intro)
    const journeySections: PageSection[] = eraNames.map((name) => ({
      id: name.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-"),
      label: name,
    }));

    setSections(journeySections);

    return () => setSections([]);
  }, [eraNames]); // Only depends on eraNames - setSections is stable

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
              // Find the global index of the current item in the flat list.
              // This is a pure calculation based on props and state.
              const globalIndex = flatEvents.findIndex((e) => e.id === item.id);
              const isLeft = globalIndex % 2 === 0;
              return <TimelineItem key={item.id} data={item} isLeft={isLeft} />;
            })}
          </section>
        ))}
      </div>
    </motion.div>
  );
};

export default Journey;
