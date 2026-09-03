import type { Recipe, Ingredient, Step, MealPlan, RecipeDetail, MealPlanItem } from '@/types';

describe('Types', () => {
  it('Recipe type is structurally valid', () => {
    const r: Recipe = { id: 1, title: 'Test', created_at: '2024-01-01' };
    expect(r.id).toBe(1);
  });

  it('MealPlan type is structurally valid', () => {
    const m: MealPlan = { id: 1, recipe_id: 1, date: '2024-01-01', meal_type: 'dinner' };
    expect(m.meal_type).toBe('dinner');
  });
});