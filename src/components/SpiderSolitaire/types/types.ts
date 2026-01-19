// Card ranks: Ace (1) through King (13)
export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

export const RANK_NAMES: Record<Rank, string> = {
  1: 'A',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
  7: '7',
  8: '8',
  9: '9',
  10: '10',
  11: 'J',
  12: 'Q',
  13: 'K',
};

export interface Card {
  id: string;          // Unique identifier (e.g., "S-7-2" = Spade 7, copy 2)
  rank: Rank;
  faceUp: boolean;
}

// A column in the tableau
export interface Column {
  cards: Card[];
}

export interface GameState {
  tableau: Column[];      // 10 columns
  stock: Card[];          // Cards waiting to be dealt (50 cards, 5 deals of 10)
  completedSuits: number; // 0-8, need 8 to win
  moveCount: number;
  isWon: boolean;
}

// Represents a move for undo functionality
export interface Move {
  type: 'move' | 'deal';
  // For 'move': which cards moved from where to where
  fromColumn?: number;
  toColumn?: number;
  cardCount?: number;
  // For 'deal': we just need to know it was a deal
  // Track which cards were flipped face-up after the move
  flippedCard?: boolean;
}