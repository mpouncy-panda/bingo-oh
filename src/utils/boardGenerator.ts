export const generateBingoBoard = (): number[] => {
  const board: number[] = [];
  const used = new Set<number>();

  while (board.length < 25) {
    const num = Math.floor(Math.random() * 75) + 1;
    if (!used.has(num)) {
      used.add(num);
      board.push(num);
    }
  }

  return board;
};

export const checkBingo = (marks: boolean[]): boolean => {
  // Check rows
  for (let i = 0; i < 5; i++) {
    if (marks.slice(i * 5, (i + 1) * 5).every(Boolean)) return true;
  }

  // Check columns
  for (let i = 0; i < 5; i++) {
    if ([0, 1, 2, 3, 4].every(j => marks[i + j * 5])) return true;
  }

  // Check diagonals
  if ([0, 6, 12, 18, 24].every(i => marks[i])) return true;
  if ([4, 8, 12, 16, 20].every(i => marks[i])) return true;

  return false;
};