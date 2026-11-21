import { useCallback, useEffect, useState, type FormEvent } from 'react';
import {
  adminCategories,
  adminCreateCategory,
  adminDeleteCategory,
  adminReorderCategories,
  adminUpdateCategory,
} from '../api/endpoints';
import type { Category } from '../api/types';
import { useToast } from '../context/ToastContext';

type Draft = { name: string; description: string; image: string };

const emptyDraft: Draft = { name: '', description: '', image: '' };

export function CategoriesPage() {
  const { push } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Category | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setCategories(await adminCategories());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const reset = () => {
    setEditing(null);
    setDraft(emptyDraft);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      const payload = {
        name: draft.name.trim(),
        description: draft.description.trim(),
        image: draft.image.trim(),
      };

      if (editing) {
        await adminUpdateCategory(editing._id, payload);
        push('Category updated');
      } else {
        await adminCreateCategory(payload);
        push('Category created');
      }

      reset();
      void load();
    } catch (err) {
      push(err instanceof Error ? err.message : 'Could not save category', 'error');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (category: Category) => {
    if (!window.confirm(`Delete “${category.name}”?`)) return;
    try {
      await adminDeleteCategory(category._id);
      push('Category deleted');
      void load();
    } catch (err) {
      push(err instanceof Error ? err.message : 'Could not delete', 'error');
    }
  };

  const move = async (index: number, direction: -1 | 1) => {
    const next = [...categories];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;

    [next[index], next[target]] = [next[target], next[index]];
    setCategories(next);

    try {
      await adminReorderCategories(next.map((item) => item._id));
    } catch (err) {
      push(err instanceof Error ? err.message : 'Could not reorder', 'error');
      void load();
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Catalogue</p>
          <h1 className="display-lg mt-2 text-champagne">Categories</h1>
          <p className="mt-2 text-[13px] text-ash">Order here controls the menu and homepage chips.</p>
        </div>
      </div>

      {error ? (
        <p className="mt-6 rounded-xl border border-red-400/30 bg-red-950/25 p-4 text-sm text-red-100">{error}</p>
      ) : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="overflow-hidden rounded-2xl border border-champagne/10">
          {loading ? (
            <p className="px-4 py-10 text-center text-sm text-ash">Loading…</p>
          ) : categories.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-ash">No categories yet — add the first on the right.</p>
          ) : (
            <ul className="divide-y divide-champagne/5">
              {categories.map((category, index) => (
                <li key={category._id} className="flex flex-wrap items-center gap-3 bg-ink/40 px-4 py-3">
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => void move(index, -1)}
                      className="rounded border border-champagne/15 px-1 text-[9px] text-ash hover:text-champagne"
                      aria-label={`Move ${category.name} up`}
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      onClick={() => void move(index, 1)}
                      className="rounded border border-champagne/15 px-1 text-[9px] text-ash hover:text-champagne"
                      aria-label={`Move ${category.name} down`}
                    >
                      ▼
                    </button>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] text-champagne">{category.name}</p>
                    <p className="text-[11px] text-ash/70">
                      /{category.slug} · {category.productCount ?? 0} item(s)
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(category);
                        setDraft({
                          name: category.name,
                          description: category.description ?? '',
                          image: category.image ?? '',
                        });
                      }}
                      className="rounded-lg border border-champagne/15 px-2.5 py-1 text-[10px] uppercase tracking-[0.1em] text-champagne hover:border-copper-300"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void remove(category)}
                      className="rounded-lg border border-red-400/25 px-2.5 py-1 text-[10px] uppercase tracking-[0.1em] text-red-200 hover:bg-red-500/10"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <form onSubmit={submit} className="h-fit rounded-2xl border border-champagne/10 bg-coal/60 p-5">
          <p className="eyebrow">{editing ? 'Edit category' : 'New category'}</p>

          <div className="mt-4 space-y-4">
            <div>
              <label className="label" htmlFor="c-name">Name</label>
              <input
                id="c-name"
                className="input"
                required
                value={draft.name}
                onChange={(event) => setDraft({ ...draft, name: event.target.value })}
              />
            </div>

            <div>
              <label className="label" htmlFor="c-desc">Description</label>
              <textarea
                id="c-desc"
                className="input min-h-[70px]"
                value={draft.description}
                onChange={(event) => setDraft({ ...draft, description: event.target.value })}
              />
            </div>

            <div>
              <label className="label" htmlFor="c-image">Image URL or path</label>
              <input
                id="c-image"
                className="input font-mono text-[12px]"
                value={draft.image}
                onChange={(event) => setDraft({ ...draft, image: event.target.value })}
                placeholder="/placeholders/service-1.svg"
              />
            </div>
          </div>

          <div className="mt-5 flex gap-2">
            <button type="submit" className="btn btn-sm flex-1" disabled={busy}>
              {busy ? 'Saving…' : editing ? 'Save' : 'Create'}
            </button>
            {editing ? (
              <button type="button" onClick={reset} className="btn-ghost btn-sm">
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
}
