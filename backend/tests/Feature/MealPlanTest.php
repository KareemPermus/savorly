<?php

namespace Tests\Feature;

use App\Models\MealPlan;
use App\Models\Recipe;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MealPlanTest extends TestCase
{
    use RefreshDatabase;

    public function test_list_meal_plans(): void
    {
        $r = Recipe::create(['title' => 'R', 'ingredients' => 'i', 'instructions' => 'x']);
        MealPlan::create(['recipe_id' => $r->id, 'date' => '2025-01-06', 'meal_type' => 'lunch']);
        $response = $this->getJson('/api/meal-plans');
        $response->assertOk()->assertJsonCount(1);
        $response->assertJsonFragment(['meal_type' => 'lunch']);
        $this->assertArrayHasKey('recipe', $response->json()[0]);
    }

    public function test_create_meal_plan(): void
    {
        $r = Recipe::create(['title' => 'R', 'ingredients' => 'i', 'instructions' => 'x']);
        $response = $this->postJson('/api/meal-plans', [
            'recipe_id' => $r->id,
            'date' => '2025-01-07',
            'meal_type' => 'dinner',
        ]);
        $response->assertStatus(201)->assertJsonFragment(['meal_type' => 'dinner']);
    }

    public function test_create_meal_plan_validation(): void
    {
        $this->postJson('/api/meal-plans', ['recipe_id' => 9999, 'date' => '2025-01-07', 'meal_type' => 'dinner'])->assertStatus(422);
    }

    public function test_delete_meal_plan(): void
    {
        $r = Recipe::create(['title' => 'R', 'ingredients' => 'i', 'instructions' => 'x']);
        $mp = MealPlan::create(['recipe_id' => $r->id, 'date' => '2025-01-06', 'meal_type' => 'lunch']);
        $this->deleteJson("/api/meal-plans/{$mp->id}")->assertOk()->assertJsonFragment(['message' => 'Meal plan deleted successfully.']);
    }

    public function test_delete_meal_plan_not_found(): void
    {
        $this->deleteJson('/api/meal-plans/9999')->assertStatus(404);
    }
}