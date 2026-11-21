import { NavLink, Outlet, Link } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthContext';

const NAV = [
  { to: 'dashboard', label: 'Dashboard' },
  { to: 'services', label: 'Services' },
  { to: 'categories', label: 'Categories' },
  { to: 'reviews', label: 'Reviews' },
  { to: 'gallery', label: 'Gallery & slider' },
  { to: 'settings', label: 'Settings' },
];

export function AdminLayout() {
  const { admin, signOut } = useAdminAuth();

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[248px_1fr]">
      <aside className="border-b border-champagne/10 bg-ink/70 lg:min-h-screen lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-5 py-5">
          <div>
            <p className="font-display text-xl tracking-[0.16em] text-champagne">HAIR5S</p>
            <p className="text-[9px] uppercase tracking-[0.22em] text-copper-300">Admin panel</p>
          </div>
          <Link to="/" className="text-[10px] uppercase tracking-[0.16em] text-ash hover:text-champagne">
            Site ↗
          </Link>
        </div>

        <nav className="flex gap-1 overflow-x-auto px-3 pb-4 no-scrollbar lg:flex-col lg:overflow-visible" aria-label="Admin">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-lg px-3 py-2.5 text-[11px] uppercase tracking-[0.16em] transition ${
                  isActive ? 'bg-copper-400/15 text-copper-100' : 'text-ash hover:bg-champagne/5 hover:text-champagne'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden border-t border-champagne/10 px-5 py-5 lg:block">
          <p className="truncate text-[11px] text-ash">{admin?.email}</p>
          <div className="mt-3 flex flex-col gap-2">
            <NavLink
              to="change-password"
              className="text-[10px] uppercase tracking-[0.16em] text-ash hover:text-champagne"
            >
              Change password
            </NavLink>
            <button
              type="button"
              onClick={signOut}
              className="text-left text-[10px] uppercase tracking-[0.16em] text-copper-300 hover:text-copper-100"
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="flex items-center justify-between border-b border-champagne/10 px-5 py-4 lg:hidden">
          <p className="text-[10px] uppercase tracking-[0.18em] text-ash">{admin?.email}</p>
          <button type="button" onClick={signOut} className="text-[10px] uppercase tracking-[0.18em] text-copper-300">
            Sign out
          </button>
        </header>

        <div className="mx-auto w-full max-w-[1180px] px-5 py-8 sm:px-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
