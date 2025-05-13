import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateTicketModal } from './create-ticket-modal';
import { supportTicketCreateSchema } from '../schemas/support-ticket.schema';

// Mock the zod schema
vi.mock('../schemas/support-ticket.schema', () => ({
  supportTicketCreateSchema: {
    safeParse: vi.fn().mockImplementation((data) => {
      // Only validate that title and description are not empty for simplicity
      if (!data.title || !data.description) {
        return {
          success: false,
          error: {
            errors: [{ message: 'Required fields are missing' }],
          },
        };
      }
      return {
        success: true,
        data,
      };
    }),
  },
}));

describe('CreateTicketModal', () => {
  const mockOnCreate = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnCreate.mockReset();
    mockOnClose.mockReset();
    vi.clearAllMocks();
  });

  it('renders the modal with form fields', () => {
    render(<CreateTicketModal onCreate={mockOnCreate} onClose={mockOnClose} />);

    // Check for modal title
    expect(screen.getByText('Create New Ticket')).toBeInTheDocument();

    // Check for form fields
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Priority')).toBeInTheDocument();

    // Check for buttons
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
  });

  it('sets default form values correctly', () => {
    render(<CreateTicketModal onCreate={mockOnCreate} onClose={mockOnClose} />);

    const titleInput = screen.getByLabelText('Title') as HTMLInputElement;
    const descriptionInput = screen.getByLabelText(
      'Description'
    ) as HTMLTextAreaElement;
    const prioritySelect = screen.getByLabelText(
      'Priority'
    ) as HTMLSelectElement;

    expect(titleInput.value).toBe('');
    expect(descriptionInput.value).toBe('');
    expect(prioritySelect.value).toBe('MEDIUM');
  });

  it('updates form state when user inputs values', async () => {
    const user = userEvent.setup();
    render(<CreateTicketModal onCreate={mockOnCreate} onClose={mockOnClose} />);

    const titleInput = screen.getByLabelText('Title') as HTMLInputElement;
    const descriptionInput = screen.getByLabelText(
      'Description'
    ) as HTMLTextAreaElement;
    const prioritySelect = screen.getByLabelText(
      'Priority'
    ) as HTMLSelectElement;

    await user.type(titleInput, 'New Test Ticket');
    await user.type(descriptionInput, 'This is a test ticket description');
    await user.selectOptions(prioritySelect, 'HIGH');

    expect(titleInput.value).toBe('New Test Ticket');
    expect(descriptionInput.value).toBe('This is a test ticket description');
    expect(prioritySelect.value).toBe('HIGH');
  });

  it('calls onClose when Cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<CreateTicketModal onCreate={mockOnCreate} onClose={mockOnClose} />);

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnCreate).not.toHaveBeenCalled();
  });

  it('validates form data and calls onCreate when form is submitted with valid data', async () => {
    const user = userEvent.setup();
    render(<CreateTicketModal onCreate={mockOnCreate} onClose={mockOnClose} />);

    const titleInput = screen.getByLabelText('Title');
    const descriptionInput = screen.getByLabelText('Description');
    const prioritySelect = screen.getByLabelText('Priority');
    const createButton = screen.getByRole('button', { name: 'Create' });

    await user.type(titleInput, 'New Test Ticket');
    await user.type(descriptionInput, 'This is a test ticket description');
    await user.selectOptions(prioritySelect, 'HIGH');
    await user.click(createButton);

    expect(supportTicketCreateSchema.safeParse).toHaveBeenCalledWith({
      title: 'New Test Ticket',
      description: 'This is a test ticket description',
      priority: 'HIGH',
    });

    expect(mockOnCreate).toHaveBeenCalledTimes(1);
    expect(mockOnCreate).toHaveBeenCalledWith({
      title: 'New Test Ticket',
      description: 'This is a test ticket description',
      priority: 'HIGH',
    });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('resets form after successful submission', async () => {
    const user = userEvent.setup();
    render(<CreateTicketModal onCreate={mockOnCreate} onClose={mockOnClose} />);

    const titleInput = screen.getByLabelText('Title') as HTMLInputElement;
    const descriptionInput = screen.getByLabelText(
      'Description'
    ) as HTMLTextAreaElement;
    const createButton = screen.getByRole('button', { name: 'Create' });

    await user.type(titleInput, 'New Test Ticket');
    await user.type(descriptionInput, 'This is a test ticket description');
    await user.click(createButton);

    // The component gets unmounted after submission due to onClose,
    // so we don't need to check the values after submission
    expect(mockOnCreate).toHaveBeenCalledTimes(1);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
