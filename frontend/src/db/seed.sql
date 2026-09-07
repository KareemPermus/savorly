INSERT INTO recipes (title, slug, description, ingredients, steps, prep_time, cook_time, servings, image_url, category)
VALUES
  ('Classic Margherita Pizza', 'classic-margherita-pizza', 'Traditional Italian pizza with fresh basil', 'Pizza dough, San Marzano tomatoes, Fresh mozzarella, Basil, Olive oil, Salt', '1. Preheat oven to 475°F\n2. Roll out dough\n3. Spread sauce\n4. Add cheese and basil\n5. Bake 12-15 minutes', 20, 15, 4, NULL, 'Italian')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO recipes (title, slug, description, ingredients, steps, prep_time, cook_time, servings, image_url, category)
VALUES
  ('Chicken Stir Fry', 'chicken-stir-fry', 'Quick and healthy weeknight dinner', 'Chicken breast, Soy sauce, Broccoli, Bell pepper, Garlic, Ginger, Rice', '1. Slice chicken\n2. Heat oil in wok\n3. Cook chicken until browned\n4. Add vegetables\n5. Add sauce and serve over rice', 15, 10, 2, NULL, 'Asian')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO recipes (title, slug, description, ingredients, steps, prep_time, cook_time, servings, image_url, category)
VALUES
  ('Avocado Toast', 'avocado-toast', 'Simple and delicious breakfast', 'Sourdough bread, Avocado, Lemon juice, Red pepper flakes, Salt, Egg', '1. Toast bread\n2. Mash avocado with lemon and salt\n3. Spread on toast\n4. Fry egg and place on top\n5. Sprinkle red pepper flakes', 5, 5, 1, NULL, 'Breakfast')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO meal_plans (recipe_id, date, meal_type, slug)
VALUES
  ((SELECT id FROM recipes WHERE slug='chicken-stir-fry'), '2025-01-20', 'dinner', 'mealplan-2025-01-20-dinner')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO meal_plans (recipe_id, date, meal_type, slug)
VALUES
  ((SELECT id FROM recipes WHERE slug='avocado-toast'), '2025-01-20', 'breakfast', 'mealplan-2025-01-20-breakfast')
ON CONFLICT (slug) DO NOTHING;