import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { setupGameHandlers } from './handlers/gameHandlers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const rooms = new Map();

// Clean up inactive rooms periodically
setInterval(() => {
  const now = Date.now();
  const ROOM_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours

  rooms.forEach((room, roomId) => {
    if (now - room.createdAt > ROOM_TIMEOUT) {
      rooms.delete(roomId);
    }
  });
}, 60 * 60 * 1000); // Check every hour

io.on('connection', (socket) => {
  const handlers = setupGameHandlers(io, socket, rooms);

  socket.on('createRoom', handlers.handleCreateRoom);
  socket.on('joinRoom', handlers.handleJoinRoom);
  socket.on('rejoinRoom', handlers.handleRejoinRoom);
  socket.on('startGame', handlers.handleStartGame);
  socket.on('drawNumber', handlers.handleDrawNumber);
  socket.on('markNumber', handlers.handleMarkNumber);
  socket.on('disconnect', handlers.handleDisconnect);
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});