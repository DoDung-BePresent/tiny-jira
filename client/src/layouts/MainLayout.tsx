/**
 * Node modules
 */
import { Outlet } from 'react-router-dom';

/**
 * Components
 */
import { Sidebar } from './components/Sidebar';
import { NavbarLeft } from './components/NavbarLeft';
import { Header } from './components/Header';

export const MainLayout = () => {
  return (
    <main className="flex h-screen">
      <NavbarLeft />
      <Sidebar className="ml-16" />
      <div className="flex-1 overflow-x-hidden p-10 py-5">
        <Header />
        <Outlet />
      </div>
    </main>
  );
};
