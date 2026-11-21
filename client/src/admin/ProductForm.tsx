import { useState, type FormEvent } from 'react';
import { adminCreateProduct, adminUpdateProduct } from '../api/endpoints';
import type { Category, Product } from '../api/types';
import { useToast } from '../context/ToastContext';

interface ProductFormProps {
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}

const categoryId = (product: Product | null): string => {
  if (!product) return '';
  return typeof product.category === 'string' ? product.category : product.category._id;
};

export function ProductForm({ product, categories, onClose, onSaved }: ProductFormProps) {
  const { push } = useToast();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: product?.name ?? '',
    category: categoryId(product),
    type: product?.type ?? 'service',
    price: String(product?.price ?? ''),
    compareAtPrice: product?.compareAtPrice ? String(product.compareAtPrice) : '',
    duration: product?.duration ?? '',
    shortDescription: product?.shortDescription ?? '',
    description: product?.description ?? '',
    images: (product?.images ?? []).join('\n'),
    variants: (product?.variants ?? []).map((variant) => `${variant.label} | ${variant.price}`).join('\n'),
    bestseller: product?.bestseller ?? false,
    featured: product?.featured ?? false,
    outOfStock: product?.outOfStock ?? false,
    order: String(product?.order ?? 0),
    seoTitle: product?.seo?.title ?? '',
    seoDescription: product?.seo?.description ?? '',
  });

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);

    const variants = form.variants
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [label, price] = line.split('|').map((part) => part.trim());
        return { label: label || 'Option', price: Number(price) || 0 };
      });

    const payload = {
      name: form.name.trim(),
      category: form.category,
      type: form.type as 'service' | 'retail',
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
      duration: form.duration.trim(),
      shortDescription: form.shortDescription.trim(),
      description: form.description.trim(),
      images: form.images
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
      variants,
      bestseller: form.bestseller,
      featured: form.featured,
      outOfStock: form.outOfStock,
      order: Number(form.order) || 0,
      seo: { title: form.seoTitle.trim(), description: form.seoDescription.trim() },
    };

    try {
      if (product) await adminUpdateProduct(product._id, payload);
      else await adminCreateProduct(payload);
      push(product ? 'Service updated' : 'Service created');
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[95] flex items-start justify-center overflow-y-auto bg-onyx/80 p-4 backdrop-blur-sm">
      <form
        onSubmit={submit}
        className="my-8 w-full max-w-3xl rounded-2xl border border-champagne/15 bg-ink p-6 shadow-card"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">{product ? 'Edit' : 'New'}</p>
            <h2 className="mt-2 font-display text-2xl text-champagne">
              {product ? product.name : 'Add a service'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-champagne/20 text-champagne"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label" htmlFor="p-name">Name</label>
            <input
              id="p-name"
              className="input"
              required
              value={form.name}
              onChange={(event) => set('name', event.target.value)}
              placeholder="Global Hair Colour"
            />
          </div>

          <div>
            <label className="label" htmlFor="p-category">Category</label>
            <select
              id="p-category"
              className="input"
              required
              value={form.category}
              onChange={(event) => set('category', event.target.value)}
            >
              <option value="" disabled>Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id} className="bg-coal">
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label" htmlFor="p-type">Type</label>
            <select
              id="p-type"
              className="input"
              value={form.type}
              onChange={(event) => set('type', event.target.value as 'service' | 'retail')}
            >
              <option value="service" className="bg-coal">Service</option>
              <option value="retail" className="bg-coal">Retail product</option>
            </select>
          </div>

          <div>
            <label className="label" htmlFor="p-price">Price (INR)</label>
            <input
              id="p-price"
              type="number"
              min="0"
              step="1"
              required
              className="input"
              value={form.price}
              onChange={(event) => set('price', event.target.value)}
            />
          </div>

          <div>
            <label className="label" htmlFor="p-compare">Compare-at price (optional)</label>
            <input
              id="p-compare"
              type="number"
              min="0"
              step="1"
              className="input"
              value={form.compareAtPrice}
              onChange={(event) => set('compareAtPrice', event.target.value)}
            />
          </div>

          <div>
            <label className="label" htmlFor="p-duration">Duration</label>
            <input
              id="p-duration"
              className="input"
              value={form.duration}
              onChange={(event) => set('duration', event.target.value)}
              placeholder="120 min"
            />
          </div>

          <div>
            <label className="label" htmlFor="p-order">Sort order</label>
            <input
              id="p-order"
              type="number"
              className="input"
              value={form.order}
              onChange={(event) => set('order', event.target.value)}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="label" htmlFor="p-short">Short description</label>
            <input
              id="p-short"
              className="input"
              maxLength={240}
              value={form.shortDescription}
              onChange={(event) => set('shortDescription', event.target.value)}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="label" htmlFor="p-desc">Full description</label>
            <textarea
              id="p-desc"
              className="input min-h-[110px]"
              value={form.description}
              onChange={(event) => set('description', event.target.value)}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="label" htmlFor="p-images">Images — one URL or path per line</label>
            <textarea
              id="p-images"
              className="input min-h-[80px] font-mono text-[12px]"
              value={form.images}
              onChange={(event) => set('images', event.target.value)}
              placeholder="/placeholders/service-1.svg&#10;https://res.cloudinary.com/..."
            />
            <p className="mt-1 text-[10px] text-ash/70">
              Local placeholders live in <code>client/public/placeholders</code>. Pasted URLs work too.
            </p>
          </div>

          <div className="sm:col-span-2">
            <label className="label" htmlFor="p-variants">Variants — one per line as <code>Label | Price</code></label>
            <textarea
              id="p-variants"
              className="input min-h-[70px] font-mono text-[12px]"
              value={form.variants}
              onChange={(event) => set('variants', event.target.value)}
              placeholder="Short hair | 2500&#10;Medium hair | 3500"
            />
          </div>

          <div>
            <label className="label" htmlFor="p-seo-title">SEO title</label>
            <input
              id="p-seo-title"
              className="input"
              maxLength={160}
              value={form.seoTitle}
              onChange={(event) => set('seoTitle', event.target.value)}
            />
          </div>

          <div>
            <label className="label" htmlFor="p-seo-desc">SEO description</label>
            <input
              id="p-seo-desc"
              className="input"
              maxLength={300}
              value={form.seoDescription}
              onChange={(event) => set('seoDescription', event.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-6 border-y border-champagne/10 py-4">
          {([
            ['bestseller', 'Most booked'],
            ['featured', 'Featured on home'],
            ['outOfStock', 'Unavailable'],
          ] as const).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-ash">
              <input
                type="checkbox"
                checked={form[key]}
                onChange={(event) => set(key, event.target.checked)}
                className="h-4 w-4 rounded border-champagne/30 bg-transparent accent-copper-400"
              />
              {label}
            </label>
          ))}
        </div>

        {error ? (
          <p className="mt-4 rounded-lg border border-red-400/30 bg-red-950/30 px-3 py-2 text-[12px] text-red-100">
            {error}
          </p>
        ) : null}

        <div className="mt-5 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="btn-ghost btn-sm">
            Cancel
          </button>
          <button type="submit" className="btn btn-sm" disabled={busy}>
            {busy ? 'Saving…' : product ? 'Save changes' : 'Create service'}
          </button>
        </div>
      </form>
    </div>
  );
}
