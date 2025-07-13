import { useRef, useCallback, useReducer } from "react";
import {
  FileSystemItem,
  HistoryEntry,
  TerminalState,
  Command,
  TabCompleteResult,
  TerminalAction,
} from "../types/terminal";

// Terminal reducer function
const terminalReducer = (
  state: TerminalState,
  action: TerminalAction
): TerminalState => {
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

    case "SET_FADE_OUT_WELCOME":
      return { ...state, fadeOutWelcome: action.payload };

    case "SET_CURRENT_DIRECTORY":
      return { ...state, currentDirectory: action.payload };

    case "SET_IS_MINIMIZED":
      return { ...state, isMinimized: action.payload };

    case "SET_SHOW_PREVIEW":
      return { ...state, showPreview: action.payload };

    case "ADD_HISTORY_ENTRY":
      return {
        ...state,
        commandHistory: [...state.commandHistory, action.payload],
      };

    case "CLEAR_COMMAND":
      return {
        ...state,
        currentCommand: "",
        autocompleteIndex: 0,
      };

    case "MINIMIZE_TERMINAL":
      return {
        ...state,
        isMinimized: true,
      };

    case "RESTORE_TERMINAL":
      return {
        ...state,
        isMinimized: false,
        showPreview: false,
      };

    case "SHOW_PREVIEW":
      return {
        ...state,
        showPreview: true,
      };

    case "HIDE_PREVIEW":
      return {
        ...state,
        showPreview: false,
      };

    case "FADE_OUT_WELCOME":
      return {
        ...state,
        fadeOutWelcome: true,
      };

    default:
      return state;
  }
};

// File content mapping for specific files
const fileContents: Record<string, string[]> = {
  "personal-info": [
    "=== Personal Information ===",
    "",
    "Name: Kareem Sasa",
    "Title: Full Stack Developer",
    "Location: [Your Location]",
    "Email: [Your Email]",
    "",
    "About Me:",
    "I am a passionate full stack developer with expertise in modern web technologies.",
    "I love creating elegant solutions to complex problems and building user-friendly applications.",
    "My journey in software development started with curiosity and has evolved into a career",
    "filled with continuous learning and growth.",
    "",
    "Skills:",
    "- Frontend: React, TypeScript, JavaScript, HTML, CSS",
    "- Backend: Node.js, Python, Express, Django",
    "- Database: MongoDB, PostgreSQL, MySQL",
    "- DevOps: Docker, AWS, CI/CD",
    "- Tools: Git, VS Code, Figma",
    "",
    "Interests:",
    "- Web Development",
    "- Open Source Projects",
    "- Learning New Technologies",
    "- Problem Solving",
    "- User Experience Design",
    "",
    "I'm always excited to work on new projects and collaborate with talented developers.",
    "Feel free to reach out if you'd like to connect or discuss potential opportunities!",
  ],
  skills: [
    "=== Technical Skills ===",
    "",
    "Programming Languages:",
    "- JavaScript/TypeScript (Advanced)",
    "- Python (Intermediate)",
    "- Java (Intermediate)",
    "- HTML/CSS (Advanced)",
    "",
    "Frontend Technologies:",
    "- React.js & React Native",
    "- Vue.js",
    "- Angular",
    "- Next.js",
    "- Tailwind CSS",
    "- Bootstrap",
    "",
    "Backend Technologies:",
    "- Node.js & Express",
    "- Python Flask/Django",
    "- RESTful APIs",
    "- GraphQL",
    "",
    "Databases:",
    "- MongoDB",
    "- PostgreSQL",
    "- MySQL",
    "- Redis",
    "",
    "DevOps & Tools:",
    "- Docker & Kubernetes",
    "- AWS/Google Cloud",
    "- Git & GitHub",
    "- CI/CD Pipelines",
    "- Linux/Unix",
    "",
    "Other Skills:",
    "- Agile/Scrum Methodologies",
    "- Test-Driven Development",
    "- Performance Optimization",
    "- Security Best Practices",
    "- UI/UX Design Principles",
  ],
  interests: [
    "=== Personal Interests ===",
    "",
    "Technology:",
    "- Artificial Intelligence & Machine Learning",
    "- Blockchain & Web3",
    "- Mobile App Development",
    "- Cloud Computing",
    "- Cybersecurity",
    "",
    "Professional Development:",
    "- Open Source Contributions",
    "- Technical Blogging",
    "- Conference Speaking",
    "- Mentoring Junior Developers",
    "- Learning New Programming Languages",
    "",
    "Personal:",
    "- Reading Tech Books & Articles",
    "- Playing Strategy Games",
    "- Hiking & Outdoor Activities",
    "- Photography",
    "- Travel & Cultural Exploration",
    "",
    "Community:",
    "- Local Developer Meetups",
    "- Online Tech Communities",
    "- Code Review & Collaboration",
    "- Knowledge Sharing",
    "",
    "I believe in continuous learning and staying updated with the latest",
    "technologies and industry trends to deliver the best solutions.",
  ],
};

