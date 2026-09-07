import { render, screen, waitFor } from '@testing-library/react';
import Home from '@/pages/index';
import apiClient from '@/api/client';

jest.mock('@/api/client', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

const mockRecipes = [
  { id: 1, title: 'Test Recipe', description: 'Desc', category: 'Mains', cook_time: 30, prep_time: 10, servings: 4, image_url: '', created_at: '2024-01-01' },
];

const mockMealPlans = [
  { id: 1, recipe_id: 1, recipe_title: 'Test Recipe', date: '2024-01-01', meal_type: 'Dinner', created_at: '2024-01-01' },
];

describe('Home page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders recipes and meal plans after loading', async () => {
    (apiClient.get as jest.Mock)
      .mockResolvedValueOnce({ data: mockRecipes })
      .mockResolvedValueOnce({ data: mockMealPlans });

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Test Recipe')).toBeInTheDocument();
    });

    expect(screen.getByText('Dinner')).toBeInTheDocument();
    expect(screen.getByText('1 recipes · 1 planned meals')).toBeInTheDocument();
  });

  it('shows error state on API failure', async () => {
    (apiClient.get as jest.Mock).mockRejectedValue(new Error('fail'));

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load data')).toBeInTheDocument();
    });
  });
});