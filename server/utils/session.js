export const createSession = (socketId, playerName) => ({
  sessionId: socketId,
  playerName,
  timestamp: Date.now()
});

export const validateSession = (session, room) => {
  if (!session || !room) return false;
  
  const player = room.players.find(p => p.sessionId === session.sessionId);
  if (!player) return false;
  
  const sessionAge = Date.now() - session.timestamp;
  const MAX_SESSION_AGE = 24 * 60 * 60 * 1000; // 24 hours
  
  return sessionAge < MAX_SESSION_AGE;
};