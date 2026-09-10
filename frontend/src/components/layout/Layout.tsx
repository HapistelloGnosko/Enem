import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function Layout() {
  return (
    <div className="flex min-h-screen bg-bg-primary text-text-primary">
      <Sidebar />
      <main className="flex-1 overflow-y-auto max-h-screen p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
