import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./WelcomeScreen.css";
import TypeWriterText from "../TypeWriterText";
import MatrixBackground from "../MatrixBackground";
import { useTerminal } from "../../hooks/useTerminal";
import { FileSystemItem } from "../../types/terminal";

interface WelcomeScreenProps {
  onAnimationEnd: (route?: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onAnimationEnd }) => {
  const fileSystem: FileSystemItem[] = [
    {
      name: "about",
      type: "directory",
      permissions: "drwxr-xr-x",
      size: "4096",
      date: "Dec 15 10:30",
      children: [
        {
          name: "personal-info",
          type: "file",
          permissions: "-rw-r--r--",
          size: "2.1K",
          date: "Dec 15 10:30",
          route: "info/personal",
        },
        {
          name: "skills",
          type: "file",
          permissions: "-rw-r--r--",
          size: "1.8K",
          date: "Dec 15 10:30",
          route: "info/skills",
        },
        {
          name: "interests",
          type: "file",
          permissions: "-rw-r--r--",
          size: "1.5K",
          date: "Dec 15 10:30",
          route: "info/interests",
        },
      ],
    },
    {
      name: "projects",
      type: "directory",
      permissions: "drwxr-xr-x",
      size: "4096",
      date: "Dec 15 10:30",
      children: [
        {
          name: "workfolio",
          type: "directory",
          permissions: "drwxr-xr-x",
          size: "4096",
          date: "Dec 15 10:30",
          route: "projects/workfolio",
        },
        {
          name: "ecommerce-app",
          type: "directory",
          permissions: "drwxr-xr-x",
          size: "4096",
          date: "Dec 15 10:30",
          route: "projects/ecommerce",
        },
        {
          name: "task-manager",
          type: "directory",
          permissions: "drwxr-xr-x",
          size: "4096",
          date: "Dec 15 10:30",
          route: "projects/task-manager",
        },
        {
          name: "weather-app",
          type: "directory",
          permissions: "drwxr-xr-x",
          size: "4096",
          date: "Dec 15 10:30",
          route: "projects/weather",
        },
        {
          name: "blog-platform",
          type: "directory",
          permissions: "drwxr-xr-x",
          size: "4096",
          date: "Dec 15 10:30",
          route: "projects/blog",
        },
      ],
    },
    {
      name: "experience",
      type: "directory",
      permissions: "drwxr-xr-x",
      size: "4096",
      date: "Dec 15 10:30",
      children: [
        {
          name: "senior-developer",
          type: "file",
          permissions: "-rw-r--r--",
          size: "3.2K",
          date: "Dec 15 10:30",
          route: "work/senior",
        },
        {
          name: "full-stack-developer",
          type: "file",
          permissions: "-rw-r--r--",
          size: "2.8K",
          date: "Dec 15 10:30",
          route: "work/fullstack",
        },
        {
          name: "frontend-developer",
          type: "file",
          permissions: "-rw-r--r--",
          size: "2.5K",
          date: "Dec 15 10:30",
          route: "work/frontend",
        },
        {
          name: "internships",
          type: "file",
          permissions: "-rw-r--r--",
          size: "1.9K",
          date: "Dec 15 10:30",
          route: "work/internships",
        },
      ],
    },
    {
      name: "education",
      type: "directory",
      permissions: "drwxr-xr-x",
      size: "4096",
      date: "Dec 15 10:30",
      children: [
        {
          name: "bachelor-degree",
          type: "file",
          permissions: "-rw-r--r--",
          size: "2.3K",
          date: "Dec 15 10:30",
          route: "education/bachelor",
        },
        {
          name: "certifications",
          type: "file",
          permissions: "-rw-r--r--",
          size: "1.7K",
          date: "Dec 15 10:30",
          route: "education/certifications",
        },
        {
          name: "courses",
          type: "file",
          permissions: "-rw-r--r--",
          size: "2.1K",
          date: "Dec 15 10:30",
          route: "education/courses",
        },
        {
          name: "workshops",
          type: "file",
          permissions: "-rw-r--r--",
          size: "1.4K",
          date: "Dec 15 10:30",
          route: "education/workshops",
        },
      ],
    },
    {
      name: "certifications",
      type: "directory",
      permissions: "drwxr-xr-x",
      size: "4096",
      date: "Dec 15 10:30",
      children: [
        {
          name: "aws-certified",
          type: "file",
          permissions: "-rw-r--r--",
          size: "1.2K",
          date: "Dec 15 10:30",
          route: "certifications/aws",
        },
        {
          name: "google-cloud",
          type: "file",
          permissions: "-rw-r--r--",
          size: "1.1K",
          date: "Dec 15 10:30",
          route: "certifications/google",
        },
        {
          name: "microsoft-azure",
          type: "file",
          permissions: "-rw-r--r--",
          size: "1.3K",
          date: "Dec 15 10:30",
          route: "certifications/azure",
        },
        {
          name: "react-certification",
          type: "file",
          permissions: "-rw-r--r--",
          size: "0.9K",
          date: "Dec 15 10:30",
          route: "certifications/react",
        },
      ],
    },
    {
      name: "contact",
      type: "directory",
      permissions: "drwxr-xr-x",
      size: "4096",
      date: "Dec 15 10:30",
      children: [
        {
          name: "email",
          type: "file",
          permissions: "-rw-r--r--",
          size: "0.5K",
          date: "Dec 15 10:30",
          route: "contact/email",
        },
        {
          name: "linkedin",
          type: "file",
          permissions: "-rw-r--r--",
          size: "0.4K",
          date: "Dec 15 10:30",
          route: "contact/linkedin",
        },
        {
          name: "github",
          type: "file",
          permissions: "-rw-r--r--",
          size: "0.4K",
          date: "Dec 15 10:30",
          route: "contact/github",
        },
        {
          name: "phone",
          type: "file",
          permissions: "-rw-r--r--",
          size: "0.3K",
          date: "Dec 15 10:30",
          route: "contact/phone",
        },
      ],
    },
    {
      name: "resume",
      type: "file",
      permissions: "-rw-r--r--",
      size: "245K",
      date: "Dec 15 10:30",
      route: "resume",
    },
    {
      name: "games",
      type: "directory",
      permissions: "drwxr-xr-x",
      size: "4096",
      date: "Dec 15 10:30",
      children: [
        {
          name: "snake-game",
          type: "file",
          permissions: "-rw-r--r--",
          size: "15K",
          date: "Dec 15 10:30",
          route: "games/snake",
        },
        {
          name: "tetris",
          type: "file",
          permissions: "-rw-r--r--",
          size: "22K",
          date: "Dec 15 10:30",
          route: "games/tetris",
        },
        {
          name: "puzzle-game",
          type: "file",
          permissions: "-rw-r--r--",
          size: "18K",
          date: "Dec 15 10:30",
          route: "games/puzzle",
        },
      ],
    },
  ];

  const {
    commandHistory,
    currentCommand,
    showPrompt,
    fadeOutWelcome,
    autocompleteIndex,
    currentDirectory,
    isMinimized,
    terminalRef,
    executeCommand,
    handleTabComplete,
    setCurrentCommand,
    setShowPrompt,
    setAutocompleteIndex,
    clearCommand,
    minimizeTerminal,
    restoreTerminal,
    handleAnimationComplete,
  } = useTerminal(fileSystem, onAnimationEnd);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    if (showPrompt && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showPrompt]);

  useEffect(() => {
    if (terminalRef.current) {
      // Always scroll to bottom when new content is added
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commandHistory, terminalRef]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && currentCommand.trim()) {
      executeCommand(currentCommand.trim());
      clearCommand();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const result = handleTabComplete(currentCommand, autocompleteIndex);
      setCurrentCommand(result.currentCommand);
      setAutocompleteIndex(result.autocompleteIndex);
    }
  };

  const handleCloseButton = () => {
    // Execute a custom close command that will trigger navigation
    executeCommand("exit");
  };

  // Remove the problematic state variables
  // const [isRestoring, setIsRestoring] = useState(false);
  // const [isReceiving, setIsReceiving] = useState(false);
  // const [animationKey, setAnimationKey] = useState(0);

  // Create a single handler for restoring
  const handleRestore = () => {
    restoreTerminal(); // This function from your hook should set isMinimized to false
  };

  // Simplify the main button handler
  const handleMinimizeButton = () => {
    if (isMinimized) {
      handleRestore();
    } else {
      minimizeTerminal(); // This function should set isMinimized to true
    }
  };

  const handleMaximizeButton = () => {
    // For now, just log - could be used for maximizing the terminal
    console.log("Maximize clicked");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  const promptVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  };

  return (
    <AnimatePresence mode="wait" onExitComplete={handleAnimationComplete}>
      {!fadeOutWelcome && (
        <motion.div
          className="welcome-screen"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <MatrixBackground />

          {/* Sidecar for minimized terminal */}
          <AnimatePresence>
            {isMinimized && (
              <motion.div
                className="terminal-sidecar"
                initial={{ x: -200, opacity: 0, scale: 0.8 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                exit={{ x: -200, opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, ease: [0.4, 0.0, 0.2, 1] }}
                onClick={() => {
                  handleRestore();
                }}
              >
                <div className="sidecar-icon">💻</div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            className="terminal-container"
            style={{
              opacity: isMinimized ? 0 : 1,
              pointerEvents: isMinimized ? "none" : "auto",
            }}
            animate={{
              x: isMinimized ? "-50vw" : 0,
              scale: isMinimized ? 0.1 : 1,
            }}
            transition={{
              duration: 0.5,
              ease: [0.4, 0.0, 0.2, 1],
            }}
          >
            <div className="terminal-header">
              <div className="terminal-buttons">
                <button
                  className="terminal-button close"
                  onClick={handleCloseButton}
                  title="Close terminal"
                  aria-label="Close terminal"
                ></button>
                <button
                  className="terminal-button minimize"
                  onClick={handleMinimizeButton}
                  title="Minimize terminal"
                  aria-label="Minimize terminal"
                ></button>
                <button
                  className="terminal-button maximize"
                  onClick={handleMaximizeButton}
                  title="Maximize terminal"
                  aria-label="Maximize terminal"
                ></button>
              </div>
              <div className="terminal-title">
                portfolio@kareem-sasa:
                {currentDirectory === "/" ? "~" : currentDirectory}
              </div>
            </div>

            <div className="terminal-body" ref={terminalRef}>
              <div className="welcome-message">
                <TypeWriterText
                  text="Welcome to my portfolio, I'm really glad you're here."
                  delay={0}
                  speed={30}
                  onComplete={() => {
                    setTimeout(() => setShowPrompt(true), 200);
                  }}
                />
              </div>

              <div className="command-history">
                {commandHistory.map((line, index) => (
                  <div
                    key={index}
                    className={`history-line ${line.type || ""}`}
                  >
                    {line.text}
                  </div>
                ))}
              </div>

              {showPrompt && (
                <motion.div
                  className="command-prompt"
                  variants={promptVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <span className="prompt-symbol">
                    portfolio@kareem-sasa:
                    {currentDirectory === "/" ? "~" : currentDirectory}$
                  </span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={currentCommand}
                    onChange={(e) => setCurrentCommand(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onKeyDown={handleKeyDown}
                    className="command-input"
                    placeholder="Type 'help' for available commands"
                    autoFocus
                  />
                  <span className="cursor">|</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeScreen;
