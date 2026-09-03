import { createMocks } from 'node-mocks-http';
import handler from '@/pages/api/recipes/[id]';

jest.mock('@/lib/db', () => {
  const Database = require('better-sqlite3');
  const testDb = new Database(':memory:');
  testDb.pragma('journal_mode = WAL');
  testDb.exec(`
    CREATE TABLE recipes (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, slug TEXT UNIQUE NOT NULL, description TEXT, image_url TEXT, prep_time INTEGER, cook_time INTEGER, servings INTEGER, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE ingredients (id INTEGER PRIMARY KEY AUTOINCREMENT, recipe_id INTEGER NOT NULL, name TEXT NOT NULL, quantity TEXT, unit TEXT);
    CREATE TABLE steps (id INTEGER PRIMARY KEY AUTOINCREMENT, recipe_id INTEGER NOT NULL, step_number INTEGER NOT NULL, instruction TEXT NOT NULL);
  `);
  testDb.prepare("INSERT INTO recipes (title, slug) VALUES ('Test','test-1')").run();
  return { getDb: () => testDb, isSupabase: () => false };
});

describe('/api/recipes/[id]', () => {
  it('GET returns recipe with ingredients and steps', async () => {
    const { req, res } = createMocks({ method: 'GET', query: { id: '1' } });
    await handler(req as any, res as any);
    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.title).toBe('Test');
  });

  it('GET 404 for missing recipe', async () => {
    const { req, res } = createMocks({ method: 'GET', query: { id: '999' } });
    await handler(req as any, res as any);
    expect(res._getStatusCode()).toBe(404);
  });

  it('DELETE returns success', async () => {
    const { req, res } = createMocks({ method: 'DELETE', query: { id: '1' } });
    await handler(req as any, res as any);
    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({ success: true });
  });
});