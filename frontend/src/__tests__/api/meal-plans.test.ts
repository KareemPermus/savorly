import { createMocks } from 'node-mocks-http';
import handler from '@/pages/api/meal-plans/index';

jest.mock('@/lib/db', () => {
  const Database = require('better-sqlite3');
  const testDb = new Database(':memory:');
  testDb.pragma('journal_mode = WAL');
  testDb.exec(`
    CREATE TABLE recipes (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, slug TEXT UNIQUE NOT NULL, description TEXT, image_url TEXT, prep_time INTEGER, cook_time INTEGER, servings INTEGER, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE meal_plans (id INTEGER PRIMARY KEY AUTOINCREMENT, recipe_id INTEGER NOT NULL, date TEXT NOT NULL, meal_type TEXT NOT NULL, slug TEXT UNIQUE NOT NULL);
  `);
  testDb.prepare("INSERT INTO recipes (title, slug) VALUES ('R1','r1')").run();
  return { getDb: () => testDb, isSupabase: () => false };
});

describe('/api/meal-plans', () => {
  it('GET returns empty array', async () => {
    const { req, res } = createMocks({ method: 'GET' });
    await handler(req as any, res as any);
    expect(res._getStatusCode()).toBe(200);
  });

  it('POST creates meal plan', async () => {
    const { req, res } = createMocks({ method: 'POST', body: { recipe_id: 1, date: '2025-01-20', meal_type: 'dinner' } });
    await handler(req as any, res as any);
    expect(res._getStatusCode()).toBe(201);
    const data = JSON.parse(res._getData());
    expect(data.meal_type).toBe('dinner');
  });

  it('POST without fields returns 400', async () => {
    const { req, res } = createMocks({ method: 'POST', body: {} });
    await handler(req as any, res as any);
    expect(res._getStatusCode()).toBe(400);
  });
});