import React from 'react';
import { clsx } from 'clsx';

interface BingoBoardProps {
  board: number[];
  marks: boolean[];
  onNumberClick?: (number: number) => void;
  isActive: boolean;
}

export const BingoBoard: React.FC<BingoBoardProps> = ({
  board,
  marks,
  onNumberClick,
  isActive,
}) => {
  return (
    <div className="grid grid-cols-5 gap-2 p-4 bg-white rounded-lg shadow-md">
      {board.map((number, index) => (
        <button
          key={index}
          onClick={() => onNumberClick?.(number)}
          disabled={!isActive || marks[index]}
          className={clsx(
            'w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-colors',
            marks[index]
              ? 'bg-green-500 text-white'
              : isActive
              ? 'bg-blue-100 hover:bg-blue-200 text-blue-800'
              : 'bg-gray-100 text-gray-800'
          )}
        >
          {number}
        </button>
      ))}
    </div>
  );
};