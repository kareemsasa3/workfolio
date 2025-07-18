import React, { useState, useRef, useEffect } from "react";
import "./TerminalDropdown.css";

interface TerminalDropdownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

const TerminalDropdown: React.FC<TerminalDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  label,
  disabled = false,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setHighlightedIndex((prev) =>
            prev < options.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          event.preventDefault();
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : options.length - 1
          );
          break;
        case "Enter":
          event.preventDefault();
          if (highlightedIndex >= 0 && highlightedIndex < options.length) {
            onChange(options[highlightedIndex]);
            setIsOpen(false);
            setHighlightedIndex(-1);
          }
          break;
        case "Escape":
          event.preventDefault();
          setIsOpen(false);
          setHighlightedIndex(-1);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, highlightedIndex, options, onChange]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setHighlightedIndex(-1);
    }
  };

  const handleOptionClick = (option: string) => {
    onChange(option);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const selectedOption =
    options.find((option) => option === value) || placeholder;

  return (
    <div className={`terminal-dropdown ${className}`} ref={dropdownRef}>
      {label && (
        <label className="terminal-dropdown-label">
          <span className="terminal-prompt">$</span> {label}
        </label>
      )}
      <div className="terminal-dropdown-container">
        <button
          type="button"
          className={`terminal-dropdown-trigger ${isOpen ? "open" : ""} ${
            disabled ? "disabled" : ""
          }`}
          onClick={handleToggle}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className="terminal-dropdown-value">
            <span className="terminal-prompt">{isOpen ? "∨" : ">"}</span>{" "}
            {selectedOption}
          </span>
          <span className="terminal-dropdown-arrow">{isOpen ? "▲" : "▼"}</span>
        </button>

        {isOpen && (
          <div className="terminal-dropdown-menu">
            <div className="terminal-dropdown-header">
              <span className="terminal-prompt">$</span> cat options.txt
            </div>
            <div className="terminal-dropdown-options">
              {options.map((option, index) => (
                <button
                  key={option}
                  type="button"
                  className={`terminal-dropdown-option ${
                    index === highlightedIndex ? "highlighted" : ""
                  } ${option === value ? "selected" : ""}`}
                  onClick={() => handleOptionClick(option)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  <span className="terminal-option-prefix">
                    {option === value ? "●" : "○"}
                  </span>
                  <span className="terminal-option-text">{option}</span>
                </button>
              ))}
            </div>
            <div className="terminal-dropdown-footer">
              <span className="terminal-comment">
                # Use ↑↓ to navigate, Enter to select, Esc to close
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TerminalDropdown;
