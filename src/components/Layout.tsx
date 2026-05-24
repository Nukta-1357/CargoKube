import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';
import BackgroundEffects from './BackgroundEffects';

export default function Layout() {
  return (
    <div className="flex h-screen bg-[#050816] overflow-hidden relative">
      <BackgroundEffects />
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader />
        <main className="flex-1 overflow-y-auto p-6 relative z-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
