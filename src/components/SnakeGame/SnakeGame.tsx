// src/components/SnakeGame.js
import { useState, useEffect, useRef, KeyboardEvent } from "react";
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

const CELL_SIZE = 20;
const GRID_WIDTH = 40; // Larger grid for full-page experience
const GRID_HEIGHT = 30; // Larger grid for full-page experience

const SnakeGame = () => {
  const [snake, setSnake] = useState<SnakeSegment[]>([{ x: 20, y: 15 }]);
  const [food, setFood] = useState<Food>({ x: 30, y: 15 });
  const [direction, setDirection] = useState<Direction>({ x: 0, y: 0 });
  const [speed, setSpeed] = useState(150);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const gameBoardRef = useRef<HTMLDivElement>(null);

  // Load high score from localStorage on component mount
  useEffect(() => {
    const savedHighScore = localStorage.getItem("snakeGameHighScore");
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  // Function to save high score
  const saveHighScore = (newScore: number) => {
    if (newScore > highScore) {
      setHighScore(newScore);
      localStorage.setItem("snakeGameHighScore", newScore.toString());
    }
  };

  // Function to generate food in a valid position (not on snake)
  const generateFood = (currentSnake: SnakeSegment[]): Food => {
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
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default browser behavior for arrow keys to avoid scrolling
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case "ArrowUp":
          setDirection({ x: 0, y: -1 });
          break;
        case "ArrowDown":
          setDirection({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
          setDirection({ x: -1, y: 0 });
          break;
        case "ArrowRight":
          setDirection({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown as any);
    return () => {
      window.removeEventListener("keydown", handleKeyDown as any);
    };
  }, []);

  useEffect(() => {
    const moveSnake = () => {
      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        let head = {
          x: newSnake[0].x + direction.x,
          y: newSnake[0].y + direction.y,
        };

        // Wrap around logic using fixed grid size
        if (head.x < 0) head.x = GRID_WIDTH - 1;
        if (head.x >= GRID_WIDTH) head.x = 0;
        if (head.y < 0) head.y = GRID_HEIGHT - 1;
        if (head.y >= GRID_HEIGHT) head.y = 0;

        if (head.x === food.x && head.y === food.y) {
          setFood(generateFood(newSnake));
          setScore((score) => score + 1);
        } else {
          newSnake.pop();
        }

        newSnake.unshift(head);
        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [direction, speed, food]);

  useEffect(() => {
    const checkCollision = () => {
      const head = snake[0];
      for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
          saveHighScore(score);
          alert(`Game Over! Score: ${score}`);
          const newSnake = [{ x: 20, y: 15 }];
          setSnake(newSnake);
          setDirection({ x: 0, y: 0 });
          setFood(generateFood(newSnake));
          setScore(0);
          setSpeed(150);
        }
      }
    };
    checkCollision();
  }, [snake]);

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
      <p className="game-description">Use arrow keys to control the snake.</p>
      <div className="game-scores">
        <p className="game-score">Score: {score}</p>
        <p className="game-high-score">High Score: {highScore}</p>
      </div>
    </div>
  );
};

export default SnakeGame;
