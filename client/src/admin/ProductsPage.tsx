import { useCallback, useEffect, useState } from 'react';
import { adminCategories, adminDeleteProduct, adminProducts } from '../api/endpoints';
import type { Category, Product } from '../api/types';
import { useToast } from '../context/ToastContext';
import { categoryLabel, formatINR } from '../lib/format';
import { ProductForm } from './ProductForm';

export function ProductsPage() {
  const { push } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editor, setEditor] = useState<{ open: boolean; product: Product | null }>({
    open: false,
    product: null,
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [items, groups] = await Promise.all([adminProducts(), adminCategories()]);
      setProducts(items);
      setCategories(groups);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load services');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const remove = async (product: Product) => {
    if (!window.confirm(`Delete “${product.name}”? This cannot be undone.`)) return;
    try {
      await adminDeleteProduct(product._id);
      push('Service deleted');
      void load();
    } catch (err) {
      push(err instanceof Error ? err.message : 'Could not delete', 'error');
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Catalogue</p>
          <h1 className="display-lg mt-2 text-champagne">Services</h1>
          <p className="mt-2 text-[13px] text-ash">Prices here are what guests see on the site.</p>
        </div>
        <button
          type="button"
          className="btn btn-sm"
          onClick={() => setEditor({ open: true, product: null })}
          disabled={categories.length === 0}
          title={categories.length === 0 ? 'Create a category first' : undefined}
        >
          + New service
        </button>
      </div>

      {error ? (
        <p className="mt-6 rounded-xl border border-red-400/30 bg-red-950/25 p-4 text-sm text-red-100">{error}</p>
      ) : null}

      <div className="mt-8 overflow-hidden rounded-2xl border border-champagne/10">
        <table className="w-full text-left text-[13px]">
          <thead className="bg-coal/80 text-[10px] uppercase tracking-[0.14em] text-ash">
            <tr>
              <th className="px-4 py-3 font-normal">Service</th>
              <th className="hidden px-4 py-3 font-normal sm:table-cell">Category</th>
              <th className="px-4 py-3 font-normal">Price</th>
              <th className="hidden px-4 py-3 font-normal lg:table-cell">Flags</th>
              <th className="px-4 py-3 text-right font-normal">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-champagne/5 bg-ink/40">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-ash">Loading…</td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-ash">
                  No services yet. Create a category, then add your first service.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id} className="align-middle transition hover:bg-champagne/5">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product.images?.[0] ? (
                        <img src={product.images[0]} alt="" className="h-11 w-11 rounded-lg object-cover" />
                      ) : (
                        <span className="h-11 w-11 rounded-lg bg-smoke" />
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-champagne">{product.name}</p>
                        <p className="truncate text-[11px] text-ash/70">/{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-ash sm:table-cell">{categoryLabel(product.category)}</td>
                  <td className="px-4 py-3 text-champagne">{formatINR(product.price)}</td>
                  <td className="hidden px-4 py-3 lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {product.bestseller ? <span className="chip !px-2 !py-0.5 !text-[9px]">Top</span> : null}
                      {product.featured ? <span className="chip !px-2 !py-0.5 !text-[9px]">Home</span> : null}
                      {product.outOfStock ? (
                        <span className="chip !border-red-400/40 !px-2 !py-0.5 !text-[9px] !text-red-200">Off</span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditor({ open: true, product })}
                        className="rounded-lg border border-champagne/15 px-2.5 py-1 text-[10px] uppercase tracking-[0.1em] text-champagne transition hover:border-copper-300"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => void remove(product)}
                        className="rounded-lg border border-red-400/25 px-2.5 py-1 text-[10px] uppercase tracking-[0.1em] text-red-200 transition hover:bg-red-500/10"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editor.open ? (
        <ProductForm
          product={editor.product}
          categories={categories}
          onClose={() => setEditor({ open: false, product: null })}
          onSaved={() => {
            setEditor({ open: false, product: null });
            void load();
          }}
        />
      ) : null}
    </div>
  );
}
