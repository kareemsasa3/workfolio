import { useState, useMemo } from "react";
import "./Projects.css";
import ProjectsList from "../../components/ProjectsList";
import { projectsData } from "../../data/projects";

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedComplexity, setSelectedComplexity] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("date");

  // Get unique categories, complexities, and statuses
  const categories = useMemo(() => {
    const cats = [...new Set(projectsData.map((p) => p.category))];
    return ["All", ...cats];
  }, []);

  const complexities = useMemo(() => {
    const comps = [...new Set(projectsData.map((p) => p.complexity))];
    return ["All", ...comps];
  }, []);

  const statuses = useMemo(() => {
    const stats = [...new Set(projectsData.map((p) => p.status))];
    return ["All", ...stats];
  }, []);

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projectsData.filter((project) => {
      const categoryMatch =
        selectedCategory === "All" || project.category === selectedCategory;
      const complexityMatch =
        selectedComplexity === "All" ||
        project.complexity === selectedComplexity;
      const statusMatch =
        selectedStatus === "All" || project.status === selectedStatus;
      return categoryMatch && complexityMatch && statusMatch;
    });

    // Sort projects
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "complexity":
          const complexityOrder = {
            Expert: 4,
            Advanced: 3,
            Intermediate: 2,
            Beginner: 1,
          };
          return (
            complexityOrder[b.complexity as keyof typeof complexityOrder] -
            complexityOrder[a.complexity as keyof typeof complexityOrder]
          );
        case "name":
          return a.title.localeCompare(b.title);
        case "category":
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    return filtered;
  }, [selectedCategory, selectedComplexity, selectedStatus, sortBy]);

  return (
    <div className="page-content">
      <div className="projects-container">
        <header className="projects-header">
          <h1 className="projects-title">My Projects</h1>
          <p className="projects-subtitle">
            A showcase of my technical expertise across multiple domains and
            technologies
          </p>
        </header>

        {/* Filters and Sorting */}
        <div className="projects-controls">
          <div className="filters-section">
            <div className="filter-group">
              <label htmlFor="category-filter">Category:</label>
              <select
                id="category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
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
              <label htmlFor="complexity-filter">Complexity:</label>
              <select
                id="complexity-filter"
                value={selectedComplexity}
                onChange={(e) => setSelectedComplexity(e.target.value)}
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
              <label htmlFor="status-filter">Status:</label>
              <select
                id="status-filter"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
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
            <label htmlFor="sort-select">Sort by:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="date">Date (Newest)</option>
              <option value="complexity">Complexity</option>
              <option value="name">Name</option>
              <option value="category">Category</option>
            </select>
          </div>
        </div>

        {/* Project Statistics */}
        <div className="projects-stats">
          <div className="stat-card">
            <span className="stat-number">
              {filteredAndSortedProjects.length}
            </span>
            <span className="stat-label">Projects</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">
              {projectsData.filter((p) => p.complexity === "Expert").length}
            </span>
            <span className="stat-label">Expert Level</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">
              {projectsData.filter((p) => p.status === "Live").length}
            </span>
            <span className="stat-label">Live Projects</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">
              {new Set(projectsData.flatMap((p) => p.techStack)).size}
            </span>
            <span className="stat-label">Technologies</span>
          </div>
        </div>

        {/* Projects List */}
        <div className="projects-content">
          {filteredAndSortedProjects.length > 0 ? (
            <ProjectsList projects={filteredAndSortedProjects} />
          ) : (
            <div className="no-projects">
              <h3>No projects found</h3>
              <p>Try adjusting your filters to see more projects.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;
