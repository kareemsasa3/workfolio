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
  direction: { x: 1, y: 0 }, // Start moving right
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

function gameReducer(
  state: GameStateObject,
  action: GameAction
): GameStateObject {
  switch (action.type) {
    case "MOVE_SNAKE": {
      if (
        state.gameState !== "playing" ||
        (state.direction.x === 0 && state.direction.y === 0)
      ) {
        return state; // Don't move if paused or direction is not set
      }

      // Create a mutable copy of the snake for this turn's logic
      const newSnake = [...state.snake];
      const currentHead = newSnake[0];

      // 1. Calculate the new head's position
      const newHead = {
        x: currentHead.x + state.direction.x,
        y: currentHead.y + state.direction.y,
      };

      // Wrap around logic
      if (newHead.x < 0) newHead.x = GRID_WIDTH - 1;
      if (newHead.x >= GRID_WIDTH) newHead.x = 0;
      if (newHead.y < 0) newHead.y = GRID_HEIGHT - 1;
      if (newHead.y >= GRID_HEIGHT) newHead.y = 0;

      // 2. Check for game-ending self-collision
      // The new head's position cannot be on any part of the *current* snake body
      // EXCEPT the last segment (tail), because the tail will move away on the next frame
      for (let i = 0; i < newSnake.length - 1; i++) {
        const segment = newSnake[i];
        if (segment.x === newHead.x && segment.y === newHead.y) {
          const newHighScore =
            state.score > state.highScore ? state.score : state.highScore;
          return {
            ...state,
            highScore: newHighScore,
            gameState: "gameOver",
          };
        }
      }

      // If we are here, there was no collision. Now add the new head.
      newSnake.unshift(newHead);

      // 3. Check for food collision (eating)
      if (newHead.x === state.food.x && newHead.y === state.food.y) {
        // The snake grows, so we DON'T remove the tail.
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
        // 4. Just a normal move (no food eaten)
        // Remove the tail segment to keep the snake the same length
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
      // This case can now be simplified or removed, as the logic is in MOVE_SNAKE
      // For now, we can leave it in case it's used elsewhere, but it's now redundant for self-collision.
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

  // === THE FIX: Use a ref to hold a stable reference to the state ===
  const gameStateRef = useRef(gameState);
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);
  // ===================================================================

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
  const gameLoop = useCallback((currentTime: number) => {
    animationFrameRef.current = requestAnimationFrame(gameLoop);

    if (gameStateRef.current.gameState !== "playing") {
      return;
    }

    if (currentTime - lastUpdateTimeRef.current >= gameStateRef.current.speed) {
      if (directionQueueRef.current.length > 0) {
        const newDirection = directionQueueRef.current.shift()!;
        dispatch({ type: "CHANGE_DIRECTION", payload: newDirection });
      }
      dispatch({ type: "MOVE_SNAKE" });
      lastUpdateTimeRef.current = currentTime;
    }
  }, []);

  // === THE CORRECTED AND SIMPLIFIED GAME LOOP MANAGER ===
  useEffect(() => {
    // If the game is in a state that should have a running loop, start it.
    if (gameState.gameState === "playing") {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }
    // The cleanup function will always run when the dependency [gameState.gameState] changes.
    // This will correctly stop the loop when pausing, or on game over.
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState.gameState, gameLoop]);
  // =======================================================

  // Input handling with queue
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)
      ) {
        e.preventDefault();
      }
      if (e.key === " ") {
        dispatch({ type: "PAUSE_TOGGLE" });
        return;
      }
      if (gameStateRef.current.gameState !== "playing") return;

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

      if (directionQueueRef.current.length < 3) {
        directionQueueRef.current.push(newDirection);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []); // <-- Empty dependency array makes this stable as well

  const resetGame = useCallback(() => {
    dispatch({ type: "RESET" });
    directionQueueRef.current = [];
    lastUpdateTimeRef.current = 0;
    animationFrameRef.current = null; // Ensure ref is cleared on reset
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
