import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('App', () => {
  it('renders the sidebar with brand name', () => {
    render(<App />);
    expect(screen.getAllByText('Savorly').length).toBeGreaterThan(0);
  });

  it('renders navigation links for MealPlanner and Recipes', () => {
    render(<App />);
    expect(screen.getByText('MealPlanner')).toBeDefined();
    expect(screen.getByText('Recipes')).toBeDefined();
  });
});