export interface Recipe {
  id: number;
  title: string;
  description?: string;
  image_url?: string;
  prep_time?: number;
  cook_time?: number;
  servings?: number;
  created_at: string;
}

export interface Ingredient {
  id: number;
  recipe_id: number;
  name: string;
  quantity?: string;
  unit?: string;
}

export interface Step {
  id: number;
  recipe_id: number;
  step_number: number;
  instruction: string;
}

export interface MealPlan {
  id: number;
  recipe_id: number;
  date: string;
  meal_type: string;
}

// API response types
export interface RecipeListItem {
  id: number;
  title: string;
  description: string;
  image_url: string;
  prep_time: number;
  cook_time: number;
  servings: number;
  created_at: string;
}

export interface RecipeDetail {
  id: number;
  title: string;
  description: string;
  image_url: string;
  prep_time: number;
  cook_time: number;
  servings: number;
  ingredients: { id: number; name: string; quantity: string; unit: string }[];
  steps: { id: number; step_number: number; instruction: string }[];
}

export interface MealPlanItem {
  id: number;
  recipe_id: number;
  date: string;
  meal_type: string;
  recipe: { id: number; title: string; image_url: string };
}