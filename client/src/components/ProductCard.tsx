import { Link } from 'react-router-dom';
import type { Product } from '../api/types';
import { useCart } from '../context/CartContext';
import { categoryLabel, formatINR } from '../lib/format';

const isPlaceholder = (src?: string) => Boolean(src && src.includes('/placeholders/'));

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const image = product.images?.[0];

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[22px] border border-char/10 bg-paper transition duration-500 ease-luxe hover:-translate-y-1 hover:border-char/25 hover:shadow-lift">
      <Link to={`/services/${product.slug}`} className="relative block overflow-hidden">
        {isPlaceholder(image) ? <span className="placeholder-tag">Placeholder</span> : null}
        {image ? (
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            className="aspect-[4/3] w-full object-cover transition duration-[1200ms] ease-luxe group-hover:scale-[1.05]"
          />
        ) : (
          <div className="aspect-[4/3] w-full bg-gradient-to-br from-sand to-bone" />
        )}

        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {product.bestseller ? (
            <span className="rounded-full bg-char px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-paper">
              Most booked
            </span>
          ) : null}
          {product.outOfStock ? (
            <span className="rounded-full border border-char/20 bg-paper/90 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-ash">
              Unavailable
            </span>
          ) : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-wine-500">
          {categoryLabel(product.category)}
        </p>
        <h3 className="mt-2 font-display text-xl font-semibold leading-snug text-char">
          <Link to={`/services/${product.slug}`} className="transition hover:text-wine-500">
            {product.name}
          </Link>
        </h3>
        {product.shortDescription ? (
          <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-ash">{product.shortDescription}</p>
        ) : null}

        <div className="mt-auto flex items-end justify-between border-t border-char/10 pt-4 mt-5">
          <div>
            <p className="font-display text-lg font-semibold text-char">{formatINR(product.price)}</p>
            {product.duration ? (
              <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-ash">{product.duration}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => add(product)}
            disabled={product.outOfStock}
            className="inline-flex items-center justify-center rounded-full border border-char px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-char transition hover:bg-char hover:text-paper disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={`Add ${product.name} to appointment`}
          >
            Add
          </button>
        </div>
      </div>
    </article>
  );
}
