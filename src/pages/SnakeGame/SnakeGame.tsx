import React from "react";
import "./SnakeGame.css";
import SnakeGameComponent from "../../components/SnakeGame/SnakeGame";

const SnakeGame = () => {
  return (
    <div className="snake-game-page">
      <div className="game-header">
        <h1>Snake Game</h1>
        <p>
          Classic snake game with wrap-around edges. Use arrow keys to control
          the snake!
        </p>
      </div>
      <div className="game-container">
        <SnakeGameComponent />
      </div>
    </div>
  );
};

export default SnakeGame;
