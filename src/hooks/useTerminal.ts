import { useCallback } from "react";
import {
  FileSystemItem,
  HistoryEntry,
  Command,
  CommandResult,
  CoreTerminalAction,
  CoreTerminalState,
} from "../types/terminal";
import { useTerminalCore } from "./useTerminalCore";
import { useTopCommand } from "./useTopCommand";
import { getFileContentByPath } from "../data/fileContents";

// Helper function to create properly typed history entries
const createHistoryEntry = (
  text: string,
  type?: "error" | "success" | "info" | "command",
  useTypewriter?: boolean,
  id?: number,
  highlightedText?: string
): HistoryEntry => ({
  id: id || 0, // Will be set by the caller
  text,
  type,
  useTypewriter,
  highlightedText,
});

// Shared helper function to get items in current directory
const getCurrentDirectoryItems = (
  fileSystem: FileSystemItem[],
  currentDir: string
): FileSystemItem[] => {
  if (currentDir === "/") {
    return fileSystem;
  }

  const pathParts = currentDir.split("/").filter((part) => part);
  let currentItems = fileSystem;

  for (const part of pathParts) {
    const item = currentItems.find((item) => item.name === part);
    if (item && item.type === "directory" && item.children) {
      currentItems = item.children;
    } else {
      return [];
    }
  }

  return currentItems;
};

// Advanced Command Implementations

class TopCommand implements Command {
  name = "top";

  execute(
    _args: string[],
    history: HistoryEntry[],
    _fileSystem: FileSystemItem[],
    dispatch: React.Dispatch<CoreTerminalAction>,
    _currentDirectory: string,
    _onNavigate?: (route: string) => void
  ): HistoryEntry[] {
    dispatch({ type: "SHOW_TOP_COMMAND" });
    return history;
  }

  getSuggestions(_input: string): string[] {
    return [];
  }
}

class CatCommand implements Command {
  name = "cat";

  execute(
    args: string[],
    history: HistoryEntry[],
    _fileSystem: FileSystemItem[],
    _dispatch: React.Dispatch<CoreTerminalAction>,
    currentDirectory: string,
    _onNavigate?: (route: string) => void,
    _state?: CoreTerminalState,
    _stdin?: string[],
    getFileContent?: (path: string) => { content: string[] } | null
  ): CommandResult {
    if (args.length === 0) {
      return [
        ...history,
        createHistoryEntry("cat: missing file operand", "error"),
      ];
    }

    const fileName = args[0];
    let filePath = fileName;

    // Handle relative paths
    if (!fileName.startsWith("/")) {
      if (currentDirectory.endsWith("/")) {
        filePath = currentDirectory + fileName;
      } else {
        filePath = currentDirectory + "/" + fileName;
      }
    }

    // Try to get file content
    const fileContent = getFileContent ? getFileContent(filePath) : null;
    if (!fileContent) {
      return [
        ...history,
        createHistoryEntry(
          `cat: ${fileName}: No such file or directory`,
          "error"
        ),
      ];
    }

    return [
      ...history,
      createHistoryEntry(fileContent.content.join("\n"), "success"),
    ];
  }

  getSuggestions(
    input: string,
    fileSystem: FileSystemItem[],
    currentDirectory: string
  ): string[] {
    // Get items in current directory
    const items = getCurrentDirectoryItems(fileSystem, currentDirectory);
    const files = items.filter((item) => item.type === "file");
    return files
      .map((item) => item.name)
      .filter((name) => name.startsWith(input));
  }
}

class GrepCommand implements Command {
  name = "grep";

