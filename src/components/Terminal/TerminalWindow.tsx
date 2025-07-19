import React from "react";
import "./TerminalWindow.css";

interface TerminalWindowProps {
  children: React.ReactNode;
  containerStyles: React.CSSProperties;
  isMaximized: boolean;
  isDragging: boolean;
  currentDirectory: string;
  onMouseDown: (e: React.MouseEvent) => void;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  className?: string;
}

const TerminalWindow: React.FC<TerminalWindowProps> = ({
  children,
  containerStyles,
  isMaximized,
  isDragging,
  currentDirectory,
  onMouseDown,
  onClose,
  onMinimize,
  onMaximize,
  className = "",
}) => {
  return (
    <div
      className={`terminal-container ${isMaximized ? "maximized" : ""} ${
        isDragging ? "dragging" : ""
      } ${className}`}
      style={containerStyles}
      onMouseDown={onMouseDown}
    >
      <div className="terminal-header">
        <div className="terminal-buttons">
          <button
            className="terminal-button close"
            onClick={onClose}
            title="Close terminal"
            aria-label="Close terminal"
          />
          <button
            className="terminal-button minimize"
            onClick={onMinimize}
            title="Minimize terminal"
            aria-label="Minimize terminal"
          />
          <button
            className="terminal-button maximize"
            onClick={onMaximize}
            title={isMaximized ? "Restore terminal" : "Maximize terminal"}
            aria-label={isMaximized ? "Restore terminal" : "Maximize terminal"}
          />
        </div>
        <div className="terminal-title">
          portfolio@kareem-sasa:
          {currentDirectory === "/" ? "~" : currentDirectory}
          {isDragging && " (dragging)"}
        </div>
      </div>
      {children}
    </div>
  );
};

export default TerminalWindow;
