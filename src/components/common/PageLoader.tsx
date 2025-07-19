import React from "react";
import ReactDOM from "react-dom";
import "./PageLoader.css";

// A more thematic loader text
const loadingMessages = [
  "Compiling kernels...",
  "Reticulating splines...",
  "Booting mainframes...",
  "Initializing subroutines...",
  "Decrypting data streams...",
  "Establishing neuro-link...",
  "Loading... please wait.",
];

const PageLoader: React.FC = () => {
  // Select a random loading message for variety
  const [message] = React.useState(
    () => loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
  );

  const loaderElement = (
    <div className="page-loader-overlay" role="status" aria-live="polite">
      <div className="loader-content">
        {/* Thematic Matrix/Terminal Spinner */}
        <div className="matrix-spinner">
          <div className="matrix-spinner-text">01</div>
        </div>
        <p className="loading-text">{message}</p>
      </div>
    </div>
  );

  // Render into the portal root to ensure it's on top of everything
  return ReactDOM.createPortal(
    loaderElement,
    document.getElementById("portal-root")!
  );
};

export default PageLoader;
