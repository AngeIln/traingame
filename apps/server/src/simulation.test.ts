import { describe, expect, it } from 'vitest';
import { SimulationEngine } from './simulation';

describe('SimulationEngine', () => {
  it('increments score on tick', () => {
    const engine = new SimulationEngine();
    const player = engine.addPlayer('p1', 'Alice');

    const afterTick = engine.tick().find((p) => p.id === player.id);

    expect(afterTick?.score).toBe(1);
  });
});
