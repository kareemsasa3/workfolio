import { useEffect, useRef, useCallback, useReducer } from "react";

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

interface GameStateObject {
  snake: SnakeSegment[];
  food: Food;
  direction: Direction;
  speed: number;
  score: number;
  highScore: number;
  gameState: GameState;
}

type GameAction =
  | { type: "MOVE_SNAKE" }
  | { type: "CHANGE_DIRECTION"; payload: Direction }
  | { type: "GAME_OVER" }
  | { type: "SET_HIGH_SCORE"; payload: number }
  | { type: "RESET" }
  | { type: "PAUSE_TOGGLE" };

const GRID_WIDTH = 40;
const GRID_HEIGHT = 30;
const INITIAL_SPEED = 150;

const initialGameState: GameStateObject = {
  snake: [{ x: 20, y: 15 }],
  food: { x: 30, y: 15 },
  direction: { x: 0, y: 0 },
  speed: INITIAL_SPEED,
  score: 0,
  highScore: 0,
  gameState: "playing" as GameState,
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

// Function to check if a direction is valid (prevents reversing)
const isValidDirection = (
  newDirection: Direction,
  currentDirection: Direction
): boolean => {
  return !(
    newDirection.x === -currentDirection.x &&
    newDirection.y === -currentDirection.y
  );
};

// Function to check for self-collision
const checkCollision = (snake: SnakeSegment[]): boolean => {
  if (snake.length <= 1) return false;

  const head = snake[0];
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      return true;
    }
  }
  return false;
};

function gameReducer(
  state: GameStateObject,
  action: GameAction
): GameStateObject {
  switch (action.type) {
    case "MOVE_SNAKE": {
      if (state.gameState !== "playing") return state;

      const newSnake = [...state.snake];
      const head = {
        x: newSnake[0].x + state.direction.x,
        y: newSnake[0].y + state.direction.y,
      };

      // Wrap around logic
      if (head.x < 0) head.x = GRID_WIDTH - 1;
      if (head.x >= GRID_WIDTH) head.x = 0;
      if (head.y < 0) head.y = GRID_HEIGHT - 1;
      if (head.y >= GRID_HEIGHT) head.y = 0;

      // Check for food collision
      if (head.x === state.food.x && head.y === state.food.y) {
        // Eat food - grow snake and generate new food
        newSnake.unshift(head);
        const newFood = generateFood(newSnake);
        const newScore = state.score + 1;
        const newSpeed =
          newScore % 5 === 0 ? Math.max(50, state.speed - 10) : state.speed;

        return {
          ...state,
          snake: newSnake,
          food: newFood,
          score: newScore,
          speed: newSpeed,
        };
      } else {
        // Move without eating - remove tail
        newSnake.unshift(head);
        newSnake.pop();

        return {
          ...state,
          snake: newSnake,
        };
      }
    }

    case "CHANGE_DIRECTION": {
      if (state.gameState !== "playing") return state;

      if (isValidDirection(action.payload, state.direction)) {
        return {
          ...state,
          direction: action.payload,
        };
      }
      return state;
    }

    case "GAME_OVER": {
      const newHighScore =
        state.score > state.highScore ? state.score : state.highScore;
      return {
        ...state,
        highScore: newHighScore,
        gameState: "gameOver" as GameState,
      };
    }

    case "SET_HIGH_SCORE": {
      return {
        ...state,
        highScore: action.payload,
      };
    }

    case "RESET": {
      const newSnake = [{ x: 20, y: 15 }];
      return {
        ...initialGameState,
        food: generateFood(newSnake),
      };
    }

    case "PAUSE_TOGGLE": {
      const newGameState = state.gameState === "playing" ? "paused" : "playing";
      return {
        ...state,
        gameState: newGameState as GameState,
      };
    }

    default:
      return state;
  }
}

export const useSnakeGame = () => {
  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);

  // Refs for game loop and input handling
  const lastUpdateTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  const directionQueueRef = useRef<Direction[]>([]);

  // Load high score from localStorage on mount
  useEffect(() => {
    const savedHighScore = localStorage.getItem("snakeGameHighScore");
    if (savedHighScore) {
      dispatch({
        type: "SET_HIGH_SCORE",
        payload: parseInt(savedHighScore, 10),
      });
    }
  }, []);

  // Save high score to localStorage whenever it changes
  useEffect(() => {
    if (gameState.highScore > 0) {
      localStorage.setItem(
        "snakeGameHighScore",
        gameState.highScore.toString()
      );
    }
  }, [gameState.highScore]);

  // Game loop using requestAnimationFrame
  const gameLoop = useCallback(
    (currentTime: number) => {
      if (gameState.gameState !== "playing") {
        animationFrameRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      if (currentTime - lastUpdateTimeRef.current >= gameState.speed) {
        // Process input queue
        if (directionQueueRef.current.length > 0) {
          const newDirection = directionQueueRef.current.shift()!;
          dispatch({ type: "CHANGE_DIRECTION", payload: newDirection });
        }

        // Move snake
        dispatch({ type: "MOVE_SNAKE" });
        lastUpdateTimeRef.current = currentTime;
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    },
    [gameState.gameState, gameState.speed]
  );

  // Start/stop game loop based on game state
  useEffect(() => {
    if (gameState.gameState === "playing") {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameLoop, gameState.gameState]);

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
        dispatch({ type: "PAUSE_TOGGLE" });
        return;
      }

      // Only handle direction keys if game is playing
      if (gameState.gameState !== "playing") return;

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
  }, [gameState.gameState]);

  // Collision detection
  useEffect(() => {
    if (gameState.gameState !== "playing" || gameState.snake.length <= 1)
      return;

    if (checkCollision(gameState.snake)) {
      dispatch({ type: "GAME_OVER" });
    }
  }, [gameState.snake, gameState.gameState]);

  // Reset game function
  const resetGame = useCallback(() => {
    dispatch({ type: "RESET" });
    directionQueueRef.current = [];
    lastUpdateTimeRef.current = 0;
  }, []);

  return {
    snake: gameState.snake,
    food: gameState.food,
    score: gameState.score,
    highScore: gameState.highScore,
    gameState: gameState.gameState,
    resetGame,
  };
};
