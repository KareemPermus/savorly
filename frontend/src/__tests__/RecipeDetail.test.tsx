import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RecipeDetail from '@/pages/recipes/[id]';
import apiClient from '@/api/client';

jest.mock('next/router', () => ({
  useRouter: () => ({ query: { id: '1' }, push: jest.fn() }),
}));

jest.mock('@/api/client', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockRecipe = {
  id: 1,
  title: 'Test Recipe',
  description: 'A test',
  ingredients: 'flour\nsugar',
  steps: 'mix\nbake',
  prep_time: 10,
  cook_time: 25,
  servings: 4,
  image_url: '',
  category: 'Desserts',
  created_at: '2024-01-01T00:00:00Z',
};

describe('RecipeDetail', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders recipe details on success', async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({ data: mockRecipe });
    render(<RecipeDetail />);
    await waitFor(() => expect(screen.getByText('Test Recipe')).toBeInTheDocument());
    expect(screen.getByText('Desserts')).toBeInTheDocument();
    expect(screen.getByText('flour')).toBeInTheDocument();
    expect(screen.getByText('bake')).toBeInTheDocument();
  });

  it('shows error when recipe not found', async () => {
    (apiClient.get as jest.Mock).mockRejectedValue(new Error('404'));
    render(<RecipeDetail />);
    await waitFor(() => expect(screen.getByText('Recipe not found')).toBeInTheDocument());
  });

  it('shows delete confirmation on click', async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({ data: mockRecipe });
    render(<RecipeDetail />);
    await waitFor(() => screen.getByText('Test Recipe'));
    fireEvent.click(screen.getByText('Delete'));
    expect(screen.getByText('Delete this recipe?')).toBeInTheDocument();
  });
});