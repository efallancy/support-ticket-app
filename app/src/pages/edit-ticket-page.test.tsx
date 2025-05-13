import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EditTicketPage } from './edit-ticket-page';
import { sampleTickets } from '../test/utils';

// Mock the actual imported functions
import * as apiModule from '../api/support-ticket-api';
import * as schemaModule from '../schemas/support-ticket.schema';

// Create mock implementations
const mockNavigate = vi.fn();
const mockFetchSupportTickets = vi.fn();
const mockUpdateSupportTicket = vi.fn();

// Mock the React Router's navigate function
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: vi.fn().mockReturnValue({ id: '1' }),
    useNavigate: () => mockNavigate,
  };
});

describe('EditTicketPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock API functions
    vi.spyOn(apiModule, 'fetchSupportTickets').mockImplementation(
      mockFetchSupportTickets
    );
    vi.spyOn(apiModule, 'updateSupportTicket').mockImplementation(
      mockUpdateSupportTicket
    );

    // Set up default responses
    mockFetchSupportTickets.mockResolvedValue(sampleTickets);
    mockUpdateSupportTicket.mockResolvedValue(undefined);

    // Mock schema validation
    if (schemaModule.supportTicketUpdateSchema) {
      vi.spyOn(
        schemaModule.supportTicketUpdateSchema,
        'safeParse'
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ).mockImplementation((data: any): any => {
        if (!data.title || !data.description) {
          return {
            success: false,
            error: {
              errors: [{ message: 'Title and description are required' }],
            },
          };
        }
        return {
          success: true,
          data,
        };
      });
    }
  });

  it('shows loading state initially', () => {
    render(<EditTicketPage />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('fetches ticket data on load', async () => {
    render(<EditTicketPage />);

    await waitFor(() => {
      expect(mockFetchSupportTickets).toHaveBeenCalledTimes(1);
    });
  });

  it('displays error when ticket is not found', async () => {
    // Return empty array to simulate ticket not found
    mockFetchSupportTickets.mockResolvedValueOnce([]);

    render(<EditTicketPage />);

    await waitFor(() => {
      expect(screen.getByText(/Ticket not found/i)).toBeInTheDocument();
    });
  });

  it('displays form with ticket data when loaded', async () => {
    render(<EditTicketPage />);

    await waitFor(() => {
      expect(screen.getByText(/Edit Ticket/i)).toBeInTheDocument();
    });

    // Check if the title field exists and contains correct data
    const titleInput =
      screen.getByRole('textbox', { name: /title/i }) ||
      screen.getByLabelText(/title/i, { exact: false }) ||
      screen.getAllByRole('textbox')[0];

    expect(titleInput).toBeInTheDocument();
    expect(titleInput).toHaveValue(sampleTickets[0].title);

    // Find status and priority selects by their options
    expect(screen.getByText(/Open/i)).toBeInTheDocument();
    expect(screen.getByText(/High/i)).toBeInTheDocument();
  });

  it('navigates back when cancel is clicked', async () => {
    const user = userEvent.setup();

    render(<EditTicketPage />);

    await waitFor(() => {
      expect(screen.getByText(/Edit Ticket/i)).toBeInTheDocument();
    });

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    await user.click(cancelButton);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('handles API fetch errors gracefully', async () => {
    // Simulate API error
    mockFetchSupportTickets.mockRejectedValueOnce(new Error('Network error'));

    render(<EditTicketPage />);

    await waitFor(() => {
      expect(
        screen.getByText(/Failed to load ticket data/i)
      ).toBeInTheDocument();
    });

    // Check for back button
    const backButton = screen.getByRole('button', { name: /Back to Tickets/i });
    expect(backButton).toBeInTheDocument();
  });

  it('submits updated data when save is clicked', async () => {
    const user = userEvent.setup();

    render(<EditTicketPage />);

    await waitFor(() => {
      expect(screen.getByText(/Edit Ticket/i)).toBeInTheDocument();
    });

    // Find the save button
    const saveButton = screen.getByRole('button', { name: /Save/i });

    // Click save button to submit the form
    await user.click(saveButton);

    // Verify API call and navigation
    await waitFor(() => {
      expect(mockUpdateSupportTicket).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('shows error message when update fails', async () => {
    const user = userEvent.setup();

    // Set up the API to reject
    mockUpdateSupportTicket.mockRejectedValueOnce(
      new Error('Failed to update')
    );

    render(<EditTicketPage />);

    await waitFor(() => {
      expect(screen.getByText(/Edit Ticket/i)).toBeInTheDocument();
    });

    // Find the save button
    const saveButton = screen.getByRole('button', { name: /Save/i });

    // Click save button
    await user.click(saveButton);

    // Check for error message
    await waitFor(() => {
      expect(
        screen.getByText(/unexpected error occurred/i)
      ).toBeInTheDocument();
    });
  });
});
