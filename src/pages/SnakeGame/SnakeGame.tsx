import "./SnakeGame.css";
import SnakeGameComponent from "../../components/SnakeGame/SnakeGame";

const SnakeGame = () => {
  return (
    <div className="page-content">
      <div className="snake-game-container">
        <div className="snake-game-header">
          <h1 className="snake-game-title">Snake Game</h1>
          <p className="snake-game-subtitle">
            Classic snake game with wrap-around edges. Use arrow keys to control
            the snake!
          </p>
        </div>
        <div className="game-container">
          <SnakeGameComponent />
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;
