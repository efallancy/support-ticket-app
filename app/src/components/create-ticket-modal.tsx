import { useState } from 'react';
import type { SupportTicket } from './support-ticket-table';

type CreateTicketModalProps = {
  onCreate: (newTicket: SupportTicket) => void;
  onClose: () => void;
};

function CreateTicketModal({ onCreate, onClose }: CreateTicketModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Low',
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      alert('Title and Description are required.');
      return;
    }

    onCreate({
      ...formData,
      id: crypto.randomUUID(),
      status: 'Open', // Default status
      createdAt: new Date(),
    } as SupportTicket);

    setFormData({ title: '', description: '', priority: 'Low' });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Create New Ticket</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 hover:cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 hover:cursor-pointer"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export { CreateTicketModal };
