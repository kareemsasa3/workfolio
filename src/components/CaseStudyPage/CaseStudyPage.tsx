import { Link } from "react-router-dom";
import { useEffect, useMemo } from "react";
import TypeWriterText from "../TypeWriterText";
import { CaseStudy } from "../../data/caseStudies";
import { useLayoutContext, PageSection } from "../../contexts/LayoutContext";
import "./CaseStudyPage.css";

interface CaseStudyPageProps {
  caseStudy: CaseStudy;
}

const sectionDefinitions: PageSection[] = [
  { id: "hero", label: "Hero" },
  { id: "problem", label: "Problem" },
  { id: "constraints", label: "Constraints" },
  { id: "architecture", label: "Architecture" },
  { id: "decisions", label: "Decisions" },
  { id: "implementation", label: "Implementation" },
  { id: "outcome", label: "Outcome" },
  { id: "links", label: "Links" },
];

const CaseStudyPage = ({ caseStudy }: CaseStudyPageProps) => {
  const { setSections } = useLayoutContext();
  const sections = useMemo(() => sectionDefinitions, []);

  useEffect(() => {
    setSections(sections);
    return () => setSections([]);
  }, [sections, setSections]);

  return (
    <div className="page-content case-study-page">
      <div className="case-study-container">
        <section id="hero" className="case-study-hero interactive-card">
          <div className="case-study-breadcrumbs">
            <Link to="/case-studies">Case Studies</Link>
            <span>/</span>
            <span>{caseStudy.title}</span>
          </div>
          <header className="case-study-hero-copy">
            <p className="case-study-eyebrow">Engineering Case Study</p>
            <h1 className="case-study-title">
              <TypeWriterText text={caseStudy.title} speed={60} />
            </h1>
            <p className="case-study-summary">{caseStudy.shortDescription}</p>
          </header>
          <div className="case-study-focus-list">
            {caseStudy.focusAreas.map((focusArea) => (
              <span key={focusArea} className="tech-tag">
                {focusArea}
              </span>
            ))}
          </div>
        </section>

        <section id="problem" className="case-study-section interactive-card">
          <h2>Problem</h2>
          <p>{caseStudy.problem}</p>
        </section>

        <section id="constraints" className="case-study-section">
          <h2>Constraints</h2>
          <div className="case-study-grid case-study-constraints-grid">
            <article className="interactive-card">
              <h3>Technical Limitations</h3>
              <p>{caseStudy.constraints.technicalLimitations}</p>
            </article>
            <article className="interactive-card">
              <h3>Environment</h3>
              <p>{caseStudy.constraints.environment}</p>
            </article>
            <article className="interactive-card">
              <h3>Tradeoffs</h3>
              <p>{caseStudy.constraints.tradeoffs}</p>
            </article>
          </div>
        </section>

        <section id="architecture" className="case-study-section interactive-card">
          <h2>Architecture</h2>
          <ul className="case-study-list">
            {caseStudy.architecture.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section id="decisions" className="case-study-section">
          <h2>Key Technical Decisions</h2>
          <div className="case-study-grid">
            {caseStudy.keyTechnicalDecisions.map((decision) => (
              <article key={decision.title} className="interactive-card">
                <h3>{decision.title}</h3>
                <p>{decision.rationale}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="implementation" className="case-study-section">
          <h2>Implementation Highlights</h2>
          <div className="case-study-grid">
            {caseStudy.implementationHighlights.map((highlight) => (
              <article key={highlight.title} className="interactive-card">
                <h3>{highlight.title}</h3>
                <p>{highlight.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="outcome" className="case-study-section interactive-card">
          <h2>Outcome</h2>
          <ul className="case-study-list">
            {caseStudy.outcome.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section id="links" className="case-study-section interactive-card">
          <h2>Links</h2>
          <div className="case-study-links">
            {caseStudy.links.map((link) => {
              if (link.unavailable) {
                return (
                  <div key={link.label} className="case-study-link disabled">
                    <span>{link.label}</span>
                    <span>Not public yet</span>
                  </div>
                );
              }

              if (link.external) {
                return (
                  <a
                    key={link.label}
                    className="case-study-link"
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span>{link.label}</span>
                    <span>Open</span>
                  </a>
                );
              }

              return (
                <Link key={link.label} className="case-study-link" to={link.href}>
                  <span>{link.label}</span>
                  <span>View</span>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CaseStudyPage;
