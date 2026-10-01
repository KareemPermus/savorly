<?php

namespace App\Http\Controllers;

use App\Models\MealPlan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MealPlanController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = MealPlan::with('recipe:id,title,image_url');

        if ($start = $request->query('start_date')) {
            $query->where('date', '>=', $start);
        }
        if ($end = $request->query('end_date')) {
            $query->where('date', '<=', $end);
        }

        $plans = $query->orderBy('date')->get()->map(fn($p) => [
            'id' => $p->id,
            'recipe_id' => $p->recipe_id,
            'date' => $p->date->format('Y-m-d'),
            'meal_type' => $p->meal_type,
            'recipe' => $p->recipe ? [
                'id' => $p->recipe->id,
                'title' => $p->recipe->title,
                'image_url' => $p->recipe->image_url,
            ] : null,
        ]);

        return response()->json($plans);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'recipe_id' => 'required|integer|exists:recipes,id',
            'date' => 'required|date',
            'meal_type' => 'required|string|in:breakfast,lunch,dinner,snack',
        ]);

        $plan = MealPlan::create($data);

        return response()->json([
            'id' => $plan->id,
            'recipe_id' => $plan->recipe_id,
            'date' => $plan->date->format('Y-m-d'),
            'meal_type' => $plan->meal_type,
        ], 201);
    }

    public function destroy(int $id): JsonResponse
    {
        $plan = MealPlan::findOrFail($id);
        $plan->delete();
        return response()->json(['message' => 'Meal plan deleted successfully.']);
    }
}