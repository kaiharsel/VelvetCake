import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Seo from '../components/ui/Seo'
import DessertCard from '../components/ui/DessertCard'
import Reveal from '../components/ui/Reveal'
import CtaSection from '../components/shared/CtaSection'
import { categories, desserts } from '../data/desserts'

export default function Menu() {
  const [params, setParams] = useSearchParams()
  const initialCat = params.get('cat') || 'all'
  const [cat, setCat] = useState(
    categories.some((c) => c.id === initialCat) ? initialCat : 'all',
  )
  const [query, setQuery] = useState('')

  const setCategory = (id) => {
    setCat(id)
    if (id === 'all') params.delete('cat')
    else params.set('cat', id)
    setParams(params, { replace: true })
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return desserts.filter((d) => {
      const matchCat = cat === 'all' || d.category === cat
      const matchQuery =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.short.toLowerCase().includes(q) ||
        d.tagline.toLowerCase().includes(q)
      return matchCat && matchQuery
    })
  }, [cat, query])

  return (
    <>
      <Seo
        title="Меню"
        description="Меню VelvetCake: авторські торти, тарти, тістечка та сигнатурні десерти темного люксу. Оберіть і оформіть замовлення онлайн."
        path="/menu"
      />

      {/* Header */}
      <header className="relative bg-wine-900 pb-16 pt-36 md:pb-24 md:pt-48">
        <div className="container-shell">
          <Reveal stagger={0.1}>
            <h1
              className="display-xl max-w-4xl text-balance font-display text-cream"
              data-reveal
            >
              Оберіть свій <span className="italic text-blood-400">ідеальний</span> десерт
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-mute md:text-lg" data-reveal>
              Торти, бенто, десерти, капкейки та кенді-бари — з вашим дизайном чи
              з нашого портфоліо. Доставка по Львову або самовивіз.
            </p>
          </Reveal>
        </div>
      </header>

      {/* Controls */}
      <div className="sticky top-[68px] z-30 border-y border-cream/10 bg-ink/85 backdrop-blur-md md:top-[76px]">
        <div className="container-shell flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Категорії">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={cat === c.id}
                onClick={() => setCategory(c.id)}
                className={`focus-ring rounded-full px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.1em] transition-colors duration-300 ${
                  cat === c.id
                    ? 'bg-blood text-cream'
                    : 'border border-cream/20 text-mute hover:border-cream/50 hover:text-cream'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-72">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Пошук десерту…"
              aria-label="Пошук десерту"
              className="focus-ring w-full rounded-full border border-cream/20 bg-transparent py-2.5 pl-11 pr-4 text-sm text-cream placeholder:text-mute focus:border-cream/50"
            />
            <svg
              viewBox="0 0 24 24"
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mute"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
              <path d="m20 20-3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="bg-ink py-14 md:py-20">
        <div className="container-shell">
          <p className="mb-8 text-sm text-mute">
            Показано {filtered.length}{' '}
            {filtered.length === 1 ? 'десерт' : 'десертів'}
          </p>

          {filtered.length === 0 ? (
            <div className="grid place-items-center py-24 text-center">
              <p className="font-display text-3xl italic text-cream">Нічого не знайдено</p>
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  setCategory('all')
                }}
                className="focus-ring mt-6 rounded-full border border-cream/30 px-6 py-3 text-sm uppercase tracking-[0.14em] text-cream transition-colors hover:bg-cream hover:text-ink"
              >
                Скинути фільтри
              </button>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((d) => (
                  <motion.div
                    key={d.slug}
                    layout
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <DessertCard dessert={d} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      <CtaSection
        title={
          <>
            Замовте свій <span className="italic text-blood-400">десерт</span>
          </>
        }
        primary={{ label: 'Написати нам', to: '/menu' }}
        secondary={{ label: 'Майстер-класи', to: '/masterclasses' }}
      />
    </>
  )
}
