import { Link } from 'react-router-dom';
import { BrandLogo } from '../BrandLogo';
import { useSettings } from '../../context/SettingsContext';

export function Footer() {
  const { settings } = useSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-char/10 bg-paper">
      <div className="container-x grid gap-12 py-16 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <BrandLogo className="h-11" />
          <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-ash">
            {settings.aboutCopy || 'A unisex salon in Mumbai — hair, skin and nails in one chair.'}
          </p>
          <p className="mt-6 font-display text-[10px] font-semibold uppercase tracking-[0.3em] text-wine-500">
            {settings.tagline}
          </p>
        </div>

        <div>
          <p className="eyebrow">Visit</p>
          <address className="mt-4 space-y-2 text-[13px] not-italic leading-relaxed text-ash">
            {settings.address ? <p>{settings.address}</p> : null}
            {settings.hours ? <p className="text-char/80">{settings.hours}</p> : null}
            {settings.phone ? (
              <p>
                <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="transition hover:text-wine-500">
                  {settings.phone}
                </a>
              </p>
            ) : null}
            {settings.email ? (
              <p>
                <a href={`mailto:${settings.email}`} className="transition hover:text-wine-500">
                  {settings.email}
                </a>
              </p>
            ) : null}
          </address>
        </div>

        <div>
          <p className="eyebrow">Explore</p>
          <nav className="mt-4 flex flex-col gap-2 text-[13px] text-ash" aria-label="Footer">
            <Link to="/services" className="transition hover:text-char">
              Service menu
            </Link>
            <Link to="/about" className="transition hover:text-char">
              The salon
            </Link>
            <Link to="/contact" className="transition hover:text-char">
              Find us
            </Link>
            {settings.instagram ? (
              <a
                href={settings.instagram}
                target="_blank"
                rel="noreferrer noopener"
                className="transition hover:text-char"
              >
                Instagram
              </a>
            ) : null}
            {settings.mapsUrl ? (
              <a href={settings.mapsUrl} target="_blank" rel="noreferrer noopener" className="transition hover:text-char">
                Google Maps
              </a>
            ) : null}
          </nav>
        </div>
      </div>

      <div className="container-x flex flex-col gap-4 border-t border-char/10 py-6 text-[9px] font-semibold uppercase tracking-[0.18em] text-ash/80 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {settings.brandName}. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <span>Photography from @hair5s</span>
          <Link to="/admin" className="transition hover:text-wine-500">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
