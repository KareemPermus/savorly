import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Recipes from '../pages/Recipes';

vi.mock('../api/client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

import apiClient from '../api/client';

const mockRecipes = [
  { id: 1, title: 'Pasta Primavera', description: 'Fresh veggies', ingredients: 'pasta\nveggies', instructions: 'Cook it', image_url: '', prep_time: 30, servings: 4 },
  { id: 2, title: 'Tacos', description: 'Spicy tacos', ingredients: 'tortillas\nmeat', instructions: 'Assemble', image_url: '', prep_time: 20, servings: 2 },
];

describe('Recipes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (apiClient.get as any).mockResolvedValue({ data: mockRecipes });
  });

  it('renders recipes after loading', async () => {
    render(<Recipes />);
    await waitFor(() => {
      expect(screen.getByText('Pasta Primavera')).toBeTruthy();
      expect(screen.getByText('Tacos')).toBeTruthy();
    });
  });

  it('filters recipes by search', async () => {
    render(<Recipes />);
    await waitFor(() => screen.getByText('Pasta Primavera'));
    const input = screen.getByPlaceholderText('Search recipes, ingredients…');
    fireEvent.change(input, { target: { value: 'taco' } });
    expect(screen.queryByText('Pasta Primavera')).toBeNull();
    expect(screen.getByText('Tacos')).toBeTruthy();
  });

  it('opens new recipe form on button click', async () => {
    render(<Recipes />);
    await waitFor(() => screen.getByText('All Recipes'));
    fireEvent.click(screen.getByText('New Recipe'));
    expect(screen.getByPlaceholderText('Title')).toBeTruthy();
  });

  it('shows empty state when no recipes', async () => {
    (apiClient.get as any).mockResolvedValue({ data: [] });
    render(<Recipes />);
    await waitFor(() => {
      expect(screen.getByText('No recipes found. Add your first recipe!')).toBeTruthy();
    });
  });
});