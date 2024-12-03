import React from 'react';
import { useParams } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { BingoBoard } from '../components/BingoBoard';
import { PlayerList } from '../components/PlayerList';
import { GameControls } from '../components/GameControls';
import { useRoomSession } from '../hooks/useRoomSession';
import { Share2 } from 'lucide-react';

export const GameRoom: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const playerName = localStorage.getItem('playerName');
  const { socket } = useRoomSession(roomId, playerName);
  const gameState = useGameStore();

  const handleStartGame = () => {
    socket?.emit('startGame', roomId);
  };

  const handleDrawNumber = () => {
    socket?.emit('drawNumber', roomId);
  };

  const handleMarkNumber = (playerId: string, number: number) => {
    socket?.emit('markNumber', { roomId, playerId, number });
  };

  const handleCopyRoomCode = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Room: {roomId}</h1>
          <button
            onClick={handleCopyRoomCode}
            className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <Share2 className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-600">Share Room Link</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-8">
            <PlayerList players={gameState.players} />
          </div>

          <div>
            <GameControls
              onStartGame={handleStartGame}
              onDrawNumber={handleDrawNumber}
              gameStarted={gameState.gameStarted}
              currentNumber={gameState.currentNumber}
              winner={gameState.winner}
            />
          </div>

          <div className="space-y-8">
            {gameState.players.map(player => (
              <div key={player.id} className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-800">{player.name}'s Board</h3>
                <BingoBoard
                  board={player.board}
                  marks={player.marks}
                  onNumberClick={(number) => handleMarkNumber(player.id, number)}
                  isActive={gameState.gameStarted && !gameState.winner && gameState.currentNumber !== null}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};