// Helper function to create properly typed history entries
const createHistoryEntry = (
  text: string,
  type?: "error" | "success" | "info" | "command"
): HistoryEntry => ({
  text,
  type,
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

// Individual Command Implementations
class LsCommand implements Command {
  name = "ls";

  execute(
    args: string[],
    history: HistoryEntry[],
    fileSystem: FileSystemItem[],
    _dispatch: React.Dispatch<TerminalAction>,
    currentDirectory: string
  ): HistoryEntry[] {
    const newHistory = [...history];

    const currentItems = getCurrentDirectoryItems(fileSystem, currentDirectory);
    const showHidden = args.includes("-a");
    const showDetails = args.includes("-l");

    // Get items to display (including hidden if -a flag is used)
    let itemsToShow = [...currentItems];
    if (showHidden) {
      itemsToShow = [
        {
          name: ".",
          type: "directory",
          permissions: "drwxr-xr-x",
          size: "4096",
          date: "Dec 15 10:30",
        },
        {
          name: "..",
          type: "directory",
          permissions: "drwxr-xr-x",
          size: "4096",
          date: "Dec 15 10:30",
        },
        ...currentItems,
      ];
    }

    if (showDetails) {
      // Show detailed format
      newHistory.push(createHistoryEntry("total 32", "info"));
      itemsToShow.forEach((item) => {
        const icon = item.type === "directory" ? "📁" : "📄";
        newHistory.push(
          createHistoryEntry(
            `${item.permissions} 1 user group ${item.size.padStart(8)} ${
              item.date
            } ${icon} ${item.name}`,
            "info"
          )
        );
      });
    } else {
      // Show simple format
      const names = itemsToShow.map((item) => item.name);
      newHistory.push(createHistoryEntry(names.join("  "), "info"));
    }

    return newHistory;
  }

  getSuggestions(input: string): string[] {
    const suggestions = [];
    if (input.toLowerCase().startsWith("ls")) {
      suggestions.push("ls", "ls -l", "ls -a", "ls -al");
    }
    return suggestions.filter((s) =>
      s.toLowerCase().startsWith(input.toLowerCase())
    );
  }
}

class CdCommand implements Command {
  name = "cd";

  execute(
    args: string[],
    history: HistoryEntry[],
    fileSystem: FileSystemItem[],
    dispatch: React.Dispatch<TerminalAction>,
    currentDirectory: string
  ): HistoryEntry[] {
    const newHistory = [...history];
    const target = args[0];

    // Handle special cases
    if (!target || target === "~") {
      // Go to home directory (root)
      dispatch({ type: "SET_CURRENT_DIRECTORY", payload: "/" });
      newHistory.push(
        createHistoryEntry("Changed to home directory", "success")
      );
      return newHistory;
    }

    if (target === "..") {
      // Go up one directory
      if (currentDirectory === "/") {
        newHistory.push(
          createHistoryEntry("Already at root directory", "info")
        );
        return newHistory;
      }
      const newPath = currentDirectory.split("/").slice(0, -1).join("/") || "/";
      dispatch({ type: "SET_CURRENT_DIRECTORY", payload: newPath });
      newHistory.push(createHistoryEntry(`Changed to ${newPath}`, "success"));
      return newHistory;
    }

    // Helper function to find item by path
    const findItemByPath = (path: string): FileSystemItem | null => {
      if (path === "/") return null;

      const pathParts = path.split("/").filter((part) => part);
      let currentItems = fileSystem;

      for (let i = 0; i < pathParts.length; i++) {
        const part = pathParts[i];
        const item = currentItems.find((item) => item.name === part);

        if (!item) return null;

        if (i === pathParts.length - 1) {
          return item;
        }

        if (item.type === "directory" && item.children) {
          currentItems = item.children;
        } else {
          return null;
        }
      }

      return null;
    };

    const currentItems = getCurrentDirectoryItems(fileSystem, currentDirectory);
    const item = currentItems.find((fs) => fs.name === target);

    if (item && item.type === "directory") {
      const newPath =
        currentDirectory === "/"
          ? `/${target}`
          : `${currentDirectory}/${target}`;
      dispatch({ type: "SET_CURRENT_DIRECTORY", payload: newPath });
      newHistory.push(createHistoryEntry(`Changed to ${newPath}`, "success"));
    } else if (item && item.type === "file") {
      newHistory.push(
        createHistoryEntry(
          `Error: ${target} is a file, not a directory.`,
          "error"
        )
      );
    } else {
      // Check if this is a project directory that should open a page
      const fullPath =
        currentDirectory === "/"
          ? `/${target}`
          : `${currentDirectory}/${target}`;
      const pathItem = findItemByPath(fullPath);

      if (pathItem && pathItem.route) {
        newHistory.push(createHistoryEntry(`Opening ${target}...`, "info"));
        newHistory.push(
          createHistoryEntry(
            `Access granted. Opening ${target} page.`,
            "success"
          )
        );
        const route = `/${pathItem.route}`;
        dispatch({ type: "SET_TARGET_ROUTE", payload: route });
        setTimeout(() => {
          dispatch({ type: "SET_FADE_OUT_WELCOME", payload: true });
        }, 1500);
      } else {
        newHistory.push(
          createHistoryEntry(`Error: Directory '${target}' not found.`, "error")
        );
        newHistory.push(
          createHistoryEntry(
            `Available directories: ${currentItems
              .filter((fs) => fs.type === "directory")
              .map((fs) => fs.name)
              .join(", ")}`,
            "info"
          )
        );
      }
    }

    return newHistory;
  }

  getSuggestions(
    input: string,
    fileSystem: FileSystemItem[],
    currentDirectory: string
  ): string[] {
    if (input.toLowerCase().startsWith("cd ")) {
      const partialDir = input.substring(3).trim();
      const currentItems = getCurrentDirectoryItems(
        fileSystem,
        currentDirectory
      );
      return currentItems
        .filter((item) =>
          item.name.toLowerCase().startsWith(partialDir.toLowerCase())
        )
        .map((item) => `cd ${item.name}`);
    }
    return [];
  }
}

class HelpCommand implements Command {
  name = "help";

  execute(_args: string[], history: HistoryEntry[]): HistoryEntry[] {
    const newHistory = [...history];
    newHistory.push(createHistoryEntry("Available commands:", "info"));
    newHistory.push(
      createHistoryEntry(
        "  ls         List files and directories (names only)",
        "info"
      )
    );
    newHistory.push(
      createHistoryEntry("  ls -l      List files in long format", "info")
    );
    newHistory.push(
      createHistoryEntry("  ls -a      List all files including hidden", "info")
    );
    newHistory.push(
      createHistoryEntry("  ls -al     List all files in long format", "info")
    );
    newHistory.push(
      createHistoryEntry("  cd <dir>   Navigate to directory", "info")
    );
    newHistory.push(
      createHistoryEntry("  pwd        Show current working directory", "info")
    );
    newHistory.push(
      createHistoryEntry(
        "  cat <file> View file contents or open file page",
        "info"
      )
    );
    newHistory.push(
      createHistoryEntry(
        "  exit       Close terminal and go to home page",
        "info"
      )
    );
    newHistory.push(
      createHistoryEntry("  help       Show this help message", "info")
    );
    newHistory.push(createHistoryEntry("  clear      Clear terminal", "info"));
    newHistory.push(createHistoryEntry("", "info"));
    newHistory.push(
      createHistoryEntry(
        "Tip: Press Tab to autocomplete commands and directory names",
        "info"
      )
    );
    return newHistory;
  }
}

class ClearCommand implements Command {
  name = "clear";

  execute(_args: string[], _history: HistoryEntry[]): HistoryEntry[] {
    return [];
  }
}

class PwdCommand implements Command {
  name = "pwd";

  execute(
    _args: string[],
    history: HistoryEntry[],
    _fileSystem: FileSystemItem[],
    _dispatch: React.Dispatch<TerminalAction>,
    currentDirectory: string
  ): HistoryEntry[] {
    const newHistory = [...history];
    const displayPath = currentDirectory === "/" ? "/" : currentDirectory;
    newHistory.push(createHistoryEntry(displayPath, "info"));
    return newHistory;
  }
}

class ExitCommand implements Command {
  name = "exit";

  execute(
    _args: string[],
    history: HistoryEntry[],
    _fileSystem: FileSystemItem[],
    dispatch: React.Dispatch<TerminalAction>,
    _currentDirectory: string
  ): HistoryEntry[] {
    const newHistory = [...history];
    newHistory.push(createHistoryEntry("Closing terminal...", "info"));
    newHistory.push(
      createHistoryEntry("Access granted. Opening home page.", "success")
    );

    // Set the target route and trigger fade out
    dispatch({
      type: "SET_TARGET_ROUTE",
      payload: "/",
    });
    dispatch({ type: "SET_FADE_OUT_WELCOME", payload: true });

    return newHistory;
  }
}

class CatCommand implements Command {
  name = "cat";

  execute(
    args: string[],
    history: HistoryEntry[],
    fileSystem: FileSystemItem[],
    dispatch: React.Dispatch<TerminalAction>,
    currentDirectory: string
  ): HistoryEntry[] {
    const newHistory = [...history];
    const filename = args[0];

    if (!filename) {
      newHistory.push(
        createHistoryEntry("Error: Please specify a file to view", "error")
      );
      return newHistory;
    }

    const currentItems = getCurrentDirectoryItems(fileSystem, currentDirectory);
    const file = currentItems.find((item) => item.name === filename);

    if (!file) {
      newHistory.push(
        createHistoryEntry(`Error: File '${filename}' not found`, "error")
      );
      return newHistory;
    }

    if (file.type !== "file") {
      newHistory.push(
        createHistoryEntry(`Error: '${filename}' is not a file`, "error")
      );
      return newHistory;
    }

    // Check if we have content for this specific file first
    const content = fileContents[filename];
    if (content) {
      // Display the actual file content
      content.forEach((line) => {
        newHistory.push(createHistoryEntry(line, "info"));
      });
    } else if (file.route) {
      // This is a file that should open a page (only if no specific content is defined)
      newHistory.push(createHistoryEntry(`Opening ${filename}...`, "info"));
      newHistory.push(
        createHistoryEntry(
          `Access granted. Opening ${filename} page.`,
          "success"
        )
      );
      const route = `/${file.route}`;
      dispatch({ type: "SET_TARGET_ROUTE", payload: route });
      setTimeout(() => {
        dispatch({ type: "SET_FADE_OUT_WELCOME", payload: true });
      }, 1500);
    } else {
      // Show file contents (simulated) for files without specific content
      newHistory.push(createHistoryEntry(`--- ${filename} ---`, "info"));
      newHistory.push(createHistoryEntry(`File size: ${file.size}`, "info"));
      newHistory.push(
        createHistoryEntry(`Last modified: ${file.date}`, "info")
      );
      newHistory.push(
        createHistoryEntry(`Permissions: ${file.permissions}`, "info")
      );
      newHistory.push(createHistoryEntry("", "info"));
      newHistory.push(
        createHistoryEntry("(File content would be displayed here)", "info")
      );
    }

    return newHistory;
  }

  getSuggestions(
    input: string,
    fileSystem: FileSystemItem[],
    currentDirectory: string
  ): string[] {
    if (input.toLowerCase().startsWith("cat ")) {
      const partialFile = input.substring(4).trim();
      const currentItems = getCurrentDirectoryItems(
        fileSystem,
        currentDirectory
      );
      return currentItems
        .filter(
          (item) =>
            item.type === "file" &&
            item.name.toLowerCase().startsWith(partialFile.toLowerCase())
        )
        .map((item) => `cat ${item.name}`);
    }
    return [];
  }
}

const availableCommands = [
  "ls",
  "ls -l",
  "ls -a",
  "ls -al",
  "cd",
  "help",
  "clear",
  "pwd",
  "cat",
  "exit",
];

export const useTerminal = (
  fileSystem: FileSystemItem[],
  onNavigate: (route: string) => void
) => {
  const [state, dispatch] = useReducer(terminalReducer, {
    commandHistory: [],
    currentCommand: "",
    showPrompt: false,
    targetRoute: "/",
    autocompleteIndex: 0,
    fadeOutWelcome: false,
    currentDirectory: "/", // Start at root
    isMinimized: false,
    showPreview: false,
  });

  const terminalRef = useRef<HTMLDivElement>(null);

  // Helper function to find item by path
  const findItemByPath = useCallback(
    (path: string): FileSystemItem | null => {
      if (path === "/") return null;

      const pathParts = path.split("/").filter((part) => part);
      let currentItems = fileSystem;

      for (let i = 0; i < pathParts.length; i++) {
        const part = pathParts[i];
        const item = currentItems.find((item) => item.name === part);

        if (!item) return null;

        if (i === pathParts.length - 1) {
          return item;
        }

        if (item.type === "directory" && item.children) {
          currentItems = item.children;
        } else {
          return null;
        }
      }

      return null;
    },
    [fileSystem]
  );

  // Command registry using Command Pattern
  const commandRegistry: Record<string, Command> = {
    ls: new LsCommand(),
    cd: new CdCommand(),
    help: new HelpCommand(),
    clear: new ClearCommand(),
    pwd: new PwdCommand(),
    cat: new CatCommand(),
    exit: new ExitCommand(),
  };

  const executeCommand = useCallback(
    (command: string) => {
      const newHistoryEntry = createHistoryEntry(`$ ${command}`, "command");
      dispatch({ type: "ADD_HISTORY_ENTRY", payload: newHistoryEntry });

      const [commandName, ...args] = command.split(" ");

      // Expand combined flags (e.g., -al becomes -a -l)
      const expandedArgs: string[] = [];
      args.forEach((arg) => {
        if (arg.startsWith("-") && arg.length > 2) {
          // Split combined flags like -al into -a -l
          for (let i = 1; i < arg.length; i++) {
            expandedArgs.push(`-${arg[i]}`);
          }
        } else {
          expandedArgs.push(arg);
        }
      });

      if (commandRegistry[commandName]) {
        const updatedHistory = commandRegistry[commandName].execute(
          expandedArgs,
          [...state.commandHistory, newHistoryEntry], // Pass the updated history
          fileSystem,
          dispatch, // Pass dispatch instead of setState
          state.currentDirectory
        );
        dispatch({ type: "SET_COMMAND_HISTORY", payload: updatedHistory });
      } else {
        dispatch({
          type: "ADD_HISTORY_ENTRY",
          payload: createHistoryEntry(
            `Command not found: ${command}. Type 'help' for available commands.`,
            "error"
          ),
        });
      }
    },
    [
      state.commandHistory,
      state.currentDirectory,
      fileSystem,
      commandRegistry,
      dispatch,
    ]
  );

  const getAutocompleteSuggestions = useCallback(
    (input: string): string[] => {
      if (!input.trim()) return [];

      const suggestions: string[] = [];
      // Use the shared helper
      const currentItems = getCurrentDirectoryItems(
        fileSystem,
        state.currentDirectory
      );

      // Check for commands
      availableCommands.forEach((cmd) => {
        if (cmd.toLowerCase().startsWith(input.toLowerCase())) {
          suggestions.push(cmd);
        }
      });

      // Check for cd command with directory names
      if (input.toLowerCase().startsWith("cd ")) {
        const partialPath = input.substring(3).trim();

        // Split the path to get the directory and the partial name
        const pathParts = partialPath.split("/");
        const basePath = pathParts.slice(0, -1).join("/");
        const partialName = pathParts[pathParts.length - 1];

        // Get the items from the base path
        let targetItems = fileSystem;
        if (basePath) {
          const basePathParts = basePath.split("/").filter((part) => part);
          for (const part of basePathParts) {
            const item = targetItems.find((item) => item.name === part);
            if (item && item.type === "directory" && item.children) {
              targetItems = item.children;
            } else {
              targetItems = [];
              break;
            }
          }
        } else {
          targetItems = currentItems;
        }

        // Find matching items
        targetItems.forEach((item) => {
          if (item.name.toLowerCase().startsWith(partialName.toLowerCase())) {
            const fullPath = basePath ? `${basePath}/${item.name}` : item.name;
            suggestions.push(`cd ${fullPath}`);
          }
        });
      }

      // Check for cat command with file names
      if (input.toLowerCase().startsWith("cat ")) {
        const partialFile = input.substring(4).trim();
        currentItems.forEach((item) => {
          if (
            item.type === "file" &&
            item.name.toLowerCase().startsWith(partialFile.toLowerCase())
          ) {
            suggestions.push(`cat ${item.name}`);
          }
        });
      }

      return suggestions;
    },
    [state.currentDirectory, fileSystem] // Update dependency array
  );

  const handleTabComplete = useCallback(
    (currentCommand: string, autocompleteIndex: number): TabCompleteResult => {
      const suggestions = getAutocompleteSuggestions(currentCommand);

      if (suggestions.length === 0) {
        // No suggestions, reset index.
        return { currentCommand, autocompleteIndex: 0 };
      }

      if (suggestions.length === 1) {
        // One suggestion, complete and reset index.
        return { currentCommand: suggestions[0], autocompleteIndex: 0 };
      }

      // Multiple suggestions:
      if (autocompleteIndex === 0) {
        // First Tab: Display suggestions in history.
        const newHistory = [...state.commandHistory];
        const filteredHistory = newHistory.filter(
          (entry) =>
            !entry.text.startsWith("Suggestions:") &&
            !entry.text.startsWith("  ")
        );
        const updatedHistory = [
          ...filteredHistory,
          createHistoryEntry(`$ ${currentCommand}`, "command"), // Re-add the current command for context
          createHistoryEntry(suggestions.join("  "), "info"), // Show suggestions in a single line
        ];
        dispatch({ type: "SET_COMMAND_HISTORY", payload: updatedHistory });

        // Don't change the command, but prepare for cycling.
        // We set the next command and the next index here.
        return {
          currentCommand: suggestions[0], // Show the first suggestion immediately
          autocompleteIndex: 1, // Next tab will go to index 1
        };
      } else {
        // Subsequent Tabs: Cycle through suggestions.
        const nextIndex = autocompleteIndex % suggestions.length;
        return {
          currentCommand: suggestions[nextIndex],
          autocompleteIndex: autocompleteIndex + 1, // Increment for the next cycle
        };
      }
    },
    [getAutocompleteSuggestions, state.commandHistory, dispatch]
  );

  const setCurrentCommand = useCallback((command: string) => {
    dispatch({ type: "SET_CURRENT_COMMAND", payload: command });
  }, []);

  const setShowPrompt = useCallback((show: boolean) => {
    dispatch({ type: "SET_SHOW_PROMPT", payload: show });
  }, []);

  const setAutocompleteIndex = useCallback((index: number) => {
    dispatch({ type: "SET_AUTOCOMPLETE_INDEX", payload: index });
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

  const showPreviewFunc = useCallback(() => {
    if (state.isMinimized) {
      dispatch({ type: "SHOW_PREVIEW" });
    }
  }, [state.isMinimized]);

  const hidePreview = useCallback(() => {
    dispatch({ type: "HIDE_PREVIEW" });
  }, []);

  const handleAnimationComplete = useCallback(() => {
    if (state.fadeOutWelcome) {
      onNavigate(state.targetRoute);
    }
  }, [state.fadeOutWelcome, state.targetRoute, onNavigate]);

  return {
    // State
    commandHistory: state.commandHistory,
    currentCommand: state.currentCommand,
    showPrompt: state.showPrompt,
    fadeOutWelcome: state.fadeOutWelcome,
    autocompleteIndex: state.autocompleteIndex,
    currentDirectory: state.currentDirectory,
    isMinimized: state.isMinimized,
    showPreview: state.showPreview,

    // Refs
    terminalRef,

    // Actions
    executeCommand,
    getAutocompleteSuggestions,
    handleTabComplete,
    setCurrentCommand,
    setShowPrompt,
    setAutocompleteIndex,
    clearCommand,
    minimizeTerminal,
    restoreTerminal,
    showPreviewFunc,
    hidePreview,
    handleAnimationComplete,

    // Helpers
    findItemByPath,

    // Computed
    isLoading: false,
  };
};
