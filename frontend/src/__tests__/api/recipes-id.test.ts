import { createMocks } from 'node-mocks-http';
import handler from '@/pages/api/recipes/[id]';

jest.mock('@/lib/db', () => {
  const row = { id: 1, title: 'Test', description: '', ingredients: 'a', steps: 'b', prep_time: 5, cook_time: 10, servings: 2, image_url: null, category: 'X', created_at: '2025-01-01' };
  const mockDb = {
    prepare: jest.fn(() => ({
      get: jest.fn(() => row),
      run: jest.fn(),
      all: jest.fn(() => [row]),
    })),
  };
  return { getDb: () => mockDb, isSupabase: () => false };
});

describe('GET /api/recipes/[id]', () => {
  it('returns recipe', async () => {
    const { req, res } = createMocks({ method: 'GET', query: { id: '1' } });
    await handler(req as any, res as any);
    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toHaveProperty('title');
  });

  it('returns 400 for invalid id', async () => {
    const { req, res } = createMocks({ method: 'GET', query: { id: 'abc' } });
    await handler(req as any, res as any);
    expect(res._getStatusCode()).toBe(400);
  });
});

describe('DELETE /api/recipes/[id]', () => {
  it('returns success', async () => {
    const { req, res } = createMocks({ method: 'DELETE', query: { id: '1' } });
    await handler(req as any, res as any);
    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({ success: true });
  });
});