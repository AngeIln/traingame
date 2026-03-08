import { GAME_CONSTANTS, type PlayerState } from '@traingame/shared';

export class SimulationEngine {
  private readonly players = new Map<string, PlayerState>();

  addPlayer(id: string, name: string): PlayerState {
    const player: PlayerState = {
      id,
      name,
      score: 0,
      position: {
        x: Math.floor(Math.random() * GAME_CONSTANTS.worldWidth),
        y: Math.floor(Math.random() * GAME_CONSTANTS.worldHeight),
      },
    };

    this.players.set(id, player);
    return player;
  }

  removePlayer(id: string): void {
    this.players.delete(id);
  }

  tick(): PlayerState[] {
    for (const [id, player] of this.players.entries()) {
      this.players.set(id, {
        ...player,
        score: player.score + 1,
      });
    }

    return Array.from(this.players.values());
  }
}
