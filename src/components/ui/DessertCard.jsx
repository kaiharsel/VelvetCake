import Figure from './Figure'
import ChevronRight from './ChevronRight'
import DelayedLink from './DelayedLink'
import { categories } from '../../data/desserts'

const catLabel = (id) => categories.find((c) => c.id === id)?.label || ''

const fmtPrice = (p) => String(p)

/**
 * Product card used on the Menu grid, Popular rail and Related rows.
 * `ratio` lets callers vary the crop; `index` staggers reveal delays.
 */
export default function DessertCard({
  dessert,
  ratio = '4 / 5',
  className = '',
  showTagline = true,
}) {
  const { slug, name, category, short, price, unit, tone, tagline } = dessert

  return (
    <DelayedLink
      to={`/menu/${slug}`}
      className={`focus-ring group block transition-all duration-500 active:scale-[0.99] data-[pending=true]:scale-[0.97] ${className}`}
      aria-label={`${name}. Детальніше`}
    >
      <div className="relative overflow-hidden rounded-[3px]">
        <Figure
          tone={tone}
          ratio={ratio}
          label={name}
          className="transition-transform duration-[900ms] ease-velvet group-data-[pending=true]:scale-[1.04] md:group-hover:scale-[1.04]"
          // src={`/desserts/${slug}.jpg`}
        />
        {/* Hover veil + CTA */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 md:group-hover:opacity-100" />
        <span className="pointer-events-none absolute bottom-4 left-4 hidden translate-y-3 items-center gap-2 rounded-full border border-cream/20 bg-ink/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-cream opacity-0 shadow-[0_10px_28px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-500 ease-velvet md:flex md:group-hover:translate-y-0 md:group-hover:border-blood-400 md:group-hover:opacity-100">
          Детальніше <ChevronRight />
        </span>
        {showTagline && tagline && (
          <span className="absolute right-3 top-3 rounded-full bg-ink/70 px-3 py-1 text-[10px] uppercase tracking-[0.12em] text-cream/90 backdrop-blur-sm">
            {tagline}
          </span>
        )}
      </div>

      <div className="mt-5">
        <p className="text-[11px] uppercase tracking-[0.14em] text-mute">
          {catLabel(category)}
        </p>
        <h3 className="mt-1 font-display text-2xl leading-tight text-cream transition-colors duration-300 group-data-[pending=true]:text-blood-400 md:group-hover:text-blood-400">
          {name}
        </h3>

        <div className="mt-4 flex items-center justify-between gap-4 rounded-[4px] border border-cream/10 bg-cream/[0.025] px-4 py-3 transition-colors duration-300 md:group-hover:border-blood-400/35 md:group-hover:bg-blood/[0.06]">
          <div className="flex items-end gap-2 whitespace-nowrap">
            <span className="pb-[2px] text-[10px] font-semibold uppercase leading-none tracking-[0.14em] text-mute">
              Від
            </span>
            <span className="price-display translate-y-[3px] text-3xl font-semibold leading-none tracking-tight text-blood-400">
              {fmtPrice(price)}
            </span>
            <span className="pb-px text-sm leading-none text-cream/80">грн</span>
          </div>
          <span className="shrink-0 rounded-full border border-cream/15 bg-ink/50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-cream/70">
            {unit}
          </span>
        </div>

        <p className="mt-4 max-w-sm text-sm leading-relaxed text-mute">
          {short}
        </p>
      </div>
    </DelayedLink>
  )
}
