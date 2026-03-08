export const GAME_CONSTANTS = {
  worldWidth: 100,
  worldHeight: 100,
  maxPlayers: 16,
} as const;

export type Position = {
  x: number;
  y: number;
};

export type PlayerState = {
  id: string;
  name: string;
  position: Position;
  score: number;
};

export type SimulationTickEvent = {
  type: 'tick';
  timestamp: number;
  players: PlayerState[];
};

export type PlayerJoinedEvent = {
  type: 'player_joined';
  player: PlayerState;
};

export type ServerEvent = SimulationTickEvent | PlayerJoinedEvent;
