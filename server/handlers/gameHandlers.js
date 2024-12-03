import { createRoom, createPlayer } from '../utils/room.js';
import { checkBingo } from '../utils/board.js';
import { createSession, validateSession } from '../utils/session.js';
import { nanoid } from 'nanoid';

export const setupGameHandlers = (io, socket, rooms) => {
  const handleCreateRoom = () => {
    const roomId = nanoid(7);
    rooms.set(roomId, createRoom(roomId));
    socket.emit('roomCreated', roomId);
  };

  const handleJoinRoom = ({ roomId, playerName }) => {
    const room = rooms.get(roomId);
    if (!room) {
      socket.emit('error', 'Room not found');
      return;
    }

    socket.join(roomId);
    const session = createSession(socket.id, playerName);
    const player = createPlayer(socket.id, playerName, session.sessionId);
    room.players.push(player);
    
    socket.emit('sessionCreated', session);
    io.to(roomId).emit('gameState', room);
  };

  const handleRejoinRoom = ({ roomId, playerName, sessionId }) => {
    const room = rooms.get(roomId);
    if (!room) {
      socket.emit('error', 'Room not found');
      return;
    }

    const existingPlayer = room.players.find(p => p.sessionId === sessionId);
    if (!existingPlayer) {
      handleJoinRoom({ roomId, playerName });
      return;
    }

    socket.join(roomId);
    existingPlayer.id = socket.id;
    io.to(roomId).emit('gameState', room);
  };

  const handleStartGame = (roomId) => {
    const room = rooms.get(roomId);
    if (room) {
      room.gameStarted = true;
      io.to(roomId).emit('gameState', room);
    }
  };

  const handleDrawNumber = (roomId) => {
    const room = rooms.get(roomId);
    if (room && room.gameStarted && !room.winner) {
      const availableNumbers = Array.from({ length: 75 }, (_, i) => i + 1)
        .filter(n => !room.drawnNumbers.includes(n));
      
      if (availableNumbers.length > 0) {
        const number = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
        room.currentNumber = number;
        room.drawnNumbers.push(number);
        io.to(roomId).emit('gameState', room);
      }
    }
  };

  const handleMarkNumber = ({ roomId, playerId, number }) => {
    const room = rooms.get(roomId);
    if (room) {
      const player = room.players.find(p => p.id === playerId);
      if (player) {
        const index = player.board.indexOf(number);
        if (index !== -1) {
          player.marks[index] = true;
          player.hasBingo = checkBingo(player.marks);
          if (player.hasBingo) {
            room.winner = player;
          }
          io.to(roomId).emit('gameState', room);
        }
      }
    }
  };

  const handleDisconnect = () => {
    rooms.forEach((room, roomId) => {
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      if (playerIndex !== -1) {
        const player = room.players[playerIndex];
        if (!player.sessionId) {
          room.players.splice(playerIndex, 1);
        }
        io.to(roomId).emit('gameState', room);
      }
    });
  };

  return {
    handleCreateRoom,
    handleJoinRoom,
    handleRejoinRoom,
    handleStartGame,
    handleDrawNumber,
    handleMarkNumber,
    handleDisconnect
  };
};