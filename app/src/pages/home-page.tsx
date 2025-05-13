import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SupportTicketTable } from '../components/support-ticket-table';
import type { SupportTicket } from '../types/support-ticket';
import { CreateTicketModal } from '../components/create-ticket-modal';
import { DeleteConfirmationModal } from '../components/delete-confirmation-modal';

type HomePageProps = {
  tickets: SupportTicket[];
  onCreateTicket: (newTicket: SupportTicket) => void;
  onDeleteTicket: (ticket: SupportTicket) => void;
};

function HomePage({ tickets, onCreateTicket, onDeleteTicket }: HomePageProps) {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<SupportTicket | null>(
    null
  );

  const handleEdit = (ticket: SupportTicket) => {
    navigate(`/edit/${ticket.id}`);
  };

  const handleDelete = (ticket: SupportTicket) => {
    setTicketToDelete(ticket);
  };

  const handleConfirmDelete = (ticket: SupportTicket) => {
    onDeleteTicket(ticket);
    setTicketToDelete(null);
  };

  const handleCancelDelete = () => {
    setTicketToDelete(null);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const filteredTickets = tickets.filter((ticket) => {
    return (
      (statusFilter ? ticket.status === statusFilter : true) &&
      (priorityFilter ? ticket.priority === priorityFilter : true)
    );
  });

  return (
    <>
      <div className="mb-6 flex justify-between align-baseline">
        <div className="flex gap-4">
          <div>
            <label className="block text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="">All statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Priority</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="">All priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
        <div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-700 hover:cursor-pointer"
          >
            New Ticket
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <SupportTicketTable
          tickets={filteredTickets}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        {isCreateModalOpen && (
          <CreateTicketModal
            onCreate={onCreateTicket}
            onClose={handleCloseCreateModal}
          />
        )}
        {ticketToDelete && (
          <DeleteConfirmationModal
            ticket={ticketToDelete}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        )}
      </div>
    </>
  );
}

export { HomePage };