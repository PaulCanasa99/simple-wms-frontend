import { describe, expect, it } from 'vitest';
import { authenticate } from '../api/auth';
import { listProducts } from '../api/products';
import { listLocations } from '../api/locations';
import { listOrders } from '../api/orders';

describe('API layer (against MSW handlers)', () => {
  it('authenticate returns a token and a user', async () => {
    const res = await authenticate('demo@simplewms.dev', 'demo');
    expect(res.token).toMatch(/^demo-/);
    expect(res.user.name).toBe('Demo Worker');
  });

  it('rejects empty credentials', async () => {
    await expect(authenticate('', '')).rejects.toBeDefined();
  });

  it('lists products with the expected shape', async () => {
    const products = await listProducts();
    expect(products.length).toBeGreaterThan(0);
    const sample = products[0];
    expect(sample).toMatchObject({
      id: expect.any(String),
      code: expect.any(String),
      name: expect.any(String),
      productsPerHU: expect.any(Number),
    });
  });

  it('lists locations with codes like "AB-01"', async () => {
    const locations = await listLocations();
    expect(locations.length).toBeGreaterThan(0);
    expect(locations[0]?.code).toMatch(/^[A-H][A-H]-\d{2}$/);
  });

  it('lists sales orders', async () => {
    const orders = await listOrders();
    expect(orders.length).toBeGreaterThan(0);
    expect(orders[0]?.customer).toBeDefined();
    expect(Array.isArray(orders[0]?.products)).toBe(true);
  });
});
