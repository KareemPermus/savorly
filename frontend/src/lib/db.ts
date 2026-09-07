import path from 'path';

let db: any = null;

export function getDb() {
  if (db) return db;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const { createClient } = require('@supabase/supabase-js');
    db = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    return db;
  }

  const Database = require('better-sqlite3');
  db = new Database(path.join('/tmp', 'app.db'));
  db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      ingredients TEXT NOT NULL,
      steps TEXT NOT NULL,
      prep_time INTEGER,
      cook_time INTEGER,
      servings INTEGER,
      image_url TEXT,
      category TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS meal_plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
      date TEXT NOT NULL,
      meal_type TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  const count = db.prepare('SELECT COUNT(*) as c FROM recipes').get();
  if (count.c === 0) {
    db.exec(`
      INSERT INTO recipes (title, slug, description, ingredients, steps, prep_time, cook_time, servings, category)
      VALUES
        ('Classic Margherita Pizza', 'classic-margherita-pizza', 'Traditional Italian pizza with fresh basil', 'Pizza dough, San Marzano tomatoes, Fresh mozzarella, Basil, Olive oil, Salt', '1. Preheat oven to 475°F\n2. Roll out dough\n3. Spread sauce\n4. Add cheese and basil\n5. Bake 12-15 minutes', 20, 15, 4, 'Italian'),
        ('Chicken Stir Fry', 'chicken-stir-fry', 'Quick and healthy weeknight dinner', 'Chicken breast, Soy sauce, Broccoli, Bell pepper, Garlic, Ginger, Rice', '1. Slice chicken\n2. Heat oil in wok\n3. Cook chicken until browned\n4. Add vegetables\n5. Add sauce and serve over rice', 15, 10, 2, 'Asian'),
        ('Avocado Toast', 'avocado-toast', 'Simple and delicious breakfast', 'Sourdough bread, Avocado, Lemon juice, Red pepper flakes, Salt, Egg', '1. Toast bread\n2. Mash avocado with lemon and salt\n3. Spread on toast\n4. Fry egg and place on top\n5. Sprinkle red pepper flakes', 5, 5, 1, 'Breakfast');
    `);
    const chickenId = db.prepare("SELECT id FROM recipes WHERE slug='chicken-stir-fry'").get()?.id;
    const avocadoId = db.prepare("SELECT id FROM recipes WHERE slug='avocado-toast'").get()?.id;
    if (chickenId) {
      db.prepare("INSERT INTO meal_plans (recipe_id, date, meal_type, slug) VALUES (?, '2025-01-20', 'dinner', 'mealplan-2025-01-20-dinner')").run(chickenId);
    }
    if (avocadoId) {
      db.prepare("INSERT INTO meal_plans (recipe_id, date, meal_type, slug) VALUES (?, '2025-01-20', 'breakfast', 'mealplan-2025-01-20-breakfast')").run(avocadoId);
    }
  }

  return db;
}

// Helper to check if db is Supabase client
export function isSupabase(): boolean {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL;
}