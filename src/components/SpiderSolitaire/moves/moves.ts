import { GameState, Card, Rank } from '../types/types';

/**
 * Check if a sequence of cards forms a valid run (sequential, all same suit)
 * In 1-suit Spider, we only care about sequential ranks
 */
export function isValidRun(cards: Card[]): boolean {
  if (cards.length === 0) return false;
  if (cards.length === 1) return true;
  
  for (let i = 0; i < cards.length - 1; i++) {
    // Each card must be exactly one rank higher than the next
    if (cards[i].rank !== cards[i + 1].rank + 1) {
      return false;
    }
  }
  
  return true;
}

/**
 * Get the valid movable run starting from a given card index in a column
 * Returns the cards that can be moved as a unit, or empty if invalid
 */
export function getMovableRun(columnCards: Card[], startIndex: number): Card[] {
  // Can't move face-down cards
  if (!columnCards[startIndex]?.faceUp) return [];
  
  const run = columnCards.slice(startIndex);
  
  // All cards in the run must be face-up and sequential
  if (!run.every(card => card.faceUp)) return [];
  if (!isValidRun(run)) return [];
  
  return run;
}

/**
 * Check if a run can be placed on top of a column
 */
export function canPlaceRun(run: Card[], targetColumn: Card[]): boolean {
  if (run.length === 0) return false;
  
  // Can always place on empty column
  if (targetColumn.length === 0) return true;
  
  const topCard = targetColumn[targetColumn.length - 1];
  const bottomOfRun = run[0];
  
  // The top card of target must be exactly one rank higher than bottom of run
  return topCard.rank === bottomOfRun.rank + 1;
}

/**
 * Check if a column has a complete King-to-Ace run on top
 */
export function hasCompleteRun(columnCards: Card[]): boolean {
  if (columnCards.length < 13) return false;
  
  // Check the top 13 cards
  const top13 = columnCards.slice(-13);
  
  // Must all be face-up
  if (!top13.every(card => card.faceUp)) return false;
  
  // Must be K, Q, J, 10, 9, 8, 7, 6, 5, 4, 3, 2, A (13 down to 1)
  for (let i = 0; i < 13; i++) {
    if (top13[i].rank !== (13 - i) as Rank) return false;
  }
  
  return true;
}

/**
 * Remove a complete run from a column and return updated state
 */
export function removeCompleteRun(state: GameState, columnIndex: number): GameState {
  const column = state.tableau[columnIndex];
  
  if (!hasCompleteRun(column.cards)) return state;
  
  const newTableau = state.tableau.map((col, idx) => {
    if (idx !== columnIndex) return col;
    
    // Remove top 13 cards
    const newCards = col.cards.slice(0, -13);
    
    // Flip the new top card if there is one and it's face-down
    if (newCards.length > 0 && !newCards[newCards.length - 1].faceUp) {
      newCards[newCards.length - 1] = {
        ...newCards[newCards.length - 1],
        faceUp: true,
      };
    }
    
    return { cards: newCards };
  });
  
  const newCompletedSuits = state.completedSuits + 1;
  
  return {
    ...state,
    tableau: newTableau,
    completedSuits: newCompletedSuits,
    isWon: newCompletedSuits === 8,
  };
}

/**
 * Execute a move: move cards from one column to another
 */
export function executeMove(
  state: GameState,
  fromColumn: number,
  cardIndex: number,
  toColumn: number
): GameState {
  const fromCards = state.tableau[fromColumn].cards;
  const toCards = state.tableau[toColumn].cards;
  
  // Get the run to move
  const run = getMovableRun(fromCards, cardIndex);
  if (run.length === 0) return state;
  
  // Check if we can place it
  if (!canPlaceRun(run, toCards)) return state;
  
  // Can't move to same column
  if (fromColumn === toColumn) return state;
  
  // Execute the move
  const newTableau = state.tableau.map((col, idx) => {
    if (idx === fromColumn) {
      // Remove cards from source
      const newCards = col.cards.slice(0, cardIndex);
      
      // Flip new top card if needed
      if (newCards.length > 0 && !newCards[newCards.length - 1].faceUp) {
        newCards[newCards.length - 1] = {
          ...newCards[newCards.length - 1],
          faceUp: true,
        };
      }
      
      return { cards: newCards };
    }
    
    if (idx === toColumn) {
      // Add cards to destination
      return { cards: [...col.cards, ...run] };
    }
    
    return col;
  });
  
  let newState: GameState = {
    ...state,
    tableau: newTableau,
    moveCount: state.moveCount + 1,
  };
  
  // Check if we completed a run in the target column
  if (hasCompleteRun(newState.tableau[toColumn].cards)) {
    newState = removeCompleteRun(newState, toColumn);
  }
  
  return newState;
}

/**
 * Find all valid moves from a given card
 * Returns array of column indices where the card/run can be moved
 */
export function getValidMoves(
  state: GameState,
  fromColumn: number,
  cardIndex: number
): number[] {
  const run = getMovableRun(state.tableau[fromColumn].cards, cardIndex);
  if (run.length === 0) return [];
  
  const validTargets: number[] = [];
  
  for (let col = 0; col < 10; col++) {
    if (col === fromColumn) continue;
    if (canPlaceRun(run, state.tableau[col].cards)) {
      validTargets.push(col);
    }
  }
  
  return validTargets;
}

/**
 * Check if any moves are possible (for detecting stuck state)
 */
export function hasAnyValidMove(state: GameState): boolean {
  // Can we deal from stock?
  if (state.stock.length > 0 && state.tableau.every(col => col.cards.length > 0)) {
    return true;
  }
  
  // Check all columns for movable runs
  for (let fromCol = 0; fromCol < 10; fromCol++) {
    const cards = state.tableau[fromCol].cards;
    
    for (let cardIdx = 0; cardIdx < cards.length; cardIdx++) {
      if (getValidMoves(state, fromCol, cardIdx).length > 0) {
        return true;
      }
    }
  }
  
  return false;
}