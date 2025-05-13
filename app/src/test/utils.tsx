import { type ReactElement } from 'react';
import {
  render,
  type RenderOptions,
  screen,
  waitFor,
} from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { vi, beforeEach } from 'vitest';
import { type SupportTicket } from '../schemas/support-ticket.schema';

/**
 * Custom render function that includes the router by default
 */
function renderWithRouter(
  ui: ReactElement,
  {
    initialEntries = ['/'],
    route = '/',
    ...renderOptions
  }: RenderOptions & {
    initialEntries?: string[];
    route?: string;
  } = {}
) {
  return {
    user: userEvent.setup(),
    ...render(
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path={route} element={ui} />
        </Routes>
      </MemoryRouter>,
      renderOptions
    ),
    // Include helpful testing utilities
    screen,
    waitFor,
  };
}

/**
 * Mock API functions that can be used in tests
 */
const mockFetchSupportTickets = vi.fn();
const mockCreateSupportTicket = vi.fn();
const mockUpdateSupportTicket = vi.fn();
const mockDeleteSupportTicket = vi.fn();
const mockFetchTicketSummary = vi.fn();
const mockCheckSummaryAvailability = vi.fn();

/**
 * Setup function to reset mocks before each test
 */
function setupApiMocks() {
  beforeEach(() => {
    mockFetchSupportTickets.mockReset();
    mockCreateSupportTicket.mockReset();
    mockUpdateSupportTicket.mockReset();
    mockDeleteSupportTicket.mockReset();
    mockFetchTicketSummary.mockReset();
    mockCheckSummaryAvailability.mockReset();
  });
}

// IMPORTANT: Don't use vi.mock here as it can interfere with
// component test files. Instead, import these mock functions
// and use vi.spyOn() in your test files.

/**
 * Sample test data representing support tickets
 */
const sampleTickets: SupportTicket[] = [
  {
    id: '1',
    title: 'Login Issue',
    description: 'User unable to log in with correct credentials.',
    priority: 'HIGH',
    status: 'OPEN',
    createdAt: '2023-01-15T14:30:00Z',
  },
  {
    id: '2',
    title: 'Payment Failure',
    description: 'Payment processing fails at checkout.',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    createdAt: '2023-01-14T09:15:00Z',
  },
  {
    id: '3',
    title: 'UI Bug',
    description: 'Button misalignment on mobile view.',
    priority: 'LOW',
    status: 'CLOSED',
    createdAt: '2023-01-13T16:45:00Z',
  },
];

export {
  renderWithRouter,
  mockFetchSupportTickets,
  mockCreateSupportTicket,
  mockUpdateSupportTicket,
  mockDeleteSupportTicket,
  mockFetchTicketSummary,
  mockCheckSummaryAvailability,
  setupApiMocks,
  sampleTickets,
};
