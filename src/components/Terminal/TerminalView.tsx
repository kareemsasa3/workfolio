import React, { useRef, useEffect } from "react";
import TypeWriterText from "../TypeWriterText";
import "./TerminalView.css";

interface CommandHistoryItem {
  text: string;
  type?: string;
  useTypewriter?: boolean;
  highlightedText?: string;
}

interface TerminalViewProps {
  commandHistory: CommandHistoryItem[];
  currentCommand: string;
  showPrompt: boolean;
  currentDirectory: string;
  hasShownIntro: boolean;
  isReverseSearch: boolean;
  reverseSearchTerm: string;
  reverseSearchResults: string[];
  reverseSearchIndex: number;
  autocompleteSuggestions: string[];
  autocompleteIndex: number;
  onCommandChange: (value: string) => void;
  onCommandSubmit: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onIntroComplete: () => void;
  terminalRef: React.RefObject<HTMLDivElement>;
}

const TerminalView: React.FC<TerminalViewProps> = ({
  commandHistory,
  currentCommand,
  showPrompt,
  currentDirectory,
  hasShownIntro,
  isReverseSearch,
  reverseSearchTerm,
  reverseSearchResults,
  reverseSearchIndex,
  autocompleteSuggestions,
  autocompleteIndex,
  onCommandChange,
  onCommandSubmit,
  onKeyDown,
  onIntroComplete,
  terminalRef,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when prompt is shown
  useEffect(() => {
    if (showPrompt && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showPrompt]);

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (isReverseSearch) {
        // In reverse search mode, execute the matched command and exit search
        if (reverseSearchResults.length > 0) {
          const selectedCommand = reverseSearchResults[reverseSearchIndex];
          onCommandChange(selectedCommand);
          onCommandSubmit();
        }
      } else if (currentCommand.trim()) {
        onCommandSubmit();
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onCommandChange(value);
  };

  return (
    <div className="terminal-body" ref={terminalRef}>
      <div className="terminal-message">
        {!hasShownIntro ? (
          <TypeWriterText
            text="Welcome to my terminal."
            delay={0}
            speed={30}
            onComplete={onIntroComplete}
          />
        ) : (
          <span>Welcome to my terminal.</span>
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
                onKeyDown={onKeyDown}
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
                onKeyDown={onKeyDown}
                className="command-input"
                placeholder="Type 'help' for available commands"
                autoFocus
              />
            </>
          )}
        </div>
      )}

      {/* Autocomplete Suggestions */}
      {autocompleteSuggestions.length > 1 && showPrompt && !isReverseSearch && (
        <div className="autocomplete-suggestions">
          <div className="suggestions-header">Multiple matches:</div>
          <div className="suggestions-list">
            {autocompleteSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`suggestion-item ${
                  index === autocompleteIndex ? "selected" : ""
                }`}
              >
                {suggestion}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TerminalView;
