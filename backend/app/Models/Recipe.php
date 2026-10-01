<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Recipe extends Model
{
    protected $fillable = [
        'title', 'description', 'ingredients', 'instructions', 'image_url', 'prep_time', 'servings',
    ];

    protected $casts = [
        'prep_time' => 'integer',
        'servings' => 'integer',
    ];

    public function mealPlans(): HasMany
    {
        return $this->hasMany(MealPlan::class);
    }
}