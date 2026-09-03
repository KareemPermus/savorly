import { render, screen, waitFor } from '@testing-library/react';
import Home from '@/pages/index';
import apiClient from '@/api/client';

jest.mock('@/api/client', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

jest.mock('next/link', () => {
  return ({ children, href }: any) => <a href={href}>{children}</a>;
});

const mockRecipes = [
  { id: 1, title: 'Test Recipe', description: 'Desc', image_url: '', prep_time: 10, cook_time: 15, servings: 4, created_at: '2024-01-01' },
  { id: 2, title: 'Quick Meal', description: 'Fast', image_url: '', prep_time: 5, cook_time: 10, servings: 2, created_at: '2024-01-02' },
];

describe('Home page', () => {
  it('renders featured recipes after loading', async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({ data: mockRecipes });
    render(<Home />);
    await waitFor(() => {
      expect(screen.getByText('Test Recipe')).toBeInTheDocument();
    });
    expect(screen.getByText('Featured Recipes')).toBeInTheDocument();
  });

  it('shows error state on API failure', async () => {
    (apiClient.get as jest.Mock).mockRejectedValue(new Error('fail'));
    render(<Home />);
    await waitFor(() => {
      expect(screen.getByText('Failed to load recipes')).toBeInTheDocument();
    });
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    (apiClient.get as jest.Mock).mockReturnValue(new Promise(() => {}));
    render(<Home />);
    expect(screen.getByText('Loading recipes…')).toBeInTheDocument();
  });
});