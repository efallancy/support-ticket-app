import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SupportTicketTable } from './support-ticket-table';
import { sampleTickets } from '../test/utils';

describe('SupportTicketTable', () => {
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockOnEdit.mockReset();
    mockOnDelete.mockReset();
  });

  // Add a test helper function
  const renderTable = (tickets = sampleTickets) => {
    return render(
      <SupportTicketTable
        tickets={tickets}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
  };

  it('renders the table with headers', () => {
    renderTable();

    // Check table headers using case-insensitive matchers for more resilience
    const expectedHeaders = [
      'Title',
      'Description',
      'Priority',
      'Status',
      'Created At',
      'Actions',
    ];

    expectedHeaders.forEach((header) => {
      expect(
        screen.getByRole('columnheader', { name: new RegExp(header, 'i') })
      ).toBeInTheDocument();
    });
  });

  it('displays ticket data correctly', () => {
    renderTable();

    // Check if ticket data is rendered
    for (const ticket of sampleTickets) {
      expect(screen.getByText(ticket.title)).toBeInTheDocument();

      // Use a safer approach for longer descriptions that might be truncated in the UI
      const descriptionElement = screen.getByText(
        (content, element) =>
          element?.tagName.toLowerCase() !== 'title' &&
          content.includes(ticket.description.substring(0, 20))
      );
      expect(descriptionElement).toBeInTheDocument();
    }

    // Check priorities are rendered correctly
    const priorities = ['HIGH', 'MEDIUM', 'LOW'];
    for (const priority of priorities) {
      const priorityElement = screen.getByText(priority);
      expect(priorityElement).toBeInTheDocument();
    }

    // Check statuses are rendered correctly
    const statuses = ['OPEN', 'IN_PROGRESS', 'CLOSED'];
    for (const status of statuses) {
      const statusElement = screen.getByText(status);
      expect(statusElement).toBeInTheDocument();
    }
  });

  it('displays message when no tickets available', () => {
    render(
      <SupportTicketTable
        tickets={[]}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(
      screen.getByText(
        'No tickets found. Try adjusting the filters or create a new ticket.'
      )
    ).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <SupportTicketTable
        tickets={sampleTickets}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButtons = screen.getAllByRole('button', { name: /Edit/i });
    expect(editButtons.length).toBeGreaterThan(0);
    await user.click(editButtons[0]); // Click first edit button

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
    expect(mockOnEdit).toHaveBeenCalledWith(sampleTickets[0]);
  });

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <SupportTicketTable
        tickets={sampleTickets}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const deleteButtons = screen.getAllByRole('button', { name: /Delete/i });
    expect(deleteButtons.length).toBeGreaterThan(0);
    await user.click(deleteButtons[1]); // Click second delete button

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith(sampleTickets[1]);
  });

  it('applies correct styles for different priorities', () => {
    render(
      <SupportTicketTable
        tickets={sampleTickets}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Find priority elements with more reliable selectors
    const priorities = {
      HIGH: screen.getByText('HIGH'),
      MEDIUM: screen.getByText('MEDIUM'),
      LOW: screen.getByText('LOW'),
    };

    // Get closest span elements
    const highPriority = priorities.HIGH.closest('span');
    const mediumPriority = priorities.MEDIUM.closest('span');
    const lowPriority = priorities.LOW.closest('span');

    // Ensure elements were found before checking classes
    expect(highPriority).not.toBeNull();
    expect(mediumPriority).not.toBeNull();
    expect(lowPriority).not.toBeNull();

    // Check classes
    expect(highPriority).toHaveClass('bg-red-200');
    expect(mediumPriority).toHaveClass('bg-yellow-200');
    expect(lowPriority).toHaveClass('bg-green-200');
  });

  it('applies correct styles for different statuses', () => {
    render(
      <SupportTicketTable
        tickets={sampleTickets}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Find status elements with more reliable selectors
    const statuses = {
      OPEN: screen.getByText('OPEN'),
      IN_PROGRESS: screen.getByText('IN_PROGRESS'),
      CLOSED: screen.getByText('CLOSED'),
    };

    // Get closest span elements
    const openStatus = statuses.OPEN.closest('span');
    const inProgressStatus = statuses.IN_PROGRESS.closest('span');
    const closedStatus = statuses.CLOSED.closest('span');

    // Ensure elements were found before checking classes
    expect(openStatus).not.toBeNull();
    expect(inProgressStatus).not.toBeNull();
    expect(closedStatus).not.toBeNull();

    // Check classes
    expect(openStatus).toHaveClass('bg-blue-200');
    expect(inProgressStatus).toHaveClass('bg-orange-200');
    expect(closedStatus).toHaveClass('bg-gray-200');
  });

  it('formats created date correctly', () => {
    // Mock the toLocaleString function to return a consistent value for testing
    const originalToLocaleString = Date.prototype.toLocaleString;
    const mockToLocaleString = vi.fn(() => '1/15/23, 2:30 PM');
    Date.prototype.toLocaleString = mockToLocaleString;

    render(
      <SupportTicketTable
        tickets={sampleTickets}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(mockToLocaleString).toHaveBeenCalled();
    const dateElements = screen.getAllByText('1/15/23, 2:30 PM');
    expect(dateElements.length).toBeGreaterThan(0);
    expect(dateElements[0]).toBeInTheDocument();

    // Restore original function
    Date.prototype.toLocaleString = originalToLocaleString;
  });
});