  execute(
    args: string[],
    history: HistoryEntry[],
    _fileSystem: FileSystemItem[],
    _dispatch: React.Dispatch<CoreTerminalAction>,
    currentDirectory: string,
    _onNavigate?: (route: string) => void,
    _state?: CoreTerminalState,
    stdin?: string[],
    getFileContent?: (path: string) => { content: string[] } | null
  ): CommandResult {
    if (args.length === 0) {
      return [...history, createHistoryEntry("grep: missing pattern", "error")];
    }

    const pattern = args[0];
    const fileName = args[1];

    let lines: string[] = [];
    if (stdin && stdin.length > 0) {
      // Use stdin if provided (for piping)
      lines = stdin;
    } else if (fileName) {
      // Read from file
      let filePath = fileName;
      if (!fileName.startsWith("/")) {
        if (currentDirectory.endsWith("/")) {
          filePath = currentDirectory + fileName;
        } else {
          filePath = currentDirectory + "/" + fileName;
        }
      }

      const fileContent = getFileContent ? getFileContent(filePath) : null;
      if (!fileContent) {
        return [
          ...history,
          createHistoryEntry(
            `grep: ${fileName}: No such file or directory`,
            "error"
          ),
        ];
      }
      lines = fileContent.content;
    } else {
      return [
        ...history,
        createHistoryEntry("grep: missing file operand", "error"),
      ];
    }

    // Perform grep search
    const regex = new RegExp(pattern, "i");
    const matches = lines
      .map((line, index) => ({ line, lineNumber: index + 1 }))
      .filter(({ line }) => regex.test(line))
      .map(({ line, lineNumber }) => `${lineNumber}:${line}`);

    if (matches.length === 0) {
      return [...history, createHistoryEntry("No matches found", "info")];
    }

    return [
      ...history,
      createHistoryEntry(
        matches.join("\n"),
        "success",
        false,
        undefined,
        matches.map((match) => `\x1b[1;31m${match}\x1b[0m`).join("\n")
      ),
    ];
  }

  getSuggestions(
    input: string,
    fileSystem: FileSystemItem[],
    _currentDirectory: string
  ): string[] {
    const currentItems = getCurrentDirectoryItems(
      fileSystem,
      _currentDirectory
    );
    return currentItems
      .filter((item) => item.type === "file")
      .map((item) => item.name)
      .filter((name) => name.startsWith(input));
  }
}

class WcCommand implements Command {
  name = "wc";

  execute(
    args: string[],
    history: HistoryEntry[],
    _fileSystem: FileSystemItem[],
    _dispatch: React.Dispatch<CoreTerminalAction>,
    currentDirectory: string,
    _onNavigate?: (route: string) => void,
    _state?: CoreTerminalState,
    stdin?: string[],
    getFileContent?: (path: string) => { content: string[] } | null
  ): CommandResult {
    let lines: string[] = [];

    if (stdin && stdin.length > 0) {
      // Use stdin if provided (for piping)
      lines = stdin;
    } else if (args.length > 0) {
      // Read from file
      const fileName = args[0];
      let filePath = fileName;
      if (!fileName.startsWith("/")) {
        if (currentDirectory.endsWith("/")) {
          filePath = currentDirectory + fileName;
        } else {
          filePath = currentDirectory + "/" + fileName;
        }
      }

      const fileContent = getFileContent ? getFileContent(filePath) : null;
      if (!fileContent) {
        return [
          ...history,
          createHistoryEntry(
            `wc: ${fileName}: No such file or directory`,
            "error"
          ),
        ];
      }
      lines = fileContent.content;
    } else {
      return [
        ...history,
        createHistoryEntry("wc: missing file operand", "error"),
      ];
    }

    // Count lines, words, and characters
    const lineCount = lines.length;
    const wordCount = lines.reduce((total, line) => {
      return total + line.split(/\s+/).filter((word) => word.length > 0).length;
    }, 0);
    const charCount = lines.join("\n").length;

    const result = `${lineCount} ${wordCount} ${charCount}`;
    return [...history, createHistoryEntry(result, "success")];
  }

  getSuggestions(
    input: string,
    fileSystem: FileSystemItem[],
    _currentDirectory: string
  ): string[] {
    const currentItems = getCurrentDirectoryItems(
      fileSystem,
      _currentDirectory
    );
    return currentItems
      .filter((item) => item.type === "file")
      .map((item) => item.name)
      .filter((name) => name.startsWith(input));
  }
}

class CurlCommand implements Command {
  name = "curl";

  async execute(
    args: string[],
    history: HistoryEntry[],
    _fileSystem: FileSystemItem[],
    _dispatch: React.Dispatch<CoreTerminalAction>,
    _currentDirectory: string,
    _onNavigate?: (route: string) => void,
    _state?: CoreTerminalState
  ): Promise<HistoryEntry[]> {
    if (args.length === 0) {
      return [...history, createHistoryEntry("curl: missing URL", "error")];
    }

    const url = args[0];

    try {
      const response = await fetch(url);
      const data = await response.text();

      return [
        ...history,
        createHistoryEntry(
          `HTTP ${response.status} ${response.statusText}`,
          "info"
        ),
        createHistoryEntry(data, "success"),
      ];
    } catch (error) {
      return [
        ...history,
        createHistoryEntry(
          `curl: ${error instanceof Error ? error.message : String(error)}`,
          "error"
        ),
      ];
    }
  }

