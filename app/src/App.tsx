import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import type { SupportTicket } from './types/support-ticket';
import { MainLayout } from './components/main-layout';
import { HomePage } from './pages/home-page';
import { EditTicketPage } from './pages/edit-ticket-page';

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

  useEffect(() => {
    // fetch('http://localhost:3000/support-tickets')
    //   .then((res) => res.json())
    //   .then((res) => {
    //     setTickets(res.data);
    //   });
  }, []);

  const handleCreate = (newTicket: SupportTicket) => {
    setTickets([...tickets, newTicket]);
  };

  const handleSave = (updatedTicket: SupportTicket) => {
    setTickets(
      tickets.map((t) => (t.id === updatedTicket.id ? updatedTicket : t))
    );
  };

  const handleDelete = (ticket: SupportTicket) => {
    setTickets(tickets.filter((t) => t.id !== ticket.id));
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route
            index
            element={
              <HomePage
                tickets={tickets}
                onCreateTicket={handleCreate}
                onDeleteTicket={handleDelete}
              />
            }
          />
          <Route
            path="edit/:id"
            element={<EditTicketPage tickets={tickets} onSave={handleSave} />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
