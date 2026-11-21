import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminAnalytics } from '../api/endpoints';
import type { Analytics } from '../api/types';

const RANGES = [7, 30, 90];

export function DashboardPage() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<Analytics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    adminAnalytics(days)
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Could not load analytics');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [days]);

  const peak = Math.max(1, ...(data?.series ?? []).map((row) => row.views));

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Overview</p>
          <h1 className="display-lg mt-2 text-champagne">Dashboard</h1>
        </div>

        <div className="flex gap-1 rounded-full border border-champagne/15 p-1">
          {RANGES.map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => setDays(range)}
              className={`rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] transition ${
                days === range ? 'bg-copper-400 text-onyx' : 'text-ash hover:text-champagne'
              }`}
            >
              {range}d
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <p className="mt-6 rounded-xl border border-red-400/30 bg-red-950/25 p-4 text-sm text-red-100">{error}</p>
      ) : null}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Page views', value: data?.totalViews ?? 0, hint: `last ${days} days` },
          { label: 'Services', value: data?.counts.products ?? 0, hint: 'in the catalogue', to: '/admin/services' },
          { label: 'Categories', value: data?.counts.categories ?? 0, hint: 'menu groups', to: '/admin/categories' },
          {
            label: 'Reviews to approve',
            value: data?.counts.pendingReviews ?? 0,
            hint: 'moderation queue',
            to: '/admin/reviews',
          },
        ].map((card) => (
          <div key={card.label} className="rounded-2xl border border-champagne/10 bg-coal/60 p-5">
            <p className="text-[10px] uppercase tracking-[0.18em] text-ash">{card.label}</p>
            <p className="mt-2 font-display text-4xl font-light text-champagne">
              {loading ? '—' : card.value}
            </p>
            {card.to ? (
              <Link to={card.to} className="mt-2 inline-block text-[10px] uppercase tracking-[0.12em] text-copper-300 hover:text-copper-100">
                {card.hint} →
              </Link>
            ) : (
              <p className="mt-2 text-[10px] uppercase tracking-[0.12em] text-ash/70">{card.hint}</p>
            )}
          </div>
        ))}
      </div>

      <section className="mt-8 rounded-2xl border border-champagne/10 bg-coal/60 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl text-champagne">Traffic</h2>
          <p className="text-[10px] uppercase tracking-[0.14em] text-ash">Peak {peak} views / day</p>
        </div>

        {(data?.series ?? []).length === 0 ? (
          <p className="mt-8 text-sm text-ash">
            No page views recorded yet in this range. Views are counted on the public site only.
          </p>
        ) : (
          <div className="mt-6 flex h-40 items-end gap-1">
            {(data?.series ?? []).map((row) => (
              <div key={row.date} className="group relative flex flex-1 flex-col items-center justify-end">
                <div
                  className="w-full rounded-t bg-copper-400/70 transition group-hover:bg-copper-300"
                  style={{ height: `${Math.max(4, (row.views / peak) * 100)}%` }}
                />
                <span className="pointer-events-none absolute -top-7 hidden whitespace-nowrap rounded bg-onyx px-2 py-1 text-[10px] text-champagne group-hover:block">
                  {row.date} · {row.views}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link to="/admin/gallery" className="rounded-2xl border border-champagne/10 bg-coal/60 p-6 transition hover:border-copper-300/40">
          <p className="text-[10px] uppercase tracking-[0.18em] text-copper-300">Gallery</p>
          <p className="mt-2 font-display text-2xl text-champagne">Manage the slider</p>
          <p className="mt-1 text-[12px] text-ash">
            {data ? `${data.counts.gallery} tiles` : '—'} · toggle which ones appear in the homepage slider.
          </p>
        </Link>
        <Link to="/admin/settings" className="rounded-2xl border border-champagne/10 bg-coal/60 p-6 transition hover:border-copper-300/40">
          <p className="text-[10px] uppercase tracking-[0.18em] text-copper-300">Settings</p>
          <p className="mt-2 font-display text-2xl text-champagne">WhatsApp & copy</p>
          <p className="mt-1 text-[12px] text-ash">Set the booking number, address, hours and hero copy.</p>
        </Link>
      </div>
    </div>
  );
}