  getSuggestions(_input: string): string[] {
    const suggestions = ["https://", "http://"];
    return suggestions.filter((s) => s.startsWith(_input));
  }
}

// Extended command registry with advanced commands
const advancedCommands = [
  new TopCommand(),
  new CatCommand(),
  new GrepCommand(),
  new WcCommand(),
  new CurlCommand(),
];

export const useTerminal = (
  fileSystem: FileSystemItem[],
  onNavigate: (route: string) => void,
  _isVisible: boolean = true
) => {
  // Core terminal functionality
  const core = useTerminalCore(fileSystem, onNavigate);

  // Feature-specific hooks - these need to be updated to accept the correct parameters
  const topCommand = useTopCommand();

  // Enhanced command execution with advanced commands
  const executeCommand = useCallback(
    async (commandLine: string) => {
      const trimmedCommand = commandLine.trim();
      if (!trimmedCommand) return;

      // Parse command and arguments
      const parts = trimmedCommand.split(" ");
      const commandName = parts[0];
      const args = parts.slice(1);

      // Check for advanced commands first
      const advancedCommand = advancedCommands.find(
        (cmd) => cmd.name === commandName
      );
      if (advancedCommand) {
        // Execute advanced command
        const result = await advancedCommand.execute(
          args,
          core.state.commandHistory,
          fileSystem,
          core.dispatch,
          core.state.currentDirectory,
          onNavigate,
          core.state,
          undefined,
          getFileContentByPath
        );

        // Handle different result types
        if (Array.isArray(result)) {
          // HistoryEntry array
          core.dispatch({
            type: "SET_COMMAND_HISTORY",
            payload: result,
          });
        } else if (
          result &&
          typeof result === "object" &&
          "_effect" in result
        ) {
          // TypewriterEffect - handle differently
          console.log("Typewriter effect result:", result);
        } else if (
          result &&
          typeof result === "object" &&
          "history" in result
        ) {
          // PipeResult - use the history
          core.dispatch({
            type: "SET_COMMAND_HISTORY",
            payload: result.history,
          });
        }
        return;
      }

      // Fall back to core command execution
      await core.executeCommand(commandLine);
    },
    [core, fileSystem, onNavigate]
  );

  return {
    // Core state and handlers
    coreState: {
      commandHistory: core.state.commandHistory,
      currentCommand: core.state.currentCommand,
      showPrompt: core.state.showPrompt,
      currentDirectory: core.state.currentDirectory,
      isReverseSearch: core.state.isReverseSearch,
      reverseSearchTerm: core.state.reverseSearchTerm,
      reverseSearchResults: core.state.reverseSearchResults,
      reverseSearchIndex: core.state.reverseSearchIndex,
      autocompleteSuggestions: core.state.autocompleteSuggestions,
      autocompleteIndex: core.state.autocompleteIndex,
      isManPage: core.state.isManPage,
      currentManPage: core.state.currentManPage,
      manPageScrollPosition: core.state.manPageScrollPosition,
      nextHistoryId: core.state.nextHistoryId,
      historyIndex: core.state.historyIndex,
    },
    coreHandlers: {
      dispatch: core.dispatch,
      executeCommand: core.executeCommand,
      setCurrentCommand: core.setCurrentCommand,
      clearCommand: core.clearCommand,
      setShowPrompt: core.setShowPrompt,
      resetTerminal: core.resetTerminal,
      startReverseSearch: core.startReverseSearch,
      exitReverseSearch: core.exitReverseSearch,
      updateReverseSearch: core.updateReverseSearch,
      setReverseSearchIndex: core.setReverseSearchIndex,
      setAutocompleteIndex: core.setAutocompleteIndex,
      setAutocompleteSuggestions: core.setAutocompleteSuggestions,
      setHistoryIndex: core.setHistoryIndex,
      resetHistoryIndex: core.resetHistoryIndex,
      handleTabComplete: core.handleTabComplete,
      hideManPage: core.hideManPage,
      setManPageScroll: core.setManPageScroll,
      terminalRef: core.terminalRef,
    },

    // Top command state and handlers
    topState: topCommand.topState,
    topHandlers: {
      showTopCommand: topCommand.showTopCommand,
      hideTopCommand: topCommand.hideTopCommand,
      killTopProcess: topCommand.killTopProcess,
      setTopSort: topCommand.setTopSort,
      setTopRefreshRate: topCommand.setTopRefreshRate,
      setTopSelectedPid: topCommand.setTopSelectedPid,
    },

    // Combined execute command
    executeCommand,
  };
};
