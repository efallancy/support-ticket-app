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
  checkSummaryAvailability,
  fetchTicketSummary,
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
  const [summaryAvailable, setSummaryAvailable] = useState(false);
  const [summaryMessage, setSummaryMessage] = useState<string | null>(null);
  const [isFetchingSummary, setIsFetchingSummary] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch tickets
        const fetchedTickets = await fetchSupportTickets();
        setTickets(fetchedTickets);

        // Check if summary feature is available
        const isSummaryAvailable = await checkSummaryAvailability();
        setSummaryAvailable(isSummaryAvailable);
      } catch (error) {
        console.error('Failed to fetch tickets:', error);
        setError('Failed to load tickets. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
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
      {summaryMessage && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6">
          <h3 className="font-semibold text-lg mb-2">Ticket Summary</h3>
          <div className="whitespace-pre-line">{summaryMessage}</div>
        </div>
      )}
      <div className="mb-6 flex justify-between align-baseline">
        <div className="flex gap-8">
          <div>
            <label className="block text-gray-700 mb-1">
              Status
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-2 border rounded block"
              >
                <option value="">All statuses</option>
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Closed</option>
                <option value="CLOSED">Closed</option>
              </select>
            </label>
          </div>
          <div>
            <label className="block text-gray-700 mb-1">
              Priority
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="p-2 border rounded block"
              >
                <option value="">All priorities</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </label>
          </div>
        </div>
        <div>
          <div className="flex gap-2">
            {summaryAvailable && (
              <button
                onClick={async () => {
                  setIsFetchingSummary(true);
                  try {
                    const summary = await fetchTicketSummary();
                    setSummaryMessage(summary);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } catch (error) {
                    console.error('Failed to fetch summary:', error);
                    setError('Failed to load summary. Please try again.');
                  } finally {
                    setIsFetchingSummary(false);
                  }
                }}
                disabled={isFetchingSummary}
                className={`px-4 py-2 text-white rounded ${
                  isFetchingSummary
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 hover:cursor-pointer'
                }`}
                aria-label="View AI-generated summary of tickets"
                title="Generate an AI summary of all tickets"
              >
                {isFetchingSummary
                  ? 'Generating Summary...'
                  : 'View AI Summary'}
              </button>
            )}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-700 hover:cursor-pointer"
            >
              New Ticket
            </button>
          </div>
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
