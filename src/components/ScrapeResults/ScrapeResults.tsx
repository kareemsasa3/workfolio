import React from "react";
import "./ScrapeResults.css";

export interface ScrapedData {
  url: string;
  title?: string;
  status: number;
  size: number;
  scraped: string;
  content: string;
}

interface ScrapeResultsProps {
  results: ScrapedData[];
  onClose: () => void;
}

export const ScrapeResults: React.FC<ScrapeResultsProps> = ({
  results,
  onClose,
}) => {
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: number): string => {
    if (status >= 200 && status < 300) return "success";
    if (status >= 300 && status < 400) return "warning";
    if (status >= 400 && status < 500) return "error";
    if (status >= 500) return "error";
    return "info";
  };

  const truncateContent = (
    content: string,
    maxLength: number = 200
  ): string => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <div className="scrape-results-overlay">
      <div className="scrape-results-modal">
        <div className="scrape-results-header">
          <h2>🌐 Scraping Results</h2>
          <button className="scrape-results-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="scrape-results-summary">
          <div className="summary-item">
            <span className="summary-label">Total URLs:</span>
            <span className="summary-value">{results.length}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Successful:</span>
            <span className="summary-value success">
              {results.filter((r) => r.status >= 200 && r.status < 300).length}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Failed:</span>
            <span className="summary-value error">
              {results.filter((r) => r.status >= 400).length}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Total Size:</span>
            <span className="summary-value">
              {formatBytes(results.reduce((sum, r) => sum + r.size, 0))}
            </span>
          </div>
        </div>

        <div className="scrape-results-list">
          {results.map((result, index) => (
            <div key={index} className="scrape-result-item">
              <div className="result-header">
                <div className="result-url">
                  <span className="result-number">#{index + 1}</span>
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="result-link"
                  >
                    {result.url}
                  </a>
                </div>
                <div className="result-meta">
                  <span
                    className={`status-badge ${getStatusColor(result.status)}`}
                  >
                    {result.status}
                  </span>
                  <span className="size-badge">{formatBytes(result.size)}</span>
                </div>
              </div>

              {result.title && (
                <div className="result-title">
                  <strong>Title:</strong> {result.title}
                </div>
              )}

              <div className="result-timestamp">
                <strong>Scraped:</strong> {formatDate(result.scraped)}
              </div>

              <div className="result-content">
                <strong>Content Preview:</strong>
                <div className="content-preview">
                  {truncateContent(result.content)}
                </div>
              </div>

              <div className="result-actions">
                <button
                  className="action-btn view-full"
                  onClick={() => {
                    const newWindow = window.open();
                    if (newWindow) {
                      newWindow.document.write(result.content);
                      newWindow.document.close();
                    }
                  }}
                >
                  View Full Content
                </button>
                <button
                  className="action-btn copy-url"
                  onClick={() => navigator.clipboard.writeText(result.url)}
                >
                  Copy URL
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="scrape-results-footer">
          <button
            className="export-btn"
            onClick={() => {
              const dataStr = JSON.stringify(results, null, 2);
              const dataBlob = new Blob([dataStr], {
                type: "application/json",
              });
              const url = URL.createObjectURL(dataBlob);
              const link = document.createElement("a");
              link.href = url;
              link.download = `scrape-results-${Date.now()}.json`;
              link.click();
              URL.revokeObjectURL(url);
            }}
          >
            📥 Export as JSON
          </button>
        </div>
      </div>
    </div>
  );
};
