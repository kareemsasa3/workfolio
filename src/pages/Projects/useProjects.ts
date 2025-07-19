import { useMemo, useReducer, useCallback, useEffect } from "react";
import {
  projectsData,
  complexityOrder,
  COMPLEXITY_LEVELS,
  STATUSES,
} from "../../data/projects";

// Define explicit types for better type safety
type SortByType = "date" | "complexity" | "name" | "category";
type FilterableKeys = "category" | "complexity" | "status";

// State interface for better type safety
interface ProjectsState {
  category: string;
  complexity: string;
  status: string;
  sortBy: SortByType;
  showTechStack: boolean;
}

// Action types for useReducer
type ProjectsAction =
  | {
      type: "SET_FILTER";
      payload: {
        filterName: FilterableKeys;
        value: string;
      };
    }
  | { type: "SET_SORT"; payload: SortByType }
  | { type: "TOGGLE_TECH_STACK" }
  | { type: "RESET_FILTERS" }
  | {
      type: "APPLY_QUICK_FILTER";
      payload: {
        filterName: FilterableKeys;
        value: string;
      };
    };

// 1. Define the base filter state first. This is the "source of truth" for filters.
const initialFilterState = {
  category: "All" as const,
  complexity: "All" as const,
  status: "All" as const,
};

// 2. Compose the full initial state from the filter state and other properties.
const initialState: ProjectsState = {
  ...initialFilterState,
  sortBy: "date",
  showTechStack: false,
};

// Sort options constant to avoid repetition
const SORT_OPTIONS = [
  { value: "date" as const, label: "Date (Newest)" },
  { value: "complexity" as const, label: "Complexity" },
  { value: "name" as const, label: "Name" },
  { value: "category" as const, label: "Category" },
] as const;

// Reducer function with exhaustive type checking
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
      return { ...state, ...initialFilterState };
    case "APPLY_QUICK_FILTER":
      // Reset all filters first, then apply the specific filter
      return {
        ...state,
        ...initialFilterState, // Reset all filters...
        [action.payload.filterName]: action.payload.value, // ...then apply the new one
      };
    default:
      // Exhaustive type checking
      const _exhaustiveCheck: never = action;
      throw new Error(`Unhandled action type: ${_exhaustiveCheck}`);
  }
}

export function useProjects() {
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

  // Memoize stat card calculations
  const expertProjectCount = useMemo(
    () => projectsData.filter((p) => p.complexity === "Expert").length,
    []
  );

  const liveProjectCount = useMemo(
    () => projectsData.filter((p) => p.status === "Live").length,
    []
  );

  // Pre-calculate technology counts for efficient lookup
  const techProjectCounts = useMemo(() => {
    const counts = new Map<string, number>();
    // Iterate through the projects ONCE to build the count map
    projectsData.forEach((project) => {
      project.techStack.forEach((tech) => {
        counts.set(tech, (counts.get(tech) || 0) + 1);
      });
    });
    return counts;
  }, []); // Empty dependency array as projectsData is static

  // Filter and sort projects - fixed array mutation issue
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projectsData.filter((project) => {
      const categoryMatch = category === "All" || project.category === category;
      const complexityMatch =
        complexity === "All" || project.complexity === complexity;
      const statusMatch = status === "All" || project.status === status;
      return categoryMatch && complexityMatch && statusMatch;
    });

    // Create a new sorted array instead of mutating
    return [...filtered].sort((a, b) => {
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
  }, [category, complexity, status, sortBy]);

  // Event handlers using useCallback for performance
  const handleFilterChange = useCallback(
    (filterName: FilterableKeys, value: string) => {
      dispatch({ type: "SET_FILTER", payload: { filterName, value } });
    },
    []
  );

  const handleSortChange = useCallback((value: SortByType) => {
    dispatch({ type: "SET_SORT", payload: value });
  }, []);

  const handleShowAllProjects = useCallback(() => {
    dispatch({ type: "RESET_FILTERS" });
  }, []);

  const handleShowExpertProjects = useCallback(() => {
    dispatch({
      type: "APPLY_QUICK_FILTER",
      payload: { filterName: "complexity", value: "Expert" },
    });
  }, []);

  const handleShowLiveProjects = useCallback(() => {
    dispatch({
      type: "APPLY_QUICK_FILTER",
      payload: { filterName: "status", value: "Live" },
    });
  }, []);

  const handleShowTechStack = useCallback(() => {
    dispatch({ type: "TOGGLE_TECH_STACK" });
  }, []);

  // Handle Escape key for modal accessibility
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleShowTechStack();
      }
    };

    if (showTechStack) {
      document.addEventListener("keydown", handleKeyDown);
    }

    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showTechStack, handleShowTechStack]);

  // Perfecting the accessibility experience with more descriptive announcements
  const projectCount = filteredAndSortedProjects.length;
  const projectsFoundMessage =
    projectCount > 0
      ? `${projectCount} project${projectCount === 1 ? "" : "s"} found.`
      : "No projects found matching your criteria.";

  return {
    // State
    category,
    complexity,
    status,
    sortBy,
    showTechStack,

    // Derived data
    filteredAndSortedProjects,
    categories,
    complexities,
    statuses,
    allTechnologies,
    expertProjectCount,
    liveProjectCount,
    techProjectCounts,
    projectsFoundMessage,

    // Constants
    SORT_OPTIONS,

    // Event handlers
    handleFilterChange,
    handleSortChange,
    handleShowAllProjects,
    handleShowExpertProjects,
    handleShowLiveProjects,
    handleShowTechStack,
  };
}
