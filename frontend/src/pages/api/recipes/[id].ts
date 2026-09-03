import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb, isSupabase } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = getDb();
  const id = Number(req.query.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

  if (req.method === 'GET') {
    try {
      if (isSupabase()) {
        const { data: recipe, error } = await db.from('recipes').select('*').eq('id', id).single();
        if (error || !recipe) return res.status(404).json({ error: 'Not found' });
        const { data: ingredients } = await db.from('ingredients').select('*').eq('recipe_id', id);
        const { data: steps } = await db.from('steps').select('*').eq('recipe_id', id).order('step_number');
        return res.json({ ...recipe, ingredients: ingredients || [], steps: steps || [] });
      } else {
        const recipe = db.prepare('SELECT * FROM recipes WHERE id = ?').get(id);
        if (!recipe) return res.status(404).json({ error: 'Not found' });
        const ingredients = db.prepare('SELECT * FROM ingredients WHERE recipe_id = ?').all(id);
        const steps = db.prepare('SELECT * FROM steps WHERE recipe_id = ? ORDER BY step_number').all(id);
        return res.json({ ...recipe, id: Number(recipe.id), ingredients, steps });
      }
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { title, description, image_url, prep_time, cook_time, servings, ingredients, steps } = req.body;

      if (isSupabase()) {
        const { data: recipe, error } = await db.from('recipes').update({ title, description, image_url, prep_time, cook_time, servings }).eq('id', id).select().single();
        if (error || !recipe) return res.status(404).json({ error: 'Not found' });

        // Replace ingredients and steps
        await db.from('ingredients').delete().eq('recipe_id', id);
        await db.from('steps').delete().eq('recipe_id', id);

        let ins: any[] = [];
        if (ingredients?.length) {
          const { data } = await db.from('ingredients').insert(ingredients.map((i: any) => ({ recipe_id: id, name: i.name, quantity: i.quantity, unit: i.unit }))).select();
          ins = data || [];
        }
        let sts: any[] = [];
        if (steps?.length) {
          const { data } = await db.from('steps').insert(steps.map((s: any, idx: number) => ({ recipe_id: id, step_number: s.step_number || idx + 1, instruction: s.instruction }))).select();
          sts = data || [];
        }

        return res.json({ ...recipe, ingredients: ins, steps: sts });
      } else {
        const existing = db.prepare('SELECT * FROM recipes WHERE id = ?').get(id);
        if (!existing) return res.status(404).json({ error: 'Not found' });

        db.prepare('UPDATE recipes SET title=?, description=?, image_url=?, prep_time=?, cook_time=?, servings=? WHERE id=?')
          .run(title ?? existing.title, description ?? existing.description, image_url ?? existing.image_url, prep_time ?? existing.prep_time, cook_time ?? existing.cook_time, servings ?? existing.servings, id);

        db.prepare('DELETE FROM ingredients WHERE recipe_id = ?').run(id);
        db.prepare('DELETE FROM steps WHERE recipe_id = ?').run(id);

        let ins: any[] = [];
        if (ingredients?.length) {
          const stmt = db.prepare('INSERT INTO ingredients (recipe_id, name, quantity, unit) VALUES (?,?,?,?)');
          for (const i of ingredients) {
            const r = stmt.run(id, i.name, i.quantity || null, i.unit || null);
            ins.push({ id: Number(r.lastInsertRowid), name: i.name, quantity: i.quantity || '', unit: i.unit || '' });
          }
        }
        let sts: any[] = [];
        if (steps?.length) {
          const stmt = db.prepare('INSERT INTO steps (recipe_id, step_number, instruction) VALUES (?,?,?)');
          steps.forEach((s: any, idx: number) => {
            const r = stmt.run(id, s.step_number || idx + 1, s.instruction);
            sts.push({ id: Number(r.lastInsertRowid), step_number: s.step_number || idx + 1, instruction: s.instruction });
          });
        }

        const updated = db.prepare('SELECT * FROM recipes WHERE id = ?').get(id);
        return res.json({ ...updated, id: Number(updated.id), ingredients: ins, steps: sts });
      }
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      if (isSupabase()) {
        const { error } = await db.from('recipes').delete().eq('id', id);
        if (error) return res.status(500).json({ error: error.message });
        return res.json({ success: true });
      } else {
        db.prepare('DELETE FROM recipes WHERE id = ?').run(id);
        return res.json({ success: true });
      }
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  res.setHeader('Allow', 'GET, PUT, DELETE');
  res.status(405).end();
}