import { useRef, useCallback, useReducer, useEffect } from "react";
import {
  FileSystemItem,
  HistoryEntry,
  CoreTerminalState,
  Command,
  TabCompleteResult,
  CoreTerminalAction,
} from "../types/terminal";
import { manPages } from "../data/manPages";

// Type definition for TypewriterEffect (unused for now)
// interface TypewriterEffect {
//   start: () => void;
//   stop: () => void;
//   isRunning: boolean;
// }

// Core terminal reducer function - handles basic terminal operations
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
      return {
        ...state,
        reverseSearchIndex: action.payload,
      };

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
      return {
        ...state,
        manPageScrollPosition: action.payload,
      };

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

// Helper functions
const createHistoryEntry = (
  text: string,
  type?: "error" | "success" | "info" | "command",
  useTypewriter?: boolean,
  id?: number,
  highlightedText?: string
): HistoryEntry => ({
  id: id || 0,
  text,
  type,
  useTypewriter,
  highlightedText,
});

const getCurrentDirectoryItems = (
  fileSystem: FileSystemItem[],
  currentDir: string
): FileSystemItem[] => {
  if (currentDir === "/") {
    return fileSystem;
  }

  const pathParts = currentDir.split("/").filter(Boolean);
  let currentItems = fileSystem;

  for (const part of pathParts) {
    const found = currentItems.find((item) => item.name === part);
    if (!found || found.type !== "directory") {
      return [];
    }
    currentItems = found.children || [];
  }

  return currentItems;
};

// Command implementations
class LsCommand implements Command {
  name = "ls";

  execute(
    _args: string[],
    history: HistoryEntry[],
    fileSystem: FileSystemItem[],
    _dispatch: React.Dispatch<CoreTerminalAction>,
    currentDirectory: string
  ): HistoryEntry[] {
    const items = getCurrentDirectoryItems(fileSystem, currentDirectory);
    const output = items
      .map((item) => {
        const size = item.size.padStart(8);
        const date = item.date;
        const name = item.name;
        return `${item.permissions} ${size} ${date} ${name}`;
      })
      .join("\n");

    return [...history, createHistoryEntry(output || "No files found")];
  }

  getSuggestions(
    _input: string,
    _fileSystem: FileSystemItem[],
    _currentDirectory: string
  ): string[] {
    return [];
  }
}

class CdCommand implements Command {
  name = "cd";

  execute(
    args: string[],
    history: HistoryEntry[],
    fileSystem: FileSystemItem[],
    dispatch: React.Dispatch<CoreTerminalAction>,
    currentDirectory: string,
    onNavigate?: (route: string) => void
  ): HistoryEntry[] {
    if (args.length === 0) {
      dispatch({ type: "SET_CURRENT_DIRECTORY", payload: "/" });
      return [...history, createHistoryEntry("Changed to root directory")];
    }

    const targetPath = args[0];
    let newPath = currentDirectory;

    if (targetPath === "/") {
      newPath = "/";
    } else if (targetPath === "..") {
      const parts = currentDirectory.split("/").filter(Boolean);
      parts.pop();
      newPath = "/" + parts.join("/");
    } else if (targetPath.startsWith("/")) {
      newPath = targetPath;
    } else {
      newPath =
        currentDirectory === "/"
          ? `/${targetPath}`
          : `${currentDirectory}/${targetPath}`;
    }

    const findItemByPath = (path: string): FileSystemItem | null => {
      if (path === "/")
        return {
          name: "/",
          type: "directory",
          permissions: "drwxr-xr-x",
          size: "0",
          date: "",
          children: fileSystem,
        };

      const parts = path.split("/").filter(Boolean);
      let currentItems = fileSystem;

      for (const part of parts) {
        const found = currentItems.find((item) => item.name === part);
        if (!found) return null;
        if (found.type !== "directory") return found;
        currentItems = found.children || [];
      }

      return {
        name: parts[parts.length - 1],
        type: "directory",
        permissions: "drwxr-xr-x",
        size: "0",
        date: "",
        children: currentItems,
      };
    };

    const targetItem = findItemByPath(newPath);
    if (!targetItem) {
      return [
        ...history,
        createHistoryEntry(
          `cd: ${targetPath}: No such file or directory`,
          "error"
        ),
      ];
    }

    if (targetItem.type !== "directory") {
      return [
        ...history,
        createHistoryEntry(`cd: ${targetPath}: Not a directory`, "error"),
      ];
    }

    dispatch({ type: "SET_CURRENT_DIRECTORY", payload: newPath });

    // Handle navigation for special routes
    if (targetItem.route && onNavigate) {
      onNavigate(targetItem.route);
    }

    return [...history, createHistoryEntry(`Changed directory to ${newPath}`)];
  }

