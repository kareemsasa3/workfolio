import { gamesData } from "../../data/gamesData";
import GameCard from "../../components/GameCard";
import "./Games.css";

const Games = () => {
  return (
    <div className="page-content">
      <div className="games-container">
        <div className="games-header">
          <h1 className="games-title">Mini Games</h1>
          <p className="games-subtitle">
            Interactive games and experiences built with modern web technologies
          </p>
        </div>
        
        <div className="games-grid">
          {gamesData.map((game) => (
            <GameCard key={game.id} {...game} />
          ))}

          {/* Coming Soon Card */}
          <GameCard
            id="coming-soon"
            title="Coming Soon"
            description="More games are in development..."
            path=""
            previewType="placeholder"
            isAvailable={false}
            isComingSoon={true}
          />
        </div>
      </div>
    </div>
  );
};

export default Games;
