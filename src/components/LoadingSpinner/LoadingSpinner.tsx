import React from "react";
import "./LoadingSpinner.css";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  color?: string;
  className?: string;
  ariaLabel?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "medium",
  color = "var(--primary-color)",
  className = "",
  ariaLabel = "Loading...",
}) => {
  return (
    <div
      className={`loading-spinner ${size} ${className}`}
      role="status"
      aria-label={ariaLabel}
      style={{ "--spinner-color": color } as React.CSSProperties}
    >
      <div className="spinner-ring"></div>
      <div className="spinner-ring"></div>
      <div className="spinner-ring"></div>
    </div>
  );
};

export default LoadingSpinner;
