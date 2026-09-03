import { createMocks } from 'node-mocks-http';
import handler from '@/pages/api/meal-plans/[id]';

jest.mock('@/lib/db', () => {
  const Database = require('better-sqlite3');
  const testDb = new Database(':memory:');
  testDb.pragma('journal_mode = WAL');
  testDb.exec(`
    CREATE TABLE meal_plans (id INTEGER PRIMARY KEY AUTOINCREMENT, recipe_id INTEGER NOT NULL, date TEXT NOT NULL, meal_type TEXT NOT NULL, slug TEXT UNIQUE NOT NULL);
  `);
  testDb.prepare("INSERT INTO meal_plans (recipe_id, date, meal_type, slug) VALUES (1,'2025-01-20','dinner','s1')").run();
  return { getDb: () => testDb, isSupabase: () => false };
});

describe('/api/meal-plans/[id]', () => {
  it('DELETE returns success', async () => {
    const { req, res } = createMocks({ method: 'DELETE', query: { id: '1' } });
    await handler(req as any, res as any);
    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({ success: true });
  });

  it('GET returns 405', async () => {
    const { req, res } = createMocks({ method: 'GET', query: { id: '1' } });
    await handler(req as any, res as any);
    expect(res._getStatusCode()).toBe(405);
  });
});