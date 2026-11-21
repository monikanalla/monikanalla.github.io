import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { BrandLogo } from '../BrandLogo';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';

const links = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'The Salon' },
  { to: '/contact', label: 'Visit' },
];

export function Navbar() {
  const { settings } = useSettings();
  const { count, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      {settings.announcement ? (
        <div className="bg-char px-4 py-2 text-center text-[9px] font-semibold uppercase tracking-[0.24em] text-paper">
          {settings.announcement}
        </div>
      ) : null}

      <header
        className={`sticky top-0 z-50 transition duration-500 ease-luxe ${
          scrolled ? 'border-b border-char/10 bg-bone/85 backdrop-blur-xl' : 'bg-transparent'
        }`}
      >
        <div className="container-x flex h-[76px] items-center justify-between">
          <Link to="/" className="flex items-center" aria-label={`${settings.brandName} — home`}>
            <BrandLogo />
          </Link>

          <nav className="hidden items-center gap-9 md:flex" aria-label="Primary">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `relative text-[10px] font-semibold uppercase tracking-[0.22em] transition ${
                    isActive ? 'text-char' : 'text-ash hover:text-char'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    <span
                      className={`absolute -bottom-2 left-0 h-px w-full origin-left bg-wine-500 transition-transform duration-300 ${
                        isActive ? 'scale-x-100' : 'scale-x-0'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={openCart}
              className="group flex items-center gap-2 rounded-full bg-char px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-paper transition hover:bg-wine-500"
            >
              Appointment
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-paper/15 px-1 text-[10px] font-semibold tabular-nums text-paper">
                {count}
              </span>
            </button>

            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-char/20 text-char md:hidden"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-label="Toggle menu"
            >
              <span className="text-sm">{menuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>

        {menuOpen ? (
          <div className="border-t border-char/10 bg-bone/95 px-5 pb-6 pt-2 backdrop-blur-xl md:hidden">
            <nav className="flex flex-col" aria-label="Mobile">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `border-b border-char/10 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] ${
                      isActive ? 'text-wine-500' : 'text-ash'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>
        ) : null}
      </header>
    </>
  );
}
