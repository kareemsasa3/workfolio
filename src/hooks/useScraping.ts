import { useReducer, useEffect, useCallback } from "react";
import {
  ScrapingState,
  ScrapingAction,
  ActiveScrapeJob,
} from "../types/terminal";

// Scraping reducer
const scrapingReducer = (
  state: ScrapingState,
  action: ScrapingAction
): ScrapingState => {
  switch (action.type) {
    case "ADD_SCRAPE_JOB":
      return {
        ...state,
        activeScrapeJobs: {
          ...state.activeScrapeJobs,
          [action.payload.jobId]: action.payload,
        },
      };

    case "UPDATE_SCRAPE_JOB":
      return {
        ...state,
        activeScrapeJobs: {
          ...state.activeScrapeJobs,
          [action.payload.jobId]: {
            ...state.activeScrapeJobs[action.payload.jobId],
            ...action.payload.updates,
          },
        },
      };

    case "REMOVE_SCRAPE_JOB":
      const { [action.payload]: removed, ...remainingJobs } =
        state.activeScrapeJobs;
      return {
        ...state,
        activeScrapeJobs: remainingJobs,
      };

    case "SHOW_SCRAPE_RESULTS":
      return {
        ...state,
        showScrapeResults: true,
        scrapeResults: action.payload.results,
        currentScrapeJobId: action.payload.jobId,
      };

    case "HIDE_SCRAPE_RESULTS":
      return {
        ...state,
        showScrapeResults: false,
        scrapeResults: [],
        currentScrapeJobId: "",
      };

    default:
      return state;
  }
};

// Initial scraping state
const getInitialScrapingState = (): ScrapingState => ({
  activeScrapeJobs: {},
  showScrapeResults: false,
  scrapeResults: [],
  currentScrapeJobId: "",
});

export const useScraping = () => {
  const [scrapingState, dispatch] = useReducer(
    scrapingReducer,
    getInitialScrapingState()
  );

  // Effect for polling scrape jobs
  useEffect(() => {
    const pollJobs = async () => {
      const jobIds = Object.keys(scrapingState.activeScrapeJobs);
      if (jobIds.length === 0) return;

      for (const jobId of jobIds) {
        const job = scrapingState.activeScrapeJobs[jobId];
        if (job.status === "running") {
          // Simulate job progress updates
          const progress = Math.min(
            (job.progress || 0) + Math.random() * 20,
            100
          );

          if (progress >= 100) {
            // Job completed
            const mockResults = [
              {
                url: "https://example.com",
                title: "Example Page",
                status: "success",
              },
              {
                url: "https://test.com",
                title: "Test Page",
                status: "success",
              },
            ];

            dispatch({
              type: "UPDATE_SCRAPE_JOB",
              payload: {
                jobId,
                updates: {
                  status: "completed",
                  progress: 100,
                  results: mockResults,
                },
              },
            });
          } else {
            dispatch({
              type: "UPDATE_SCRAPE_JOB",
              payload: {
                jobId,
                updates: { progress },
              },
            });
          }
        }
      }
    };

    const interval = setInterval(pollJobs, 2000);
    return () => clearInterval(interval);
  }, [scrapingState.activeScrapeJobs]);

  // Action creators
  const addScrapeJob = useCallback((job: ActiveScrapeJob) => {
    dispatch({ type: "ADD_SCRAPE_JOB", payload: job });
  }, []);

  const updateScrapeJob = useCallback(
    (jobId: string, updates: Partial<ActiveScrapeJob>) => {
      dispatch({ type: "UPDATE_SCRAPE_JOB", payload: { jobId, updates } });
    },
    []
  );

  const removeScrapeJob = useCallback((jobId: string) => {
    dispatch({ type: "REMOVE_SCRAPE_JOB", payload: jobId });
  }, []);

  const showScrapeResults = useCallback((results: any[], jobId: string) => {
    dispatch({ type: "SHOW_SCRAPE_RESULTS", payload: { results, jobId } });
  }, []);

  const hideScrapeResults = useCallback(() => {
    dispatch({ type: "HIDE_SCRAPE_RESULTS" });
  }, []);

  return {
    scrapingState,
    addScrapeJob,
    updateScrapeJob,
    removeScrapeJob,
    showScrapeResults,
    hideScrapeResults,
  };
};
