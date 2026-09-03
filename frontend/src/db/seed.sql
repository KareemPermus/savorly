INSERT INTO recipes (title, slug, description, image_url, prep_time, cook_time, servings)
VALUES ('Classic Margherita Pizza', 'classic-margherita-pizza', 'A simple and delicious Italian classic with fresh mozzarella and basil.', 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600', 20, 15, 4)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO recipes (title, slug, description, image_url, prep_time, cook_time, servings)
VALUES ('Chicken Stir Fry', 'chicken-stir-fry', 'Quick and healthy chicken stir fry with colorful vegetables.', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600', 15, 10, 2)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO recipes (title, slug, description, image_url, prep_time, cook_time, servings)
VALUES ('Chocolate Lava Cake', 'chocolate-lava-cake', 'Rich and indulgent chocolate cake with a molten center.', 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600', 10, 12, 2)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO ingredients (recipe_id, name, quantity, unit)
SELECT r.id, 'Pizza Dough', '1', 'ball' FROM recipes r WHERE r.slug = 'classic-margherita-pizza'
ON CONFLICT DO NOTHING;

INSERT INTO ingredients (recipe_id, name, quantity, unit)
SELECT r.id, 'Fresh Mozzarella', '200', 'g' FROM recipes r WHERE r.slug = 'classic-margherita-pizza'
ON CONFLICT DO NOTHING;

INSERT INTO ingredients (recipe_id, name, quantity, unit)
SELECT r.id, 'Chicken Breast', '300', 'g' FROM recipes r WHERE r.slug = 'chicken-stir-fry'
ON CONFLICT DO NOTHING;

INSERT INTO ingredients (recipe_id, name, quantity, unit)
SELECT r.id, 'Soy Sauce', '2', 'tbsp' FROM recipes r WHERE r.slug = 'chicken-stir-fry'
ON CONFLICT DO NOTHING;

INSERT INTO ingredients (recipe_id, name, quantity, unit)
SELECT r.id, 'Dark Chocolate', '150', 'g' FROM recipes r WHERE r.slug = 'chocolate-lava-cake'
ON CONFLICT DO NOTHING;

INSERT INTO steps (recipe_id, step_number, instruction)
SELECT r.id, 1, 'Preheat oven to 475°F and stretch the dough.' FROM recipes r WHERE r.slug = 'classic-margherita-pizza'
ON CONFLICT DO NOTHING;

INSERT INTO steps (recipe_id, step_number, instruction)
SELECT r.id, 2, 'Add sauce, mozzarella and bake for 12-15 minutes.' FROM recipes r WHERE r.slug = 'classic-margherita-pizza'
ON CONFLICT DO NOTHING;

INSERT INTO steps (recipe_id, step_number, instruction)
SELECT r.id, 1, 'Slice chicken and vegetables into strips.' FROM recipes r WHERE r.slug = 'chicken-stir-fry'
ON CONFLICT DO NOTHING;

INSERT INTO steps (recipe_id, step_number, instruction)
SELECT r.id, 2, 'Stir fry chicken until golden, add vegetables and sauce.' FROM recipes r WHERE r.slug = 'chicken-stir-fry'
ON CONFLICT DO NOTHING;

INSERT INTO steps (recipe_id, step_number, instruction)
SELECT r.id, 1, 'Melt chocolate and butter together.' FROM recipes r WHERE r.slug = 'chocolate-lava-cake'
ON CONFLICT DO NOTHING;

INSERT INTO steps (recipe_id, step_number, instruction)
SELECT r.id, 2, 'Mix with eggs and sugar, pour into ramekins and bake 12 min.' FROM recipes r WHERE r.slug = 'chocolate-lava-cake'
ON CONFLICT DO NOTHING;

INSERT INTO meal_plans (recipe_id, date, meal_type, slug)
SELECT r.id, '2025-01-20', 'dinner', 'margherita-2025-01-20-dinner' FROM recipes r WHERE r.slug = 'classic-margherita-pizza'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO meal_plans (recipe_id, date, meal_type, slug)
SELECT r.id, '2025-01-21', 'lunch', 'stirfry-2025-01-21-lunch' FROM recipes r WHERE r.slug = 'chicken-stir-fry'
ON CONFLICT (slug) DO NOTHING;