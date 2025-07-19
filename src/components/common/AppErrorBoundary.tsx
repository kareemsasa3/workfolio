import { Component, ErrorInfo, ReactNode } from "react";
import { Link } from "react-router-dom";
import "./ErrorBoundary.css";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class AppErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to console for debugging
    console.error(
      "AppErrorBoundary caught a critical error:",
      error,
      errorInfo
    );

    // Update state with error details
    this.setState({
      error,
      errorInfo,
    });

    // In a production app, you would also log to an error reporting service
    // Example: logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary app-error">
          <div className="error-content">
            <h1>🚨 Critical Error</h1>
            <p>
              We're sorry, but the application has encountered a critical error.
              This has been logged and our team will investigate.
            </p>

            <div className="error-actions">
              <button
                onClick={() => window.location.reload()}
                className="error-button primary"
              >
                Reload Application
              </button>
              <Link to="/" className="error-button secondary">
                Try Home Page
              </Link>
            </div>

            {import.meta.env.DEV && this.state.error && (
              <details className="error-details">
                <summary>Technical Details (Development)</summary>
                <div className="error-info">
                  <h4>Error Message:</h4>
                  <pre className="error-message">
                    {this.state.error.message}
                  </pre>

                  <h4>Error Stack:</h4>
                  <pre className="error-stack">{this.state.error.stack}</pre>

                  {this.state.errorInfo && (
                    <>
                      <h4>Component Stack:</h4>
                      <pre className="error-stack">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
