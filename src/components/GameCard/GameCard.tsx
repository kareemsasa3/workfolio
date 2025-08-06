import { Link } from "react-router-dom";
import { GameData } from "../../data/gamesData";
import "./GameCard.css";

interface GameCardProps extends GameData {
  isComingSoon?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({
  title,
  description,
  path,
  previewType,
  isComingSoon = false,
}) => {
  const renderPreview = () => {
    switch (previewType) {
      case "snake":
        return (
          <div className="snake-preview">
            <div className="snake-segment-preview"></div>
            <div className="snake-segment-preview"></div>
            <div className="snake-segment-preview"></div>
            <div className="food-preview"></div>
          </div>
        );
      default:
        return <div className="placeholder">🎮</div>;
    }
  };

  if (isComingSoon) {
    return (
      <div className="game-card coming-soon">
        <div className="game-card-content">
          <h3>{title}</h3>
          <p>{description}</p>
          <div className="game-preview">
            <div className="placeholder">🎮</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link to={path} className="game-card">
      <div className="game-card-content">
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="game-preview">{renderPreview()}</div>
        <div className="play-button">Play Now</div>
      </div>
    </Link>
  );
};

export default GameCard;
