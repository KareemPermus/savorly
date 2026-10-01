<?php

namespace Database\Seeders;

use App\Models\MealPlan;
use App\Models\Recipe;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class MealPlanSeeder extends Seeder
{
    public function run(): void
    {
        $recipes = Recipe::all();
        if ($recipes->isEmpty()) return;

        $monday = Carbon::now()->startOfWeek();

        $plans = [
            ['date' => $monday->copy(), 'meal_type' => 'breakfast', 'recipe_idx' => 3],
            ['date' => $monday->copy(), 'meal_type' => 'dinner', 'recipe_idx' => 0],
            ['date' => $monday->copy()->addDay(), 'meal_type' => 'lunch', 'recipe_idx' => 1],
            ['date' => $monday->copy()->addDays(2), 'meal_type' => 'dinner', 'recipe_idx' => 2],
            ['date' => $monday->copy()->addDays(3), 'meal_type' => 'lunch', 'recipe_idx' => 4],
        ];

        foreach ($plans as $p) {
            $recipe = $recipes[$p['recipe_idx']] ?? $recipes->first();
            MealPlan::firstOrCreate([
                'date' => $p['date']->format('Y-m-d'),
                'meal_type' => $p['meal_type'],
            ], [
                'recipe_id' => $recipe->id,
                'date' => $p['date']->format('Y-m-d'),
                'meal_type' => $p['meal_type'],
            ]);
        }
    }
}