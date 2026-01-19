import { useReducer, useCallback } from 'react';
import { GameState } from './types/types';
import { dealGame, dealFromStock, canDealFromStock } from './deck/deck';
import { executeMove, getValidMoves, getMovableRun } from './moves/moves';

type GameAction =
  | { type: 'NEW_GAME' }
  | { type: 'DEAL_FROM_STOCK' }
  | { type: 'MOVE_CARDS'; fromColumn: number; cardIndex: number; toColumn: number }
  | { type: 'SELECT_CARD'; column: number; cardIndex: number }
  | { type: 'CLEAR_SELECTION' };

interface SelectionState {
  column: number;
  cardIndex: number;
}

interface FullGameState extends GameState {
  selection: SelectionState | null;
}

function createInitialState(): FullGameState {
  return {
    ...dealGame(),
    selection: null,
  };
}

function gameReducer(state: FullGameState, action: GameAction): FullGameState {
  switch (action.type) {
    case 'NEW_GAME':
      return createInitialState();

    case 'DEAL_FROM_STOCK':
      if (!canDealFromStock(state)) return state;
      return {
        ...dealFromStock(state),
        selection: null,
      };

    case 'MOVE_CARDS': {
      const newState = executeMove(
        state,
        action.fromColumn,
        action.cardIndex,
        action.toColumn
      );
      
      // If move didn't happen, state reference is the same
      if (newState === state) return state;
      
      return {
        ...newState,
        selection: null,
      };
    }

    case 'SELECT_CARD': {
      const { column, cardIndex } = action;
      const cards = state.tableau[column].cards;
      
      // Can't select face-down cards
      if (!cards[cardIndex]?.faceUp) return state;
      
      // Check if this forms a valid movable run
      const run = getMovableRun(cards, cardIndex);
      if (run.length === 0) return state;
      
      // If we already have a selection, try to move there
      if (state.selection) {
        // Clicking the same card clears selection
        if (state.selection.column === column && state.selection.cardIndex === cardIndex) {
          return { ...state, selection: null };
        }
        
        // Try to move to this column (clicking on any card in target column)
        const newState = executeMove(
          state,
          state.selection.column,
          state.selection.cardIndex,
          column
        );
        
        if (newState !== state) {
          return { ...newState, selection: null };
        }
        
        // Move failed, select this card instead
        return { ...state, selection: { column, cardIndex } };
      }
      
      // No existing selection, select this card
      return { ...state, selection: { column, cardIndex } };
    }

    case 'CLEAR_SELECTION':
      return { ...state, selection: null };

    default:
      return state;
  }
}

export function useSpiderSolitaire() {
  const [state, dispatch] = useReducer(gameReducer, null, createInitialState);

  const newGame = useCallback(() => {
    dispatch({ type: 'NEW_GAME' });
  }, []);

  const dealCards = useCallback(() => {
    dispatch({ type: 'DEAL_FROM_STOCK' });
  }, []);

  const selectCard = useCallback((column: number, cardIndex: number) => {
    dispatch({ type: 'SELECT_CARD', column, cardIndex });
  }, []);

  const moveCards = useCallback((fromColumn: number, cardIndex: number, toColumn: number) => {
    dispatch({ type: 'MOVE_CARDS', fromColumn, cardIndex, toColumn });
  }, []);

  const clearSelection = useCallback(() => {
    dispatch({ type: 'CLEAR_SELECTION' });
  }, []);

  const getValidTargets = useCallback((column: number, cardIndex: number) => {
    return getValidMoves(state, column, cardIndex);
  }, [state]);

  const canDeal = canDealFromStock(state);

  return {
    // State
    tableau: state.tableau,
    stock: state.stock,
    completedSuits: state.completedSuits,
    moveCount: state.moveCount,
    isWon: state.isWon,
    selection: state.selection,
    canDeal,
    
    // Actions
    newGame,
    dealCards,
    selectCard,
    moveCards,
    clearSelection,
    getValidTargets,
  };
}