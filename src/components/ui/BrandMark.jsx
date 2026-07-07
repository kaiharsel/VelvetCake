/**
 * VelvetCake emblem — a gold cake slice with layered sponge and a piped
 * cream tip, recreated as crisp vector from the confectionery's embroidered
 * logo so it scales cleanly and sits well on the dark UI.
 *
 * To swap in the official artwork later: drop a transparent PNG/SVG at
 * /public/logo.svg and render <img src="/logo.svg" /> instead of this mark.
 */
export default function BrandMark({ className = '', title = 'VelvetCake' }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label={title}
      fill="none"
    >
      <defs>
        <linearGradient id="vc-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E4C889" />
          <stop offset="0.5" stopColor="#C6A15B" />
          <stop offset="1" stopColor="#A5813F" />
        </linearGradient>
      </defs>

      <g
        stroke="url(#vc-gold)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Slice body — side-profile wedge, tip to the right */}
        <path d="M18 44 L18 22 L48 44 Z" fill="url(#vc-gold)" fillOpacity="0.12" />
        {/* Layered sponge / cream */}
        <path d="M18 30 L29 30" />
        <path d="M18 37 L38 37" />
        {/* Piped cream tip on top */}
        <path
          d="M26 28 C 20 22, 23 14, 26 11 C 29 14, 32 22, 26 28 Z"
          fill="url(#vc-gold)"
          fillOpacity="0.12"
        />
      </g>
    </svg>
  )
}
