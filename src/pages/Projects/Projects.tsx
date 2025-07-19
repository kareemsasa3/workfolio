import FocusTrap from "focus-trap-react";
import "./Projects.css";
import ProjectsList from "../../components/ProjectsList";
import TerminalDropdown from "../../components/TerminalDropdown";
import { useProjects } from "./useProjects";

const Projects = () => {
  const {
    category,
    complexity,
    status,
    sortBy,
    showTechStack,
    filteredAndSortedProjects,
    categories,
    complexities,
    statuses,
    allTechnologies,
    expertProjectCount,
    liveProjectCount,
    techProjectCounts,
    projectsFoundMessage,
    SORT_OPTIONS,
    handleFilterChange,
    handleSortChange,
    handleShowAllProjects,
    handleShowExpertProjects,
    handleShowLiveProjects,
    handleShowTechStack,
  } = useProjects();

  return (
    <div className="page-content">
      <div className="projects-container">
        <header className="projects-header">
          <h1 className="projects-title">
            <span className="terminal-prompt">$</span> ls -la projects/
          </h1>
          <p className="projects-subtitle">
            <span className="terminal-comment">#</span> A showcase of my
            technical expertise across multiple domains and technologies
          </p>
        </header>

        {/* Filters and Sorting */}
        <div className="projects-controls">
          <div className="filters-section">
            <div className="filter-group">
              <TerminalDropdown
                options={categories}
                value={category}
                onChange={(value) => handleFilterChange("category", value)}
                label="filter --category:"
                placeholder="Select category"
              />
            </div>

            <div className="filter-group">
              <TerminalDropdown
                options={complexities}
                value={complexity}
                onChange={(value) => handleFilterChange("complexity", value)}
                label="filter --complexity:"
                placeholder="Select complexity"
              />
            </div>

            <div className="filter-group">
              <TerminalDropdown
                options={statuses}
                value={status}
                onChange={(value) => handleFilterChange("status", value)}
                label="filter --status:"
                placeholder="Select status"
              />
            </div>
          </div>

          <div className="sort-section">
            <TerminalDropdown
              options={SORT_OPTIONS.map((option) => option.label)}
              value={
                SORT_OPTIONS.find((option) => option.value === sortBy)?.label ||
                SORT_OPTIONS[0].label
              }
              onChange={(label) => {
                const selectedValue = SORT_OPTIONS.find(
                  (opt) => opt.label === label
                )?.value;
                if (selectedValue) {
                  handleSortChange(selectedValue);
                }
              }}
              label="sort --by:"
              placeholder="Select sort option"
            />
          </div>
        </div>

        {/* Project Statistics - Clickable Filters */}
        <div className="projects-stats">
          <button
            className={`stat-card ${
              category === "All" && complexity === "All" && status === "All"
                ? "active"
                : ""
            }`}
            onClick={handleShowAllProjects}
            aria-pressed={
              category === "All" && complexity === "All" && status === "All"
            }
            title="Click to show all projects"
          >
            <span className="stat-number">
              {filteredAndSortedProjects.length}
            </span>
            <span className="stat-label">
              <span className="terminal-prompt">$</span> wc -l projects
            </span>
          </button>
          <button
            className={`stat-card ${complexity === "Expert" ? "active" : ""}`}
            onClick={handleShowExpertProjects}
            aria-pressed={complexity === "Expert"}
            title="Click to show Expert level projects"
          >
            <span className="stat-number">{expertProjectCount}</span>
            <span className="stat-label">
              <span className="terminal-prompt">$</span> grep "Expert" projects
            </span>
          </button>
          <button
            className={`stat-card ${status === "Live" ? "active" : ""}`}
            onClick={handleShowLiveProjects}
            aria-pressed={status === "Live"}
            title="Click to show Live projects"
          >
            <span className="stat-number">{liveProjectCount}</span>
            <span className="stat-label">
              <span className="terminal-prompt">$</span> grep "Live" projects
            </span>
          </button>
          <button
            className={`stat-card ${showTechStack ? "active" : ""}`}
            onClick={handleShowTechStack}
            aria-pressed={showTechStack}
            title="Click to view all technologies"
          >
            <span className="stat-number">{allTechnologies.length}</span>
            <span className="stat-label">
              <span className="terminal-prompt">$</span> uniq tech-stack
            </span>
          </button>
        </div>

        {/* Tech Stack Modal */}
        {showTechStack && (
          <FocusTrap>
            <div className="tech-stack-modal" onClick={handleShowTechStack}>
              <div
                className="tech-stack-content"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="tech-stack-title"
              >
                <div className="tech-stack-header">
                  <h3 id="tech-stack-title">
                    <span className="terminal-prompt">$</span> cat
                    tech-stack.txt
                  </h3>
                  <button
                    className="close-tech-stack"
                    onClick={handleShowTechStack}
                    aria-label="Close technology list"
                  >
                    <span className="terminal-prompt">$</span> exit
                  </button>
                </div>
                <div className="tech-stack-grid">
                  {allTechnologies.map((tech) => (
                    <div key={tech} className="tech-item">
                      <span className="tech-name">{tech}</span>
                      <span className="tech-count">
                        ({techProjectCounts.get(tech) || 0} projects)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FocusTrap>
        )}

        {/* Projects List */}
        <div className="projects-content">
          {/* ARIA Live Region for announcing dynamic content changes */}
          <div
            className="visually-hidden"
            aria-live="polite"
            aria-atomic="true"
          >
            {projectsFoundMessage}
          </div>

          {filteredAndSortedProjects.length > 0 ? (
            <div className="terminal-output">
              <div className="terminal-line">
                <span className="terminal-prompt">$</span> cat projects/*.json |
                jq '.title'
              </div>
              <ProjectsList projects={filteredAndSortedProjects} />
            </div>
          ) : (
            <div className="no-projects">
              <h3>
                <span className="terminal-error">ERROR:</span> No projects found
              </h3>
              <p>
                <span className="terminal-comment">#</span> Try adjusting your
                filters to see more projects.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;
