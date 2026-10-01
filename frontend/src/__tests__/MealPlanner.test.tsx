import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MealPlanner from '../pages/MealPlanner';

vi.mock('../api/client', () => ({
  getMealPlans: vi.fn().mockResolvedValue([
    { id: 1, recipe_id: 2, date: '2025-01-06', meal_type: 'breakfast', recipe: { id: 2, title: 'Pancakes', image_url: '' } },
  ]),
  getRecipes: vi.fn().mockResolvedValue([
    { id: 2, title: 'Pancakes', description: 'Fluffy', image_url: '', prep_time: 15, servings: 2 },
  ]),
  createMealPlan: vi.fn().mockResolvedValue({ id: 2, recipe_id: 2, date: '2025-01-06', meal_type: 'lunch' }),
  deleteMealPlan: vi.fn().mockResolvedValue({ message: 'deleted' }),
}));

describe('MealPlanner', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('renders the page title and week navigation', async () => {
    render(<MealPlanner />);
    expect(screen.getByText('Meal Planner')).toBeTruthy();
    expect(screen.getByText('Today')).toBeTruthy();
    await waitFor(() => expect(screen.queryByText('Loading meal plans…')).toBeNull());
  });

  it('opens add meal modal when clicking an empty slot', async () => {
    render(<MealPlanner />);
    await waitFor(() => expect(screen.queryByText('Loading meal plans…')).toBeNull());
    const addButtons = screen.getAllByTitle(/Add (Breakfast|Lunch|Dinner)/);
    expect(addButtons.length).toBeGreaterThan(0);
    fireEvent.click(addButtons[0]);
    expect(screen.getByText('Search recipes…')).toBeTruthy();
  });
});