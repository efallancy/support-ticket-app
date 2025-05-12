import { useState } from 'react';
import { EditTicketModal } from './components/edit-ticket-modal';
import {
  type SupportTicket,
  SupportTicketTable,
} from './components/support-ticket-table';
import { CreateTicketModal } from './components/create-ticket-modal';

const initialTickets: SupportTicket[] = [
  {
    id: '1',
    title: 'Login Issue',
    description: 'User unable to log in with correct credentials.',
    priority: 'High',
    status: 'Open',
    createdAt: new Date(2025, 5, 10, 14, 30),
  },
  {
    id: '2',
    title: 'Payment Failure',
    description: 'Payment processing fails at checkout.',
    priority: 'Medium',
    status: 'In Progress',
    createdAt: new Date(2025, 5, 9, 9, 15),
  },
  {
    id: '3',
    title: 'UI Bug',
    description: 'Button misalignment on mobile view.',
    priority: 'Low',
    status: 'Closed',
    createdAt: new Date(2025, 5, 8, 16, 45),
  },
];

function App() {
  const [tickets, setTickets] = useState(initialTickets);
  const [editingTicket, setEditingTicket] = useState<SupportTicket | null>(
    null
  );
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreate = (newTicket: SupportTicket) => {
    setTickets([...tickets, newTicket]);
  };

  const handleEdit = (ticket: SupportTicket) => {
    setEditingTicket(ticket);
  };

  const handleSave = (updatedTicket: SupportTicket) => {
    setTickets(
      tickets.map((t) => (t.id === updatedTicket.id ? updatedTicket : t))
    );
    setEditingTicket(null);
  };

  const handleDelete = (ticket: SupportTicket) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${ticket.title}" ticket?`
      )
    ) {
      setTickets(tickets.filter((t) => t.id !== ticket.id));
    }
  };

  const handleCloseModal = () => {
    setEditingTicket(null);
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
    <div className="bg-gray-200 min-h-screen">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Support Tickets</h1>
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
          {editingTicket && (
            <EditTicketModal
              ticket={editingTicket}
              onSave={handleSave}
              onClose={handleCloseModal}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
