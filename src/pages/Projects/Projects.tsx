import { useState, useMemo, useReducer } from "react";
import "./Projects.css";
import ProjectsList from "../../components/ProjectsList";
import {
  projectsData,
  complexityOrder,
  COMPLEXITY_LEVELS,
  STATUSES,
  CATEGORIES,
} from "../../data/projects";

// State interface for better type safety
interface ProjectsState {
  category: string;
  complexity: string;
  status: string;
  sortBy: string;
  showTechStack: boolean;
}

// Action types for useReducer
type ProjectsAction =
  | {
      type: "SET_FILTER";
      payload: {
        filterName: keyof Pick<
          ProjectsState,
          "category" | "complexity" | "status"
        >;
        value: string;
      };
    }
  | { type: "SET_SORT"; payload: string }
  | { type: "TOGGLE_TECH_STACK" }
  | { type: "RESET_FILTERS" }
  | {
      type: "APPLY_QUICK_FILTER";
      payload: {
        filterName: keyof Pick<
          ProjectsState,
          "category" | "complexity" | "status"
        >;
        value: string;
      };
    };

// Initial state
const initialState: ProjectsState = {
  category: "All",
  complexity: "All",
  status: "All",
  sortBy: "date",
  showTechStack: false,
};

// Reducer function
function projectsReducer(
  state: ProjectsState,
  action: ProjectsAction
): ProjectsState {
  switch (action.type) {
    case "SET_FILTER":
      return { ...state, [action.payload.filterName]: action.payload.value };
    case "SET_SORT":
      return { ...state, sortBy: action.payload };
    case "TOGGLE_TECH_STACK":
      return { ...state, showTechStack: !state.showTechStack };
    case "RESET_FILTERS":
      return { ...state, category: "All", complexity: "All", status: "All" };
    case "APPLY_QUICK_FILTER":
      // Reset all filters first, then apply the specific filter
      return {
        ...state,
        category: "All",
        complexity: "All",
        status: "All",
        [action.payload.filterName]: action.payload.value,
      };
    default:
      throw new Error(`Unknown action type: ${(action as any).type}`);
  }
}

