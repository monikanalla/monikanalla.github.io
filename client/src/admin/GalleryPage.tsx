import { useCallback, useEffect, useState, type FormEvent } from 'react';
import {
  adminCreateGalleryItem,
  adminDeleteGalleryItem,
  adminGallery,
  adminReorderGallery,
  adminUpdateGalleryItem,
} from '../api/endpoints';
import type { GalleryItem } from '../api/types';
import { useToast } from '../context/ToastContext';

export function GalleryPage() {
  const { push } = useToast();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ image: '', title: '', caption: '', inSlider: true });
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await adminGallery());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load gallery');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      await adminCreateGalleryItem({
        image: form.image.trim(),
        title: form.title.trim(),
        caption: form.caption.trim(),
        inSlider: form.inSlider,
        order: items.length,
      });
      push('Gallery item added');
      setForm({ image: '', title: '', caption: '', inSlider: true });
      void load();
    } catch (err) {
      push(err instanceof Error ? err.message : 'Could not add item', 'error');
    } finally {
      setBusy(false);
    }
  };

  const toggleSlider = async (item: GalleryItem) => {
    try {
      await adminUpdateGalleryItem(item._id, { inSlider: !item.inSlider });
      void load();
    } catch (err) {
      push(err instanceof Error ? err.message : 'Could not update', 'error');
    }
  };

  const remove = async (item: GalleryItem) => {
    if (!window.confirm('Remove this image?')) return;
    try {
      await adminDeleteGalleryItem(item._id);
      push('Image removed');
      void load();
    } catch (err) {
      push(err instanceof Error ? err.message : 'Could not remove', 'error');
    }
  };

  const move = async (index: number, direction: -1 | 1) => {
    const next = [...items];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;

    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);

    try {
      await adminReorderGallery(next.map((item) => item._id));
    } catch (err) {
      push(err instanceof Error ? err.message : 'Could not reorder', 'error');
      void load();
    }
  };

  return (
    <div>
      <div>
        <p className="eyebrow">Media</p>
        <h1 className="display-lg mt-2 text-champagne">Gallery & slider</h1>
        <p className="mt-2 text-[13px] text-ash">
          Items marked “In slider” appear in the homepage carousel; the rest fill the gallery grid.
        </p>
      </div>

      {error ? (
        <p className="mt-6 rounded-xl border border-red-400/30 bg-red-950/25 p-4 text-sm text-red-100">{error}</p>
      ) : null}

      <form onSubmit={submit} className="mt-8 grid gap-4 rounded-2xl border border-champagne/10 bg-coal/60 p-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label" htmlFor="g-image">Image URL or path</label>
          <input
            id="g-image"
            className="input font-mono text-[12px]"
            required
            value={form.image}
            onChange={(event) => setForm({ ...form, image: event.target.value })}
            placeholder="/placeholders/slide-1.svg"
          />
        </div>

        <div>
          <label className="label" htmlFor="g-title">Title</label>
          <input
            id="g-title"
            className="input"
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
          />
        </div>

        <div>
          <label className="label" htmlFor="g-caption">Caption</label>
          <input
            id="g-caption"
            className="input"
            value={form.caption}
            onChange={(event) => setForm({ ...form, caption: event.target.value })}
          />
        </div>

        <label className="flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-ash">
          <input
            type="checkbox"
            checked={form.inSlider}
            onChange={(event) => setForm({ ...form, inSlider: event.target.checked })}
            className="h-4 w-4 accent-copper-400"
          />
          Show in slider
        </label>

        <div className="flex justify-end">
          <button type="submit" className="btn btn-sm" disabled={busy}>
            {busy ? 'Adding…' : '+ Add image'}
          </button>
        </div>
      </form>

      {loading ? (
        <p className="mt-10 text-sm text-ash">Loading…</p>
      ) : items.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-champagne/15 p-10 text-center text-sm text-ash">
          No images yet — add the first one above, or drop files in <code>client/public/placeholders</code>.
        </p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <div key={item._id} className="overflow-hidden rounded-2xl border border-champagne/10 bg-coal/50">
              <div className="relative">
                <img src={item.image} alt={item.title ?? ''} className="aspect-[4/3] w-full object-cover" />
                {item.inSlider ? (
                  <span className="absolute left-2 top-2 rounded-full bg-copper-400 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-onyx">
                    Slider
                  </span>
                ) : null}
              </div>

              <div className="p-4">
                <p className="truncate text-[13px] text-champagne">{item.title || 'Untitled'}</p>
                <p className="truncate text-[11px] text-ash/70">{item.caption || '—'}</p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => void toggleSlider(item)}
                    className="rounded-lg border border-champagne/15 px-2 py-1 text-[9px] uppercase tracking-[0.1em] text-champagne hover:border-copper-300"
                  >
                    {item.inSlider ? 'Remove from slider' : 'Add to slider'}
                  </button>
                  <button
                    type="button"
                    onClick={() => void move(index, -1)}
                    className="rounded-lg border border-champagne/15 px-2 py-1 text-[10px] text-ash hover:text-champagne"
                    aria-label="Move earlier"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => void move(index, 1)}
                    className="rounded-lg border border-champagne/15 px-2 py-1 text-[10px] text-ash hover:text-champagne"
                    aria-label="Move later"
                  >
                    →
                  </button>
                  <button
                    type="button"
                    onClick={() => void remove(item)}
                    className="ml-auto rounded-lg border border-red-400/25 px-2 py-1 text-[9px] uppercase tracking-[0.1em] text-red-200 hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
