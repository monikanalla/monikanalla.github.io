interface MarqueeProps {
  items: string[];
  className?: string;
  reverse?: boolean;
}

export function Marquee({ items, className = '', reverse = false }: MarqueeProps) {
  const row = [...items, ...items];

  return (
    <div className={`group relative flex overflow-hidden ${className}`} aria-hidden="true">
      <div
        className="flex min-w-max shrink-0 animate-marquee items-center gap-10 pr-10 group-hover:[animation-play-state:paused]"
        style={reverse ? { animationDirection: 'reverse' } : undefined}
      >
        {row.map((item, index) => (
          <span key={`${item}-${index}`} className="flex items-center gap-10">
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em]">{item}</span>
            <span className="text-[10px] text-wine-500">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
