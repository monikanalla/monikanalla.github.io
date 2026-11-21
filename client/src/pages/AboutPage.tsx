import { Link } from 'react-router-dom';
import { Reveal } from '../components/Reveal';
import { Seo } from '../components/Seo';
import { useSettings } from '../context/SettingsContext';

const APPROACH = [
  {
    title: 'Consult',
    body: 'We look at porosity, previous colour and how much time you actually have for upkeep before we quote anything.',
  },
  {
    title: 'Plan',
    body: 'One visit, one clear list — what we do today, what waits, and what would damage the hair if rushed.',
  },
  {
    title: 'Finish',
    body: 'Cuts and colour leave styled, not just rinsed. The finish is part of the service.',
  },
];

const FACTS = [
  ['Type', 'Unisex salon'],
  ['City', 'Mumbai'],
  ['Services', 'Hair · Skin · Nails'],
  ['Instagram', '33.3K followers'],
  ['Booking', 'WhatsApp confirmation'],
];

export function AboutPage() {
  const { settings } = useSettings();

  return (
    <>
      <Seo
        title="About the salon"
        description="HAIR5S is a unisex salon in Mumbai — hair colour, keratin, extensions, hair patch, skin, nails, lashes and microblading."
        path="/about"
      />

      <section className="container-x grid gap-12 pt-14 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="eyebrow">The salon</p>
          <h1 className="display-xl mt-4 max-w-xl text-char text-balance">
            One chair,
            <br />
            <span className="display-serif text-wine-500">five disciplines.</span>
          </h1>
          <div className="mt-7 max-w-lg space-y-4 text-sm leading-relaxed text-ash">
            <p>
              {settings.aboutCopy ||
                'HAIR5S is a unisex salon in Mumbai working across hair, skin and nails — colour, extensions, facials, lashes and nail art under one roof.'}
            </p>
            <p>
              The menu is deliberately wide because the clientele is: a colour correction on Saturday morning, a
              men’s cut at noon, a set of nails before a wedding. The standard of finish does not change between
              them.
            </p>
          </div>

          <dl className="mt-10 grid gap-px overflow-hidden rounded-[20px] border border-char/10 bg-char/10 sm:grid-cols-2">
            {FACTS.map(([label, value]) => (
              <div key={label} className="bg-paper px-5 py-4">
                <dt className="text-[9px] font-semibold uppercase tracking-[0.22em] text-ash">{label}</dt>
                <dd className="mt-1 text-[13px] font-medium text-char">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/services" className="btn">
              View the menu
            </Link>
            <Link to="/contact" className="btn-ghost">
              Find the salon
            </Link>
          </div>
        </div>

        <div className="relative">
          <img
            src="/instagram/work-01.jpg"
            alt="The HAIR5S salon front in Mumbai"
            className="h-full min-h-[420px] w-full rounded-[26px] border border-char/10 object-cover"
          />
          <p className="absolute bottom-5 left-5 rounded-full bg-paper/90 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-char backdrop-blur">
            HAIR5S · Mumbai
          </p>
        </div>
      </section>

      <section className="container-x py-20 sm:py-24">
        <Reveal>
          <p className="eyebrow">How we work</p>
          <h2 className="display-lg mt-4 max-w-2xl text-char">Three steps, every visit.</h2>
        </Reveal>

        <div className="mt-10 grid gap-px overflow-hidden rounded-[24px] border border-char/10 bg-char/10 md:grid-cols-3">
          {APPROACH.map((step, index) => (
            <Reveal key={step.title} delay={index * 90}>
              <div className="h-full bg-paper p-7">
                <span className="font-display text-4xl font-semibold text-outline">0{index + 1}</span>
                <h3 className="mt-5 font-display text-2xl font-semibold text-char">{step.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ash">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-x pb-16">
        <Reveal>
          <div className="rounded-[26px] border border-char/10 bg-paper p-8 sm:p-12">
            <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="eyebrow">Photography</p>
                <h2 className="display-lg mt-3 text-char">Straight from the grid.</h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-ash">
                  Every photo on this site is real work from the salon’s Instagram. New sets can be added from the
                  admin panel without a code change.
                </p>
              </div>
              <a href={settings.instagram} target="_blank" rel="noreferrer noopener" className="btn-ghost btn-sm">
                @hair5s
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