  getSuggestions(
    input: string,
    fileSystem: FileSystemItem[],
    currentDirectory: string
  ): string[] {
    const items = getCurrentDirectoryItems(fileSystem, currentDirectory);
    return items
      .filter(
        (item) => item.type === "directory" && item.name.startsWith(input)
      )
      .map((item) => item.name);
  }
}

class HelpCommand implements Command {
  name = "help";

  execute(_args: string[], history: HistoryEntry[]): HistoryEntry[] {
    const helpText = `Available commands:
  ls          - List directory contents
  cd <dir>    - Change directory
  pwd         - Print working directory
  clear       - Clear terminal
  history     - Show command history
  man <cmd>   - Show manual page for command
  exit        - Exit terminal
  help        - Show this help message`;

    return [...history, createHistoryEntry(helpText)];
  }

  getSuggestions(
    _input: string,
    _fileSystem: FileSystemItem[],
    _currentDirectory: string
  ): string[] {
    return [];
  }
}

class ClearCommand implements Command {
  name = "clear";

  execute(
    _args: string[],
    _history: HistoryEntry[],
    _fileSystem: FileSystemItem[],
    dispatch: React.Dispatch<CoreTerminalAction>,
    _currentDirectory: string
  ): HistoryEntry[] {
    dispatch({ type: "SET_COMMAND_HISTORY", payload: [] });
    return [];
  }

  getSuggestions(
    _input: string,
    _fileSystem: FileSystemItem[],
    _currentDirectory: string
  ): string[] {
    return [];
  }
}

class PwdCommand implements Command {
  name = "pwd";

  execute(
    _args: string[],
    history: HistoryEntry[],
    _fileSystem: FileSystemItem[],
    _dispatch: React.Dispatch<CoreTerminalAction>,
    currentDirectory: string
  ): HistoryEntry[] {
    return [...history, createHistoryEntry(currentDirectory)];
  }

  getSuggestions(
    _input: string,
    _fileSystem: FileSystemItem[],
    _currentDirectory: string
  ): string[] {
    return [];
  }
}

class ExitCommand implements Command {
  name = "exit";

  execute(
    _args: string[],
    history: HistoryEntry[],
    _fileSystem: FileSystemItem[],
    _dispatch: React.Dispatch<CoreTerminalAction>,
    _currentDirectory: string,
    onNavigate?: (route: string) => void
  ): HistoryEntry[] {
    if (onNavigate) {
      onNavigate("/");
    }
    return [...history, createHistoryEntry("Exiting terminal...", "info")];
  }

  getSuggestions(
    _input: string,
    _fileSystem: FileSystemItem[],
    _currentDirectory: string
  ): string[] {
    return [];
  }
}

class HistoryCommand implements Command {
  name = "history";

  execute(
    _args: string[],
    history: HistoryEntry[],
    _fileSystem: FileSystemItem[],
    _dispatch: React.Dispatch<CoreTerminalAction>,
    _currentDirectory: string
  ): HistoryEntry[] {
    const commandHistory = history
      .filter((entry) => entry.type === "command")
      .map((entry, index) => `${index + 1}  ${entry.text}`)
      .join("\n");

    return [
      ...history,
      createHistoryEntry(commandHistory || "No command history"),
    ];
  }

  getSuggestions(
    _input: string,
    _fileSystem: FileSystemItem[],
    _currentDirectory: string
  ): string[] {
    return [];
  }
}

class ManCommand implements Command {
  name = "man";

