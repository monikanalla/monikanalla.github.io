interface BrandLogoProps {
  className?: string;
  alt?: string;
  compact?: boolean;
}

/**
 * HAIR5S wordmark — drawn in code so it stays crisp at every size and
 * inherits the palette (ink + oxblood). Swap for a supplied logo file by
 * replacing this component's body with an <img>.
 */
export function BrandLogo({ className = '', alt = 'HAIR5S Unisex Salon', compact = false }: BrandLogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`} role="img" aria-label={alt}>
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-char">
        <svg viewBox="0 0 64 64" className="h-5 w-5" aria-hidden="true">
          <path
            d="M22 14c-3.4 0-6 2.6-6 6s2.6 6 6 6c1.7 0 3.2-.7 4.3-1.8L31 31l-4.7 6.8A5.9 5.9 0 0 0 22 36c-3.4 0-6 2.6-6 6s2.6 6 6 6 6-2.7 6-6c0-.6-.1-1.2-.3-1.8l5-7.2 5 7.2c-.2.6-.3 1.2-.3 1.8 0 3.3 2.7 6 6 6s6-2.7 6-6-2.7-6-6-6c-1.3 0-2.5.4-3.4 1.1L31 31l4.7-6.8c1 .9 2.3 1.4 3.7 1.4 3.3 0 6-2.7 6-6s-2.7-6-6-6-6 2.7-6 6c0 .6.1 1.2.3 1.8l-2.7 3.9-2.7-3.9c.2-.6.3-1.2.3-1.8 0-3.4-2.6-6-6-6Z"
            fill="#F2EDE3"
          />
          <circle cx="22" cy="20" r="2.4" fill="#A23443" />
          <circle cx="42" cy="20" r="2.4" fill="#A23443" />
        </svg>
      </span>

      <span className="flex flex-col leading-none">
        <span className="font-display text-[21px] font-extrabold uppercase tracking-[-0.06em] text-char">
          Hair<span className="text-wine-500">5</span>s
        </span>
        {compact ? null : (
          <span className="mt-[5px] text-[7px] font-semibold uppercase tracking-[0.36em] text-ash">Unisex Salon</span>
        )}
      </span>
    </span>
  );
}
