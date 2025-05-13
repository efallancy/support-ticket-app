import type { SupportTicket } from '../schemas/support-ticket.schema';

export type DeleteConfirmationModalProps = {
  ticket: SupportTicket;
  onConfirm: (ticket: SupportTicket) => void;
  onCancel: () => void;
};

function DeleteConfirmationModal({
  ticket,
  onConfirm,
  onCancel,
}: DeleteConfirmationModalProps) {
  return (
    <div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Confirm Delete</h2>
        <p className="mb-6">
          Are you sure you want to delete the ticket{' '}
          <span className="font-bold">"{ticket.title}"</span>? This action
          cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 hover:cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(ticket)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 hover:cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export { DeleteConfirmationModal };
