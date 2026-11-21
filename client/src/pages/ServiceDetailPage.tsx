import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProduct, getProducts } from '../api/endpoints';
import type { Product } from '../api/types';
import { ProductCard } from '../components/ProductCard';
import { Reveal } from '../components/Reveal';
import { Seo } from '../components/Seo';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { useResource } from '../hooks/useResource';
import { formatINR } from '../lib/format';
import { buildWhatsAppMessage, whatsappLink } from '../lib/whatsapp';

export function ServiceDetailPage() {
  const { slug = '' } = useParams();
  const { settings } = useSettings();
  const { add, openCart } = useCart();
  const [variantIndex, setVariantIndex] = useState(0);
  const [activeImage, setActiveImage] = useState(0);

  const { data: product, loading, error } = useResource<Product>(
    (signal) => getProduct(slug, signal),
    [slug],
  );

  const related = useResource<Product[]>(
    (signal) => getProducts({ type: 'service' }, signal),
    [],
  );

  useEffect(() => {
    setVariantIndex(0);
    setActiveImage(0);
  }, [slug]);

  const variant = product?.variants?.[variantIndex];
  const price = variant?.price ?? product?.price ?? 0;

  const bookLink = useMemo(() => {
    if (!product) return null;
    const message = buildWhatsAppMessage(
      settings,
      [
        {
          id: product._id,
          productId: product._id,
          slug: product.slug,
          name: product.name,
          price,
          variant: variant?.label,
          qty: 1,
        },
      ],
      '',
    );
    return whatsappLink(settings, message);
  }, [product, price, variant, settings]);

  const others = (related.data ?? []).filter((item) => item.slug !== slug).slice(0, 3);
  const image = product?.images?.[activeImage];

  if (loading) {
    return (
      <div className="container-x py-20">
        <div className="h-8 w-40 animate-pulse rounded-full bg-coal" />
        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <div className="aspect-[4/3] animate-pulse rounded-2xl bg-coal" />
          <div className="space-y-4">
            <div className="h-10 w-2/3 animate-pulse rounded bg-coal" />
            <div className="h-24 animate-pulse rounded bg-coal" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container-x py-24 text-center">
        <p className="font-display text-3xl text-champagne">That service isn't on the menu.</p>
        <p className="mt-3 text-sm text-ash">{error ?? 'It may have been renamed or removed.'}</p>
        <Link to="/services" className="btn mt-8">
          Back to the menu
        </Link>
      </div>
    );
  }

  return (
    <>
      <Seo
        title={product.seo?.title || product.name}
        description={product.seo?.description || product.shortDescription}
        path={`/services/${product.slug}`}
      />

      <div className="container-x pt-8">
        <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-ash" aria-label="Breadcrumb">
          <Link to="/" className="transition hover:text-champagne">
            Home
          </Link>
          <span>/</span>
          <Link to="/services" className="transition hover:text-champagne">
            Services
          </Link>
          <span>/</span>
          <span className="text-copper-300">{product.name}</span>
        </nav>
      </div>

      <section className="container-x grid gap-12 py-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <div className="relative overflow-hidden rounded-2xl border border-champagne/10">
            {image?.includes('/placeholders/') ? <span className="placeholder-tag">Placeholder</span> : null}
            {image ? (
              <img src={image} alt={product.name} className="aspect-[4/3] w-full object-cover" />
            ) : (
              <div className="aspect-[4/3] bg-gradient-to-br from-smoke to-onyx" />
            )}
          </div>

          {product.images.length > 1 ? (
            <div className="mt-3 flex gap-3">
              {product.images.map((src, index) => (
                <button
                  key={`${src}-${index}`}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={`overflow-hidden rounded-lg border transition ${
                    index === activeImage ? 'border-copper-300' : 'border-champagne/10 hover:border-champagne/30'
                  }`}
                  aria-label={`View image ${index + 1}`}
                >
                  <img src={src} alt="" className="h-20 w-24 object-cover" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <p className="eyebrow">{typeof product.category === 'string' ? 'Service' : product.category.name}</p>
          <h1 className="display-lg mt-3 text-champagne">{product.name}</h1>

          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ash">
            <span className="font-display text-2xl text-champagne">{formatINR(price)}</span>
            {product.compareAtPrice && product.compareAtPrice > price ? (
              <span className="text-ash/60 line-through">{formatINR(product.compareAtPrice)}</span>
            ) : null}
            {product.duration ? <span>{product.duration}</span> : null}
          </div>

          <p className="mt-6 text-sm leading-relaxed text-ash">
            {product.description || product.shortDescription || 'Details for this service are being confirmed.'}
          </p>

          {product.variants.length > 0 ? (
            <fieldset className="mt-8">
              <legend className="label">Choose an option</legend>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((option, index) => (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => setVariantIndex(index)}
                    className={`chip ${index === variantIndex ? 'chip-active' : ''}`}
                  >
                    {option.label} · {formatINR(option.price)}
                  </button>
                ))}
              </div>
            </fieldset>
          ) : null}

          <div className="mt-9 flex flex-wrap gap-3">
            <button
              type="button"
              className="btn"
              disabled={product.outOfStock}
              onClick={() => add(product, variant)}
            >
              {product.outOfStock ? 'Currently unavailable' : 'Add to appointment'}
            </button>
            {bookLink ? (
              <a href={bookLink} target="_blank" rel="noreferrer noopener" className="btn-ghost">
                Ask on WhatsApp
              </a>
            ) : (
              <button type="button" className="btn-ghost" onClick={openCart}>
                View appointment
              </button>
            )}
          </div>

          <dl className="mt-10 space-y-4 border-t border-champagne/10 pt-6 text-[13px]">
            <div className="flex justify-between gap-6">
              <dt className="text-ash">Confirmed at the salon</dt>
              <dd className="text-right text-champagne/90">Final price depends on hair length & density</dd>
            </div>
            <div className="flex justify-between gap-6">
              <dt className="text-ash">Booking</dt>
              <dd className="text-right text-champagne/90">WhatsApp confirmation · no online payment</dd>
            </div>
            <div className="flex justify-between gap-6">
              <dt className="text-ash">Hours</dt>
              <dd className="text-right text-champagne/90">{settings.hours || 'Tue–Sun · 11:00 – 21:00'}</dd>
            </div>
          </dl>
        </div>
      </section>

      {others.length > 0 ? (
        <section className="container-x py-16">
          <Reveal>
            <div className="flex items-end justify-between gap-6">
              <h2 className="display-lg text-champagne">Also on the menu</h2>
              <Link to="/services" className="text-[10px] uppercase tracking-[0.18em] text-copper-300 hover:text-copper-100">
                View all
              </Link>
            </div>
          </Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((item, index) => (
              <Reveal key={item._id} delay={index * 70}>
                <ProductCard product={item} />
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
