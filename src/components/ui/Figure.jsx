import { useState } from 'react'

const toneStyles = {
  wine: {
    bg: 'radial-gradient(120% 100% at 30% 0%, #4C1017 0%, #2A080D 55%, #160406 100%)',
    ring: 'rgba(192,41,59,0.28)',
    mono: '#C0293B',
  },
  blood: {
    bg: 'radial-gradient(120% 100% at 70% 10%, #A8202F 0%, #5C0E18 55%, #200206 100%)',
    ring: 'rgba(244,238,226,0.22)',
    mono: '#F4EDE2',
  },
  ink: {
    bg: 'radial-gradient(120% 100% at 40% 0%, #241719 0%, #140D0E 55%, #0A0607 100%)',
    ring: 'rgba(154,134,123,0.24)',
    mono: '#9A867B',
  },
  cream: {
    bg: 'radial-gradient(120% 100% at 30% 0%, #EEE5D6 0%, #D7C6B3 60%, #B7A08A 100%)',
    ring: 'rgba(58,12,18,0.2)',
    mono: '#3A0C12',
  },
}

/**
 * Image with a graceful, on-brand placeholder fallback.
 *
 * Pass `src` once real photography is ready (drop files in /public/desserts).
 * Until then a styled velvet block with the VC monogram + `label` renders,
 * keeping layout and mood intact. `ratio` is any CSS aspect-ratio string.
 */
export default function Figure({
  src,
  alt = '',
  label,
  ratio = '4 / 5',
  tone = 'wine',
  className = '',
  imgClassName = '',
  priority = false,
  children,
}) {
  const [loaded, setLoaded] = useState(false)
  const t = toneStyles[tone] || toneStyles.wine

  return (
    <div
      className={`relative overflow-hidden bg-ink-800 ${className}`}
      style={{ aspectRatio: ratio }}
    >
      {/* Placeholder — always painted; hides once a real image loads */}
      <div
        aria-hidden={!!src}
        className="absolute inset-0 grid place-items-center transition-opacity duration-700"
        style={{ background: t.bg, opacity: src && loaded ? 0 : 1 }}
      >
        <div
          className="absolute inset-3 rounded-[2px]"
          style={{ boxShadow: `inset 0 0 0 1px ${t.ring}` }}
        />
        <div className="flex flex-col items-center gap-3 px-6 text-center">
          <span
            className="font-display text-4xl italic leading-none md:text-5xl"
            style={{ color: t.mono }}
          >
            VC
          </span>
          {label && (
            <span
              className="font-sans text-[10px] uppercase tracking-label"
              style={{ color: t.mono, opacity: 0.72 }}
            >
              {label}
            </span>
          )}
        </div>
      </div>

      {src && (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchpriority={priority ? 'high' : 'auto'}
          onLoad={() => setLoaded(true)}
          className={`relative h-full w-full object-cover transition-opacity duration-700 ${
            loaded ? 'opacity-100' : 'opacity-0'
          } ${imgClassName}`}
        />
      )}

      {children}
    </div>
  )
}
