import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SupportTicketTable } from '../components/support-ticket-table';
import type { SupportTicket } from '../schemas/support-ticket.schema';
import { CreateTicketModal } from '../components/create-ticket-modal';
import { DeleteConfirmationModal } from '../components/delete-confirmation-modal';
import {
  fetchSupportTickets,
  createSupportTicket,
  deleteSupportTicket,
} from '../api/support-ticket-api';

function HomePage() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<SupportTicket | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getTickets = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedTickets = await fetchSupportTickets();
        setTickets(fetchedTickets);
      } catch (error) {
        console.error('Failed to fetch tickets:', error);
        setError('Failed to load tickets. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    getTickets();
  }, []);

  const handleEdit = (ticket: SupportTicket) => {
    navigate(`/edit/${ticket.id}`);
  };

  const handleDelete = (ticket: SupportTicket) => {
    setTicketToDelete(ticket);
  };

  const handleConfirmDelete = async (ticket: SupportTicket) => {
    setError(null);
    try {
      await deleteSupportTicket(ticket.id);
      setTickets(tickets.filter((t) => t.id !== ticket.id));
      setTicketToDelete(null);
    } catch (error) {
      console.error('Failed to delete ticket:', error);
      setError('Failed to delete ticket. Please try again.');
    }
  };

  const handleCreate = async (
    newTicket: Pick<SupportTicket, 'title' | 'description' | 'priority'>
  ) => {
    setError(null);
    try {
      const createdTicket = await createSupportTicket(newTicket);
      setTickets([...tickets, createdTicket]);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Failed to create ticket:', error);
      setError('Failed to create ticket. Please try again.');
    }
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}
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
            onCreate={handleCreate}
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
