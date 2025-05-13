import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/main-layout';
import { HomePage } from './pages/home-page';
import { EditTicketPage } from './pages/edit-ticket-page';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="edit/:id" element={<EditTicketPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
