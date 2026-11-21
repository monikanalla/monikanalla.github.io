import { useCallback, useEffect, useRef, useState } from 'react';

export interface Slide {
  id: string;
  image: string;
  title?: string;
  caption?: string;
}

interface SliderProps {
  slides: Slide[];
  autoPlay?: number;
}

const isPlaceholder = (src: string) => src.includes('/placeholders/');
const pad = (value: number) => String(value).padStart(2, '0');

export function Slider({ slides, autoPlay = 6200 }: SliderProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const dragStart = useRef<number | null>(null);

  const total = slides.length;
  const go = useCallback(
    (next: number) => {
      if (total === 0) return;
      setIndex(((next % total) + total) % total);
    },
    [total],
  );

  useEffect(() => {
    if (total <= 1 || paused) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % total), autoPlay);
    return () => window.clearInterval(timer);
  }, [autoPlay, paused, total]);

  useEffect(() => {
    if (index >= total) setIndex(0);
  }, [index, total]);

  if (total === 0) {
    return (
      <div className="flex aspect-[16/10] items-center justify-center rounded-[26px] border border-dashed border-char/20 text-[10px] uppercase tracking-[0.2em] text-ash">
        Slider images will appear here
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_250px]">
      <div
        className="group relative select-none overflow-hidden rounded-[26px] border border-char/10 bg-paper shadow-lift"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onPointerDown={(event) => {
          dragStart.current = event.clientX;
          setPaused(true);
        }}
        onPointerUp={(event) => {
          if (dragStart.current !== null) {
            const delta = event.clientX - dragStart.current;
            if (Math.abs(delta) > 48) go(index + (delta < 0 ? 1 : -1));
          }
          dragStart.current = null;
          setPaused(false);
        }}
        onPointerCancel={() => {
          dragStart.current = null;
          setPaused(false);
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') go(index + 1);
          if (event.key === 'ArrowLeft') go(index - 1);
        }}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="HAIR5S work"
      >
        <div
          className="flex transition-transform duration-[900ms] ease-luxe"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, slideIndex) => (
            <figure
              key={slide.id}
              className="relative aspect-[4/5] w-full shrink-0 sm:aspect-[16/11] lg:aspect-[16/10]"
              aria-hidden={slideIndex !== index}
            >
              {isPlaceholder(slide.image) ? <span className="placeholder-tag">Placeholder</span> : null}
              <img
                src={slide.image}
                alt={slide.title ? `${slide.title} at HAIR5S` : 'HAIR5S salon work'}
                className="h-full w-full object-cover"
                loading={slideIndex === 0 ? 'eager' : 'lazy'}
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-char/70 via-char/5 to-transparent" />

              <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6 sm:p-8">
                <div>
                  {slide.title ? (
                    <p className="max-w-md font-display text-2xl font-semibold leading-tight text-paper sm:text-3xl">
                      {slide.title}
                    </p>
                  ) : null}
                  {slide.caption ? (
                    <p className="mt-1.5 max-w-sm text-[11px] leading-relaxed text-paper/70 sm:text-xs">
                      {slide.caption}
                    </p>
                  ) : null}
                </div>
                <span className="shrink-0 font-display text-sm font-semibold tabular-nums text-paper/90">
                  {pad(slideIndex + 1)}
                  <span className="text-paper/40"> / {pad(total)}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        {total > 1 ? (
          <>
            <div className="absolute right-5 top-5 flex gap-2 sm:right-7 sm:top-7">
              <button
                type="button"
                onClick={() => go(index - 1)}
                aria-label="Previous slide"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-paper/30 bg-char/25 text-paper backdrop-blur transition hover:bg-paper hover:text-char"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => go(index + 1)}
                aria-label="Next slide"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-paper/30 bg-char/25 text-paper backdrop-blur transition hover:bg-paper hover:text-char"
              >
                →
              </button>
            </div>

            <div className="absolute inset-x-6 bottom-0 h-[2px] bg-paper/25 sm:inset-x-8">
              <div
                className="h-full bg-paper transition-all duration-700 ease-luxe"
                style={{ width: `${((index + 1) / total) * 100}%` }}
              />
            </div>
          </>
        ) : null}
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar lg:flex-col lg:overflow-visible">
        {slides.map((slide, slideIndex) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => go(slideIndex)}
            aria-label={`Show slide ${slideIndex + 1}`}
            aria-current={slideIndex === index}
            className={`group relative aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-2xl border transition duration-500 ease-luxe lg:aspect-[16/11] lg:w-full ${
              slideIndex === index ? 'border-char' : 'border-char/10 opacity-70 hover:opacity-100'
            }`}
          >
            <img src={slide.image} alt="" className="h-full w-full object-cover" loading="lazy" />
            <span
              className={`absolute bottom-2 left-2 rounded-full px-2 py-0.5 text-[9px] font-semibold tabular-nums ${
                slideIndex === index ? 'bg-char text-paper' : 'bg-paper/85 text-char'
              }`}
            >
              {pad(slideIndex + 1)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
