import { createMocks } from 'node-mocks-http';
import handler from '@/pages/api/meal-plans/[id]';

jest.mock('@/lib/db', () => {
  const mockDb = {
    prepare: jest.fn(() => ({ run: jest.fn() })),
  };
  return { getDb: () => mockDb, isSupabase: () => false };
});

describe('DELETE /api/meal-plans/[id]', () => {
  it('returns success', async () => {
    const { req, res } = createMocks({ method: 'DELETE', query: { id: '1' } });
    await handler(req as any, res as any);
    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({ success: true });
  });

  it('returns 405 for GET', async () => {
    const { req, res } = createMocks({ method: 'GET', query: { id: '1' } });
    await handler(req as any, res as any);
    expect(res._getStatusCode()).toBe(405);
  });

  it('returns 400 for invalid id', async () => {
    const { req, res } = createMocks({ method: 'DELETE', query: { id: 'xyz' } });
    await handler(req as any, res as any);
    expect(res._getStatusCode()).toBe(400);
  });
});