import React from "react";
import { Link } from "react-router-dom";
import "./Games.css";

const Games = () => {
  return (
    <div className="page-content">
      <div className="games-title">Mini Games</div>
      <div className="games-grid">
        <Link to="/games/snake" className="game-card">
          <div className="game-card-content">
            <h3>Snake Game</h3>
            <p>Classic snake game with wrap-around edges</p>
            <div className="game-preview">
              <div className="snake-preview">
                <div className="snake-segment-preview"></div>
                <div className="snake-segment-preview"></div>
                <div className="snake-segment-preview"></div>
                <div className="food-preview"></div>
              </div>
            </div>
            <div className="play-button">Play Now</div>
          </div>
        </Link>

        {/* Future games will be added here */}
        <div className="game-card coming-soon">
          <div className="game-card-content">
            <h3>Coming Soon</h3>
            <p>More games are in development...</p>
            <div className="game-preview">
              <div className="placeholder">🎮</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Games;
