import { nanoid } from 'nanoid';

export const generateRoomCode = (): string => {
  return nanoid(7);
};