import { Outlet } from 'react-router-dom';

function MainLayout() {
  return (
    <div className="bg-gray-200 min-h-screen">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Support Tickets</h1>
        <Outlet />
      </div>
    </div>
  );
}

export { MainLayout };
