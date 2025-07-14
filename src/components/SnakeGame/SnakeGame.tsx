// src/components/SnakeGame.js
import { useState, useEffect, useRef, useCallback } from "react";
import "./SnakeGame.css";

interface SnakeSegment {
  x: number;
  y: number;
}

interface Food {
  x: number;
  y: number;
}

interface Direction {
  x: number;
  y: number;
}

type GameState = "playing" | "gameOver" | "paused";

const CELL_SIZE = 20;
const GRID_WIDTH = 40; // Larger grid for full-page experience
const GRID_HEIGHT = 30; // Larger grid for full-page experience
const INITIAL_SPEED = 150; // milliseconds between moves

const SnakeGame = () => {
  const [snake, setSnake] = useState<SnakeSegment[]>([{ x: 20, y: 15 }]);
  const [food, setFood] = useState<Food>({ x: 30, y: 15 });
  const [direction, setDirection] = useState<Direction>({ x: 0, y: 0 });
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameState, setGameState] = useState<GameState>("playing");

  // Refs for game loop and input handling
  const lastUpdateTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  const directionQueueRef = useRef<Direction[]>([]);
  const gameBoardRef = useRef<HTMLDivElement>(null);

  // Load high score from localStorage on component mount
  useEffect(() => {
    const savedHighScore = localStorage.getItem("snakeGameHighScore");
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  // Function to save high score
  const saveHighScore = useCallback(
    (newScore: number) => {
      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem("snakeGameHighScore", newScore.toString());
      }
    },
    [highScore]
  );

  // Function to generate food in a valid position (not on snake)
  const generateFood = useCallback((currentSnake: SnakeSegment[]): Food => {
    let newFood: Food;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_WIDTH),
        y: Math.floor(Math.random() * GRID_HEIGHT),
      };
    } while (
      currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      )
    );

    return newFood;
  }, []);

  // Function to check if a direction is valid (prevents reversing)
  const isValidDirection = useCallback(
    (newDirection: Direction, currentDirection: Direction): boolean => {
      // Prevent reversing direction (which would cause immediate collision)
      return !(
        newDirection.x === -currentDirection.x &&
        newDirection.y === -currentDirection.y
      );
    },
    []
  );

  // Function to reset the game
  const resetGame = useCallback(() => {
    const newSnake = [{ x: 20, y: 15 }];
    setSnake(newSnake);
    setDirection({ x: 0, y: 0 });
    setFood(generateFood(newSnake));
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setGameState("playing");
    directionQueueRef.current = [];
    lastUpdateTimeRef.current = 0;
  }, [generateFood]);

  // Game loop using requestAnimationFrame
  const gameLoop = useCallback(
    (currentTime: number) => {
      if (gameState !== "playing") {
        animationFrameRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      if (currentTime - lastUpdateTimeRef.current >= speed) {
        // Process input queue
        if (directionQueueRef.current.length > 0) {
          const newDirection = directionQueueRef.current.shift()!;
          if (isValidDirection(newDirection, direction)) {
            setDirection(newDirection);
          }
        }

        // Move snake
        setSnake((prevSnake) => {
          const newSnake = [...prevSnake];
          const currentDirection =
            directionQueueRef.current.length > 0
              ? directionQueueRef.current[0]
              : direction;

          let head = {
            x: newSnake[0].x + currentDirection.x,
            y: newSnake[0].y + currentDirection.y,
          };

          // Wrap around logic using fixed grid size
          if (head.x < 0) head.x = GRID_WIDTH - 1;
          if (head.x >= GRID_WIDTH) head.x = 0;
          if (head.y < 0) head.y = GRID_HEIGHT - 1;
          if (head.y >= GRID_HEIGHT) head.y = 0;

          // Check for food collision
          if (head.x === food.x && head.y === food.y) {
            setFood(generateFood(newSnake));
            setScore((prevScore) => {
              const newScore = prevScore + 1;
              // Increase speed every 5 points
              if (newScore % 5 === 0) {
                setSpeed((prevSpeed) => Math.max(50, prevSpeed - 10));
              }
              return newScore;
            });
          } else {
            newSnake.pop();
          }

          newSnake.unshift(head);
          return newSnake;
        });

        lastUpdateTimeRef.current = currentTime;
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    },
    [gameState, speed, food, direction, generateFood, isValidDirection]
  );

  // Start/stop game loop based on game state
  useEffect(() => {
    if (gameState === "playing") {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameLoop, gameState]);

  // Input handling with queue
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default browser behavior for arrow keys to avoid scrolling
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)
      ) {
        e.preventDefault();
      }

      // Handle pause/resume with spacebar
      if (e.key === " ") {
        setGameState((prevState) =>
          prevState === "playing" ? "paused" : "playing"
        );
        return;
      }

      // Only handle direction keys if game is playing
      if (gameState !== "playing") return;

      let newDirection: Direction;
      switch (e.key) {
        case "ArrowUp":
          newDirection = { x: 0, y: -1 };
          break;
        case "ArrowDown":
          newDirection = { x: 0, y: 1 };
          break;
        case "ArrowLeft":
          newDirection = { x: -1, y: 0 };
          break;
        case "ArrowRight":
          newDirection = { x: 1, y: 0 };
          break;
        default:
          return;
      }

      // Add to direction queue (limit queue size to prevent memory issues)
      if (directionQueueRef.current.length < 3) {
        directionQueueRef.current.push(newDirection);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameState]);

  // Collision detection
  useEffect(() => {
    if (gameState !== "playing" || snake.length <= 1) return;

    const head = snake[0];
    for (let i = 1; i < snake.length; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) {
        saveHighScore(score);
        setGameState("gameOver");
        return;
      }
    }
  }, [snake, gameState, score, saveHighScore]);

  return (
    <div ref={gameBoardRef} className="game-board">
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
