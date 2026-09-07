import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Recipes from '@/pages/recipes';
import apiClient from '@/api/client';

jest.mock('@/api/client', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn() },
}));

const mockRecipes = [
  { id: 1, title: 'Pasta', description: 'Delicious', category: 'Mains', cook_time: 30, prep_time: 10, servings: 4, image_url: '', created_at: '2024-01-01' },
  { id: 2, title: 'Salad', description: 'Fresh', category: 'Salads', cook_time: 10, prep_time: 5, servings: 2, image_url: '', created_at: '2024-01-02' },
];

beforeEach(() => {
  (apiClient.get as jest.Mock).mockResolvedValue({ data: mockRecipes });
});

test('renders recipes and displays them', async () => {
  render(<Recipes />);
  expect(screen.getByText('Loading recipes…')).toBeInTheDocument();
  await waitFor(() => expect(screen.getByText('Pasta')).toBeInTheDocument());
  expect(screen.getByText('Salad')).toBeInTheDocument();
});

test('filters by category', async () => {
  render(<Recipes />);
  await waitFor(() => expect(screen.getByText('Pasta')).toBeInTheDocument());
  fireEvent.click(screen.getByText('Salads'));
  expect(screen.getByText('Salad')).toBeInTheDocument();
  expect(screen.queryByText('Pasta')).not.toBeInTheDocument();
});

test('search filters recipes', async () => {
  render(<Recipes />);
  await waitFor(() => expect(screen.getByText('Pasta')).toBeInTheDocument());
  fireEvent.change(screen.getByPlaceholderText('Search recipes…'), { target: { value: 'salad' } });
  expect(screen.queryByText('Pasta')).not.toBeInTheDocument();
  expect(screen.getByText('Salad')).toBeInTheDocument();
});

test('opens add recipe modal', async () => {
  render(<Recipes />);
  await waitFor(() => expect(screen.getByText('Pasta')).toBeInTheDocument());
  fireEvent.click(screen.getAllByText('Add Recipe')[0]);
  expect(screen.getByText('Add a new recipe')).toBeInTheDocument();
});

test('shows empty state when no recipes', async () => {
  (apiClient.get as jest.Mock).mockResolvedValue({ data: [] });
  render(<Recipes />);
  await waitFor(() => expect(screen.getByText('No recipes found')).toBeInTheDocument());
});

test('handles API error', async () => {
  (apiClient.get as jest.Mock).mockRejectedValue(new Error('fail'));
  render(<Recipes />);
  await waitFor(() => expect(screen.getByText('Failed to load recipes')).toBeInTheDocument());
});