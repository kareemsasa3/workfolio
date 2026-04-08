import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import TypeWriterText from "../../components/TypeWriterText";
import { caseStudyCards } from "../../data/caseStudies";
import { useLayoutContext, PageSection } from "../../contexts/LayoutContext";
import "../../components/CaseStudyPage/CaseStudyPage.css";

const caseStudiesSections: PageSection[] = [
  { id: "case-studies-overview", label: "Overview" },
  { id: "case-studies-list", label: "Case Studies" },
];

const CaseStudies = () => {
  const { setSections } = useLayoutContext();
  const sections = useMemo(() => caseStudiesSections, []);

  useEffect(() => {
    setSections(sections);
    return () => setSections([]);
  }, [sections, setSections]);

  return (
    <div className="page-content case-studies-page">
      <div className="case-study-container">
        <header id="case-studies-overview" className="case-studies-header">
          <p className="case-study-eyebrow">Engineering Narrative</p>
          <h1>
            <TypeWriterText text="Case Studies" speed={60} />
          </h1>
          <p>
            These pages document system shape, operating constraints, and the
            design decisions behind the strongest projects in the portfolio.
            They are meant to explain how the software works, not just list the
            stack.
          </p>
        </header>

        <section id="case-studies-list" className="case-studies-grid">
          {caseStudyCards.map((caseStudy) => (
            <Link
              key={caseStudy.slug}
              to={`/case-studies/${caseStudy.slug}`}
              className="case-study-card interactive-card"
            >
              <div className="case-study-card-header">
                <div>
                  <h3>{caseStudy.title}</h3>
                  <p>{caseStudy.shortDescription}</p>
                </div>
                <div className="case-study-card-meta">
                  <span
                    className={`complexity-badge ${caseStudy.project.complexity.toLowerCase()}`}
                  >
                    {caseStudy.project.complexity}
                  </span>
                  <span
                    className={`status-badge ${caseStudy.project.status.toLowerCase()}`}
                  >
                    {caseStudy.project.status}
                  </span>
                </div>
              </div>

              <div className="case-study-focus-list">
                {caseStudy.focusAreas.map((focusArea) => (
                  <span key={focusArea} className="tech-tag">
                    {focusArea}
                  </span>
                ))}
              </div>

              <div className="case-study-card-actions">
                <span className="case-study-card-link">Read case study →</span>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
};

export default CaseStudies;
