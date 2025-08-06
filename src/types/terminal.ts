import { ChatMessage } from "../services/aiApi";

export interface FileSystemItem {
  name: string;
  type: "directory" | "file";
  permissions: string;
  size: string;
  date: string;
  route?: string;
  githubUrl?: string; // GitHub URL for project directories
  children?: FileSystemItem[]; // For nested directories
}

export interface HistoryEntry {
  id: number; // Unique identifier for the history entry
  text: string;
  type?: "error" | "success" | "info" | "command";
  useTypewriter?: boolean;
  highlightedText?: string; // For grep results with highlighted matches
}

export interface TypewriterEffect {
  _effect: "TYPEWRITER";
  lines: string[];
}

export interface PipeResult {
  history: HistoryEntry[];
  stdout?: string[]; // Output that can be piped to next command
}

export type CommandResult = HistoryEntry[] | TypewriterEffect | PipeResult;

export interface ActiveScrapeJob {
  jobId: string;
  command: string; // The command that was executed
  status: "submitted" | "running" | "completed" | "failed";
  progress?: number;
  historyEntryId: number; // The ID of the history line to update
  urls: string[];
  startTime: number; // Timestamp when job was started
  results?: unknown; // Final results when completed
  error?: string; // Error message if failed
}

export interface ProcessInfo {
  pid: number;
  name: string;
  cpu: number; // CPU usage percentage
  memory: number; // Memory usage in MB
  virtualMemory: number; // Virtual memory in MB
  state: "R" | "S" | "D" | "Z" | "T"; // Process state (Running, Sleeping, etc.)
  startTime: string; // Process start time
  command: string; // Full command
  user: string; // Process owner
  priority: number; // Process priority
  nice: number; // Nice value
  threads: number; // Number of threads
  lastUpdate: number; // Timestamp of last update
}

// TopCommand Feature State
export interface TopState {
  isTopCommand: boolean;
  topProcesses: ProcessInfo[];
  topSortBy: "cpu" | "memory" | "pid" | "name";
  topSortOrder: "asc" | "desc";
  topRefreshRate: number;
  topSelectedPid: number | null;
}

// TopCommand Feature Actions
export type TopAction =
  | { type: "SHOW_TOP_COMMAND" }
  | { type: "HIDE_TOP_COMMAND" }
  | { type: "UPDATE_TOP_PROCESSES"; payload: ProcessInfo[] }
  | {
      type: "SET_TOP_SORT";
      payload: {
        field: "cpu" | "memory" | "pid" | "name";
        order: "asc" | "desc";
      };
    }
  | { type: "SET_TOP_REFRESH_RATE"; payload: number }
  | { type: "SET_TOP_SELECTED_PID"; payload: number | null }
  | { type: "KILL_TOP_PROCESS"; payload: number };

// Scraping Feature State
export interface ScrapingState {
  activeScrapeJobs: Record<string, ActiveScrapeJob>;
  showScrapeResults: boolean;
  scrapeResults: unknown[];
  currentScrapeJobId: string;
}

// Scraping Feature Actions
export type ScrapingAction =
  | { type: "ADD_SCRAPE_JOB"; payload: ActiveScrapeJob }
  | {
      type: "UPDATE_SCRAPE_JOB";
      payload: { jobId: string; updates: Partial<ActiveScrapeJob> };
    }
  | { type: "REMOVE_SCRAPE_JOB"; payload: string }
  | { type: "SHOW_SCRAPE_RESULTS"; payload: { results: unknown[]; jobId: string } }
  | { type: "HIDE_SCRAPE_RESULTS" };

// AI Chat Feature State
export interface AiChatState {
  isAiChatting: boolean;
  aiChatHistory: ChatMessage[];
  isAiTyping: boolean;
  aiInputValue: string;
}

// AI Chat Feature Actions
export type AiChatAction =
  | { type: "START_AI_CHAT" }
  | { type: "EXIT_AI_CHAT" }
  | { type: "ADD_AI_MESSAGE"; payload: ChatMessage }
  | { type: "SET_AI_TYPING"; payload: boolean }
  | { type: "SET_AI_INPUT_VALUE"; payload: string }
  | { type: "CLEAR_AI_CHAT_HISTORY" }
  | {
      type: "SET_AI_CHAT_STATE";
      payload: {
        isChatting: boolean;
        history?: ChatMessage[];
        isTyping?: boolean;
        inputValue?: string;
      };
    };

