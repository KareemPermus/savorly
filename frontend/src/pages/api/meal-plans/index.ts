import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb, isSupabase } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = getDb();

  if (req.method === 'GET') {
    try {
      const { start_date, end_date } = req.query;

      if (isSupabase()) {
        let query = db.from('meal_plans').select('*, recipe:recipes(id, title, image_url)').order('date');
        if (start_date) query = query.gte('date', start_date);
        if (end_date) query = query.lte('date', end_date);
        const { data, error } = await query;
        if (error) return res.status(500).json({ error: error.message });
        return res.json(data);
      } else {
        let sql = `SELECT mp.*, r.id as r_id, r.title as r_title, r.image_url as r_image_url
          FROM meal_plans mp LEFT JOIN recipes r ON mp.recipe_id = r.id`;
        const params: any[] = [];
        const conditions: string[] = [];
        if (start_date) { conditions.push('mp.date >= ?'); params.push(start_date); }
        if (end_date) { conditions.push('mp.date <= ?'); params.push(end_date); }
        if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ');
        sql += ' ORDER BY mp.date';

        const rows = db.prepare(sql).all(...params);
        const result = rows.map((r: any) => ({
          id: Number(r.id),
          recipe_id: Number(r.recipe_id),
          date: r.date,
          meal_type: r.meal_type,
          recipe: { id: Number(r.r_id), title: r.r_title, image_url: r.r_image_url }
        }));
        return res.json(result);
      }
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const { recipe_id, date, meal_type } = req.body;
      if (!recipe_id || !date || !meal_type) return res.status(400).json({ error: 'recipe_id, date, meal_type required' });
      const slug = `mp-${recipe_id}-${date}-${meal_type}-${Date.now()}`;

      if (isSupabase()) {
        const { data, error } = await db.from('meal_plans').insert({ recipe_id, date, meal_type, slug }).select().single();
        if (error) return res.status(500).json({ error: error.message });
        return res.status(201).json(data);
      } else {
        const result = db.prepare('INSERT INTO meal_plans (recipe_id, date, meal_type, slug) VALUES (?,?,?,?)').run(recipe_id, date, meal_type, slug);
        return res.status(201).json({ id: Number(result.lastInsertRowid), recipe_id, date, meal_type });
      }
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  res.setHeader('Allow', 'GET, POST');
  res.status(405).end();
}