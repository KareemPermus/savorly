import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb, isSupabase } from '@/lib/db';

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = getDb();

  if (req.method === 'GET') {
    try {
      const search = (req.query.search as string) || '';
      if (isSupabase()) {
        let query = db.from('recipes').select('*').order('created_at', { ascending: false });
        if (search) query = query.ilike('title', `%${search}%`);
        const { data, error } = await query;
        if (error) return res.status(500).json({ error: error.message });
        return res.json(data);
      } else {
        let rows;
        if (search) {
          rows = db.prepare('SELECT * FROM recipes WHERE title LIKE ? ORDER BY created_at DESC').all(`%${search}%`);
        } else {
          rows = db.prepare('SELECT * FROM recipes ORDER BY created_at DESC').all();
        }
        return res.json(rows);
      }
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const { title, description, image_url, prep_time, cook_time, servings, ingredients, steps } = req.body;
      if (!title) return res.status(400).json({ error: 'title is required' });
      const slug = generateSlug(title);

      if (isSupabase()) {
        const { data: recipe, error } = await db.from('recipes').insert({ title, slug, description, image_url, prep_time, cook_time, servings }).select().single();
        if (error) return res.status(500).json({ error: error.message });

        let insertedIngredients: any[] = [];
        if (ingredients?.length) {
          const { data, error: ie } = await db.from('ingredients').insert(ingredients.map((i: any) => ({ recipe_id: recipe.id, name: i.name, quantity: i.quantity, unit: i.unit }))).select();
          if (!ie) insertedIngredients = data || [];
        }

        let insertedSteps: any[] = [];
        if (steps?.length) {
          const { data, error: se } = await db.from('steps').insert(steps.map((s: any, idx: number) => ({ recipe_id: recipe.id, step_number: s.step_number || idx + 1, instruction: s.instruction }))).select();
          if (!se) insertedSteps = data || [];
        }

        return res.status(201).json({ ...recipe, ingredients: insertedIngredients, steps: insertedSteps });
      } else {
        const result = db.prepare('INSERT INTO recipes (title, slug, description, image_url, prep_time, cook_time, servings) VALUES (?,?,?,?,?,?,?)').run(title, slug, description || null, image_url || null, prep_time || null, cook_time || null, servings || null);
        const recipeId = result.lastInsertRowid;
        const recipe = db.prepare('SELECT * FROM recipes WHERE id = ?').get(recipeId);

        let insertedIngredients: any[] = [];
        if (ingredients?.length) {
          const stmt = db.prepare('INSERT INTO ingredients (recipe_id, name, quantity, unit) VALUES (?,?,?,?)');
          for (const i of ingredients) {
            const r = stmt.run(recipeId, i.name, i.quantity || null, i.unit || null);
            insertedIngredients.push({ id: Number(r.lastInsertRowid), name: i.name, quantity: i.quantity || '', unit: i.unit || '' });
          }
        }

        let insertedSteps: any[] = [];
        if (steps?.length) {
          const stmt = db.prepare('INSERT INTO steps (recipe_id, step_number, instruction) VALUES (?,?,?)');
          steps.forEach((s: any, idx: number) => {
            const r = stmt.run(recipeId, s.step_number || idx + 1, s.instruction);
            insertedSteps.push({ id: Number(r.lastInsertRowid), step_number: s.step_number || idx + 1, instruction: s.instruction });
          });
        }

        return res.status(201).json({ ...recipe, id: Number(recipe.id), ingredients: insertedIngredients, steps: insertedSteps });
      }
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  res.setHeader('Allow', 'GET, POST');
  res.status(405).end();
}