import type { SupportTicket } from '../schemas/support-ticket.schema';

type SupportTicketTableProps = {
  tickets: SupportTicket[];
  onEdit: (ticket: SupportTicket) => void;
  onDelete: (ticket: SupportTicket) => void;
};

function SupportTicketTable({
  tickets,
  onEdit,
  onDelete,
}: SupportTicketTableProps) {
  return (
    <table className="min-w-full bg-white rounded-lg">
      <thead>
        <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
          <th className="py-3 px-6 text-left">Title</th>
          <th className="py-3 px-6 text-left">Description</th>
          <th className="py-3 px-6 text-left">Priority</th>
          <th className="py-3 px-6 text-left">Status</th>
          <th className="py-3 px-6 text-left">Created At</th>
          <th className="py-3 px-6 text-left">Actions</th>
        </tr>
      </thead>
      <tbody className="text-gray-600 text-sm font-light">
        {tickets.length ? (
          tickets.map((ticket, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 hover:bg-gray-50"
            >
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {ticket.title}
              </td>
              <td className="py-3 px-6 text-left">{ticket.description}</td>
              <td className="py-3 px-6 text-left">
                <span
                  className={`px-2 py-1 rounded ${
                    ticket.priority === 'HIGH'
                      ? 'bg-red-200 text-red-800'
                      : ticket.priority === 'MEDIUM'
                        ? 'bg-yellow-200 text-yellow-800'
                        : 'bg-green-200 text-green-800'
                  }`}
                >
                  {ticket.priority}
                </span>
              </td>
              <td className="py-3 px-6 text-left">
                <span
                  className={`px-2 py-1 rounded ${
                    ticket.status === 'OPEN'
                      ? 'bg-blue-200 text-blue-800'
                      : ticket.status === 'IN_PROGRESS'
                        ? 'bg-orange-200 text-orange-800'
                        : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {ticket.status}
                </span>
              </td>
              <td className="py-3 px-6 text-left">
                {new Date(ticket.createdAt).toLocaleString('en-US', {
                  dateStyle: 'short',
                  timeStyle: 'short',
                })}
              </td>
              <td className="py-3 px-6 text-left flex gap-2">
                <button
                  onClick={() => onEdit(ticket)}
                  className="px-3 py-1 rounded border-1 border-gray-300 text-gray-600 hover:text-gray-800 hover:bg-gray-200 hover:cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(ticket)}
                  className="px-3 py-1 rounded border-1 border-red-200 text-red-600 hover:text-red-500 hover:bg-red-100 hover:cursor-pointer"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr className="border-b border-gray-200 hover:bg-gray-50">
            <td colSpan={6} className="py-3 px-6 whitespace-nowrap text-center">
              No tickets found. Try adjusting the filters or create a new
              ticket.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export { SupportTicketTable };