const Projects = () => {
  const [state, dispatch] = useReducer(projectsReducer, initialState);
  const { category, complexity, status, sortBy, showTechStack } = state;

  // Get unique categories, complexities, and statuses
  const categories = useMemo(() => {
    const cats = [...new Set(projectsData.map((p) => p.category))];
    return ["All", ...cats];
  }, []);

  const complexities = useMemo(() => {
    return ["All", ...COMPLEXITY_LEVELS];
  }, []);

  const statuses = useMemo(() => {
    return ["All", ...STATUSES];
  }, []);

  // Get all unique technologies
  const allTechnologies = useMemo(() => {
    const techSet = new Set<string>();
    projectsData.forEach((project) => {
      project.techStack.forEach((tech) => techSet.add(tech));
    });
    return Array.from(techSet).sort();
  }, []);

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projectsData.filter((project) => {
      const categoryMatch = category === "All" || project.category === category;
      const complexityMatch =
        complexity === "All" || project.complexity === complexity;
      const statusMatch = status === "All" || project.status === status;
      return categoryMatch && complexityMatch && statusMatch;
    });

    // Sort projects
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "complexity":
          return complexityOrder[b.complexity] - complexityOrder[a.complexity];
        case "name":
          return a.title.localeCompare(b.title);
        case "category":
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    return filtered;
  }, [category, complexity, status, sortBy]);

  // Event handlers using dispatch
  const handleFilterChange = (
    filterName: keyof Pick<ProjectsState, "category" | "complexity" | "status">,
    value: string
  ) => {
    dispatch({ type: "SET_FILTER", payload: { filterName, value } });
  };

  const handleSortChange = (value: string) => {
    dispatch({ type: "SET_SORT", payload: value });
  };

  const handleShowAllProjects = () => {
    dispatch({ type: "RESET_FILTERS" });
  };

  const handleShowExpertProjects = () => {
    dispatch({
      type: "APPLY_QUICK_FILTER",
      payload: { filterName: "complexity", value: "Expert" },
    });
  };

  const handleShowLiveProjects = () => {
    dispatch({
      type: "APPLY_QUICK_FILTER",
      payload: { filterName: "status", value: "Live" },
    });
  };

  const handleShowTechStack = () => {
    dispatch({ type: "TOGGLE_TECH_STACK" });
  };

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
              <label htmlFor="category-filter">
                <span className="terminal-prompt">$</span> filter --category:
              </label>
              <select
                id="category-filter"
                value={category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="filter-select"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="complexity-filter">
                <span className="terminal-prompt">$</span> filter --complexity:
              </label>
              <select
                id="complexity-filter"
                value={complexity}
                onChange={(e) =>
                  handleFilterChange("complexity", e.target.value)
                }
                className="filter-select"
              >
                {complexities.map((complexity) => (
                  <option key={complexity} value={complexity}>
                    {complexity}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="status-filter">
                <span className="terminal-prompt">$</span> filter --status:
              </label>
              <select
                id="status-filter"
                value={status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="filter-select"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="sort-section">
            <label htmlFor="sort-select">
              <span className="terminal-prompt">$</span> sort --by:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="sort-select"
            >
              <option value="date">Date (Newest)</option>
              <option value="complexity">Complexity</option>
              <option value="name">Name</option>
              <option value="category">Category</option>
            </select>
          </div>
        </div>

        {/* Project Statistics - Clickable Filters */}
        <div className="projects-stats">
          <div
            className={`stat-card ${
              category === "All" && complexity === "All" && status === "All"
                ? "active"
                : ""
            }`}
            onClick={handleShowAllProjects}
            title="Click to show all projects"
          >
            <span className="stat-number">
              {filteredAndSortedProjects.length}
            </span>
            <span className="stat-label">
              <span className="terminal-prompt">$</span> wc -l projects
            </span>
          </div>
          <div
            className={`stat-card ${complexity === "Expert" ? "active" : ""}`}
            onClick={handleShowExpertProjects}
            title="Click to show Expert level projects"
          >
            <span className="stat-number">
              {projectsData.filter((p) => p.complexity === "Expert").length}
            </span>
            <span className="stat-label">
              <span className="terminal-prompt">$</span> grep "Expert" projects
            </span>
          </div>
          <div
            className={`stat-card ${status === "Live" ? "active" : ""}`}
            onClick={handleShowLiveProjects}
            title="Click to show Live projects"
          >
            <span className="stat-number">
              {projectsData.filter((p) => p.status === "Live").length}
            </span>
            <span className="stat-label">
              <span className="terminal-prompt">$</span> grep "Live" projects
            </span>
          </div>
          <div
            className={`stat-card ${showTechStack ? "active" : ""}`}
            onClick={handleShowTechStack}
            title="Click to view all technologies"
          >
            <span className="stat-number">{allTechnologies.length}</span>
            <span className="stat-label">
              <span className="terminal-prompt">$</span> uniq tech-stack
            </span>
          </div>
        </div>

        {/* Tech Stack Modal */}
        {showTechStack && (
          <div className="tech-stack-modal" onClick={handleShowTechStack}>
            <div
              className="tech-stack-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="tech-stack-header">
                <h3>
                  <span className="terminal-prompt">$</span> cat tech-stack.txt
                </h3>
                <button
                  className="close-tech-stack"
                  onClick={handleShowTechStack}
                  title="Close technology list"
                >
                  <span className="terminal-prompt">$</span> exit
                </button>
              </div>
              <div className="tech-stack-grid">
                {allTechnologies.map((tech, index) => (
                  <div key={tech} className="tech-item">
                    <span className="tech-name">{tech}</span>
                    <span className="tech-count">
                      (
                      {
                        projectsData.filter((p) => p.techStack.includes(tech))
                          .length
                      }{" "}
                      projects)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Projects List */}
        <div className="projects-content">
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
