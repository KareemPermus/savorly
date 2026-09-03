import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: () => ({ pathname: '/', push: jest.fn() }),
}));

import AppLayout from '@/components/layout/AppLayout';

describe('AppLayout', () => {
  it('renders brand name and nav items', () => {
    render(<AppLayout><div>Test</div></AppLayout>);
    expect(screen.getAllByText('Savorly').length).toBeGreaterThan(0);
    expect(screen.getByText('Discover')).toBeInTheDocument();
    expect(screen.getByText('My Recipes')).toBeInTheDocument();
    expect(screen.getByText('Meal Planner')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(<AppLayout><div>Child Content</div></AppLayout>);
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });
});