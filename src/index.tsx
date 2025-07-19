import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const rootElement = document.getElementById("root");

if (rootElement) {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("React application failed to render", error);
    // Display a user-friendly fallback UI using vanilla JS
    rootElement.innerHTML = `
      <div class="app-crash-fallback">
        <h1>Oops! Something went wrong.</h1>
        <p>We're sorry, but the application could not start. Please try refreshing the page or contact support.</p>
      </div>
    `;
  }
} else {
  // This case is for when the #root element itself is missing from the HTML
  console.error("Failed to find the root element. App cannot be mounted.");
  // You could even try to append a message to the body
  document.body.innerHTML = `<div class="app-crash-fallback"><h1>Application critical error: Root element not found.</h1></div>`;
}
