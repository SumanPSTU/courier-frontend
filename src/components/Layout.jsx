import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import PageTopBar from './PageTopBar';

export default function Layout({ marketing = false }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <PageTopBar />
      <main className={`min-w-0 flex-1 ${marketing ? 'w-full bg-surface' : ''}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
