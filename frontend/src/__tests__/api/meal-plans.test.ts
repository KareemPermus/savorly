import { createMocks } from 'node-mocks-http';
import handler from '@/pages/api/meal-plans/index';

jest.mock('@/lib/db', () => {
  const rows = [{ id: 1, recipe_id: 1, date: '2025-01-20', meal_type: 'dinner', created_at: '2025-01-01', recipe_title: 'Test' }];
  const mockDb = {
    prepare: jest.fn((sql: string) => {
      if (sql.includes('SELECT') && sql.includes('meal_plans')) {
        return { all: jest.fn(() => rows), get: jest.fn(() => rows[0]) };
      }
      return { run: jest.fn(() => ({ lastInsertRowid: 1 })), get: jest.fn(() => rows[0]) };
    }),
  };
  return { getDb: () => mockDb, isSupabase: () => false };
});

describe('GET /api/meal-plans', () => {
  it('returns list', async () => {
    const { req, res } = createMocks({ method: 'GET' });
    await handler(req as any, res as any);
    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(Array.isArray(data)).toBe(true);
    expect(data[0]).toHaveProperty('recipe_title');
  });
});

describe('POST /api/meal-plans', () => {
  it('returns 400 when missing fields', async () => {
    const { req, res } = createMocks({ method: 'POST', body: {} });
    await handler(req as any, res as any);
    expect(res._getStatusCode()).toBe(400);
  });
});