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
      image_url TEXT,
      prep_time INTEGER,
      cook_time INTEGER,
      servings INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS ingredients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      quantity TEXT,
      unit TEXT
    );
    CREATE TABLE IF NOT EXISTS steps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
      step_number INTEGER NOT NULL,
      instruction TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS meal_plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
      date TEXT NOT NULL,
      meal_type TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL
    );
  `);

  const count = (db.prepare('SELECT COUNT(*) as c FROM recipes').get() as any).c;
  if (count === 0) {
    db.exec(`
      INSERT INTO recipes (title, slug, description, image_url, prep_time, cook_time, servings) VALUES
        ('Classic Margherita Pizza','classic-margherita-pizza','A simple and delicious Italian classic with fresh mozzarella and basil.','https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600',20,15,4),
        ('Chicken Stir Fry','chicken-stir-fry','Quick and healthy chicken stir fry with colorful vegetables.','https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600',15,10,2),
        ('Chocolate Lava Cake','chocolate-lava-cake','Rich and indulgent chocolate cake with a molten center.','https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600',10,12,2);

      INSERT INTO ingredients (recipe_id, name, quantity, unit) VALUES
        (1,'Pizza Dough','1','ball'),(1,'Fresh Mozzarella','200','g'),
        (2,'Chicken Breast','300','g'),(2,'Soy Sauce','2','tbsp'),
        (3,'Dark Chocolate','150','g');

      INSERT INTO steps (recipe_id, step_number, instruction) VALUES
        (1,1,'Preheat oven to 475°F and stretch the dough.'),
        (1,2,'Add sauce, mozzarella and bake for 12-15 minutes.'),
        (2,1,'Slice chicken and vegetables into strips.'),
        (2,2,'Stir fry chicken until golden, add vegetables and sauce.'),
        (3,1,'Melt chocolate and butter together.'),
        (3,2,'Mix with eggs and sugar, pour into ramekins and bake 12 min.');

      INSERT INTO meal_plans (recipe_id, date, meal_type, slug) VALUES
        (1,'2025-01-20','dinner','margherita-2025-01-20-dinner'),
        (2,'2025-01-21','lunch','stirfry-2025-01-21-lunch');
    `);
  }

  return db;
}

export function isSupabase(): boolean {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL;
}