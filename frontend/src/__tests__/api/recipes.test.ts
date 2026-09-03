import { createMocks } from 'node-mocks-http';
import handler from '@/pages/api/recipes/index';

// Mock db to use SQLite path
jest.mock('@/lib/db', () => {
  const Database = require('better-sqlite3');
  const path = require('path');
  const testDb = new Database(':memory:');
  testDb.pragma('journal_mode = WAL');
  testDb.exec(`
    CREATE TABLE recipes (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, slug TEXT UNIQUE NOT NULL, description TEXT, image_url TEXT, prep_time INTEGER, cook_time INTEGER, servings INTEGER, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE ingredients (id INTEGER PRIMARY KEY AUTOINCREMENT, recipe_id INTEGER NOT NULL, name TEXT NOT NULL, quantity TEXT, unit TEXT);
    CREATE TABLE steps (id INTEGER PRIMARY KEY AUTOINCREMENT, recipe_id INTEGER NOT NULL, step_number INTEGER NOT NULL, instruction TEXT NOT NULL);
  `);
  return { getDb: () => testDb, isSupabase: () => false };
});

describe('/api/recipes', () => {
  it('GET returns empty array initially', async () => {
    const { req, res } = createMocks({ method: 'GET' });
    await handler(req as any, res as any);
    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual([]);
  });

  it('POST creates a recipe', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { title: 'Test Recipe', description: 'Desc', ingredients: [{ name: 'Salt', quantity: '1', unit: 'tsp' }], steps: [{ instruction: 'Do it' }] },
    });
    await handler(req as any, res as any);
    expect(res._getStatusCode()).toBe(201);
    const data = JSON.parse(res._getData());
    expect(data.title).toBe('Test Recipe');
    expect(data.ingredients).toHaveLength(1);
    expect(data.steps).toHaveLength(1);
  });

  it('POST without title returns 400', async () => {
    const { req, res } = createMocks({ method: 'POST', body: {} });
    await handler(req as any, res as any);
    expect(res._getStatusCode()).toBe(400);
  });
});