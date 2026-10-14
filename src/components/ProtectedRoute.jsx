import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/authContextValue';

export default function ProtectedRoute({ children, allowGuest = false }) {
  const { auth, user, logout } = useAuthContext();
  const location = useLocation();
  if (!auth && !allowGuest) {
    const next = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to={`/login?next=${encodeURIComponent(next)}`} replace />;
  }
  if (auth && !user?.role) return <Navigate to="/login?expired=1" replace />;
  if (auth && user.role !== 'CUSTOMER') return <RoleRestricted role={user.role} logout={logout} />;
  return children || <Outlet />;
}

function RoleRestricted({ role, logout }) {
  return (
    <main className="grid min-h-[65vh] place-items-center px-4 py-10">
      <section className="w-full max-w-lg rounded-3xl border border-line bg-white p-7 text-center shadow-sm sm:p-9">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[.18em] text-primary">Customer account required</p>
        <h1 className="mt-3 font-syne text-2xl font-extrabold text-on-surface">This account belongs in its own portal.</h1>
        <p className="mt-3 text-sm leading-6 text-on-surface-variant">You are signed in with the <strong>{role}</strong> role. Customer orders and profile tools are available only to customer accounts.</p>
        <button className="mt-6 min-h-11 rounded-xl bg-primary px-5 text-sm font-bold text-white hover:bg-primary-container" onClick={() => logout()} type="button">Sign out</button>
      </section>
    </main>
  );
}
