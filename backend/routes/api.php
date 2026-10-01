<?php

use App\Http\Controllers\RecipeController;
use App\Http\Controllers\MealPlanController;
use Illuminate\Support\Facades\Route;

Route::get('/health', fn() => response()->json(['status' => 'ok']));

Route::get('/recipes', [RecipeController::class, 'index']);
Route::get('/recipes/{id}', [RecipeController::class, 'show']);
Route::post('/recipes', [RecipeController::class, 'store']);

Route::get('/meal-plans', [MealPlanController::class, 'index']);
Route::post('/meal-plans', [MealPlanController::class, 'store']);
Route::delete('/meal-plans/{id}', [MealPlanController::class, 'destroy']);