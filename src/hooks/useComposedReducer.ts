import { useReducer, useCallback } from "react";
import {
  CoreTerminalState,
  CoreTerminalAction,
  TopState,
  TopAction,
  ScrapingState,
  ScrapingAction,
  AiChatState,
  AiChatAction,
} from "../types/terminal";

// Combined state interface
export interface ComposedTerminalState {
  core: CoreTerminalState;
  top: TopState;
  scraping: ScrapingState;
  aiChat: AiChatState;
}

// Combined action type
export type ComposedTerminalAction =
  | CoreTerminalAction
  | TopAction
  | ScrapingAction
  | AiChatAction;

// Core terminal reducer
const coreTerminalReducer = (
  state: CoreTerminalState,
  action: CoreTerminalAction
): CoreTerminalState => {
  switch (action.type) {
    case "SET_COMMAND_HISTORY":
      return { ...state, commandHistory: action.payload };
    case "SET_CURRENT_COMMAND":
      return { ...state, currentCommand: action.payload };
    case "SET_SHOW_PROMPT":
      return { ...state, showPrompt: action.payload };
    case "SET_TARGET_ROUTE":
      return { ...state, targetRoute: action.payload };
    case "SET_AUTOCOMPLETE_INDEX":
      return { ...state, autocompleteIndex: action.payload };
    case "SET_AUTOCOMPLETE_SUGGESTIONS":
      return { ...state, autocompleteSuggestions: action.payload };
    case "SET_CURRENT_DIRECTORY":
      return { ...state, currentDirectory: action.payload };
    case "SET_IS_MINIMIZED":
      return { ...state, isMinimized: action.payload };
    case "SET_IS_MAXIMIZED":
      return { ...state, isMaximized: action.payload };
    case "SET_SHOW_PREVIEW":
      return { ...state, showPreview: action.payload };
    case "SET_ACTIVE_TYPEWRITER":
      return { ...state, activeTypewriter: action.payload };
    case "SET_HISTORY_INDEX":
      return { ...state, historyIndex: action.payload };
    case "RESET_HISTORY_INDEX":
      return { ...state, historyIndex: -1 };
    case "START_REVERSE_SEARCH":
      return {
        ...state,
        isReverseSearch: true,
        reverseSearchTerm: "",
        reverseSearchIndex: 0,
        reverseSearchResults: [],
      };
    case "UPDATE_REVERSE_SEARCH":
      return {
        ...state,
        reverseSearchTerm: action.payload.term,
        reverseSearchResults: action.payload.results,
        reverseSearchIndex: 0,
      };
    case "SET_REVERSE_SEARCH_INDEX":
      return { ...state, reverseSearchIndex: action.payload };
    case "EXIT_REVERSE_SEARCH":
      return {
        ...state,
        isReverseSearch: false,
        reverseSearchTerm: "",
        reverseSearchIndex: 0,
        reverseSearchResults: [],
      };
    case "SHOW_MAN_PAGE":
      return {
        ...state,
        isManPage: true,
        currentManPage: action.payload,
        manPageScrollPosition: 0,
      };
    case "HIDE_MAN_PAGE":
      return {
        ...state,
        isManPage: false,
        currentManPage: "",
        manPageScrollPosition: 0,
      };
    case "SET_MAN_PAGE_SCROLL":
      return { ...state, manPageScrollPosition: action.payload };
    case "ADD_HISTORY_ENTRY":
      return {
        ...state,
        commandHistory: [...state.commandHistory, action.payload],
      };
    case "UPDATE_HISTORY_ENTRY":
      return {
        ...state,
        commandHistory: state.commandHistory.map((entry) =>
          entry.id === action.payload.id ? action.payload.entry : entry
        ),
      };
    case "CLEAR_COMMAND":
      return { ...state, currentCommand: "" };
    case "MINIMIZE_TERMINAL":
      return { ...state, isMinimized: true, isMaximized: false };
    case "RESTORE_TERMINAL":
      return { ...state, isMinimized: false, isMaximized: false };
    case "MAXIMIZE_TERMINAL":
      return { ...state, isMaximized: true, isMinimized: false };
    case "SHOW_PREVIEW":
      return { ...state, showPreview: true };
    case "HIDE_PREVIEW":
      return { ...state, showPreview: false };
    case "CREATE_VIRTUAL_FILE":
      return { ...state };
    case "SET_NEXT_HISTORY_ID":
      return { ...state, nextHistoryId: action.payload };
    case "RESET_TERMINAL":
      return {
        ...state,
        commandHistory: [],
        currentCommand: "",
        showPrompt: false,
        autocompleteIndex: 0,
        autocompleteSuggestions: [],
        historyIndex: -1,
        isReverseSearch: false,
        reverseSearchTerm: "",
        reverseSearchIndex: 0,
        reverseSearchResults: [],
        isManPage: false,
        currentManPage: "",
        manPageScrollPosition: 0,
        nextHistoryId: 1,
      };
    case "ADD_FILE_TO_FILESYSTEM":
      return { ...state };
    default:
      return state;
  }
};

