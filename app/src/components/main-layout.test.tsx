import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { MainLayout } from './main-layout';

// Helper to render MainLayout with Router context
const renderWithRouter = (ui: React.ReactElement) => {
  return render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={ui}>
          <Route
            index
            element={<div data-testid="outlet-content">Outlet Content</div>}
          />
        </Route>
      </Routes>
    </MemoryRouter>
  );
};

describe('MainLayout', () => {
  it('renders the layout with the title', () => {
    renderWithRouter(<MainLayout />);

    // Check for the title
    expect(screen.getByText('Support Tickets')).toBeInTheDocument();
    expect(screen.getByText('Support Tickets')).toHaveClass('text-3xl');
    expect(screen.getByText('Support Tickets')).toHaveClass('font-bold');
  });

  it('renders children content through outlet', () => {
    renderWithRouter(<MainLayout />);

    // Check that outlet content renders
    expect(screen.getByTestId('outlet-content')).toBeInTheDocument();
    expect(screen.getByText('Outlet Content')).toBeInTheDocument();
  });

  it('applies correct styling to the container', () => {
    renderWithRouter(<MainLayout />);

    // Check container styling
    const container = screen.getByText('Support Tickets').closest('div');
    expect(container).toHaveClass('container');
    expect(container).toHaveClass('mx-auto');
    expect(container).toHaveClass('p-6');

    // Check background styling
    const bgElement = container?.parentElement;
    expect(bgElement).toHaveClass('bg-gray-200');
    expect(bgElement).toHaveClass('min-h-screen');
  });

  it('maintains consistent spacing', () => {
    renderWithRouter(<MainLayout />);

    // Check spacing between title and content
    const title = screen.getByText('Support Tickets');
    expect(title).toHaveClass('mb-6');
  });
});
