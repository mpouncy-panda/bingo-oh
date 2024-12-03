import { useEffect } from 'react';
import { useSocketStore } from '../store/socketStore';
import { useGameStore } from '../store/gameStore';
import { useNavigate } from 'react-router-dom';

export const useRoomSession = (roomId: string | undefined, playerName: string | null) => {
  const { socket, connect } = useSocketStore();
  const { updateGameState } = useGameStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!roomId || !playerName) {
      navigate('/');
      return;
    }

    if (!socket) {
      connect();
    }

    const storedSession = localStorage.getItem(`bingo-session-${roomId}`);
    if (storedSession) {
      const session = JSON.parse(storedSession);
      socket?.emit('rejoinRoom', { roomId, playerName: session.playerName, sessionId: session.sessionId });
    } else {
      socket?.emit('joinRoom', { roomId, playerName });
    }

    socket?.on('sessionCreated', (sessionData) => {
      localStorage.setItem(`bingo-session-${roomId}`, JSON.stringify(sessionData));
    });

    socket?.on('gameState', (state) => {
      updateGameState(state);
    });

    socket?.on('error', (error) => {
      console.error(error);
      navigate('/');
    });

    return () => {
      socket?.off('sessionCreated');
      socket?.off('gameState');
      socket?.off('error');
    };
  }, [socket, roomId, playerName]);

  return { socket };
};