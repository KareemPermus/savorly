import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
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

const mockPlans = [
  { id: 1, recipe_id: 1, date: new Date().toISOString().split('T')[0], meal_type: 'Dinner', created_at: '2024-01-01', recipe_title: 'Pasta' },
];
const mockRecipes = [
  { id: 1, title: 'Pasta', category: 'Mains', cook_time: 30, created_at: '2024-01-01', description: '', image_url: '', prep_time: 10, servings: 4 },
];

describe('MealPlanner page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (apiClient.get as jest.Mock).mockImplementation((url: string) => {
      if (url === '/api/meal-plans') return Promise.resolve({ data: mockPlans });
      if (url === '/api/recipes') return Promise.resolve({ data: mockRecipes });
      return Promise.resolve({ data: [] });
    });
  });

  it('renders title and meal plan data', async () => {
    render(<MealPlanner />);
    await waitFor(() => expect(screen.getByText('Meal Planner')).toBeInTheDocument());
    expect(screen.getByText('Pasta')).toBeInTheDocument();
  });

  it('shows error state when API fails', async () => {
    (apiClient.get as jest.Mock).mockRejectedValue(new Error('fail'));
    render(<MealPlanner />);
    await waitFor(() => expect(screen.getByText('Failed to load meal plans.')).toBeInTheDocument());
  });

  it('can delete a meal plan item', async () => {
    (apiClient.delete as jest.Mock).mockResolvedValue({ data: { success: true } });
    render(<MealPlanner />);
    await waitFor(() => expect(screen.getByText('Pasta')).toBeInTheDocument());
    const delBtn = screen.getByTitle('Remove');
    fireEvent.click(delBtn);
    await waitFor(() => expect(apiClient.delete).toHaveBeenCalledWith('/api/meal-plans/1'));
  });

  it('opens add modal on cell plus click', async () => {
    render(<MealPlanner />);
    await waitFor(() => expect(screen.getByText('Meal Planner')).toBeInTheDocument());
    const addBtns = screen.getAllByTitle('Add meal');
    fireEvent.click(addBtns[0]);
    expect(screen.getByText('Add to Meal Plan')).toBeInTheDocument();
  });
});