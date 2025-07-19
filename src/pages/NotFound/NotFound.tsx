import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound: React.FC = () => {
  return (
    <div className="not-found">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you're looking for doesn't exist.</p>
        <Link to="/" className="home-link">
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
