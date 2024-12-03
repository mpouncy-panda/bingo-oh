import { generateBingoBoard } from './board.js';

export const createRoom = (roomId) => ({
  id: roomId,
  players: [],
  gameStarted: false,
  currentNumber: null,
  drawnNumbers: [],
  winner: null,
  createdAt: Date.now()
});

export const createPlayer = (socketId, playerName, sessionId = null) => ({
  id: socketId,
  sessionId,
  name: playerName,
  board: generateBingoBoard(),
  marks: new Array(25).fill(false),
  hasBingo: false
});