// src/components/SnakeGame.js
import React from "react";
import { useSnakeGame } from "./useSnakeGame";
import "./SnakeGame.css";

const CELL_SIZE = 20;

const SnakeGame: React.FC = () => {
  const { snake, food, score, highScore, gameState, resetGame } =
    useSnakeGame();

  return (
    <div className="game-board">
      {snake.map((segment, index) => (
        <div
          key={index}
          className="snake-segment"
          style={{
            left: `${segment.x * CELL_SIZE}px`,
            top: `${segment.y * CELL_SIZE}px`,
          }}
        ></div>
      ))}
      <div
        className="food"
        style={{
          left: `${food.x * CELL_SIZE}px`,
          top: `${food.y * CELL_SIZE}px`,
        }}
      ></div>

      {/* Game Over Overlay */}
      {gameState === "gameOver" && (
        <div className="game-over-overlay">
          <div className="game-over-content">
            <h2>Game Over!</h2>
            <p>Final Score: {score}</p>
            <button onClick={resetGame} className="play-again-button">
              Play Again
            </button>
          </div>
        </div>
      )}

      {/* Pause Overlay */}
      {gameState === "paused" && (
        <div className="game-overlay">
          <div className="game-over-content">
            <h2>Game Paused</h2>
            <p>Press Spacebar to resume</p>
          </div>
        </div>
      )}

      <p className="game-description">
        Use arrow keys to control the snake. Press Spacebar to pause.
      </p>
      <div className="game-scores">
        <p className="game-score">Score: {score}</p>
        <p className="game-high-score">High Score: {highScore}</p>
      </div>
    </div>
  );
};

export default SnakeGame;
