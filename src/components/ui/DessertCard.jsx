import { Link } from 'react-router-dom'
import Figure from './Figure'
import { categories } from '../../data/desserts'

const catLabel = (id) => categories.find((c) => c.id === id)?.label || ''

const fmtPrice = (p) => new Intl.NumberFormat('uk-UA').format(p)

/**
 * Product card used on the Menu grid, Popular rail and Related rows.
 * `ratio` lets callers vary the crop; `index` staggers reveal delays.
 */
export default function DessertCard({ dessert, ratio = '4 / 5', className = '' }) {
  const { slug, name, category, short, price, unit, tone, tagline } = dessert

  return (
    <Link
      to={`/menu/${slug}`}
      className={`focus-ring group block ${className}`}
      aria-label={`${name} — детальніше`}
    >
      <div className="relative overflow-hidden rounded-[3px]">
        <Figure
          tone={tone}
          ratio={ratio}
          label={name}
          className="transition-transform duration-[900ms] ease-velvet group-hover:scale-[1.04]"
          // src={`/desserts/${slug}.jpg`}
        />
        {/* Hover veil + CTA */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <span className="pointer-events-none absolute bottom-4 left-4 translate-y-3 rounded-full bg-cream px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink opacity-0 transition-all duration-500 ease-velvet group-hover:translate-y-0 group-hover:opacity-100">
          Детальніше <span className="inline-block text-[1.5em] leading-none align-middle">→</span>
        </span>
        {tagline && (
          <span className="absolute right-3 top-3 rounded-full bg-ink/70 px-3 py-1 text-[10px] uppercase tracking-[0.12em] text-cream/90 backdrop-blur-sm">
            {tagline}
          </span>
        )}
      </div>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-mute">
            {catLabel(category)}
          </p>
          <h3 className="mt-1 font-display text-2xl leading-tight text-cream transition-colors duration-300 group-hover:text-blood-400">
            {name}
          </h3>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-mute">
            {short}
          </p>
        </div>
        <div className="whitespace-nowrap text-right">
          <span className="font-display text-2xl text-cream">
            {fmtPrice(price)}
          </span>
          <span className="ml-1 text-sm text-mute">грн</span>
          <p className="mt-1 text-[11px] uppercase tracking-[0.1em] text-mute">
            {unit}
          </p>
        </div>
      </div>
    </Link>
  )
}
