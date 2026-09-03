import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RecipeDetailPage from '@/pages/recipes/[id]';
import apiClient from '@/api/client';

jest.mock('next/router', () => ({
  useRouter: () => ({ query: { id: '1' }, push: jest.fn() }),
}));

jest.mock('@/api/client', () => ({
  __esModule: true,
  default: { get: jest.fn(), delete: jest.fn() },
}));

const mockRecipe = {
  id: 1,
  title: 'Test Recipe',
  description: 'A test',
  image_url: '',
  prep_time: 10,
  cook_time: 20,
  servings: 4,
  ingredients: [{ id: 1, name: 'Salt', quantity: '1', unit: 'tsp' }],
  steps: [{ id: 1, step_number: 1, instruction: 'Do the thing' }],
};

describe('RecipeDetail', () => {
  it('renders recipe data', async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({ data: mockRecipe });
    render(<RecipeDetailPage />);
    await waitFor(() => expect(screen.getByText('Test Recipe')).toBeInTheDocument());
    expect(screen.getByText('1 tsp Salt')).toBeInTheDocument();
    expect(screen.getByText('Do the thing')).toBeInTheDocument();
  });

  it('shows error on fetch failure', async () => {
    (apiClient.get as jest.Mock).mockRejectedValue(new Error('fail'));
    render(<RecipeDetailPage />);
    await waitFor(() => expect(screen.getByText('Recipe not found')).toBeInTheDocument());
  });
});