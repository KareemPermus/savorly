import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';

describe('AppLayout', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('renders children content', () => {
    render(
      <BrowserRouter>
        <AppLayout><div>Test Content</div></AppLayout>
      </BrowserRouter>
    );
    expect(screen.getByText('Test Content')).toBeDefined();
  });

  it('has clickable nav links', () => {
    render(
      <BrowserRouter>
        <AppLayout><div>Child</div></AppLayout>
      </BrowserRouter>
    );
    const recipesLink = screen.getByText('Recipes');
    fireEvent.click(recipesLink);
    expect(recipesLink.closest('a')).toBeDefined();
  });

  it('renders dark mode toggle button', () => {
    render(
      <BrowserRouter>
        <AppLayout><div>Child</div></AppLayout>
      </BrowserRouter>
    );
    expect(screen.getByText('Dark mode')).toBeDefined();
  });

  it('toggles to dark mode on click', () => {
    render(
      <BrowserRouter>
        <AppLayout><div>Child</div></AppLayout>
      </BrowserRouter>
    );
    const toggle = screen.getByText('Dark mode');
    fireEvent.click(toggle);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(screen.getByText('Light mode')).toBeDefined();
  });

  it('toggles back to light mode', () => {
    render(
      <BrowserRouter>
        <AppLayout><div>Child</div></AppLayout>
      </BrowserRouter>
    );
    fireEvent.click(screen.getByText('Dark mode'));
    fireEvent.click(screen.getByText('Light mode'));
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('persists theme preference in localStorage', () => {
    render(
      <BrowserRouter>
        <AppLayout><div>Child</div></AppLayout>
      </BrowserRouter>
    );
    fireEvent.click(screen.getByText('Dark mode'));
    expect(localStorage.getItem('savorly-theme')).toBe('dark');
  });
});