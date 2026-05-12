import { describe, expect, it } from 'vitest';
import { buildSeed } from '../mocks/seed';

describe('seed data', () => {
  it('produces a self-consistent warehouse', () => {
    const state = buildSeed();
    expect(state.products.length).toBeGreaterThan(10);
    expect(state.locations.length).toBeGreaterThan(20);
    expect(state.handlingUnits.length).toBeGreaterThan(0);
    expect(state.orders.length).toBeGreaterThan(0);
    expect(state.customers.length).toBeGreaterThan(0);

    // Every assigned HU has a matching location
    for (const hu of state.handlingUnits) {
      if (hu.location) {
        const loc = state.locations.find((l) => l.id === hu.location!.id);
        expect(loc).toBeDefined();
        expect(loc?.handlingUnit?.id).toBe(hu.id);
      }
    }
  });
});
