import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./Terminal.css";
import "./TerminalErrorBoundary.css";
import { useTerminal } from "../../hooks/useTerminal";
import { fileSystem } from "../../data/fileSystem";
import { useWindowManagement } from "../../hooks/useWindowManagement";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import TerminalWindow from "./TerminalWindow";
import TerminalView from "./TerminalView";
import TerminalOverlays from "./TerminalOverlays";
import TerminalErrorBoundary from "./TerminalErrorBoundary";

interface TerminalProps {
  isIntro: boolean;
  onCloseOverride?: () => void;
  useExternalChrome?: boolean;
}

const Terminal: React.FC<TerminalProps> = ({
  isIntro,
  onCloseOverride,
  useExternalChrome = false,
}) => {
  const navigate = useNavigate();

  // State initialization
  const [hasShownIntro, setHasShownIntro] = useState(() => {
    try {
      return localStorage.getItem("terminal-intro-shown") === "true";
    } catch (error) {
      console.error("Failed to load terminal intro state:", error);
      return false;
    }
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
  const {
    coreState,
    coreHandlers,
    topState,
    topHandlers,
    scrapingState,
    scrapingHandlers,
    executeCommand,
  } = useTerminal(fileSystem, handleRouteNavigation, !isIntro);

  // Handle terminal close
  const handleTerminalClose = useCallback(() => {
    // Reset terminal state when closing
    coreHandlers.resetTerminal();
    if (onCloseOverride) {
      onCloseOverride();
      return;
    }
    navigate(isIntro ? "/home" : "/");
  }, [coreHandlers, navigate, isIntro, onCloseOverride]);

  // Use the new window management hook only when rendering with internal chrome
  const windowManagement = useExternalChrome
    ? null
    : useWindowManagement({
        initialWidth: getTerminalDimensions().width,
        initialHeight: getTerminalDimensions().height,
        isIntro,
        onClose: handleTerminalClose,
      });

  // Use the body scroll lock hook only for intro route mode
  if (!useExternalChrome) {
    useLockBodyScroll(isIntro);
  }

  // Mark state as loaded after terminal state is initialized
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsStateLoaded(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  // Show prompt when not in intro mode
  useEffect(() => {
    if (!isIntro && hasShownIntro && !coreState.showPrompt) {
      // Show prompt after a short delay when not in intro mode
      const timer = setTimeout(() => {
        coreHandlers.setShowPrompt(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isIntro, hasShownIntro, coreState.showPrompt, coreHandlers]);

  // Handle intro completion
  const handleIntroComplete = () => {
    setHasShownIntro(true);
    try {
      localStorage.setItem("terminal-intro-shown", "true");
    } catch (error) {
      console.error("Failed to save terminal intro state:", error);
    }
    setTimeout(() => coreHandlers.setShowPrompt(true), 200);
  };

  // Handle command submission
  const handleCommandSubmit = () => {
    if (coreState.isReverseSearch) {
      if (coreState.reverseSearchResults.length > 0) {
        const selectedCommand =
          coreState.reverseSearchResults[coreState.reverseSearchIndex];
        coreHandlers.setCurrentCommand(selectedCommand);
        coreHandlers.exitReverseSearch();
        executeCommand(selectedCommand);
        coreHandlers.clearCommand();
      }
    } else if (coreState.currentCommand.trim()) {
      executeCommand(coreState.currentCommand.trim());
      coreHandlers.clearCommand();
    }
  };

  // Handle command change
  const handleCommandChange = (value: string) => {
    if (coreState.isReverseSearch) {
      // For reverse search, we need to filter command history
      const results = coreState.commandHistory
        .filter((entry) =>
          entry.text.toLowerCase().includes(value.toLowerCase())
        )
        .map((entry) => entry.text);
      coreHandlers.updateReverseSearch(value, results);
    } else {
      coreHandlers.setCurrentCommand(value);
    }
  };

  // Handle key down events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const result = coreHandlers.handleTabComplete(coreState.currentCommand);
      coreHandlers.setCurrentCommand(result.currentCommand);
      coreHandlers.setAutocompleteIndex(result.autocompleteIndex);
      if (result.suggestions) {
        coreHandlers.dispatch({
          type: "SET_AUTOCOMPLETE_SUGGESTIONS",
          payload: result.suggestions,
        });
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (coreState.isReverseSearch) {
        // Navigate reverse search results up
        const newIndex = Math.max(0, coreState.reverseSearchIndex - 1);
        coreHandlers.setReverseSearchIndex(newIndex);
      } else {
        // Navigate history up
        const currentIndex = coreState.historyIndex;
        const newIndex = Math.min(
          coreState.commandHistory.length - 1,
          currentIndex + 1
        );
        coreHandlers.setHistoryIndex(newIndex);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (coreState.isReverseSearch) {
        // Navigate reverse search results down
        const newIndex = Math.min(
          coreState.reverseSearchResults.length - 1,
          coreState.reverseSearchIndex + 1
        );
        coreHandlers.setReverseSearchIndex(newIndex);
      } else {
        // Navigate history down
        const currentIndex = coreState.historyIndex;
        const newIndex = Math.max(-1, currentIndex - 1);
        coreHandlers.setHistoryIndex(newIndex);
      }
    } else if (e.ctrlKey && e.key === "r") {
      e.preventDefault();
      coreHandlers.startReverseSearch();
    } else if (e.key === "Escape") {
      e.preventDefault();
      coreHandlers.exitReverseSearch();
    }
  };

  const overlays = (
    <TerminalOverlays
      // Man page props
      isManPage={coreState.isManPage}
      currentManPage={coreState.currentManPage}
      manPageScrollPosition={coreState.manPageScrollPosition}
      onHideManPage={coreHandlers.hideManPage}
      onSetManPageScroll={coreHandlers.setManPageScroll}
      // Top command props
      isTopCommand={topState.isTopCommand}
      topProcesses={topState.topProcesses}
      topSortBy={topState.topSortBy}
      topSortOrder={topState.topSortOrder}
      topRefreshRate={topState.topRefreshRate}
      topSelectedPid={topState.topSelectedPid}
      onHideTopCommand={topHandlers.hideTopCommand}
      onSetTopSort={topHandlers.setTopSort}
      onKillTopProcess={topHandlers.killTopProcess}
      onSetTopSelectedPid={topHandlers.setTopSelectedPid}
      // Scrape results props
      showScrapeResults={scrapingState.showScrapeResults}
      scrapeResults={scrapingState.scrapeResults}
      onHideScrapeResults={scrapingHandlers.hideScrapeResults}
    />
  );

  if (useExternalChrome) {
    return (
      <TerminalErrorBoundary>
        {overlays}
        <div className="terminal-body" ref={coreHandlers.terminalRef as any}>
          <TerminalView
            commandHistory={coreState.commandHistory}
            currentCommand={coreState.currentCommand}
            showPrompt={coreState.showPrompt}
            currentDirectory={coreState.currentDirectory}
            hasShownIntro={hasShownIntro}
            isReverseSearch={coreState.isReverseSearch}
            reverseSearchTerm={coreState.reverseSearchTerm}
            reverseSearchResults={coreState.reverseSearchResults}
            reverseSearchIndex={coreState.reverseSearchIndex}
            autocompleteSuggestions={coreState.autocompleteSuggestions}
            autocompleteIndex={coreState.autocompleteIndex}
            onCommandChange={handleCommandChange}
            onCommandSubmit={handleCommandSubmit}
            onKeyDown={handleKeyDown}
            onIntroComplete={handleIntroComplete}
            terminalRef={coreHandlers.terminalRef}
          />
        </div>
      </TerminalErrorBoundary>
    );
  }

  return (
    <TerminalErrorBoundary>
      <div
        className={`terminal-screen ${isIntro ? "intro-mode" : "route-mode"}`}
      >
        {/* The sidecar for minimized state - NOW a BUTTON */}
        {isStateLoaded && windowManagement!.showSidecar && (
          <button
            className="terminal-sidecar"
            onClick={windowManagement!.handleMinimize}
            aria-label="Restore terminal window"
          >
            <span className="sidecar-icon" aria-hidden="true">
              💻
            </span>
          </button>
        )}

        {overlays}

        {/* Main terminal window */}
        <TerminalWindow
          containerStyles={windowManagement!.containerStyles}
          isMaximized={windowManagement!.isMaximized}
          isDragging={windowManagement!.isDragging}
          currentDirectory={coreState.currentDirectory}
          onMouseDown={windowManagement!.handleMouseDown}
          onClose={windowManagement!.handleClose}
          onMinimize={windowManagement!.handleMinimize}
          onMaximize={windowManagement!.handleMaximize}
        >
          <TerminalView
            commandHistory={coreState.commandHistory}
            currentCommand={coreState.currentCommand}
            showPrompt={coreState.showPrompt}
            currentDirectory={coreState.currentDirectory}
            hasShownIntro={hasShownIntro}
            isReverseSearch={coreState.isReverseSearch}
            reverseSearchTerm={coreState.reverseSearchTerm}
            reverseSearchResults={coreState.reverseSearchResults}
            reverseSearchIndex={coreState.reverseSearchIndex}
            autocompleteSuggestions={coreState.autocompleteSuggestions}
            autocompleteIndex={coreState.autocompleteIndex}
            onCommandChange={handleCommandChange}
            onCommandSubmit={handleCommandSubmit}
            onKeyDown={handleKeyDown}
            onIntroComplete={handleIntroComplete}
            terminalRef={coreHandlers.terminalRef}
          />
        </TerminalWindow>
      </div>
    </TerminalErrorBoundary>
  );
};

export default Terminal;
