import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { SupportTicket } from '../schemas/support-ticket.schema';
import {
  fetchSupportTickets,
  updateSupportTicket,
} from '../api/support-ticket-api';
import { supportTicketUpdateSchema } from '../schemas/support-ticket.schema';

function EditTicketPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SupportTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTicket = async () => {
      if (!id) return;

      try {
        const tickets = await fetchSupportTickets();
        const ticketToEdit = tickets.find((ticket) => ticket.id === id);

        if (ticketToEdit) {
          setFormData({ ...ticketToEdit });
        } else {
          setError('Ticket not found');
        }
      } catch (err) {
        console.error('Error fetching ticket:', err);
        setError('Failed to load ticket data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    if (!formData) return;

    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData) return;

    try {
      // Update page state
      setSaving(true);
      setSaveError('');

      const maybeValidFormData = supportTicketUpdateSchema.safeParse(formData);

      if (!maybeValidFormData.success) {
        const formValidationErrorMessage = maybeValidFormData.error.errors
          .map((err) => err.message)
          .join(', ');

        setSaveError(
          `Invalid form data. Please check the following: ${formValidationErrorMessage}`
        );
        return;
      }

      await updateSupportTicket(formData);
      navigate('/');
    } catch (error) {
      console.error('Error saving ticket:', error);
      setSaveError('An unexpected error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <button
          onClick={handleCancel}
          className="mt-4 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 hover:cursor-pointer"
        >
          Back to Tickets
        </button>
      </div>
    );
  }

  if (!formData) {
    return <div className="p-6">Something went wrong</div>;
  }

  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold mb-4">Edit Ticket</h2>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">
              Title
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">
              Description
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded h-32"
                required
              />
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-gray-700">
                Priority
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </label>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">
                Status
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </label>
            </div>
          </div>
          {saveError && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {saveError}
            </div>
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 hover:cursor-pointer"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 hover:cursor-pointer disabled:bg-blue-300"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export { EditTicketPage };
