import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocketStore } from '../store/socketStore';
import { Hash } from 'lucide-react';

export const Home: React.FC = () => {
  const [playerName, setPlayerName] = useState('');
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();
  const { socket, connect } = useSocketStore();

  useEffect(() => {
    const savedName = localStorage.getItem('playerName');
    if (savedName) {
      setPlayerName(savedName);
    }
  }, []);

  const handleCreateRoom = () => {
    if (!playerName.trim()) return;
    
    if (!socket) connect();
    localStorage.setItem('playerName', playerName);
    socket?.emit('createRoom');
    socket?.once('roomCreated', (newRoomId: string) => {
      socket.emit('joinRoom', { roomId: newRoomId, playerName });
      navigate(`/room/${newRoomId}`);
    });
  };

  const handleJoinRoom = () => {
    if (!playerName.trim() || !roomId.trim()) return;
    
    if (!socket) connect();
    localStorage.setItem('playerName', playerName);
    socket?.emit('joinRoom', { roomId, playerName });
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <Hash className="w-12 h-12 text-blue-500" />
          <h1 className="text-4xl font-bold text-gray-800 ml-3">Bingo Live</h1>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your name"
            />
          </div>

          <div className="flex flex-col space-y-4">
            <button
              onClick={handleCreateRoom}
              disabled={!playerName.trim()}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Create New Room
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or join existing</span>
              </div>
            </div>

            <div>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter room code"
              />
            </div>

            <button
              onClick={handleJoinRoom}
              disabled={!playerName.trim() || !roomId.trim()}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Join Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};