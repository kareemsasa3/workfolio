import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./Terminal.css";
import { useTerminal } from "../../hooks/useTerminal";
import { fileSystem } from "../../data/fileSystem";
import { useWindowManagement } from "../../hooks/useWindowManagement";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import TerminalWindow from "./TerminalWindow";
import TerminalView from "./TerminalView";
import TerminalOverlays from "./TerminalOverlays";

interface TerminalProps {
  isIntro: boolean;
}

const Terminal: React.FC<TerminalProps> = ({ isIntro }) => {
  const navigate = useNavigate();

  // State initialization
  const [hasShownIntro, setHasShownIntro] = useState(() => {
    return localStorage.getItem("terminal-intro-shown") === "true";
  });

  // Track when terminal state is loaded
  const [isStateLoaded, setIsStateLoaded] = useState(false);

  // Calculate terminal dimensions
  const getTerminalDimensions = () => {
    return {
      width: Math.min(window.innerWidth * 0.9, 800),
      height: Math.min(window.innerHeight * 0.7, 600),
    };
  };

  // The navigation handler
  const handleRouteNavigation = (route: string) => {
    navigate(route);
  };

  // Use the terminal logic hook
  const terminalApi = useTerminal(fileSystem, handleRouteNavigation, !isIntro);

  // Handle terminal close
  const handleTerminalClose = useCallback(() => {
    // Reset terminal state when closing
    terminalApi.resetTerminal();
    navigate(isIntro ? "/home" : "/");
  }, [terminalApi, navigate, isIntro]);

  // Use the new window management hook
  const windowManagement = useWindowManagement({
    initialWidth: getTerminalDimensions().width,
    initialHeight: getTerminalDimensions().height,
    isIntro,
    onClose: handleTerminalClose,
  });

  // Use the body scroll lock hook
  useLockBodyScroll(isIntro);

  // Mark state as loaded after terminal state is initialized
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsStateLoaded(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  // Show prompt when not in intro mode
  useEffect(() => {
    if (!isIntro && hasShownIntro && !terminalApi.showPrompt) {
      // Show prompt after a short delay when not in intro mode
      const timer = setTimeout(() => {
        terminalApi.setShowPrompt(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [
    isIntro,
    hasShownIntro,
    terminalApi.showPrompt,
    terminalApi.setShowPrompt,
  ]);

  // Handle intro completion
  const handleIntroComplete = () => {
    setHasShownIntro(true);
    localStorage.setItem("terminal-intro-shown", "true");
    setTimeout(() => terminalApi.setShowPrompt(true), 200);
  };

  // Handle command submission
  const handleCommandSubmit = () => {
    if (terminalApi.isReverseSearch) {
      if (terminalApi.reverseSearchResults.length > 0) {
        const selectedCommand =
          terminalApi.reverseSearchResults[terminalApi.reverseSearchIndex];
        terminalApi.setCurrentCommand(selectedCommand);
        terminalApi.exitReverseSearch();
        terminalApi.executeCommand(selectedCommand);
        terminalApi.clearCommand();
      }
    } else if (terminalApi.currentCommand.trim()) {
      terminalApi.executeCommand(terminalApi.currentCommand.trim());
      terminalApi.clearCommand();
    }
  };

  // Handle command change
  const handleCommandChange = (value: string) => {
    if (terminalApi.isReverseSearch) {
      terminalApi.updateReverseSearch(value);
    } else {
      terminalApi.setCurrentCommand(value);
    }
  };

  // Handle key down events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const result = terminalApi.handleTabComplete(
        terminalApi.currentCommand,
        terminalApi.autocompleteIndex
      );
      terminalApi.setCurrentCommand(result.currentCommand);
      terminalApi.setAutocompleteIndex(result.autocompleteIndex);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (terminalApi.isReverseSearch) {
        terminalApi.navigateReverseSearchResults("up");
      } else {
        terminalApi.navigateHistoryUp();
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (terminalApi.isReverseSearch) {
        terminalApi.navigateReverseSearchResults("down");
      } else {
        terminalApi.navigateHistoryDown();
      }
    } else if (e.ctrlKey && e.key === "r") {
      e.preventDefault();
      terminalApi.startReverseSearch();
    } else if (e.key === "Escape") {
      e.preventDefault();
      terminalApi.exitReverseSearch();
    }
  };

  return (
    <div className={`terminal-screen ${isIntro ? "intro-mode" : "route-mode"}`}>
      {/* The sidecar for minimized state - NOW a BUTTON */}
      {isStateLoaded && windowManagement.showSidecar && (
        <button
          className="terminal-sidecar"
          onClick={windowManagement.handleMinimize}
          aria-label="Restore terminal window"
        >
          <span className="sidecar-icon" aria-hidden="true">
            💻
          </span>
        </button>
      )}

      {/* Overlays */}
      <TerminalOverlays
        // Man page props
        isManPage={terminalApi.isManPage}
        currentManPage={terminalApi.currentManPage}
        manPageScrollPosition={terminalApi.manPageScrollPosition}
        onHideManPage={terminalApi.hideManPage}
        onSetManPageScroll={terminalApi.setManPageScroll}
        // Top command props
        isTopCommand={terminalApi.isTopCommand}
        topProcesses={terminalApi.topProcesses}
        topSortBy={terminalApi.topSortBy}
        topSortOrder={terminalApi.topSortOrder}
        topRefreshRate={terminalApi.topRefreshRate}
        topSelectedPid={terminalApi.topSelectedPid}
        onHideTopCommand={terminalApi.hideTopCommand}
        onSetTopSort={terminalApi.setTopSort}
        onKillTopProcess={terminalApi.killTopProcess}
        onSetTopSelectedPid={terminalApi.setTopSelectedPid}
        // Scrape results props
        showScrapeResults={terminalApi.showScrapeResults}
        scrapeResults={terminalApi.scrapeResults}
        onHideScrapeResults={() =>
          terminalApi.dispatch({ type: "HIDE_SCRAPE_RESULTS" })
        }
      />

      {/* Main terminal window */}
      <TerminalWindow
        containerStyles={windowManagement.containerStyles}
        isMaximized={windowManagement.isMaximized}
        isDragging={windowManagement.isDragging}
        currentDirectory={terminalApi.currentDirectory}
        onMouseDown={windowManagement.handleMouseDown}
        onClose={windowManagement.handleClose}
        onMinimize={windowManagement.handleMinimize}
        onMaximize={windowManagement.handleMaximize}
      >
        <TerminalView
          commandHistory={terminalApi.commandHistory}
          currentCommand={terminalApi.currentCommand}
          showPrompt={terminalApi.showPrompt}
          currentDirectory={terminalApi.currentDirectory}
          hasShownIntro={hasShownIntro}
          isReverseSearch={terminalApi.isReverseSearch}
          reverseSearchTerm={terminalApi.reverseSearchTerm}
          reverseSearchResults={terminalApi.reverseSearchResults}
          reverseSearchIndex={terminalApi.reverseSearchIndex}
          onCommandChange={handleCommandChange}
          onCommandSubmit={handleCommandSubmit}
          onKeyDown={handleKeyDown}
          onIntroComplete={handleIntroComplete}
          terminalRef={terminalApi.terminalRef}
        />
      </TerminalWindow>
    </div>
  );
};

export default Terminal;
