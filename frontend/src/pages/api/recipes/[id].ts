import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb, isSupabase } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = getDb();
  const { id } = req.query;
  const recipeId = Number(id);
  if (isNaN(recipeId)) return res.status(400).json({ error: 'Invalid id' });

  if (req.method === 'GET') {
    try {
      if (isSupabase()) {
        const { data, error } = await db.from('recipes').select('*').eq('id', recipeId).single();
        if (error || !data) return res.status(404).json({ error: 'Not found' });
        return res.json(data);
      } else {
        const row = db.prepare('SELECT * FROM recipes WHERE id = ?').get(recipeId);
        if (!row) return res.status(404).json({ error: 'Not found' });
        return res.json(row);
      }
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === 'PUT') {
    const { title, description, ingredients, steps, prep_time, cook_time, servings, image_url, category } = req.body;
    try {
      if (isSupabase()) {
        const { data, error } = await db.from('recipes').update({ title, description, ingredients, steps, prep_time, cook_time, servings, image_url, category }).eq('id', recipeId).select().single();
        if (error) return res.status(500).json({ error: error.message });
        if (!data) return res.status(404).json({ error: 'Not found' });
        return res.json(data);
      } else {
        db.prepare('UPDATE recipes SET title=?, description=?, ingredients=?, steps=?, prep_time=?, cook_time=?, servings=?, image_url=?, category=? WHERE id=?')
          .run(title, description || null, ingredients, steps, prep_time || null, cook_time || null, servings || null, image_url || null, category || null, recipeId);
        const row = db.prepare('SELECT * FROM recipes WHERE id = ?').get(recipeId);
        if (!row) return res.status(404).json({ error: 'Not found' });
        return res.json(row);
      }
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      if (isSupabase()) {
        const { error } = await db.from('recipes').delete().eq('id', recipeId);
        if (error) return res.status(500).json({ error: error.message });
        return res.json({ success: true });
      } else {
        db.prepare('DELETE FROM recipes WHERE id = ?').run(recipeId);
        return res.json({ success: true });
      }
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  res.setHeader('Allow', 'GET, PUT, DELETE');
  res.status(405).end();
}