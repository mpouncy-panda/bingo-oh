import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

interface SocketStore {
  socket: Socket | null;
  connect: () => void;
  disconnect: () => void;
}

export const useSocketStore = create<SocketStore>((set) => ({
  socket: null,
  connect: () => {
    const socket = io('http://localhost:3001');
    set({ socket });
  },
  disconnect: () => {
    set(state => {
      state.socket?.disconnect();
      return { socket: null };
    });
  },
}));