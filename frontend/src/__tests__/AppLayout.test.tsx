import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: () => ({ pathname: '/', push: jest.fn() }),
}));

import AppLayout from '@/components/layout/AppLayout';

describe('AppLayout', () => {
  it('renders brand name and nav links', () => {
    render(<AppLayout><div>child</div></AppLayout>);
    expect(screen.getAllByText('Savorly').length).toBeGreaterThan(0);
    expect(screen.getByText('Recipes')).toBeInTheDocument();
    expect(screen.getByText('Meal Planner')).toBeInTheDocument();
    expect(screen.getByText('child')).toBeInTheDocument();
  });
});