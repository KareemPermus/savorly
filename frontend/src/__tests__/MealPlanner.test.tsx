import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MealPlanner from '@/pages/meal-planner';
import apiClient from '@/api/client';

jest.mock('@/api/client', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockRecipes = [
  { id: 1, title: 'Pasta', description: 'Good', image_url: '', prep_time: 10, cook_time: 20, servings: 2, created_at: '2024-01-01' },
];

const mockMealPlans = [
  { id: 1, recipe_id: 1, date: new Date().toISOString().split('T')[0], meal_type: 'Lunch', recipe: { id: 1, title: 'Pasta', image_url: '' } },
];

beforeEach(() => {
  (apiClient.get as jest.Mock).mockImplementation((url: string) => {
    if (url === '/api/meal-plans') return Promise.resolve({ data: mockMealPlans });
    if (url === '/api/recipes') return Promise.resolve({ data: mockRecipes });
    return Promise.resolve({ data: [] });
  });
});

test('renders meal planner heading after load', async () => {
  render(<MealPlanner />);
  await waitFor(() => expect(screen.getByText('Meal Planner')).toBeInTheDocument());
});

test('shows add meal modal on button click', async () => {
  render(<MealPlanner />);
  await waitFor(() => screen.getByText('Meal Planner'));
  fireEvent.click(screen.getByText('Add Meal'));
  expect(screen.getByText('Add to Plan')).toBeInTheDocument();
});

test('displays error on fetch failure', async () => {
  (apiClient.get as jest.Mock).mockRejectedValue(new Error('fail'));
  render(<MealPlanner />);
  await waitFor(() => expect(screen.getByText('Failed to load meal plans.')).toBeInTheDocument());
});

test('deletes a meal plan', async () => {
  (apiClient.delete as jest.Mock).mockResolvedValue({ data: { success: true } });
  render(<MealPlanner />);
  await waitFor(() => screen.getByText('Pasta'));
  const deleteBtn = screen.getByTitle('Remove');
  fireEvent.click(deleteBtn);
  await waitFor(() => expect(apiClient.delete).toHaveBeenCalledWith('/api/meal-plans/1'));
});