  execute(
    args: string[],
    history: HistoryEntry[],
    _fileSystem: FileSystemItem[],
    dispatch: React.Dispatch<CoreTerminalAction>,
    _currentDirectory: string
  ): HistoryEntry[] {
    if (args.length === 0) {
      return [
        ...history,
        createHistoryEntry("man: What manual page do you want?", "error"),
      ];
    }

    const commandName = args[0];
    const manPage = manPages[commandName];

    if (!manPage) {
      return [
        ...history,
        createHistoryEntry(`No manual entry for ${commandName}`, "error"),
      ];
    }

    dispatch({ type: "SHOW_MAN_PAGE", payload: commandName });
    return [...history, createHistoryEntry(`Manual page for ${commandName}`)];
  }

  getSuggestions(
    input: string,
    _fileSystem: FileSystemItem[],
    _currentDirectory: string
  ): string[] {
    return Object.keys(manPages).filter((cmd) => cmd.startsWith(input));
  }
}

// Command registry
const commands: Command[] = [
  new LsCommand(),
  new CdCommand(),
  new HelpCommand(),
  new ClearCommand(),
  new PwdCommand(),
  new ExitCommand(),
  new HistoryCommand(),
  new ManCommand(),
];

export const useTerminalCore = (
  fileSystem: FileSystemItem[],
  onNavigate: (route: string) => void
) => {
  // State for managing typewriter effects (unused for now)
  // const [_typewriter, _setTypewriter] = useState<TypewriterEffect | null>(null);

  // Load initial state from localStorage
  const getInitialState = (): CoreTerminalState => {
    const savedState = localStorage.getItem("terminal-state");

    const defaultState: CoreTerminalState = {
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
    };

    if (!savedState) {
      return defaultState;
    }

    try {
      const parsed = JSON.parse(savedState);

      // Validate that parsed state has the expected structure
      if (typeof parsed !== "object" || parsed === null) {
        console.warn(
          "Saved terminal state is not an object, using default state"
        );
        return defaultState;
      }

      // Only merge properties that exist in the default state
      const validParsedState: Partial<CoreTerminalState> = {};
      Object.keys(defaultState).forEach((key) => {
        if (key in parsed) {
          (validParsedState as Record<string, unknown>)[key] = parsed[key];
        }
      });

      return {
        ...defaultState,
        ...validParsedState,
        // Reset transient states
        showPrompt: false,
        isReverseSearch: false,
        reverseSearchTerm: "",
        reverseSearchResults: [],
        reverseSearchIndex: 0,
        isManPage: false,
      };
    } catch (error) {
      console.error("Failed to parse saved terminal state:", error);
      // Clear the corrupted state
      localStorage.removeItem("terminal-state");
      return defaultState;
    }
  };

  const [state, dispatch] = useReducer(coreTerminalReducer, getInitialState());
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stateToSave = {
      commandHistory: state.commandHistory,
      currentDirectory: state.currentDirectory,
      targetRoute: state.targetRoute,
      nextHistoryId: state.nextHistoryId,
    };
    localStorage.setItem("terminal-state", JSON.stringify(stateToSave));
  }, [
    state.commandHistory,
    state.currentDirectory,
    state.targetRoute,
    state.nextHistoryId,
  ]);

  // Execute command
  const executeCommand = useCallback(
    async (commandLine: string): Promise<void> => {
      const trimmedCommand = commandLine.trim();
      if (!trimmedCommand) return;

      // Add command to history
      const commandEntry = createHistoryEntry(
        trimmedCommand,
        "command",
        false,
        state.nextHistoryId
      );
      dispatch({ type: "ADD_HISTORY_ENTRY", payload: commandEntry });
      dispatch({
        type: "SET_NEXT_HISTORY_ID",
        payload: state.nextHistoryId + 1,
      });

      // Parse command and arguments
      const parts = trimmedCommand.split(" ");
      const commandName = parts[0];
      const args = parts.slice(1);

      // Find command
      const command = commands.find((cmd) => cmd.name === commandName);

      if (!command) {
        const errorEntry = createHistoryEntry(
          `Command not found: ${commandName}`,
          "error",
          false,
          state.nextHistoryId
        );
        dispatch({ type: "ADD_HISTORY_ENTRY", payload: errorEntry });
        dispatch({
          type: "SET_NEXT_HISTORY_ID",
          payload: state.nextHistoryId + 1,
        });
        return;
      }

      try {
        const result = await command.execute(
          args,
          state.commandHistory,
          fileSystem,
          dispatch,
          state.currentDirectory,
          onNavigate
        );

        // Handle different result types
        if (Array.isArray(result)) {
          // HistoryEntry array
          const newEntries = result.slice(state.commandHistory.length);
          newEntries.forEach((entry) => {
            if (!entry.id) {
              entry.id = state.nextHistoryId;
              dispatch({
                type: "SET_NEXT_HISTORY_ID",
                payload: state.nextHistoryId + 1,
              });
            }
            dispatch({ type: "ADD_HISTORY_ENTRY", payload: entry });
          });
        }
      } catch (error) {
        const errorEntry = createHistoryEntry(
          `Error executing command: ${error}`,
          "error",
          false,
          state.nextHistoryId
        );
        dispatch({ type: "ADD_HISTORY_ENTRY", payload: errorEntry });
        dispatch({
          type: "SET_NEXT_HISTORY_ID",
          payload: state.nextHistoryId + 1,
        });
      }
    },
    [
      state.commandHistory,
      state.currentDirectory,
      state.nextHistoryId,
      fileSystem,
      onNavigate,
      dispatch,
    ]
  );

  // Tab completion
  const handleTabComplete = useCallback(
    (currentInput: string): TabCompleteResult => {
      const parts = currentInput.split(" ");
      const commandName = parts[0];
      const args = parts.slice(1);

      if (args.length === 0) {
        // Complete command name
        const matchingCommands = commands
          .map((cmd) => cmd.name)
          .filter((name) => name.startsWith(commandName));

        if (matchingCommands.length === 1) {
          return {
            currentCommand: matchingCommands[0] + " ",
            autocompleteIndex: 0,
          };
        } else if (matchingCommands.length > 1) {
          dispatch({
            type: "SET_AUTOCOMPLETE_SUGGESTIONS",
            payload: matchingCommands,
          });
          return {
            currentCommand: currentInput,
            autocompleteIndex: 0,
            suggestions: matchingCommands,
          };
        }
      } else {
        // Complete arguments
        const command = commands.find((cmd) => cmd.name === commandName);
        if (command && command.getSuggestions) {
          const suggestions = command.getSuggestions(
            args[args.length - 1],
            fileSystem,
            state.currentDirectory
          );

          if (suggestions.length === 1) {
            const newArgs = [...args.slice(0, -1), suggestions[0]];
            return {
              currentCommand: commandName + " " + newArgs.join(" ") + " ",
              autocompleteIndex: 0,
            };
          } else if (suggestions.length > 1) {
            dispatch({
              type: "SET_AUTOCOMPLETE_SUGGESTIONS",
              payload: suggestions,
            });
            return {
              currentCommand: currentInput,
              autocompleteIndex: 0,
              suggestions,
            };
          }
        }
      }

      return {
        currentCommand: currentInput,
        autocompleteIndex: 0,
      };
    },
    [fileSystem, state.currentDirectory, dispatch]
  );

  // Action creators
  const setCurrentCommand = useCallback((command: string) => {
    dispatch({ type: "SET_CURRENT_COMMAND", payload: command });
  }, []);

  const setShowPrompt = useCallback((show: boolean) => {
    dispatch({ type: "SET_SHOW_PROMPT", payload: show });
  }, []);

  const setTargetRoute = useCallback((route: string) => {
    dispatch({ type: "SET_TARGET_ROUTE", payload: route });
  }, []);

  const setAutocompleteIndex = useCallback((index: number) => {
    dispatch({ type: "SET_AUTOCOMPLETE_INDEX", payload: index });
  }, []);

  const setAutocompleteSuggestions = useCallback((suggestions: string[]) => {
    dispatch({ type: "SET_AUTOCOMPLETE_SUGGESTIONS", payload: suggestions });
  }, []);

  const setCurrentDirectory = useCallback((directory: string) => {
    dispatch({ type: "SET_CURRENT_DIRECTORY", payload: directory });
  }, []);

  const setIsMinimized = useCallback((minimized: boolean) => {
    dispatch({ type: "SET_IS_MINIMIZED", payload: minimized });
  }, []);

  const setIsMaximized = useCallback((maximized: boolean) => {
    dispatch({ type: "SET_IS_MAXIMIZED", payload: maximized });
  }, []);

  const setShowPreview = useCallback((show: boolean) => {
    dispatch({ type: "SET_SHOW_PREVIEW", payload: show });
  }, []);

  const setActiveTypewriter = useCallback((active: boolean) => {
    dispatch({ type: "SET_ACTIVE_TYPEWRITER", payload: active });
  }, []);

  const setHistoryIndex = useCallback((index: number) => {
    dispatch({ type: "SET_HISTORY_INDEX", payload: index });
  }, []);

  const resetHistoryIndex = useCallback(() => {
    dispatch({ type: "RESET_HISTORY_INDEX" });
  }, []);

  const startReverseSearch = useCallback(() => {
    dispatch({ type: "START_REVERSE_SEARCH" });
  }, []);

  const updateReverseSearch = useCallback((term: string, results: string[]) => {
    dispatch({ type: "UPDATE_REVERSE_SEARCH", payload: { term, results } });
  }, []);

  const setReverseSearchIndex = useCallback((index: number) => {
    dispatch({ type: "SET_REVERSE_SEARCH_INDEX", payload: index });
  }, []);

  const exitReverseSearch = useCallback(() => {
    dispatch({ type: "EXIT_REVERSE_SEARCH" });
  }, []);

  const showManPage = useCallback((page: string) => {
    dispatch({ type: "SHOW_MAN_PAGE", payload: page });
  }, []);

  const hideManPage = useCallback(() => {
    dispatch({ type: "HIDE_MAN_PAGE" });
  }, []);

  const setManPageScroll = useCallback((position: number) => {
    dispatch({ type: "SET_MAN_PAGE_SCROLL", payload: position });
  }, []);

  const addHistoryEntry = useCallback((entry: HistoryEntry) => {
    dispatch({ type: "ADD_HISTORY_ENTRY", payload: entry });
  }, []);

  const updateHistoryEntry = useCallback((id: number, entry: HistoryEntry) => {
    dispatch({ type: "UPDATE_HISTORY_ENTRY", payload: { id, entry } });
  }, []);

  const clearCommand = useCallback(() => {
    dispatch({ type: "CLEAR_COMMAND" });
  }, []);

  const minimizeTerminal = useCallback(() => {
    dispatch({ type: "MINIMIZE_TERMINAL" });
  }, []);

  const restoreTerminal = useCallback(() => {
    dispatch({ type: "RESTORE_TERMINAL" });
  }, []);

  const maximizeTerminal = useCallback(() => {
    dispatch({ type: "MAXIMIZE_TERMINAL" });
  }, []);

  const showPreview = useCallback(() => {
    dispatch({ type: "SHOW_PREVIEW" });
  }, []);

  const hidePreview = useCallback(() => {
    dispatch({ type: "HIDE_PREVIEW" });
  }, []);

  const resetTerminal = useCallback(() => {
    dispatch({ type: "RESET_TERMINAL" });
  }, []);

  return {
    // State
    state,

    // Dispatch function
    dispatch,

    // Actions
    executeCommand,
    handleTabComplete,
    setCurrentCommand,
    setShowPrompt,
    setTargetRoute,
    setAutocompleteIndex,
    setAutocompleteSuggestions,
    setCurrentDirectory,
    setIsMinimized,
    setIsMaximized,
    setShowPreview,
    setActiveTypewriter,
    setHistoryIndex,
    resetHistoryIndex,
    startReverseSearch,
    updateReverseSearch,
    setReverseSearchIndex,
    exitReverseSearch,
    showManPage,
    hideManPage,
    setManPageScroll,
    addHistoryEntry,
    updateHistoryEntry,
    clearCommand,
    minimizeTerminal,
    restoreTerminal,
    maximizeTerminal,
    showPreview,
    hidePreview,
    resetTerminal,

    // Refs
    terminalRef,
  };
};
