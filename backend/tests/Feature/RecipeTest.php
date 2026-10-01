<?php

namespace Tests\Feature;

use App\Models\Recipe;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RecipeTest extends TestCase
{
    use RefreshDatabase;

    public function test_list_recipes(): void
    {
        Recipe::create(['title' => 'Test', 'ingredients' => 'a', 'instructions' => 'b']);
        $response = $this->getJson('/api/recipes');
        $response->assertOk();
        $response->assertJsonCount(1);
        $response->assertJsonFragment(['title' => 'Test']);
    }

    public function test_show_recipe(): void
    {
        $r = Recipe::create(['title' => 'Show', 'ingredients' => 'i', 'instructions' => 'x']);
        $this->getJson("/api/recipes/{$r->id}")->assertOk()->assertJsonFragment(['title' => 'Show', 'ingredients' => 'i']);
    }

    public function test_show_recipe_not_found(): void
    {
        $this->getJson('/api/recipes/9999')->assertStatus(404);
    }

    public function test_create_recipe(): void
    {
        $response = $this->postJson('/api/recipes', [
            'title' => 'New Recipe',
            'ingredients' => 'flour, sugar',
            'instructions' => 'Mix and bake',
        ]);
        $response->assertStatus(201)->assertJsonFragment(['title' => 'New Recipe']);
    }

    public function test_create_recipe_validation(): void
    {
        $this->postJson('/api/recipes', [])->assertStatus(422);
    }
}