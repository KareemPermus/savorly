import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb, isSupabase } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = getDb();

  if (req.method === 'GET') {
    const { search, category } = req.query;
    try {
      if (isSupabase()) {
        let query = db.from('recipes').select('id, title, description, prep_time, cook_time, servings, image_url, category, created_at');
        if (search) query = query.ilike('title', `%${search}%`);
        if (category) query = query.eq('category', category);
        query = query.order('created_at', { ascending: false });
        const { data, error } = await query;
        if (error) return res.status(500).json({ error: error.message });
        return res.json(data);
      } else {
        let sql = 'SELECT id, title, description, prep_time, cook_time, servings, image_url, category, created_at FROM recipes';
        const conditions: string[] = [];
        const params: any[] = [];
        if (search) { conditions.push('title LIKE ?'); params.push(`%${search}%`); }
        if (category) { conditions.push('category = ?'); params.push(category); }
        if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ');
        sql += ' ORDER BY created_at DESC';
        const rows = db.prepare(sql).all(...params);
        return res.json(rows);
      }
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === 'POST') {
    const { title, description, ingredients, steps, prep_time, cook_time, servings, image_url, category } = req.body;
    if (!title || !ingredients || !steps) return res.status(400).json({ error: 'title, ingredients, steps required' });
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
    try {
      if (isSupabase()) {
        const { data, error } = await db.from('recipes').insert({ title, slug, description, ingredients, steps, prep_time, cook_time, servings, image_url, category }).select().single();
        if (error) return res.status(500).json({ error: error.message });
        return res.status(201).json(data);
      } else {
        const stmt = db.prepare('INSERT INTO recipes (title, slug, description, ingredients, steps, prep_time, cook_time, servings, image_url, category) VALUES (?,?,?,?,?,?,?,?,?,?)');
        const result = stmt.run(title, slug, description || null, ingredients, steps, prep_time || null, cook_time || null, servings || null, image_url || null, category || null);
        const row = db.prepare('SELECT * FROM recipes WHERE id = ?').get(result.lastInsertRowid);
        return res.status(201).json(row);
      }
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  res.setHeader('Allow', 'GET, POST');
  res.status(405).end();
}