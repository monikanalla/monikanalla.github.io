import { Link } from 'react-router-dom';
import { getCategories, getGallery, getProducts, getReviews } from '../api/endpoints';
import type { Category, GalleryItem, Product, Review } from '../api/types';
import { Hero3D } from '../components/Hero3D';
import { Marquee } from '../components/Marquee';
import { ProductCard } from '../components/ProductCard';
import { Reveal } from '../components/Reveal';
import { SectionHeading } from '../components/SectionHeading';
import { Seo } from '../components/Seo';
import { Slider } from '../components/Slider';
import { useSettings } from '../context/SettingsContext';
import { useResource } from '../hooks/useResource';
import { buildWhatsAppMessage, whatsappLink } from '../lib/whatsapp';

const VERTICALS = [
  'Hair',
  'Colour',
  'Skin',
  'Nails',
  'Eyelashes',
  'Hair extensions',
  'Hair patch',
  'Carbon facial',
  'Microblading',
];

const PILLARS = [
  {
    title: 'One chair, every service',
    body: 'Hair, skin and nails under one roof — so a colour, a facial and a set of nails don’t need three trips across town.',
  },
  {
    title: 'Specialists, not a menu of everything',
    body: 'Colour, keratin, extensions, lashes and microblading are handled by the people who do them every day.',
  },
  {
    title: 'Straight answers before the first snip',
    body: 'We tell you what your hair can take this month, what to postpone, and how the finish will grow out.',
  },
];

const STATS = [
  { label: 'Instagram', value: '33.3K', note: 'followers' },
  { label: 'Posts', value: '3,023', note: 'of real work' },
  { label: 'Verticals', value: '05', note: 'hair · skin · nails' },
  { label: 'City', value: 'Mumbai', note: 'unisex salon' },
];

