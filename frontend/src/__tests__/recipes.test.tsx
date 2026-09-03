import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Recipes from '@/pages/recipes';
import apiClient from '@/api/client';

jest.mock('@/api/client', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>;
});

const mockRecipes = [
  { id: 1, title: 'Test Pasta', description: 'Delicious', image_url: '', prep_time: 10, cook_time: 20, servings: 4, created_at: '2024-01-01' },
  { id: 2, title: 'Quick Salad', description: 'Fresh', image_url: '', prep_time: 5, cook_time: 0, servings: 2, created_at: '2024-01-02' },
];

describe('Recipes page', () => {
  beforeEach(() => {
    (apiClient.get as jest.Mock).mockResolvedValue({ data: mockRecipes });
  });

  it('renders recipes after loading', async () => {
    render(<Recipes />);
    await waitFor(() => expect(screen.getByText('Test Pasta')).toBeInTheDocument());
    expect(screen.getByText('Quick Salad')).toBeInTheDocument();
  });

  it('filters recipes by search', async () => {
    render(<Recipes />);
    await waitFor(() => expect(screen.getByText('Test Pasta')).toBeInTheDocument());
    fireEvent.change(screen.getByPlaceholderText('Search recipes…'), { target: { value: 'salad' } });
    expect(screen.queryByText('Test Pasta')).not.toBeInTheDocument();
    expect(screen.getByText('Quick Salad')).toBeInTheDocument();
  });

  it('shows error state', async () => {
    (apiClient.get as jest.Mock).mockRejectedValue(new Error('fail'));
    render(<Recipes />);
    await waitFor(() => expect(screen.getByText('Failed to load recipes.')).toBeInTheDocument());
  });

  it('opens filter drawer', async () => {
    render(<Recipes />);
    await waitFor(() => expect(screen.getByText('Test Pasta')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Filters'));
    expect(screen.getByText('Apply filters')).toBeInTheDocument();
  });
});