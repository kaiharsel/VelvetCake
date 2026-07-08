import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'
import Figure from '../ui/Figure'
import ChevronRight from '../ui/ChevronRight'
import DelayedLink from '../ui/DelayedLink'
import { productCategories } from '../../data/content'

const tones = ['wine', 'blood', 'ink', 'wine']

export default function Categories() {
  return (
    <section className="mobile-reveal-static relative bg-ink-800 py-24 md:py-36">
      <div className="container-shell">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            title={
              <>
                Оберіть свою <span className="italic text-blood-400">категорію</span>
              </>
            }
          />
          <Reveal>
            <p
              className="max-w-sm text-pretty text-mute md:text-right"
              data-reveal
            >
              Від маленьких бенто-тортів до великих кенді-барів. Усе створюємо
              для вашої події
            </p>
          </Reveal>
        </div>

        <div
          className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
        >
          {productCategories.map((cat, i) => (
            <DelayedLink
              key={cat.id}
              to={`/menu?cat=${cat.id}`}
              className="focus-ring group relative block overflow-hidden rounded-[3px] border border-cream/15 transition-all duration-500 active:scale-[0.99] data-[pending=true]:scale-[0.97] data-[pending=true]:border-blood-400 md:hover:border-blood-400"
            >
              <Figure
                src={`/desserts/category-${cat.id}.png`}
                alt={cat.title}
                tone={tones[i % tones.length]}
                ratio="3 / 4"
                label={cat.title}
                className="transition-transform duration-[900ms] ease-velvet group-data-[pending=true]:scale-105 md:group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-3xl text-cream">
                    {cat.title}
                  </h3>
                  <ChevronRight className="h-6 w-6 text-cream/70 transition-all duration-500 md:group-hover:translate-x-1 md:group-hover:text-blood-400" />
                </div>
                <p className="mt-3 inline-flex rounded-full border border-cream/15 bg-ink/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-cream/90 shadow-[0_8px_24px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-colors duration-300 group-data-[pending=true]:border-blood-400 md:group-hover:border-blood-400">
                  {cat.count}
                </p>
                <p className="mt-3 max-h-24 overflow-hidden text-sm leading-relaxed text-cream/70 opacity-100 transition-all duration-500 ease-velvet md:max-h-0 md:opacity-0 md:group-hover:max-h-24 md:group-hover:opacity-100">
                  {cat.text}
                </p>
              </div>
            </DelayedLink>
          ))}
        </div>
      </div>
    </section>
  )
}
