<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RecipeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Recipe::query();
        if ($search = $request->query('search')) {
            $query->where('title', 'like', "%{$search}%");
        }
        $recipes = $query->orderBy('created_at', 'desc')->get()
            ->map(fn($r) => [
                'id' => $r->id,
                'title' => $r->title,
                'description' => $r->description,
                'image_url' => $r->image_url,
                'prep_time' => $r->prep_time,
                'servings' => $r->servings,
            ]);
        return response()->json($recipes);
    }

    public function show(int $id): JsonResponse
    {
        $r = Recipe::findOrFail($id);
        return response()->json([
            'id' => $r->id,
            'title' => $r->title,
            'description' => $r->description,
            'ingredients' => $r->ingredients,
            'instructions' => $r->instructions,
            'image_url' => $r->image_url,
            'prep_time' => $r->prep_time,
            'servings' => $r->servings,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'ingredients' => 'required|string',
            'instructions' => 'required|string',
            'image_url' => 'nullable|string|max:2048',
            'prep_time' => 'nullable|integer|min:0',
            'servings' => 'nullable|integer|min:1',
        ]);

        $r = Recipe::create($data);

        return response()->json([
            'id' => $r->id,
            'title' => $r->title,
            'description' => $r->description,
            'ingredients' => $r->ingredients,
            'instructions' => $r->instructions,
            'image_url' => $r->image_url,
            'prep_time' => $r->prep_time,
            'servings' => $r->servings,
        ], 201);
    }
}