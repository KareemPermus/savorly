export interface Recipe {
  id: number;
  title: string;
  description?: string;
  ingredients: string;
  instructions: string;
  image_url?: string;
  prep_time?: number;
  servings?: number;
}

export interface MealPlan {
  id: number;
  recipe_id: number;
  date: string;
  meal_type: string;
}

export interface RecipeListItem {
  id: number;
  title: string;
  description: string;
  image_url: string;
  prep_time: number;
  servings: number;
}

export interface MealPlanWithRecipe {
  id: number;
  recipe_id: number;
  date: string;
  meal_type: string;
  recipe: {
    id: number;
    title: string;
    image_url: string;
  };
}