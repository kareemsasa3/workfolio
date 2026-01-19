import { useMemo, useState, useCallback, DragEvent } from "react";
import { RANK_NAMES } from "./types/types";
import { useSpiderSolitaire } from "./useSpiderSolitaire";
import "./SpiderSolitaire.css";

const CARD_OFFSET_FACE_DOWN = 8;   // Tight stack for face-down
const CARD_OFFSET_FACE_UP = 28;    // More space for face-up cards
const CARD_OFFSET_RUN_BREAK = 36;  // Extra space when run breaks

// Check if card at index is part of a sequential run with the card above it
function isPartOfRun(cards: { rank: number; faceUp: boolean }[], cardIndex: number): boolean {
  if (!cards[cardIndex].faceUp) return false;
  if (cardIndex === 0) return false; // First card starts a new run
  if (!cards[cardIndex - 1].faceUp) return false; // Card above is face-down, this starts a new run
  
  // Card above should be exactly one rank higher
  return cards[cardIndex - 1].rank === cards[cardIndex].rank + 1;
}

// Check if this card is the start of a valid sequential run
function isRunStart(cards: { rank: number; faceUp: boolean }[], cardIndex: number): boolean {
  const card = cards[cardIndex];
  if (!card.faceUp) return false;
  
  // If it's the first card or first face-up card, check if it starts a run
  const isFirstFaceUp = cardIndex === 0 || !cards[cardIndex - 1].faceUp;
  
  if (isFirstFaceUp) {
    // Check if there's at least one card below that continues the run
    if (cardIndex < cards.length - 1) {
      const nextCard = cards[cardIndex + 1];
      if (nextCard.faceUp && card.rank === nextCard.rank + 1) {
        return true; // This starts a valid run
      }
    }
    return false; // Single card, no run indicator needed
  }
  
  // Not first face-up, check if it breaks from the card above
  return !isPartOfRun(cards, cardIndex);
}

// Calculate Y position for a card based on the stack above it
function calculateCardTop(cards: { rank: number; faceUp: boolean }[], cardIndex: number): number {
  let top = 0;
  for (let i = 0; i < cardIndex; i++) {
    if (!cards[i].faceUp) {
      top += CARD_OFFSET_FACE_DOWN;
    } else if (cards[i + 1]?.faceUp && isPartOfRun(cards, i + 1)) {
      top += CARD_OFFSET_FACE_UP;
    } else {
      top += CARD_OFFSET_RUN_BREAK; // Extra gap before a break in the run
    }
  }
  return top;
}

interface DragData {
  fromColumn: number;
  cardIndex: number;
}

const SpiderSolitaire = () => {
  const {
    tableau,
    stock,
    completedSuits,
    moveCount,
    isWon,
    selection,
    canDeal,
    newGame,
    dealCards,
    selectCard,
    moveCards,
    clearSelection,
    getValidTargets,
  } = useSpiderSolitaire();

  const [dragData, setDragData] = useState<DragData | null>(null);

  const selectedMap = useMemo(() => {
    if (!selection) return null;
    return { column: selection.column, cardIndex: selection.cardIndex };
  }, [selection]);

  // Get valid targets for current drag
  const validTargets = useMemo(() => {
    if (!dragData) return new Set<number>();
    return new Set(getValidTargets(dragData.fromColumn, dragData.cardIndex));
  }, [dragData, getValidTargets]);

  const handleEmptyColumnClick = (columnIndex: number) => {
    if (!selectedMap) return;
    if (columnIndex === selectedMap.column) return;
    if (tableau[columnIndex].cards.length === 0) {
      moveCards(selectedMap.column, selectedMap.cardIndex, columnIndex);
    }
  };

  // Drag handlers
  const handleDragStart = useCallback(
    (e: DragEvent<HTMLDivElement>, columnIndex: number, cardIndex: number) => {
      const card = tableau[columnIndex].cards[cardIndex];
      if (!card.faceUp) {
        e.preventDefault();
        return;
      }

      // Check if this card starts a valid run
      const targets = getValidTargets(columnIndex, cardIndex);
      if (targets.length === 0 && tableau.every((col, i) => i === columnIndex || col.cards.length > 0)) {
        // No valid moves and no empty columns (except maybe our own)
        // Still allow drag to empty columns
      }

      setDragData({ fromColumn: columnIndex, cardIndex });
      clearSelection();

      // Set drag image (optional: could customize)
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", `${columnIndex},${cardIndex}`);
    },
    [tableau, getValidTargets, clearSelection]
  );

  const handleDragEnd = useCallback(() => {
    setDragData(null);
  }, []);

  const handleDragOver = useCallback(
    (e: DragEvent<HTMLDivElement>, columnIndex: number) => {
      if (!dragData) return;
      if (columnIndex === dragData.fromColumn) return;

      // Check if this is a valid target
      const isValid = validTargets.has(columnIndex);
      
      if (isValid) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
      }
    },
    [dragData, validTargets]
  );

  const handleDragLeave = useCallback(() => {
    // No-op, kept for potential future use
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>, columnIndex: number) => {
      e.preventDefault();

      if (!dragData) return;
      if (columnIndex === dragData.fromColumn) return;

      moveCards(dragData.fromColumn, dragData.cardIndex, columnIndex);
      setDragData(null);
    },
    [dragData, moveCards]
  );

  return (
    <div className="spider-solitaire">
      <div className="spider-header">
        <div className="spider-stats">
          <span>Moves: {moveCount}</span>
          <span>Completed: {completedSuits}/8</span>
          <span>Stock: {Math.floor(stock.length / 10)}</span>
        </div>
        <div className="spider-actions">
          <button className="spider-button" onClick={newGame}>
            New Game
          </button>
          <button
            className="spider-button"
            onClick={dealCards}
            disabled={!canDeal}
          >
            Deal
          </button>
        </div>
      </div>

      {isWon && (
        <div className="spider-win-banner">You cleared the tableau!</div>
      )}

      <div className="spider-board">
        {tableau.map((column, columnIndex) => {

          return (
            <div
              key={`column-${columnIndex}`}
              className="spider-column"
              onClick={() => handleEmptyColumnClick(columnIndex)}
              onDragOver={(e) => handleDragOver(e, columnIndex)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, columnIndex)}
            >
              {column.cards.map((card, cardIndex) => {
                const isSelected =
                  selectedMap &&
                  selectedMap.column === columnIndex &&
                  cardIndex >= selectedMap.cardIndex;

                const isDragging =
                  dragData &&
                  dragData.fromColumn === columnIndex &&
                  cardIndex >= dragData.cardIndex;

                const isRunStartCard = isRunStart(column.cards, cardIndex);

                return (
                  <div
                    key={card.id}
                    className={`spider-card ${card.faceUp ? "face-up" : "face-down"} ${isSelected ? "selected" : ""} ${isDragging ? "dragging" : ""} ${isRunStartCard ? "run-start" : ""}`}
                    style={{
                      top: `${calculateCardTop(column.cards, cardIndex)}px`,
                      zIndex: cardIndex,
                    }}
                    draggable={card.faceUp}
                    onClick={(e) => {
                      e.stopPropagation();
                      selectCard(columnIndex, cardIndex);
                    }}
                    onDragStart={(e) => handleDragStart(e, columnIndex, cardIndex)}
                    onDragEnd={handleDragEnd}
                  >
                    {card.faceUp ? (
                      <span className="spider-card-rank">
                        {RANK_NAMES[card.rank]}
                      </span>
                    ) : (
                      <span className="spider-card-back" />
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SpiderSolitaire;