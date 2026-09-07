export interface Recipe {
  id: number;
  title: string;
  description?: string;
  ingredients: string;
  steps: string;
  prep_time?: number;
  cook_time?: number;
  servings?: number;
  image_url?: string;
  category?: string;
  created_at: string;
}

export interface MealPlan {
  id: number;
  recipe_id: number;
  date: string;
  meal_type: string;
  created_at: string;
}

export interface RecipeListItem {
  id: number;
  title: string;
  description: string;
  category: string;
  cook_time: number;
  prep_time: number;
  servings: number;
  image_url: string;
  created_at: string;
}

export interface MealPlanListItem {
  id: number;
  recipe_id: number;
  date: string;
  meal_type: string;
  recipe_title: string;
  created_at: string;
}

export interface DeleteResponse {
  success: boolean;
}