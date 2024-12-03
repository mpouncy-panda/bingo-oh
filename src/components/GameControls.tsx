import React from 'react';
import { Play, Hash } from 'lucide-react';

interface GameControlsProps {
  onStartGame: () => void;
  onDrawNumber: () => void;
  gameStarted: boolean;
  currentNumber: number | null;
  winner: { name: string } | null;
}

export const GameControls: React.FC<GameControlsProps> = ({
  onStartGame,
  onDrawNumber,
  gameStarted,
  currentNumber,
  winner,
}) => {
  return (
    <div className="flex flex-col items-center space-y-4 bg-white rounded-lg shadow-md p-4">
      {!gameStarted ? (
        <button
          onClick={onStartGame}
          className="flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Play className="w-5 h-5" />
          <span>Start Game</span>
        </button>
      ) : (
        <>
          <button
            onClick={onDrawNumber}
            disabled={!!winner}
            className="flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            <Hash className="w-5 h-5" />
            <span>Draw Number</span>
          </button>
          {currentNumber && (
            <div className="text-4xl font-bold text-gray-800">
              {currentNumber}
            </div>
          )}
          {winner && (
            <div className="text-xl font-bold text-green-600">
              {winner.name} wins!
            </div>
          )}
        </>
      )}
    </div>
  );
};