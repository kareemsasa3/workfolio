export interface FileSystemItem {
  name: string;
  type: "directory" | "file";
  permissions: string;
  size: string;
  date: string;
  route?: string;
  children?: FileSystemItem[]; // For nested directories
}

export interface HistoryEntry {
  text: string;
  type?: "error" | "success" | "info" | "command";
}

export interface TerminalState {
  commandHistory: HistoryEntry[];
  currentCommand: string;
  showPrompt: boolean;
  targetRoute: string;
  autocompleteIndex: number;
  fadeOutWelcome: boolean;
  currentDirectory: string; // Track current directory path
  isMinimized: boolean; // Track if terminal is minimized
  showPreview: boolean; // Track if preview is shown on hover
}

// Action types for the terminal reducer
export type TerminalAction =
  | { type: "SET_COMMAND_HISTORY"; payload: HistoryEntry[] }
  | { type: "SET_CURRENT_COMMAND"; payload: string }
  | { type: "SET_SHOW_PROMPT"; payload: boolean }
  | { type: "SET_TARGET_ROUTE"; payload: string }
  | { type: "SET_AUTOCOMPLETE_INDEX"; payload: number }
  | { type: "SET_FADE_OUT_WELCOME"; payload: boolean }
  | { type: "SET_CURRENT_DIRECTORY"; payload: string }
  | { type: "SET_IS_MINIMIZED"; payload: boolean }
  | { type: "SET_SHOW_PREVIEW"; payload: boolean }
  | { type: "ADD_HISTORY_ENTRY"; payload: HistoryEntry }
  | { type: "CLEAR_COMMAND" }
  | { type: "MINIMIZE_TERMINAL" }
  | { type: "RESTORE_TERMINAL" }
  | { type: "SHOW_PREVIEW" }
  | { type: "HIDE_PREVIEW" }
  | { type: "FADE_OUT_WELCOME" };

export interface Command {
  name: string;
  execute: (
    args: string[],
    history: HistoryEntry[],
    fileSystem: FileSystemItem[],
    dispatch: React.Dispatch<TerminalAction>,
    currentDirectory: string
  ) => HistoryEntry[];
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
