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
  status: "submitted" | "running" | "completed" | "failed";
  progress?: number;
  historyEntryId: number; // The ID of the history line to update
  urls: string[];
  startTime: number; // Timestamp when job was started
  results?: any; // Final results when completed
  error?: string; // Error message if failed
}

export interface TerminalState {
  commandHistory: HistoryEntry[];
  currentCommand: string;
  showPrompt: boolean;
  targetRoute: string;
  autocompleteIndex: number;
  currentDirectory: string; // Track current directory path
  isMinimized: boolean; // Track if terminal is minimized
  isMaximized: boolean; // Track if terminal is maximized
  showPreview: boolean; // Track if preview is shown on hover
  activeTypewriter: boolean; // Track if typewriter animation is active
  historyIndex: number; // Track current position in command history for navigation
  isReverseSearch: boolean; // Track if we're in reverse search mode
  reverseSearchTerm: string; // Current search term in reverse search
  reverseSearchIndex: number; // Current match index in reverse search results
  reverseSearchResults: string[]; // Filtered commands matching search term
  isManPage: boolean; // Track if we're viewing a man page
  currentManPage: string; // Current man page being displayed
  manPageScrollPosition: number; // Scroll position in man page
  isTopCommand: boolean; // Track if we're viewing the top command
  topProcesses: ProcessInfo[]; // Current process list for top command
  topSortBy: "cpu" | "memory" | "pid" | "name"; // Sort field for top command
  topSortOrder: "asc" | "desc"; // Sort order for top command
  topRefreshRate: number; // Refresh rate in milliseconds
  topSelectedPid: number | null; // Currently selected process PID
  activeScrapeJobs: Record<string, ActiveScrapeJob>; // Track active scraping jobs
  nextHistoryId: number; // Auto-incrementing ID for history entries
}

// Action types for the terminal reducer
export type TerminalAction =
  | { type: "SET_COMMAND_HISTORY"; payload: HistoryEntry[] }
  | { type: "SET_CURRENT_COMMAND"; payload: string }
  | { type: "SET_SHOW_PROMPT"; payload: boolean }
  | { type: "SET_TARGET_ROUTE"; payload: string }
  | { type: "SET_AUTOCOMPLETE_INDEX"; payload: number }
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
  | { type: "ADD_SCRAPE_JOB"; payload: ActiveScrapeJob }
  | {
      type: "UPDATE_SCRAPE_JOB";
      payload: { jobId: string; updates: Partial<ActiveScrapeJob> };
    }
  | { type: "REMOVE_SCRAPE_JOB"; payload: string }
  | { type: "CREATE_VIRTUAL_FILE"; payload: { path: string; content: string } }
  | { type: "SET_NEXT_HISTORY_ID"; payload: number };

export interface Command {
  name: string;
  execute: (
    args: string[],
    history: HistoryEntry[],
    fileSystem: FileSystemItem[],
    dispatch: React.Dispatch<TerminalAction>,
    currentDirectory: string,
    onNavigate?: (route: string) => void,
    state?: TerminalState,
    stdin?: string[] // New stdin parameter for piping
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
