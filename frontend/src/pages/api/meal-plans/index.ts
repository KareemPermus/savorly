import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb, isSupabase } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = getDb();

  if (req.method === 'GET') {
    const { start_date, end_date } = req.query;
    try {
      if (isSupabase()) {
        let query = db.from('meal_plans').select('id, recipe_id, date, meal_type, created_at, recipes(title)');
        if (start_date) query = query.gte('date', start_date);
        if (end_date) query = query.lte('date', end_date);
        query = query.order('date', { ascending: true });
        const { data, error } = await query;
        if (error) return res.status(500).json({ error: error.message });
        const mapped = (data || []).map((mp: any) => ({
          id: mp.id,
          recipe_id: mp.recipe_id,
          date: mp.date,
          meal_type: mp.meal_type,
          created_at: mp.created_at,
          recipe_title: mp.recipes?.title || '',
        }));
        return res.json(mapped);
      } else {
        let sql = `SELECT mp.id, mp.recipe_id, mp.date, mp.meal_type, mp.created_at, r.title as recipe_title
                    FROM meal_plans mp LEFT JOIN recipes r ON mp.recipe_id = r.id`;
        const conditions: string[] = [];
        const params: any[] = [];
        if (start_date) { conditions.push('mp.date >= ?'); params.push(start_date); }
        if (end_date) { conditions.push('mp.date <= ?'); params.push(end_date); }
        if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ');
        sql += ' ORDER BY mp.date ASC';
        const rows = db.prepare(sql).all(...params);
        return res.json(rows);
      }
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === 'POST') {
    const { recipe_id, date, meal_type } = req.body;
    if (!recipe_id || !date || !meal_type) return res.status(400).json({ error: 'recipe_id, date, meal_type required' });
    const slug = `mealplan-${date}-${meal_type}-${Date.now()}`;
    try {
      if (isSupabase()) {
        const { data, error } = await db.from('meal_plans').insert({ recipe_id, date, meal_type, slug }).select('id, recipe_id, date, meal_type, created_at').single();
        if (error) return res.status(500).json({ error: error.message });
        return res.status(201).json(data);
      } else {
        const result = db.prepare('INSERT INTO meal_plans (recipe_id, date, meal_type, slug) VALUES (?,?,?,?)').run(recipe_id, date, meal_type, slug);
        const row = db.prepare('SELECT id, recipe_id, date, meal_type, created_at FROM meal_plans WHERE id = ?').get(result.lastInsertRowid);
        return res.status(201).json(row);
      }
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  res.setHeader('Allow', 'GET, POST');
  res.status(405).end();
}