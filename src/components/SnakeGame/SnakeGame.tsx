import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useSnakeGame } from "./useSnakeGame";
import "./SnakeGame.css";

const CELL_SIZE = 20; // Fixed cell size, grid dimensions become dynamic

const SnakeGame: React.FC = () => {
  const [dimensions, setDimensions] = useState(() => ({
    width: Math.ceil(window.innerWidth / CELL_SIZE),
    height: Math.ceil(window.innerHeight / CELL_SIZE),
  }));
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const { snake, food, score, highScore, gameState, resetGame, changeDirection } = useSnakeGame({
    gridWidth: dimensions.width,
    gridHeight: dimensions.height,
  });

  const segmentRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const foodElementRef = useRef<HTMLDivElement>(null);

  // Detect touch device
  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkTouch();
    window.addEventListener('touchstart', () => setIsTouchDevice(true), { once: true });
  }, []);

  // Recalculate grid dimensions on resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: Math.ceil(window.innerWidth / CELL_SIZE),
        height: Math.ceil(window.innerHeight / CELL_SIZE),
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Touch control handlers
  const handleDirection = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    const directionMap = {
      up: { x: 0, y: -1 },
      down: { x: 0, y: 1 },
      left: { x: -1, y: 0 },
      right: { x: 1, y: 0 },
    };
    changeDirection(directionMap[direction]);
  }, [changeDirection]);

  // High-performance animation loop for snake segments
  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      snake.forEach((segment, index) => {
        const element = segmentRefs.current.get(index);
        if (element) {
          element.style.transform = `translate(${segment.x * CELL_SIZE}px, ${segment.y * CELL_SIZE}px)`;
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
  }, [snake, gameState]);

  // Update food position
  useEffect(() => {
    if (foodElementRef.current) {
      foodElementRef.current.style.left = `${food.x * CELL_SIZE}px`;
      foodElementRef.current.style.top = `${food.y * CELL_SIZE}px`;
    }
  }, [food]);

  // Memoize board dimensions
  const boardStyle = useMemo(() => ({
    width: dimensions.width * CELL_SIZE,
    height: dimensions.height * CELL_SIZE,
  }), [dimensions]);

  return (
    <div className="snake-game-container">
      <div className="game-scores">
        <p className="game-score">Score: {score}</p>
        <p className="game-high-score">High: {highScore}</p>
      </div>

      <div className="game-board" style={boardStyle}>
        {snake.map((_segment, index) => (
          <div
            key={index}
            className="snake-segment"
            ref={(el) => {
              if (el) segmentRefs.current.set(index, el);
            }}
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
            }}
          />
        ))}

        <div
          className="food"
          ref={foodElementRef}
          style={{
            width: CELL_SIZE,
            height: CELL_SIZE,
          }}
        />

        {gameState === "gameOver" && (
          <div className="game-over-overlay">
            <div className="game-over-content">
              <h2>Game Over</h2>
              <p>Final Score: {score}</p>
              <button onClick={resetGame} className="play-again-button">
                Play Again
              </button>
            </div>
          </div>
        )}

        {gameState === "paused" && (
          <div className="game-overlay">
            <div className="game-over-content">
              <h2>Paused</h2>
              <p>Press Space to resume</p>
            </div>
          </div>
        )}
      </div>

      {/* Mobile touch controls */}
      {isTouchDevice && (
        <div className="touch-controls">
          <button
            className="touch-btn touch-up"
            onTouchStart={(e) => { e.preventDefault(); handleDirection('up'); }}
            aria-label="Move up"
          >
            ▲
          </button>
          <div className="touch-middle-row">
            <button
              className="touch-btn touch-left"
              onTouchStart={(e) => { e.preventDefault(); handleDirection('left'); }}
              aria-label="Move left"
            >
              ◀
            </button>
            <button
              className="touch-btn touch-right"
              onTouchStart={(e) => { e.preventDefault(); handleDirection('right'); }}
              aria-label="Move right"
            >
              ▶
            </button>
          </div>
          <button
            className="touch-btn touch-down"
            onTouchStart={(e) => { e.preventDefault(); handleDirection('down'); }}
            aria-label="Move down"
          >
            ▼
          </button>
        </div>
      )}
    </div>
  );
};

export default SnakeGame;