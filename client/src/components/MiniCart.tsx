import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { formatINR } from '../lib/format';
import { buildWhatsAppMessage, whatsappLink } from '../lib/whatsapp';

export function MiniCart() {
  const { items, isOpen, closeCart, remove, setQty, total, count } = useCart();
  const { settings } = useSettings();
  const [name, setName] = useState('');
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeCart();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  const link = whatsappLink(settings, buildWhatsAppMessage(settings, items, name));

  return (
    <div className="fixed inset-0 z-[80]">
      <button
        type="button"
        aria-label="Close appointment panel"
        onClick={closeCart}
        className="absolute inset-0 bg-onyx/70 backdrop-blur-sm"
      />

      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-champagne/10 bg-ink shadow-card">
        <header className="flex items-center justify-between border-b border-champagne/10 px-6 py-5">
          <div>
            <p className="eyebrow">Your appointment</p>
            <p className="mt-1 font-display text-2xl font-light">{count} service{count === 1 ? '' : 's'}</p>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-champagne/20 text-champagne transition hover:border-copper-300"
            aria-label="Close"
          >
            ✕
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <p className="font-display text-xl text-ash">Nothing selected yet.</p>
              <Link to="/services" onClick={closeCart} className="btn-ghost btn-sm">
                Browse the menu
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 rounded-xl border border-champagne/10 bg-coal/60 p-3">
                  {item.image ? (
                    <img src={item.image} alt="" className="h-20 w-16 shrink-0 rounded-lg object-cover" />
                  ) : null}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="truncate text-sm text-champagne">{item.name}</p>
                        {item.variant ? <p className="text-[11px] text-ash">{item.variant}</p> : null}
                        {item.duration ? (
                          <p className="mt-0.5 text-[10px] uppercase tracking-[0.12em] text-ash/70">{item.duration}</p>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(item.id)}
                        className="text-[11px] uppercase tracking-[0.12em] text-ash transition hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-full border border-champagne/15 px-2 py-1">
                        <button
                          type="button"
                          onClick={() => setQty(item.id, item.qty - 1)}
                          className="h-6 w-6 rounded-full text-sm text-ash transition hover:text-champagne"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="w-5 text-center text-xs">{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => setQty(item.id, item.qty + 1)}
                          className="h-6 w-6 rounded-full text-sm text-ash transition hover:text-champagne"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-sm text-champagne">{formatINR(item.price * item.qty)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 ? (
          <footer className="border-t border-champagne/10 bg-coal/40 px-6 py-5">
            <div className="mb-4 flex items-center justify-between text-sm">
              <span className="text-ash">Estimated total</span>
              <span className="font-display text-2xl font-light text-champagne">{formatINR(total)}</span>
            </div>

            <label className="label" htmlFor="booking-name">
              Your name
            </label>
            <input
              id="booking-name"
              className="input mb-4"
              placeholder="e.g. Ayesha"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={60}
            />

            {link ? (
              <a
                href={link}
                target="_blank"
                rel="noreferrer noopener"
                onClick={() => setSent(true)}
                className="btn w-full"
              >
                Send on WhatsApp
              </a>
            ) : (
              <button type="button" className="btn w-full" disabled>
                WhatsApp number not set
              </button>
            )}

            <p className="mt-3 text-center text-[10px] leading-relaxed text-ash/70">
              Final pricing is confirmed in the chair. No payment is taken on this site.
            </p>
            {sent ? (
              <p className="mt-2 text-center text-[11px] text-copper-200">
                Opening WhatsApp — send the message to confirm your slot.
              </p>
            ) : null}
          </footer>
        ) : null}
      </aside>
    </div>
  );
}
