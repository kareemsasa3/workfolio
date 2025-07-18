import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";
import "./Terminal.css";
import TypeWriterText from "../TypeWriterText";
import { useTerminal } from "../../hooks/useTerminal";
import { fileSystem } from "../../data/fileSystem";
import ManPageUI from "./ManPageUI";
import TopUI from "./TopUI";
import VimUI from "./VimUI";
import { ScrapeResults } from "../ScrapeResults";
import { manPages } from "../../data/manPages";

interface TerminalProps {
  isIntro: boolean;
}

const Terminal: React.FC<TerminalProps> = ({ isIntro }) => {
  const navigate = useNavigate();

  // Helper functions (defined before state to avoid hoisting issues)
  const getTerminalDimensions = useCallback(() => {
    return {
      width: Math.min(window.innerWidth * 0.9, 800),
      height: Math.min(window.innerHeight * 0.7, 600),
    };
  }, []);

  const calculateCenteredPosition = useCallback(() => {
    if (typeof window === "undefined") return { x: 0, y: 0 };

    const { width: terminalWidth, height: terminalHeight } =
      getTerminalDimensions();

    // Always use viewport positioning since we're using a portal
    return {
      x: (window.innerWidth - terminalWidth) / 2,
      y: (window.innerHeight - terminalHeight) / 2,
    };
  }, [getTerminalDimensions]);

  const keepPositionInBounds = useCallback(
    (pos: { x: number; y: number }) => {
      const { width: terminalWidth, height: terminalHeight } =
        getTerminalDimensions();

      // Always use viewport boundaries since we're using a portal
      const maxX = window.innerWidth - terminalWidth;
      const maxY = window.innerHeight - terminalHeight;
      return {
        x: Math.max(0, Math.min(pos.x, maxX)),
        y: Math.max(0, Math.min(pos.y, maxY)),
      };
    },
    [getTerminalDimensions]
  );

  // State initialization
  const [hasShownIntro, setHasShownIntro] = useState(() => {
    // Check localStorage to see if intro has been shown before
    return localStorage.getItem("terminal-intro-shown") === "true";
  });

  // Track when terminal state is loaded
  const [isStateLoaded, setIsStateLoaded] = useState(false);

  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  // Calculate initial position synchronously to avoid race conditions
  const getInitialPosition = () => {
    // Gracefully handle Server-Side Rendering (SSR) where `window` is not defined.
    if (typeof window === "undefined") {
      return null;
    }
    return calculateCenteredPosition();
  };

  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    getInitialPosition
  );

  // The navigation handler is now just the navigate function
  const handleRouteNavigation = (route: string) => {
    navigate(route);
  };

  const {
    commandHistory,
    currentCommand,
    showPrompt,
    autocompleteIndex,
    currentDirectory,
    isMinimized,
    isMaximized,
    terminalRef,
    executeCommand,
    handleTabComplete,
    setCurrentCommand,
    setShowPrompt,
    setAutocompleteIndex,
    clearCommand,
    minimizeTerminal,
    restoreTerminal,
    maximizeTerminal,
    navigateHistoryUp,
    navigateHistoryDown,
    startReverseSearch,
    updateReverseSearch,
    navigateReverseSearchResults,
    exitReverseSearch,
    isReverseSearch,
    reverseSearchTerm,
    reverseSearchResults,
    reverseSearchIndex,
    hideManPage,
    setManPageScroll,
    isManPage,
    currentManPage,
    manPageScrollPosition,
    hideTopCommand,
    setTopSort,
    setTopSelectedPid,
    killTopProcess,
    isTopCommand,
    topProcesses,
    topSortBy,
    topSortOrder,
    topRefreshRate,
    topSelectedPid,

    // Vim editor functionality
    isVimEditing,
    vimFileContent,
    vimFilePath,

    // Scrape results functionality
    showScrapeResults,
    scrapeResults,
    dispatch,
  } = useTerminal(
    fileSystem,
    handleRouteNavigation,
    !isIntro // Tell the hook to be "minimized" (like stage manager) if it's the intro
  );

  const inputRef = useRef<HTMLInputElement>(null);

  // Stabilize viewport to prevent scrollbar race condition
  useEffect(() => {
    if (isIntro) {
      // Store the original overflow values
      const originalOverflowY = document.body.style.overflowY;
      const originalOverflowX = document.body.style.overflowX;

      // Force scrollbar to be visible to prevent viewport width changes
      document.body.style.overflowY = "scroll";
      document.body.style.overflowX = "hidden";

      // Cleanup function: Restore original styles on unmount
      return () => {
        document.body.style.overflowY = originalOverflowY;
        document.body.style.overflowX = originalOverflowX;
      };
    }
  }, [isIntro]);

  // Initial positioning is now handled synchronously in useState initializer

  // Final positioning correction after layout animations complete
  useEffect(() => {
    // This function will perform the definitive centering after animations settle
    const finalPositioning = () => {
      setPosition(calculateCenteredPosition());
    };

    // A small delay ensures this runs after Framer Motion animations complete
    const timer = setTimeout(finalPositioning, 100); // 100ms is a safe value

    // Cleanup the timer if the component unmounts
    return () => clearTimeout(timer);

    // We only want this effect to run ONCE when the component mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mark state as loaded after terminal state is initialized
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsStateLoaded(true);
    }, 50); // Small delay to ensure state is loaded

    return () => clearTimeout(timer);
  }, []);

  // Removed the problematic effect that fought user actions in route mode

  useEffect(() => {
    if (showPrompt && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showPrompt]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (isReverseSearch) {
        // In reverse search mode, execute the matched command and exit search
        if (reverseSearchResults.length > 0) {
          const selectedCommand = reverseSearchResults[reverseSearchIndex];
          setCurrentCommand(selectedCommand);
          exitReverseSearch();
          executeCommand(selectedCommand);
          clearCommand();
        }
      } else if (currentCommand.trim()) {
        executeCommand(currentCommand.trim());
        clearCommand();
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (isReverseSearch) {
      // In reverse search mode, the input value is the search term
      updateReverseSearch(value);
    } else {
      // Normal mode, update the current command
      setCurrentCommand(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const result = handleTabComplete(currentCommand, autocompleteIndex);
      setCurrentCommand(result.currentCommand);
      setAutocompleteIndex(result.autocompleteIndex);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (isReverseSearch) {
        navigateReverseSearchResults("up");
      } else {
        navigateHistoryUp();
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (isReverseSearch) {
        navigateReverseSearchResults("down");
      } else {
        navigateHistoryDown();
      }
    } else if (e.ctrlKey && e.key === "r") {
      e.preventDefault();
      startReverseSearch();
    } else if (e.key === "Escape") {
      e.preventDefault();
      exitReverseSearch();
    }
  };

  const handleCloseButton = () => {
    // If it's the intro screen, closing it takes you to a default "content" page.
    // If it's the standalone /terminal page, closing it takes you home.
    navigate(isIntro ? "/home" : "/");
  };

  const handleRestore = () => {
    restoreTerminal();
    // Recenter the terminal when restoring from minimized state
    if (isMinimized) {
      setPosition(calculateCenteredPosition());
    }
  };

  const handleMinimizeButton = () => {
    if (isMinimized) {
      handleRestore();
    } else {
      minimizeTerminal();
    }
  };

  const handleMaximizeButton = () => {
    if (isMaximized) {
      // When restoring from maximized, recenter the terminal
      maximizeTerminal();
      setPosition(calculateCenteredPosition());
    } else {
      maximizeTerminal();
    }
  };

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only allow dragging from the header and when not maximized
    if (isMaximized || !position) return;

    const target = e.target as HTMLElement;

    // Don't start dragging if:
    // 1. Target is not in the header, OR
    // 2. Target is a button (close/minimize/maximize)
    if (
      !target.closest(".terminal-header") ||
      target.closest(".terminal-button")
    ) {
      return;
    }

    // Only start dragging if we're in the header but not on a button
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  // DRAG HANDLERS: Wrap them in useCallback to prevent stale closures
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      // No need to check for isDragging here, the listener is only active when it's true
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      // Keep terminal within viewport bounds
      const boundedPosition = keepPositionInBounds({ x: newX, y: newY });
      setPosition(boundedPosition);
    },
    [dragOffset, keepPositionInBounds]
  ); // Dependencies of this function

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []); // No dependencies for this one, as setIsDragging is stable

  useEffect(() => {
    // Only attach listeners if we are currently dragging
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      // Cleanup function to remove listeners when drag ends or component unmounts
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]); // Add the stable functions as dependencies

  // Handle window resize to keep terminal in bounds
  useEffect(() => {
    const handleResize = () => {
      if (!isMaximized && !isMinimized && position) {
        // Simplified: only keep it in bounds, don't try to be smart about centering
        const boundedPosition = keepPositionInBounds(position);
        setPosition(boundedPosition);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMaximized, isMinimized, position, keepPositionInBounds]);

  // Smart auto-scroll: only scroll to bottom if user is already near the bottom
  useEffect(() => {
    if (terminalRef.current) {
      const container = terminalRef.current;
      const isScrolledToBottom =
        container.scrollHeight - container.clientHeight <=
        container.scrollTop + 50; // 50px threshold

      // Only auto-scroll if user is already near the bottom
      if (isScrolledToBottom) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [commandHistory, terminalRef]);

  // Calculate container styles based on state
  const getContainerStyles = () => {
    if (isMaximized) {
      return {
        position: "fixed" as const,
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        transform: "none",
        opacity: 1,
        pointerEvents: "auto" as const,
        cursor: "default" as const,
        zIndex: 1000,
      };
    }

    // If position isn't set yet, hide the component to prevent flicker
    if (!position) {
      return {
        position: "fixed" as const,
        left: 0,
        top: 0,
        transform: "none",
        opacity: 0,
        pointerEvents: "none" as const,
        cursor: "default" as const,
        zIndex: 1000,
      };
    }

    if (isMinimized) {
      return {
        position: "fixed" as const,
        left: position.x,
        top: position.y,
        transform: "translateX(-50vw) scale(0.1)",
        opacity: 0,
        pointerEvents: "none" as const,
        cursor: "default" as const,
        zIndex: 999,
      };
    }

    return {
      position: "fixed" as const,
      left: position.x,
      top: position.y,
      transform: "none",
      opacity: 1,
      pointerEvents: "auto" as const,
      cursor: isDragging ? ("grabbing" as const) : ("default" as const),
      zIndex: isIntro ? 9999 : 1000, // Fixed z-index logic - intro should be higher
    };
  };

  const terminalEl = (
    <div className={`terminal-screen ${isIntro ? "intro-mode" : "route-mode"}`}>
      {/* The sidecar for minimized state */}
      {isStateLoaded && isMinimized && (
        <div className="terminal-sidecar" onClick={handleRestore}>
          <div className="sidecar-icon">💻</div>
        </div>
      )}

      {/* Man Page Overlay */}
      {isManPage && currentManPage && manPages[currentManPage] && (
        <ManPageUI
          manPage={manPages[currentManPage]}
          onExit={hideManPage}
          onScroll={setManPageScroll}
          scrollPosition={manPageScrollPosition}
        />
      )}

      {/* Top Command Overlay */}
      {isTopCommand && (
        <TopUI
          processes={topProcesses}
          onExit={hideTopCommand}
          onSort={setTopSort}
          onKillProcess={killTopProcess}
          onSelectProcess={setTopSelectedPid}
          selectedPid={topSelectedPid}
          sortBy={topSortBy}
          sortOrder={topSortOrder}
          refreshRate={topRefreshRate}
        />
      )}

      {/* Vim Editor Overlay */}
      {isVimEditing && (
        <VimUI
          isVisible={isVimEditing}
          filePath={vimFilePath}
          content={vimFileContent}
          onClose={() => dispatch({ type: "HIDE_VIM_EDITOR" })}
          isReadOnly={true}
        />
      )}

      {/* Scrape Results Modal */}
      {showScrapeResults && scrapeResults.length > 0 && (
        <ScrapeResults
          results={scrapeResults}
          onClose={() => dispatch({ type: "HIDE_SCRAPE_RESULTS" })}
        />
      )}

      <div
        className={`terminal-container ${isMaximized ? "maximized" : ""} ${
          isDragging ? "dragging" : ""
        }`}
        style={getContainerStyles()}
        onMouseDown={handleMouseDown}
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
              title={isMaximized ? "Restore terminal" : "Maximize terminal"}
              aria-label={
                isMaximized ? "Restore terminal" : "Maximize terminal"
              }
            ></button>
          </div>
          <div className="terminal-title">
            portfolio@kareem-sasa:
            {currentDirectory === "/" ? "~" : currentDirectory}
            {isDragging && " (dragging)"}
          </div>
        </div>

        <div className="terminal-body" ref={terminalRef}>
          <div className="terminal-message">
            {!hasShownIntro ? (
              <TypeWriterText
                text="Welcome to my portfolio, I'm really glad you're here."
                delay={0}
                speed={30}
                onComplete={() => {
                  setHasShownIntro(true);
                  localStorage.setItem("terminal-intro-shown", "true");
                  setTimeout(() => setShowPrompt(true), 200);
                }}
              />
            ) : (
              <span>Welcome to my portfolio, I'm really glad you're here.</span>
            )}
          </div>

          <div className="command-history">
            {commandHistory.map((line, index) => (
              <div key={index} className={`history-line ${line.type || ""}`}>
                {line.useTypewriter ? (
                  <TypeWriterText
                    text={line.text}
                    delay={0}
                    speed={30}
                    onComplete={() => {}}
                  />
                ) : line.highlightedText ? (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: line.highlightedText.replace(
                        /\x1b\[1;31m(.*?)\x1b\[0m/g,
                        '<span class="grep-highlight">$1</span>'
                      ),
                    }}
                  />
                ) : (
                  line.text
                )}
              </div>
            ))}
          </div>

          {showPrompt && (
            <div className="command-prompt">
              {isReverseSearch ? (
                <div className="reverse-search-prompt">
                  <span className="reverse-search-indicator">
                    (reverse-i-search)`{reverseSearchTerm}':
                  </span>
                  <span className="reverse-search-command">
                    {reverseSearchResults.length > 0
                      ? reverseSearchResults[reverseSearchIndex]
                      : ""}
                  </span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={reverseSearchTerm}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    onKeyDown={handleKeyDown}
                    className="command-input reverse-search-input"
                    placeholder="Type to search command history"
                    autoFocus
                  />
                  {reverseSearchResults.length > 0 && (
                    <span className="reverse-search-info">
                      {reverseSearchIndex + 1}/{reverseSearchResults.length}
                    </span>
                  )}
                </div>
              ) : (
                <>
                  <span className="prompt-symbol">
                    portfolio@kareem-sasa:
                    {currentDirectory === "/" ? "~" : currentDirectory}$
                  </span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={currentCommand}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    onKeyDown={handleKeyDown}
                    className="command-input"
                    placeholder="Type 'help' for available commands"
                    autoFocus
                  />
                  <span className="cursor">|</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Render the terminal into the portal root, completely outside the main app flow
  return ReactDOM.createPortal(
    terminalEl,
    document.getElementById("portal-root")!
  );
};

export default Terminal;
