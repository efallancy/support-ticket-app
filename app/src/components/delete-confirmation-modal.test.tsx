import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeleteConfirmationModal } from './delete-confirmation-modal';
import { sampleTickets } from '../test/utils';

describe('DeleteConfirmationModal', () => {
  const mockOnConfirm = vi.fn();
  const mockOnCancel = vi.fn();
  const testTicket = sampleTickets[0];

  beforeEach(() => {
    mockOnConfirm.mockReset();
    mockOnCancel.mockReset();
  });

  it('renders the confirmation modal with ticket title', () => {
    render(
      <DeleteConfirmationModal
        ticket={testTicket}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    // Check for modal title
    expect(screen.getByText('Confirm Delete')).toBeInTheDocument();

    // Check that the ticket title appears in the confirmation message
    expect(screen.getByText(/Login Issue/)).toBeInTheDocument();

    // Check for confirmation message
    expect(
      screen.getByText(/Are you sure you want to delete the ticket/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/This action cannot be undone./)
    ).toBeInTheDocument();
  });

  it('calls onCancel when Cancel button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <DeleteConfirmationModal
        ticket={testTicket}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  it('calls onConfirm with ticket when Delete button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <DeleteConfirmationModal
        ticket={testTicket}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /Delete/i });
    await user.click(deleteButton);

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    expect(mockOnConfirm).toHaveBeenCalledWith(testTicket);
    expect(mockOnCancel).not.toHaveBeenCalled();
  });

  it('renders the cancel and delete buttons with correct styling', () => {
    render(
      <DeleteConfirmationModal
        ticket={testTicket}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    const deleteButton = screen.getByRole('button', { name: /Delete/i });

    // Check cancel button styling
    expect(cancelButton).toHaveClass('bg-gray-300');
    expect(cancelButton).toHaveClass('text-gray-800');

    // Check delete button styling
    expect(deleteButton).toHaveClass('bg-red-500');
    expect(deleteButton).toHaveClass('text-white');
  });

  it('displays the modal with correct overlay', () => {
    render(
      <DeleteConfirmationModal
        ticket={testTicket}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    // Check for modal overlay
    const overlay = screen.getByText('Confirm Delete').closest('div');
    expect(overlay?.parentElement).toHaveClass('fixed');
    expect(overlay?.parentElement).toHaveClass('inset-0');
    expect(overlay?.parentElement).toHaveClass('bg-gray-100');
    expect(overlay?.parentElement).toHaveClass('bg-opacity-50');
  });
});
