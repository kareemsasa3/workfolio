import React, { useEffect, useRef } from "react";
import { ManPage } from "../../data/manPages";
import "./ManPageUI.css";

interface ManPageUIProps {
  manPage: ManPage;
  onExit: () => void;
  onScroll: (position: number) => void;
  scrollPosition: number;
}

const ManPageUI: React.FC<ManPageUIProps> = ({
  manPage,
  onExit,
  onScroll,
  scrollPosition,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "q" || e.key === "Q") {
        e.preventDefault();
        onExit();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (containerRef.current) {
          containerRef.current.scrollTop -= 20;
          onScroll(containerRef.current.scrollTop);
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (containerRef.current) {
          containerRef.current.scrollTop += 20;
          onScroll(containerRef.current.scrollTop);
        }
      } else if (e.key === "PageUp") {
        e.preventDefault();
        if (containerRef.current) {
          containerRef.current.scrollTop -= containerRef.current.clientHeight;
          onScroll(containerRef.current.scrollTop);
        }
      } else if (e.key === "PageDown") {
        e.preventDefault();
        if (containerRef.current) {
          containerRef.current.scrollTop += containerRef.current.clientHeight;
          onScroll(containerRef.current.scrollTop);
        }
      } else if (e.key === "Home") {
        e.preventDefault();
        if (containerRef.current) {
          containerRef.current.scrollTop = 0;
          onScroll(0);
        }
      } else if (e.key === "End") {
        e.preventDefault();
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
          onScroll(containerRef.current.scrollHeight);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onExit, onScroll]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = scrollPosition;
    }
  }, [scrollPosition]);

  return (
    <div className="man-page-overlay">
      <div className="man-page-container" ref={containerRef}>
        <div className="man-page-header">
          <div className="man-page-title">{manPage.name}</div>
          <div className="man-page-controls">
            <span className="man-page-control">q: quit</span>
            <span className="man-page-control">↑↓: scroll</span>
            <span className="man-page-control">Home/End: top/bottom</span>
          </div>
        </div>

        <div className="man-page-content">
          <div className="man-section">
            <div className="man-section-title">NAME</div>
            <div className="man-section-content">{manPage.name}</div>
          </div>

          <div className="man-section">
            <div className="man-section-title">SYNOPSIS</div>
            <div className="man-section-content">
              <code>{manPage.synopsis}</code>
            </div>
          </div>

          <div className="man-section">
            <div className="man-section-title">DESCRIPTION</div>
            <div className="man-section-content">
              {manPage.description.split("\n").map((line, index) => (
                <div key={index} className="man-description-line">
                  {line}
                </div>
              ))}
            </div>
          </div>

          {manPage.options.length > 0 && (
            <div className="man-section">
              <div className="man-section-title">OPTIONS</div>
              <div className="man-section-content">
                {manPage.options.map((option, index) => (
                  <div key={index} className="man-option">
                    <span className="man-option-flag">{option.flag}</span>
                    <span className="man-option-description">
                      {option.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="man-section">
            <div className="man-section-title">EXAMPLES</div>
            <div className="man-section-content">
              {manPage.examples.map((example, index) => (
                <div key={index} className="man-example">
                  <div className="man-example-command">
                    <code>{example.command}</code>
                  </div>
                  <div className="man-example-description">
                    {example.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="man-section">
            <div className="man-section-title">SEE ALSO</div>
            <div className="man-section-content">
              {manPage.seeAlso.map((command, index) => (
                <span key={index} className="man-see-also">
                  {command}
                  {index < manPage.seeAlso.length - 1 ? ", " : ""}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="man-page-footer">
          <div className="man-page-info">
            Press <kbd>q</kbd> to exit
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManPageUI;