// Core Terminal State (without feature-specific state)
export interface CoreTerminalState {
  commandHistory: HistoryEntry[];
  currentCommand: string;
  showPrompt: boolean;
  targetRoute: string;
  autocompleteIndex: number;
  autocompleteSuggestions: string[];
  currentDirectory: string;
  isMinimized: boolean;
  isMaximized: boolean;
  showPreview: boolean;
  activeTypewriter: boolean;
  historyIndex: number;
  isReverseSearch: boolean;
  reverseSearchTerm: string;
  reverseSearchIndex: number;
  reverseSearchResults: string[];
  isManPage: boolean;
  currentManPage: string;
  manPageScrollPosition: number;
  nextHistoryId: number;
}

// Core Terminal Actions (without feature-specific actions)
export type CoreTerminalAction =
  | { type: "SET_COMMAND_HISTORY"; payload: HistoryEntry[] }
  | { type: "SET_CURRENT_COMMAND"; payload: string }
  | { type: "SET_SHOW_PROMPT"; payload: boolean }
  | { type: "SET_TARGET_ROUTE"; payload: string }
  | { type: "SET_AUTOCOMPLETE_INDEX"; payload: number }
  | { type: "SET_AUTOCOMPLETE_SUGGESTIONS"; payload: string[] }
  | { type: "SET_CURRENT_DIRECTORY"; payload: string }
  | { type: "SET_IS_MINIMIZED"; payload: boolean }
  | { type: "SET_IS_MAXIMIZED"; payload: boolean }
  | { type: "SET_SHOW_PREVIEW"; payload: boolean }
  | { type: "SET_ACTIVE_TYPEWRITER"; payload: boolean }
  | { type: "SET_HISTORY_INDEX"; payload: number }
  | { type: "RESET_HISTORY_INDEX" }
  | { type: "START_REVERSE_SEARCH" }
  | {
      type: "UPDATE_REVERSE_SEARCH";
      payload: { term: string; results: string[] };
    }
  | { type: "SET_REVERSE_SEARCH_INDEX"; payload: number }
  | { type: "EXIT_REVERSE_SEARCH" }
  | { type: "SHOW_MAN_PAGE"; payload: string }
  | { type: "HIDE_MAN_PAGE" }
  | { type: "SET_MAN_PAGE_SCROLL"; payload: number }
  | { type: "ADD_HISTORY_ENTRY"; payload: HistoryEntry }
  | {
      type: "UPDATE_HISTORY_ENTRY";
      payload: { id: number; entry: HistoryEntry };
    }
  | { type: "CLEAR_COMMAND" }
  | { type: "MINIMIZE_TERMINAL" }
  | { type: "RESTORE_TERMINAL" }
  | { type: "MAXIMIZE_TERMINAL" }
  | { type: "SHOW_PREVIEW" }
  | { type: "HIDE_PREVIEW" }
  | { type: "CREATE_VIRTUAL_FILE"; payload: { path: string; content: string } }
  | { type: "SET_NEXT_HISTORY_ID"; payload: number }
  | { type: "RESET_TERMINAL" }
  | {
      type: "ADD_FILE_TO_FILESYSTEM";
      payload: { path: string; content: string; filename: string };
    };

// Combined state for backward compatibility (will be removed after refactor)
export interface TerminalState
  extends CoreTerminalState,
    TopState,
    ScrapingState,
    AiChatState {}

// Combined action for backward compatibility (will be removed after refactor)
export type TerminalAction =
  | CoreTerminalAction
  | TopAction
  | ScrapingAction
  | AiChatAction;

export interface Command {
  name: string;
  execute: (
    args: string[],
    history: HistoryEntry[],
    fileSystem: FileSystemItem[],
    dispatch: React.Dispatch<CoreTerminalAction>,
    currentDirectory: string,
    onNavigate?: (route: string) => void,
    state?: CoreTerminalState, // This is the KEY CHANGE - only core state
    stdin?: string[], // New stdin parameter for piping
    getFileContent?: (path: string) => { content: string[] } | null // File content function
  ) => CommandResult | Promise<CommandResult>;
  getSuggestions?: (
    input: string,
    fileSystem: FileSystemItem[],
    currentDirectory: string
  ) => string[];
}

export interface TabCompleteResult {
  currentCommand: string;
  autocompleteIndex: number;
  suggestions?: string[];
}
