<?php

namespace Database\Seeders;

use App\Models\Recipe;
use Illuminate\Database\Seeder;

class RecipeSeeder extends Seeder
{
    public function run(): void
    {
        $recipes = [
            ['title' => 'Spaghetti Bolognese', 'description' => 'Classic Italian meat sauce over pasta', 'ingredients' => "400g spaghetti\n300g ground beef\n1 onion, diced\n2 cloves garlic\n400g canned tomatoes\n2 tbsp tomato paste\nSalt, pepper, oregano", 'instructions' => "1. Cook spaghetti according to package.\n2. Brown beef with onion and garlic.\n3. Add tomatoes, paste, and seasoning.\n4. Simmer 20 min.\n5. Serve sauce over pasta.", 'image_url' => 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600', 'prep_time' => 35, 'servings' => 4],
            ['title' => 'Chicken Caesar Salad', 'description' => 'Crispy romaine with grilled chicken and Caesar dressing', 'ingredients' => "2 chicken breasts\n1 head romaine lettuce\n1/2 cup croutons\n1/4 cup parmesan\nCaesar dressing", 'instructions' => "1. Grill chicken until cooked through.\n2. Chop romaine and place in bowl.\n3. Slice chicken and add to salad.\n4. Top with croutons, parmesan, and dressing.", 'image_url' => 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600', 'prep_time' => 20, 'servings' => 2],
            ['title' => 'Vegetable Stir Fry', 'description' => 'Quick and colorful mixed vegetable stir fry', 'ingredients' => "1 bell pepper\n1 zucchini\n1 carrot\n100g broccoli\n2 tbsp soy sauce\n1 tbsp sesame oil\n1 clove garlic\nRice for serving", 'instructions' => "1. Slice all vegetables.\n2. Heat sesame oil in wok.\n3. Stir fry garlic 30 sec.\n4. Add vegetables, cook 5 min.\n5. Add soy sauce, toss.\n6. Serve over rice.", 'image_url' => 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600', 'prep_time' => 15, 'servings' => 2],
            ['title' => 'Banana Pancakes', 'description' => 'Fluffy pancakes with fresh banana', 'ingredients' => "2 ripe bananas\n2 eggs\n1 cup flour\n1 tsp baking powder\n1/2 cup milk\nButter for cooking\nMaple syrup", 'instructions' => "1. Mash bananas in bowl.\n2. Whisk in eggs and milk.\n3. Add flour and baking powder.\n4. Cook on buttered griddle until golden.\n5. Serve with syrup.", 'image_url' => 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600', 'prep_time' => 15, 'servings' => 3],
            ['title' => 'Tomato Basil Soup', 'description' => 'Creamy homemade tomato soup with fresh basil', 'ingredients' => "800g canned tomatoes\n1 onion\n2 cloves garlic\n1 cup vegetable broth\n1/4 cup cream\nFresh basil\nSalt, pepper", 'instructions' => "1. Sauté onion and garlic.\n2. Add tomatoes and broth.\n3. Simmer 15 min.\n4. Blend until smooth.\n5. Stir in cream and basil.", 'image_url' => 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600', 'prep_time' => 25, 'servings' => 4],
        ];

        foreach ($recipes as $r) {
            Recipe::firstOrCreate(['title' => $r['title']], $r);
        }
    }
}