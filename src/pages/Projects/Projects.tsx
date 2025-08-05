import FocusTrap from "focus-trap-react";
import { useState, useEffect } from "react";
import "./Projects.css";
import ProjectsList from "../../components/ProjectsList";
import TerminalDropdown from "../../components/TerminalDropdown";
import { useProjects } from "./useProjects";

// Import the type for proper type safety
type SortByType = "date" | "complexity" | "name" | "category";

const Projects = () => {
  const { state, data, stats, handlers, projectsFoundMessage, SORT_OPTIONS } =
    useProjects();

  // Local UI state for modal management
  const [isTechStackVisible, setIsTechStackVisible] = useState(false);

  // Handle Escape key for modal accessibility
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsTechStackVisible(false);
      }
    };

    if (isTechStackVisible) {
      document.addEventListener("keydown", handleKeyDown);
    }

    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isTechStackVisible]);

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
                options={data.categories}
                value={state.category}
                onChange={(value) =>
                  handlers.handleFilterChange("category", value)
                }
                label="filter --category:"
                placeholder="Select category"
              />
            </div>

            <div className="filter-group">
              <TerminalDropdown
                options={data.complexities}
                value={state.complexity}
                onChange={(value) =>
                  handlers.handleFilterChange("complexity", value)
                }
                label="filter --complexity:"
                placeholder="Select complexity"
              />
            </div>

            <div className="filter-group">
              <TerminalDropdown
                options={data.statuses}
                value={state.status}
                onChange={(value) =>
                  handlers.handleFilterChange("status", value)
                }
                label="filter --status:"
                placeholder="Select status"
              />
            </div>
          </div>

          <div className="sort-section">
            <TerminalDropdown
              options={SORT_OPTIONS}
              value={state.sortBy}
              onChange={(value) =>
                handlers.handleSortChange(value as SortByType)
              }
              label="sort --by:"
              placeholder="Select sort option"
            />
          </div>
        </div>

        {/* Project Statistics - Clickable Filters */}
        <div className="projects-stats">
          <button
            className="stat-card"
            onClick={handlers.handleShowAllProjects}
            aria-pressed={
              state.category === "All" &&
              state.complexity === "All" &&
              state.status === "All"
            }
            title="Click to show all projects"
          >
            <span className="stat-number">
              {data.filteredAndSortedProjects.length}
            </span>
            <span className="stat-label">
              <span className="terminal-prompt">$</span> wc -l projects
            </span>
          </button>
          <button
            className="stat-card"
            onClick={handlers.handleShowExpertProjects}
            aria-pressed={state.complexity === "Expert"}
            title="Click to show Expert level projects"
          >
            <span className="stat-number">{stats.expertProjectCount}</span>
            <span className="stat-label">
              <span className="terminal-prompt">$</span> grep "Expert" projects
            </span>
          </button>
          <button
            className="stat-card"
            onClick={handlers.handleShowLiveProjects}
            aria-pressed={state.status === "Live"}
            title="Click to show Live projects"
          >
            <span className="stat-number">{stats.liveProjectCount}</span>
            <span className="stat-label">
              <span className="terminal-prompt">$</span> grep "Live" projects
            </span>
          </button>
          <button
            className="stat-card"
            onClick={() => setIsTechStackVisible(true)}
            aria-pressed={isTechStackVisible}
            title="Click to view all technologies"
          >
            <span className="stat-number">{data.allTechnologies.length}</span>
            <span className="stat-label">
              <span className="terminal-prompt">$</span> uniq tech-stack
            </span>
          </button>
        </div>

        {/* Tech Stack Modal */}
        {isTechStackVisible && (
          <FocusTrap>
            <div
              className="tech-stack-modal"
              onClick={() => setIsTechStackVisible(false)}
            >
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
                    onClick={() => setIsTechStackVisible(false)}
                    aria-label="Close technology list"
                  >
                    <span className="terminal-prompt">$</span> exit
                  </button>
                </div>
                <div className="tech-stack-grid">
                  {data.allTechnologies.map((tech) => (
                    <div key={tech} className="tech-item">
                      <span className="tech-name">{tech}</span>
                      <span className="tech-count">
                        ({stats.techProjectCounts.get(tech) || 0} projects)
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

          {data.filteredAndSortedProjects.length > 0 ? (
            <div className="terminal-output">
              <div className="terminal-line">
                <span className="terminal-prompt">$</span> cat projects/*.json |
                jq '.title'
              </div>
              <ProjectsList projects={data.filteredAndSortedProjects} />
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
