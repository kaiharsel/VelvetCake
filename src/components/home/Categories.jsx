import { Link } from 'react-router-dom'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'
import Figure from '../ui/Figure'
import { productCategories } from '../../data/content'

const tones = ['wine', 'blood', 'ink', 'wine']

export default function Categories() {
  return (
    <section className="relative bg-ink-800 py-24 md:py-36">
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
              Від маленьких бенто-тортів до великих кенді-барів — усе під вашу
              подію.
            </p>
          </Reveal>
        </div>

        <Reveal
          className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
          stagger={0.1}
          y={60}
        >
          {productCategories.map((cat, i) => (
            <Link
              key={cat.id}
              to={`/menu?cat=${cat.id}`}
              data-reveal
              className="focus-ring group relative block overflow-hidden rounded-[3px]"
            >
              <Figure
                tone={tones[i % tones.length]}
                ratio="3 / 4"
                label={cat.title}
                className="transition-transform duration-[900ms] ease-velvet group-hover:scale-105"
                // src={`/desserts/cat-${cat.id}.jpg`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-3xl text-cream">
                    {cat.title}
                  </h3>
                  <span className="text-2xl leading-none text-cream/70 transition-transform duration-500 group-hover:translate-x-1 group-hover:text-blood-400">
                    →
                  </span>
                </div>
                <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-blood-400">
                  {cat.count}
                </p>
                <p className="mt-3 max-h-0 overflow-hidden text-sm leading-relaxed text-cream/70 opacity-0 transition-all duration-500 ease-velvet group-hover:max-h-24 group-hover:opacity-100">
                  {cat.text}
                </p>
              </div>
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
