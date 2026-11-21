import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getCategories, getProducts } from '../api/endpoints';
import type { Category, Product } from '../api/types';
import { ProductCard } from '../components/ProductCard';
import { Reveal } from '../components/Reveal';
import { Seo } from '../components/Seo';
import { useResource } from '../hooks/useResource';

const SORTS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price-asc', label: 'Price · low to high' },
  { value: 'price-desc', label: 'Price · high to low' },
  { value: 'newest', label: 'Newest' },
];

export function ServicesPage() {
  const [params, setParams] = useSearchParams();
  const category = params.get('category') ?? '';
  const [term, setTerm] = useState('');
  const [sort, setSort] = useState('recommended');

  const categories = useResource<Category[]>((signal) => getCategories(signal), []);
  const products = useResource<Product[]>(
    (signal) => getProducts({ category: category || undefined, sort }, signal),
    [category, sort],
  );

  const filtered = useMemo(() => {
    const list = products.data ?? [];
    if (!term.trim()) return list;
    const needle = term.trim().toLowerCase();
    return list.filter(
      (product) =>
        product.name.toLowerCase().includes(needle) ||
        (product.shortDescription ?? '').toLowerCase().includes(needle),
    );
  }, [products.data, term]);

  const selectCategory = (slug: string) => {
    const next = new URLSearchParams(params);
    if (slug) next.set('category', slug);
    else next.delete('category');
    setParams(next, { replace: true });
  };

  return (
    <>
      <Seo
        title="Service menu"
        description="Hair colour, keratin, extensions, hair patch, carbon facials, microblading, lashes and nails at HAIR5S Unisex Salon, Mumbai."
        path="/services"
      />

      <section className="container-x pt-14 sm:pt-20">
        <p className="eyebrow">The menu</p>
        <h1 className="display-xl mt-4 max-w-3xl text-char">
          Every service,
          <br />
          <span className="display-serif text-wine-500">one place.</span>
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-ash">
          Where the salon has not published a fixed price, the service shows “On request” — the team quotes after
          seeing the hair or nails. Add what you want and send the list on WhatsApp.
        </p>
      </section>

      <section className="container-x mt-10">
        <div className="flex flex-col gap-4 border-y border-char/10 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => selectCategory('')}
              className={`chip whitespace-nowrap ${category === '' ? 'chip-active' : ''}`}
            >
              All
            </button>
            {(categories.data ?? []).map((item) => (
              <button
                key={item._id}
                type="button"
                onClick={() => selectCategory(item.slug)}
                className={`chip whitespace-nowrap ${category === item.slug ? 'chip-active' : ''}`}
              >
                {item.name}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="search"
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              placeholder="Search services"
              aria-label="Search services"
              className="input sm:w-56"
            />
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              aria-label="Sort services"
              className="input sm:w-52"
            >
              {SORTS.map((option) => (
                <option key={option.value} value={option.value} className="bg-paper">
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {products.loading ? (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-[420px] animate-pulse rounded-[22px] bg-paper" />
            ))}
          </div>
        ) : products.error ? (
          <p className="mt-14 rounded-[20px] border border-wine-500/25 bg-wine-100 p-6 text-sm text-wine-600">
            {products.error}
          </p>
        ) : filtered.length === 0 ? (
          <p className="mt-14 rounded-[20px] border border-dashed border-char/20 p-10 text-center text-sm text-ash">
            No services match that search.
          </p>
        ) : (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((product, index) => (
              <Reveal key={product._id} delay={Math.min(index, 6) * 50}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
