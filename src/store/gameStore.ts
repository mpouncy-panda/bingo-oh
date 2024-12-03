import { create } from 'zustand';
import { GameState } from '../types/game';

interface GameStore extends GameState {
  updateGameState: (state: GameState) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  players: [],
  currentNumber: null,
  drawnNumbers: [],
  gameStarted: false,
  winner: null,

  updateGameState: (state) => {
    set(state);
  },
}));