import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AddMealModal from '../components/AddMealModal';

const recipes = [
  { id: 1, title: 'Pasta', description: '', ingredients: '', instructions: '', image_url: '', prep_time: 20, servings: 4 },
  { id: 2, title: 'Salad', description: '', ingredients: '', instructions: '', image_url: '', prep_time: 10, servings: 2 },
];

describe('AddMealModal', () => {
  it('renders recipes and filters by search', () => {
    render(<AddMealModal recipes={recipes} mealType="lunch" date="2025-01-06" onSubmit={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByText('Pasta')).toBeTruthy();
    expect(screen.getByText('Salad')).toBeTruthy();
    fireEvent.change(screen.getByPlaceholderText('Search recipes…'), { target: { value: 'sal' } });
    expect(screen.queryByText('Pasta')).toBeNull();
    expect(screen.getByText('Salad')).toBeTruthy();
  });

  it('calls onSubmit with recipe id when clicked', () => {
    const onSubmit = vi.fn();
    render(<AddMealModal recipes={recipes} mealType="dinner" date="2025-01-06" onSubmit={onSubmit} onClose={vi.fn()} />);
    fireEvent.click(screen.getByText('Pasta'));
    expect(onSubmit).toHaveBeenCalledWith(1);
  });
});