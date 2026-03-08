import { describe, expect, it } from 'vitest';
import { GAME_CONSTANTS } from './index';

describe('GAME_CONSTANTS', () => {
  it('exposes a playable world size', () => {
    expect(GAME_CONSTANTS.worldWidth).toBeGreaterThan(0);
    expect(GAME_CONSTANTS.worldHeight).toBeGreaterThan(0);
  });
});
