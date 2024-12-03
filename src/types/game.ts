export interface Player {
  id: string;
  name: string;
  board: number[];
  marks: boolean[];
  hasBingo: boolean;
}

export interface GameState {
  players: Player[];
  currentNumber: number | null;
  drawnNumbers: number[];
  gameStarted: boolean;
  winner: Player | null;
}