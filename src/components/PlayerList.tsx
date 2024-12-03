import React from 'react';
import { User } from 'lucide-react';
import { Player } from '../types/game';
import { clsx } from 'clsx';

interface PlayerListProps {
  players: Player[];
}

export const PlayerList: React.FC<PlayerListProps> = ({ players }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold mb-4">Players</h2>
      <div className="space-y-2">
        {players.map(player => (
          <div
            key={player.id}
            className={clsx(
              'flex items-center space-x-2 p-2 rounded',
              player.hasBingo ? 'bg-green-100' : 'bg-gray-50'
            )}
          >
            <User className="w-5 h-5 text-gray-600" />
            <span className="font-medium">{player.name}</span>
            {player.hasBingo && (
              <span className="text-green-600 text-sm">BINGO!</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};