// Top command reducer
const topReducer = (state: TopState, action: TopAction): TopState => {
  switch (action.type) {
    case "SHOW_TOP_COMMAND":
      return {
        ...state,
        isTopCommand: true,
        topProcesses: [],
        topSelectedPid: null,
      };
    case "HIDE_TOP_COMMAND":
      return {
        ...state,
        isTopCommand: false,
        topProcesses: [],
        topSelectedPid: null,
      };
    case "UPDATE_TOP_PROCESSES":
      return { ...state, topProcesses: action.payload };
    case "SET_TOP_SORT":
      return {
        ...state,
        topSortBy: action.payload.field,
        topSortOrder: action.payload.order,
      };
    case "SET_TOP_REFRESH_RATE":
      return { ...state, topRefreshRate: action.payload };
    case "SET_TOP_SELECTED_PID":
      return { ...state, topSelectedPid: action.payload };
    case "KILL_TOP_PROCESS":
      return {
        ...state,
        topProcesses: state.topProcesses.filter(
          (process) => process.pid !== action.payload
        ),
      };
    default:
      return state;
  }
};

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
    case "REMOVE_SCRAPE_JOB": {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [action.payload]: removed, ...remainingJobs } =
        state.activeScrapeJobs;
      return { ...state, activeScrapeJobs: remainingJobs };
    }
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

// AI Chat reducer
const aiChatReducer = (
  state: AiChatState,
  action: AiChatAction
): AiChatState => {
  switch (action.type) {
    case "START_AI_CHAT":
      return {
        ...state,
        isAiChatting: true,
        aiChatHistory: [],
        isAiTyping: false,
        aiInputValue: "",
      };
    case "EXIT_AI_CHAT":
      return {
        ...state,
        isAiChatting: false,
        aiChatHistory: [],
        isAiTyping: false,
        aiInputValue: "",
      };
    case "ADD_AI_MESSAGE":
      return {
        ...state,
        aiChatHistory: [...state.aiChatHistory, action.payload],
      };
    case "SET_AI_TYPING":
      return { ...state, isAiTyping: action.payload };
    case "SET_AI_INPUT_VALUE":
      return { ...state, aiInputValue: action.payload };
    case "CLEAR_AI_CHAT_HISTORY":
      return { ...state, aiChatHistory: [] };
    case "SET_AI_CHAT_STATE":
      return {
        ...state,
        isAiChatting: action.payload.isChatting,
        aiChatHistory: action.payload.history || state.aiChatHistory,
        isAiTyping: action.payload.isTyping || false,
        aiInputValue: action.payload.inputValue || "",
      };
    default:
      return state;
  }
};

// Main composed reducer
const composedReducer = (
  state: ComposedTerminalState,
  action: ComposedTerminalAction
): ComposedTerminalState => {
  return {
    core: coreTerminalReducer(state.core, action as CoreTerminalAction),
    top: topReducer(state.top, action as TopAction),
    scraping: scrapingReducer(state.scraping, action as ScrapingAction),
    aiChat: aiChatReducer(state.aiChat, action as AiChatAction),
  };
};

// Initial state
const getInitialState = (): ComposedTerminalState => ({
  core: {
    commandHistory: [],
    currentCommand: "",
    showPrompt: false,
    targetRoute: "/",
    autocompleteIndex: 0,
    autocompleteSuggestions: [],
    currentDirectory: "/",
    isMinimized: false,
    isMaximized: false,
    showPreview: false,
    activeTypewriter: false,
    historyIndex: -1,
    isReverseSearch: false,
    reverseSearchTerm: "",
    reverseSearchIndex: 0,
    reverseSearchResults: [],
    isManPage: false,
    currentManPage: "",
    manPageScrollPosition: 0,
    nextHistoryId: 1,
  },
  top: {
    isTopCommand: false,
    topProcesses: [],
    topSortBy: "cpu",
    topSortOrder: "desc",
    topRefreshRate: 1000,
    topSelectedPid: null,
  },
  scraping: {
    activeScrapeJobs: {},
    showScrapeResults: false,
    scrapeResults: [],
    currentScrapeJobId: "",
  },
  aiChat: {
    isAiChatting: false,
    aiChatHistory: [],
    isAiTyping: false,
    aiInputValue: "",
  },
});

export const useComposedReducer = () => {
  const [state, dispatch] = useReducer(composedReducer, getInitialState());

  const dispatchCore = useCallback((action: CoreTerminalAction) => {
    dispatch(action);
  }, []);

  const dispatchTop = useCallback((action: TopAction) => {
    dispatch(action);
  }, []);

  const dispatchScraping = useCallback((action: ScrapingAction) => {
    dispatch(action);
  }, []);

  const dispatchAiChat = useCallback((action: AiChatAction) => {
    dispatch(action);
  }, []);

  return {
    state,
    dispatch,
    dispatchCore,
    dispatchTop,
    dispatchScraping,
    dispatchAiChat,
  };
};
