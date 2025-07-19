import React from "react";

interface ErrorTestComponentProps {
  shouldThrow?: boolean;
}

const ErrorTestComponent: React.FC<ErrorTestComponentProps> = ({
  shouldThrow = false,
}) => {
  if (shouldThrow) {
    throw new Error(
      "This is a test error to verify ErrorBoundary functionality"
    );
  }

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Error Test Component</h2>
      <p>
        This component is working normally. If you see this, the ErrorBoundary
        is not catching any errors.
      </p>
      <p>To test the ErrorBoundary, set shouldThrow to true.</p>
    </div>
  );
};

export default ErrorTestComponent;
