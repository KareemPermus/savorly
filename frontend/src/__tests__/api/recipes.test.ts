import { createMocks } from 'node-mocks-http';
import handler from '@/pages/api/recipes/index';

// Mock db module
jest.mock('@/lib/db', () => {
  const rows = [
    { id: 1, title: 'Test Recipe', description: 'Desc', prep_time: 10, cook_time: 20, servings: 4, image_url: null, category: 'Italian', created_at: '2025-01-01' },
  ];
  const mockDb = {
    prepare: jest.fn((sql: string) => {
      if (sql.includes('SELECT')) {
        return {
          all: jest.fn(() => rows),
          get: jest.fn(() => ({ lastInsertRowid: 2 })),
        };
      }
      return { run: jest.fn(() => ({ lastInsertRowid: 2 })) };
    }),
  };
  return {
    getDb: () => mockDb,
    isSupabase: () => false,
  };
});

describe('GET /api/recipes', () => {
  it('returns recipes list', async () => {
    const { req, res } = createMocks({ method: 'GET' });
    await handler(req as any, res as any);
    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(Array.isArray(data)).toBe(true);
    expect(data[0]).toHaveProperty('title');
  });
});

describe('POST /api/recipes', () => {
  it('returns 400 when missing fields', async () => {
    const { req, res } = createMocks({ method: 'POST', body: { title: 'X' } });
    await handler(req as any, res as any);
    expect(res._getStatusCode()).toBe(400);
  });
});

describe('Method not allowed', () => {
  it('returns 405 for PATCH', async () => {
    const { req, res } = createMocks({ method: 'PATCH' });
    await handler(req as any, res as any);
    expect(res._getStatusCode()).toBe(405);
  });
});