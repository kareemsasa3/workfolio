import { Card, Rank, Column, GameState } from '../types/types';

/**
 * Create a 1-suit Spider Solitaire deck (104 cards)
 * 8 copies of each rank (Ace through King)
 */
export function createDeck(): Card[] {
  const cards: Card[] = [];
  
  for (let copy = 0; copy < 8; copy++) {
    for (let rank = 1; rank <= 13; rank++) {
      cards.push({
        id: `S-${rank}-${copy}`,
        rank: rank as Rank,
        faceUp: false,
      });
    }
  }
  
  return cards;
}

/**
 * Fisher-Yates shuffle
 */
export function shuffleDeck(cards: Card[]): Card[] {
  const shuffled = [...cards];
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

/**
 * Deal initial game state
 * - 54 cards to tableau (columns 0-3 get 6 cards, columns 4-9 get 5 cards)
 * - Top card of each column is face-up
 * - 50 cards remain in stock
 */
export function dealGame(): GameState {
  const deck = shuffleDeck(createDeck());
  
  const tableau: Column[] = [];
  let cardIndex = 0;
  
  // Deal to 10 columns
  for (let col = 0; col < 10; col++) {
    const cardCount = col < 4 ? 6 : 5; // First 4 columns get 6 cards, rest get 5
    const cards: Card[] = [];
    
    for (let i = 0; i < cardCount; i++) {
      const card = { ...deck[cardIndex] };
      // Only the last card (top) is face-up
      card.faceUp = i === cardCount - 1;
      cards.push(card);
      cardIndex++;
    }
    
    tableau.push({ cards });
  }
  
  // Remaining 50 cards go to stock
  const stock = deck.slice(cardIndex).map(card => ({ ...card, faceUp: false }));
  
  return {
    tableau,
    stock,
    completedSuits: 0,
    moveCount: 0,
    isWon: false,
  };
}

/**
 * Deal 10 cards from stock to tableau (one to each column)
 * Can only deal if all columns have at least one card
 */
export function canDealFromStock(state: GameState): boolean {
  if (state.stock.length === 0) return false;
  
  // All columns must have at least one card to deal
  return state.tableau.every(col => col.cards.length > 0);
}

export function dealFromStock(state: GameState): GameState {
  if (!canDealFromStock(state)) return state;
  
  const newStock = [...state.stock];
  const newTableau = state.tableau.map(col => ({
    cards: [...col.cards],
  }));
  
  // Deal one card to each column
  for (let col = 0; col < 10; col++) {
    const card = newStock.pop()!;
    card.faceUp = true;
    newTableau[col].cards.push(card);
  }
  
  return {
    ...state,
    tableau: newTableau,
    stock: newStock,
    moveCount: state.moveCount + 1,
  };
}