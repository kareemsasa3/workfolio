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
  gridWidth: number;
  gridHeight: number;
}

type GameAction =
  | { type: "MOVE_SNAKE" }
  | { type: "CHANGE_DIRECTION"; payload: Direction }
  | { type: "GAME_OVER" }
  | { type: "SET_HIGH_SCORE"; payload: number }
  | { type: "RESET" }
  | { type: "PAUSE_TOGGLE" }
  | { type: "UPDATE_GRID"; payload: { width: number; height: number } };

const INITIAL_SPEED = 100;

const createInitialState = (gridWidth: number, gridHeight: number): GameStateObject => ({
  snake: [{ x: Math.floor(gridWidth / 2), y: Math.floor(gridHeight / 2) }],
  food: { x: Math.floor(gridWidth * 0.75), y: Math.floor(gridHeight / 2) },
  direction: { x: 1, y: 0 },
  speed: INITIAL_SPEED,
  score: 0,
  highScore: 0,
  gameState: "playing",
  gridWidth,
  gridHeight,
});

// Function to generate food in a valid position (not on snake)
const generateFood = (currentSnake: SnakeSegment[], gridWidth: number, gridHeight: number): Food => {
  let newFood: Food;
  do {
    newFood = {
      x: Math.floor(Math.random() * gridWidth),
      y: Math.floor(Math.random() * gridHeight),
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
    case "UPDATE_GRID": {
      const { width, height } = action.payload;
      // Only update if dimensions actually changed
      if (width === state.gridWidth && height === state.gridHeight) {
        return state;
      }
      
      // Clamp snake and food positions to new grid
      const clampedSnake = state.snake.map(segment => ({
        x: Math.min(segment.x, width - 1),
        y: Math.min(segment.y, height - 1),
      }));
      
      const clampedFood = {
        x: Math.min(state.food.x, width - 1),
        y: Math.min(state.food.y, height - 1),
      };
      
      return {
        ...state,
        gridWidth: width,
        gridHeight: height,
        snake: clampedSnake,
        food: clampedFood,
      };
    }

    case "MOVE_SNAKE": {
      if (
        state.gameState !== "playing" ||
        (state.direction.x === 0 && state.direction.y === 0)
      ) {
        return state;
      }

      const newSnake = [...state.snake];
      const currentHead = newSnake[0];

      const newHead = {
        x: currentHead.x + state.direction.x,
        y: currentHead.y + state.direction.y,
      };

      // Wrap around logic using dynamic grid dimensions
      if (newHead.x < 0) newHead.x = state.gridWidth - 1;
      if (newHead.x >= state.gridWidth) newHead.x = 0;
      if (newHead.y < 0) newHead.y = state.gridHeight - 1;
      if (newHead.y >= state.gridHeight) newHead.y = 0;

      // Check for self-collision
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

      newSnake.unshift(newHead);

      // Check for food collision
      if (newHead.x === state.food.x && newHead.y === state.food.y) {
        const newFood = generateFood(newSnake, state.gridWidth, state.gridHeight);
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
        gameState: "gameOver",
      };
    }

    case "SET_HIGH_SCORE": {
      return {
        ...state,
        highScore: action.payload,
      };
    }

    case "RESET": {
      const newSnake = [{ 
        x: Math.floor(state.gridWidth / 2), 
        y: Math.floor(state.gridHeight / 2) 
      }];
      return {
        ...createInitialState(state.gridWidth, state.gridHeight),
        food: generateFood(newSnake, state.gridWidth, state.gridHeight),
        highScore: state.highScore,
      };
    }

    case "PAUSE_TOGGLE": {
      const newGameState = state.gameState === "playing" ? "paused" : "playing";
      return {
        ...state,
        gameState: newGameState,
      };
    }

    default:
      return state;
  }
}

interface UseSnakeGameOptions {
  gridWidth: number;
  gridHeight: number;
}

export const useSnakeGame = ({ gridWidth, gridHeight }: UseSnakeGameOptions) => {
  const [gameState, dispatch] = useReducer(
    gameReducer,
    { gridWidth, gridHeight },
    ({ gridWidth, gridHeight }) => createInitialState(gridWidth, gridHeight)
  );

  // Refs for game loop and input handling
  const lastUpdateTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  const directionQueueRef = useRef<Direction[]>([]);

  const gameStateRef = useRef(gameState);
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  // Update grid dimensions when they change
  useEffect(() => {
    dispatch({ type: "UPDATE_GRID", payload: { width: gridWidth, height: gridHeight } });
  }, [gridWidth, gridHeight]);

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
      localStorage.setItem("snakeGameHighScore", gameState.highScore.toString());
    }
  }, [gameState.highScore]);

  // Game loop
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

  // Game loop manager
  useEffect(() => {
    if (gameState.gameState === "playing") {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState.gameState, gameLoop]);

  // Input handling
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
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: "RESET" });
    directionQueueRef.current = [];
    lastUpdateTimeRef.current = 0;
    animationFrameRef.current = null;
  }, []);

  const changeDirection = useCallback((direction: { x: number; y: number }) => {
    if (directionQueueRef.current.length < 3) {
      directionQueueRef.current.push(direction);
    }
  }, []);

  return {
    snake: gameState.snake,
    food: gameState.food,
    score: gameState.score,
    highScore: gameState.highScore,
    gameState: gameState.gameState,
    gridWidth: gameState.gridWidth,
    gridHeight: gameState.gridHeight,
    resetGame,
    changeDirection,
  };
};