export function HomePage() {
  const { settings } = useSettings();

  const featured = useResource<Product[]>((signal) => getProducts({ featured: true, type: 'service' }, signal), []);
  const categories = useResource<Category[]>((signal) => getCategories(signal), []);
  const gallery = useResource<GalleryItem[]>((signal) => getGallery(signal), []);
  const reviews = useResource<Review[]>((signal) => getReviews(signal), []);

  const slides = (gallery.data ?? []).filter((item) => item.inSlider);
  const categoryList = categories.data ?? [];

  const heroWords = (settings.heroHeadline || 'Cut. Colour. Confidence.').trim().split(/\s+/);
  const heroTail = heroWords.length > 1 ? heroWords[heroWords.length - 1] : '';
  const heroLead = heroWords.slice(0, -1).join(' ');
  const heroLink = whatsappLink(settings, buildWhatsAppMessage(settings, [], ''));

  return (
    <>
      <Seo
        title="Unisex salon in Mumbai"
        description="HAIR5S Unisex Salon, Mumbai — hair colour, keratin, hair spa, skin, nails, eyelashes, hair extensions, hair patch, carbon facial and microblading. Book on WhatsApp."
        path="/"
      />

      {/* ---------------------------------- hero --------------------------------- */}
      <section className="relative overflow-hidden">
        <Hero3D />

        <div className="container-x relative z-10 flex min-h-[86vh] flex-col justify-between pb-10 pt-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="rule-label">{settings.heroBadge || 'Mumbai · Unisex salon'}</span>
            <span className="hidden text-[10px] font-medium uppercase tracking-[0.26em] text-ash md:block">
              Appointments on WhatsApp · 33.3K on Instagram
            </span>
          </div>

          <div className="max-w-2xl py-12 lg:max-w-[56%]">
            <h1 className="animate-fade-up text-balance font-display text-[clamp(3rem,8.6vw,7.6rem)] font-semibold leading-[0.84] tracking-[-0.055em] text-char">
              {heroLead ? (
                <>
                  {heroLead}
                  <br />
                </>
              ) : null}
              <span className="display-serif text-wine-500">{heroTail}</span>
            </h1>

            <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.26em] text-wine-500">
              Hair · Skin · Nails
            </p>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ash">
              {settings.heroSubhead ||
                'HAIR5S is a unisex salon in Mumbai for cut, colour, keratin, skin, nails, lashes, extensions and microblading.'}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {heroLink ? (
                <a href={heroLink} target="_blank" rel="noreferrer noopener" className="btn">
                  Book on WhatsApp
                </a>
              ) : (
                <Link to="/contact" className="btn">
                  Enquire about a slot
                </Link>
              )}
              <Link to="/services" className="btn-ghost">
                The menu
              </Link>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-6 border-t border-char/15 pt-6 sm:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <dt className="text-[9px] font-semibold uppercase tracking-[0.24em] text-ash">{stat.label}</dt>
                <dd className="mt-2 font-display text-2xl font-semibold leading-none text-char">{stat.value}</dd>
                <dd className="mt-1.5 text-[10px] uppercase tracking-[0.14em] text-ash/80">{stat.note}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* -------------------------------- marquee -------------------------------- */}
      <section className="border-y border-char/10 bg-char py-3.5 text-bone">
        <Marquee items={VERTICALS} />
      </section>

      {/* --------------------------------- slider -------------------------------- */}
      <section className="container-x pt-20 sm:pt-28">
        <Reveal>
          <SectionHeading
            eyebrow="The wall"
            title={
              <>
                Work from the chair,
                <br />
                <span className="display-serif text-wine-500">not from a moodboard.</span>
              </>
            }
            description="Real colour, extensions and nails from the HAIR5S studio. Swipe, or use the thumbnails."
            action={
              <a href={settings.instagram} target="_blank" rel="noreferrer noopener" className="btn-ghost btn-sm">
                @hair5s
              </a>
            }
          />
        </Reveal>

        <Reveal delay={120} className="mt-10">
          <Slider
            slides={slides.map((slide) => ({
              id: slide._id,
              image: slide.image,
              title: slide.title,
              caption: slide.caption,
            }))}
          />
        </Reveal>
      </section>

      {/* ------------------------------- categories ------------------------------ */}
      <section className="container-x pt-20 sm:pt-28">
        <Reveal>
          <SectionHeading
            eyebrow="What we do"
            title={
              <>
                Five things, done
                <br />
                <span className="display-serif text-wine-500">properly.</span>
              </>
            }
            description="Hair, colour, skin, nails and lashes — plus the specialist work in between."
            action={
              <Link to="/services" className="btn-ghost btn-sm">
                All services
              </Link>
            }
          />
        </Reveal>

        {categoryList.length > 0 ? (
          <div className="mt-10 grid gap-3 lg:grid-cols-[1.15fr_1fr]">
            <Reveal>
              <Link
                to={`/services?category=${categoryList[0].slug}`}
                className="group relative flex h-full min-h-[420px] flex-col justify-end overflow-hidden rounded-[24px] border border-char/10 bg-char p-7"
              >
                {categoryList[0].image ? (
                  <img
                    src={categoryList[0].image}
                    alt={categoryList[0].name}
                    className="absolute inset-0 h-full w-full object-cover opacity-90 transition duration-[1200ms] ease-luxe group-hover:scale-[1.04] group-hover:opacity-100"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-char/80 via-char/20 to-transparent" />
                <div className="relative">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-paper/70">01</p>
                  <h3 className="mt-2 font-display text-3xl font-semibold text-paper">{categoryList[0].name}</h3>
                  <p className="mt-2 max-w-sm text-[12px] leading-relaxed text-paper/75">
                    {categoryList[0].description}
                  </p>
                </div>
              </Link>
            </Reveal>

            <div className="grid grid-cols-2 gap-3">
              {categoryList.slice(1, 5).map((category, index) => (
                <Reveal key={category._id} delay={index * 70}>
                  <Link
                    to={`/services?category=${category.slug}`}
                    className="group relative flex h-full min-h-[200px] flex-col justify-end overflow-hidden rounded-[22px] border border-char/10 bg-paper p-5"
                  >
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="absolute inset-0 h-full w-full object-cover transition duration-[1200ms] ease-luxe group-hover:scale-[1.05]"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-char/85 via-char/25 to-transparent" />
                    <div className="relative">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.26em] text-paper/60">
                        0{index + 2}
                      </p>
                      <h3 className="mt-1.5 font-display text-lg font-semibold leading-tight text-paper">
                        {category.name}
                      </h3>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        ) : (
          <p className="mt-10 rounded-[22px] border border-dashed border-char/20 p-10 text-center text-sm text-ash">
            Categories will appear here once they are added in the admin panel.
          </p>
        )}
      </section>

      {/* ------------------------------ featured grid ---------------------------- */}
      <section className="container-x pt-20 sm:pt-28">
        <Reveal>
          <SectionHeading
            eyebrow="Most booked"
            title="Start with these"
            description="Pricing is confirmed on WhatsApp — the salon quotes after seeing the hair."
            action={
              <Link to="/services" className="btn-ghost btn-sm">
                Full menu
              </Link>
            }
          />
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.loading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-[420px] animate-pulse rounded-[22px] border border-char/10 bg-paper" />
              ))
            : (featured.data ?? []).slice(0, 6).map((product, index) => (
                <Reveal key={product._id} delay={index * 70}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
        </div>

        {!featured.loading && (featured.data ?? []).length === 0 ? (
          <p className="mt-8 rounded-[22px] border border-dashed border-char/20 p-8 text-center text-sm text-ash">
            The menu is empty. {featured.error ? featured.error : 'Add services from the admin panel to see them here.'}
          </p>
        ) : null}
      </section>

      {/* -------------------------------- pillars -------------------------------- */}
      <section className="mt-20 border-y border-char/10 bg-paper/60 py-20 sm:mt-28 sm:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <p className="eyebrow">Why HAIR5S</p>
            <h2 className="display-lg mt-4 text-char">
              A salon that
              <br />
              <span className="display-serif text-wine-500">says no.</span>
            </h2>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ash">
              Unisex by design. Nine services, one standard of finish — for every hair type that walks in.
            </p>
            <Link to="/about" className="btn-ghost btn-sm mt-8">
              Inside the salon
            </Link>
          </Reveal>

          <div className="divide-y divide-char/10 border-t border-char/10">
            {PILLARS.map((pillar, index) => (
              <Reveal key={pillar.title} delay={index * 90}>
                <div className="grid gap-3 py-7 sm:grid-cols-[auto_1fr] sm:gap-8">
                  <span className="font-display text-4xl font-semibold text-outline sm:text-5xl">0{index + 1}</span>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-char">{pillar.title}</h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-ash">{pillar.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------- reviews ------------------------------- */}
      <section className="container-x py-20 sm:py-28">
        <Reveal>
          <SectionHeading
            eyebrow="Guests"
            title="What the chair says"
            description="Reviews left on this site are published only after the salon approves them."
          />
        </Reveal>

        {(reviews.data ?? []).length > 0 ? (
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {(reviews.data ?? []).slice(0, 3).map((review, index) => (
              <Reveal key={review._id} delay={index * 80}>
                <figure className="card h-full p-6">
                  <div className="text-wine-500" aria-label={`${review.rating} out of 5`}>
                    {'★'.repeat(review.rating)}
                    <span className="text-char/20">{'★'.repeat(5 - review.rating)}</span>
                  </div>
                  <blockquote className="mt-4 text-[13px] leading-relaxed text-char/85">{review.text}</blockquote>
                  <figcaption className="mt-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-ash">
                    {review.name}
                    {review.service ? ` · ${review.service}` : ''}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal delay={100} className="mt-10">
            <div className="flex flex-col items-start gap-6 rounded-[24px] border border-char/10 bg-paper p-8 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-wine-500">33.3K followers</p>
                <p className="mt-2 max-w-lg font-display text-2xl font-semibold leading-snug text-char">
                  Three thousand posts of real work — the grid is the portfolio.
                </p>
                <p className="mt-3 text-[12px] text-ash">
                  Guest reviews appear here once approved in the admin panel.
                </p>
              </div>
              <a
                href={settings.instagram}
                target="_blank"
                rel="noreferrer noopener"
                className="btn-ghost btn-sm"
              >
                See the grid
              </a>
            </div>
          </Reveal>
        )}
      </section>

      {/* ----------------------------------- cta --------------------------------- */}
      <section className="container-x pb-10">
        <Reveal>
          <div className="relative overflow-hidden rounded-[30px] bg-char px-8 py-12 text-paper sm:px-14 sm:py-16">
            <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-wine-500/40 blur-3xl" />
            <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-paper/60">Appointments</p>
                <h2 className="mt-4 max-w-xl font-display text-[clamp(2rem,4.4vw,3.6rem)] font-semibold leading-[0.95] tracking-[-0.035em]">
                  Tell us what you want.
                  <br />
                  <span className="display-serif text-wine-300">We’ll block the time.</span>
                </h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-paper/70">
                  Pick services, send the list on WhatsApp, and the salon confirms your slot. No online payment.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 lg:justify-end">
                <Link to="/services" className="inline-flex items-center justify-center rounded-full bg-paper px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-char transition hover:bg-wine-300">
                  Build your appointment
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center rounded-full border border-paper/30 px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-paper transition hover:bg-paper/10"
                >
                  Find the salon
                </Link>
              </div>
            </div>

            <div className="relative mt-10 flex flex-wrap gap-x-10 gap-y-3 border-t border-paper/15 pt-6 text-[10px] uppercase tracking-[0.18em] text-paper/60">
              <span>{settings.hours || 'Open daily · call to confirm timings'}</span>
              <span>Walk-ins subject to availability</span>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
