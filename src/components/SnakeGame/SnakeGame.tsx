// src/components/SnakeGame.js
import React, { useMemo, useState, useEffect, useRef } from "react";
import { useSnakeGame } from "./useSnakeGame";
import "./SnakeGame.css";

const SnakeGame: React.FC = () => {
  const { snake, food, score, highScore, gameState, resetGame } =
    useSnakeGame();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Refs for high-performance rendering
  const segmentRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const foodElementRef = useRef<HTMLDivElement>(null);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate dynamic cell size based on viewport
  const cellSize = useMemo(() => {
    const isMobile = windowWidth <= 768;
    const isSmallMobile = windowWidth <= 480;

    if (isSmallMobile) return 14;
    if (isMobile) return 16;
    return 20;
  }, [windowWidth]);

  // High-performance animation loop for snake segments
  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      // Update snake segments directly on DOM
      snake.forEach((segment, index) => {
        const element = segmentRefs.current.get(index);
        if (element) {
          element.style.transform = `translate(${segment.x * cellSize}px, ${
            segment.y * cellSize
          }px)`;
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    if (gameState === "playing") {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [snake, cellSize, gameState]);

  // Separate effect for food positioning to avoid animation loop interference
  useEffect(() => {
    if (foodElementRef.current) {
      foodElementRef.current.style.left = `${food.x * cellSize}px`;
      foodElementRef.current.style.top = `${food.y * cellSize}px`;
    }
  }, [food, cellSize]);

  return (
    <div className="snake-game-container">
      <div className="game-scores">
        <p className="game-score">Score: {score}</p>
        <p className="game-high-score">High Score: {highScore}</p>
      </div>

      <div className="game-board">
        {/* Render snake segments with refs for direct DOM manipulation */}
        {snake.map((_segment, index) => (
          <div
            key={index}
            className="snake-segment"
            ref={(el) => {
              if (el) segmentRefs.current.set(index, el);
            }}
            style={{
              width: `${cellSize}px`,
              height: `${cellSize}px`,
            }}
          ></div>
        ))}

        {/* Food with ref for direct DOM manipulation */}
        <div
          className="food"
          ref={foodElementRef}
          style={{
            width: `${cellSize}px`,
            height: `${cellSize}px`,
            left: `${food.x * cellSize}px`,
            top: `${food.y * cellSize}px`,
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
      </div>

      <p className="game-description">
        Use arrow keys to control the snake. Press Spacebar to pause.
      </p>
    </div>
  );
};

export default SnakeGame;
