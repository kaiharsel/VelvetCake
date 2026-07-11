import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Seo from '../components/ui/Seo'
import DessertCard from '../components/ui/DessertCard'
import Button from '../components/ui/Button'
import ChevronRight from '../components/ui/ChevronRight'
import CtaSection from '../components/shared/CtaSection'
import { categories } from '../data/desserts'
import { site } from '../data/site'
import { useDesserts } from '../hooks/useDesserts'
import { gsap, prefersReducedMotion } from '../lib/gsap'

export default function Menu() {
  const heroRef = useRef(null)
  const controlsRef = useRef(null)
  const catalogRef = useRef(null)
  const railRef = useRef(null)
  const [params, setParams] = useSearchParams()
  const initialCat = params.get('cat') || 'all'
  const [cat, setCat] = useState(
    categories.some((c) => c.id === initialCat) ? initialCat : 'all',
  )
  const [query, setQuery] = useState('')
  const [showCategoryHint, setShowCategoryHint] = useState(true)
  const { desserts } = useDesserts()

  useLayoutEffect(() => {
    if (prefersReducedMotion) return
    const el = heroRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power4.out' } })
        .from('[data-menu-hero-line] > span', {
          yPercent: 115,
          duration: 1.2,
          stagger: 0.12,
        })
        .from(
          '[data-menu-hero-fade]',
          { opacity: 0, y: 24, duration: 1 },
          '-=0.7',
        )
    }, el)

    return () => ctx.revert()
  }, [])

  // Keep the active category chip in view inside the horizontal rail (mobile).
  // Matters when arriving from the Home page with a category that sits past the
  // visible start of the row.
  useEffect(() => {
    const rail = railRef.current
    if (!rail) return
    const activeChip = rail.querySelector('[aria-selected="true"]')
    if (!activeChip) return
    const target =
      activeChip.offsetLeft - (rail.clientWidth - activeChip.clientWidth) / 2
    rail.scrollTo({
      left: Math.max(target, 0),
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })
  }, [cat])

  const scrollToCatalogStart = () => {
    window.requestAnimationFrame(() => {
      const catalog = catalogRef.current
      if (!catalog) return

      const catalogTop = window.scrollY + catalog.getBoundingClientRect().top
      const controlsBottom = controlsRef.current?.getBoundingClientRect().bottom
      const fallbackOffset = window.matchMedia('(min-width: 768px)').matches ? 160 : 150
      const offset =
        controlsBottom && controlsBottom > 0 && controlsBottom < window.innerHeight
          ? controlsBottom + 16
          : fallbackOffset
      const targetTop = Math.max(catalogTop - offset, 0)

      if (window.scrollY <= targetTop + 12) return

      window.scrollTo({
        top: targetTop,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      })
    })
  }

  const setCategory = (id) => {
    setCat(id)
    const nextParams = new URLSearchParams(params)
    if (id === 'all') nextParams.delete('cat')
    else nextParams.set('cat', id)
    setParams(nextParams, { replace: true })
    scrollToCatalogStart()
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
  }, [cat, desserts, query])

  return (
    <>
      <Seo
        title="Меню"
        description="Меню VelvetCake: авторські торти, трайфли, тістечка та сигнатурні десерти темного люксу. Оберіть і оформіть замовлення онлайн"
        path="/menu"
      />

      {/* Header */}
      <header ref={heroRef} className="relative bg-wine-900 pb-16 pt-36 md:pb-24 md:pt-48">
        <div className="container-shell">
          <h1 className="display-xl max-w-4xl text-balance font-display text-cream">
            <span data-menu-hero-line className="reveal-line">
              <span className="block">Оберіть свій</span>
            </span>
            <span data-menu-hero-line className="reveal-line">
              <span className="block">
                <span className="italic text-blood-400">ідеальний</span> десерт
              </span>
            </span>
          </h1>
          <p
            className="mt-6 max-w-xl text-pretty text-mute md:text-lg"
            data-menu-hero-fade
          >
            Торти, бенто, десерти, капкейки та кенді-бари з вашим дизайном або
            з нашого портфоліо. Доставка по Львову та самовивіз
          </p>
        </div>
      </header>

      {/* Controls */}
      <div
        ref={controlsRef}
        className="below-mobile-header sticky z-30 border-y border-cream/10 bg-ink/85 backdrop-blur-md"
      >
        <div className="container-shell flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative min-w-0 lg:flex-1">
            <div
              ref={railRef}
              onScroll={(event) => {
                const rail = event.currentTarget
                setShowCategoryHint(
                  rail.scrollLeft + rail.clientWidth < rail.scrollWidth - 4,
                )
              }}
              className="flex snap-x flex-nowrap gap-2 overflow-x-auto px-6 pb-1 pr-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:flex-wrap lg:overflow-visible lg:px-0 lg:pb-0 lg:pr-0"
              role="tablist"
              aria-label="Категорії"
            >
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  role="tab"
                  aria-selected={cat === c.id}
                  onClick={() => setCategory(c.id)}
                  className={`shrink-0 snap-start rounded-full px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.1em] transition-all duration-300 [-webkit-tap-highlight-color:transparent] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blood-400/70 active:scale-95 active:border-blood-400 active:text-blood-400 ${
                    cat === c.id
                      ? 'border border-blood bg-blood text-cream'
                      : 'border border-cream/20 text-mute md:hover:border-blood-400 md:hover:bg-blood/10 md:hover:text-blood-400'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute right-0 top-0 bottom-1 z-10 flex w-16 items-center justify-end bg-gradient-to-l from-ink/90 via-ink/50 to-transparent pr-1 transition-opacity duration-300 lg:hidden ${
                showCategoryHint ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <span className="grid h-8 w-8 place-items-center rounded-full border border-blood-400/60 bg-ink/80 text-blood-400 backdrop-blur-md">
                <ChevronRight className="h-5 w-5" />
              </span>
            </div>
          </div>

          <div className="relative w-full lg:w-72">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={scrollToCatalogStart}
              placeholder="Пошук десерту…"
              aria-label="Пошук десерту"
              className="w-full rounded-full border border-wine-700/70 bg-transparent py-2.5 pl-11 pr-4 text-sm text-cream placeholder:text-mute transition-colors focus:border-blood-400/70 focus:outline-none focus:ring-1 focus:ring-blood-400/30"
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
      <section ref={catalogRef} className="bg-ink py-14 md:py-20">
        <div className="container-shell">
          <p className="mb-8 text-sm text-mute">
            Показано {filtered.length}{' '}
            {filtered.length === 1 ? 'десерт' : 'десертів'}
          </p>

          {filtered.length === 0 ? (
            <div className="grid place-items-center py-24 text-center">
              <p className="font-display text-3xl italic text-cream">Нічого не знайдено</p>
              <Button
                onClick={() => {
                  setQuery('')
                  setCategory('all')
                }}
                variant="outline"
                arrow={false}
                className="mt-6"
              >
                Скинути фільтри
              </Button>
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
                    <DessertCard dessert={d} showTagline={false} />
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
        primary={{
          label: 'Написати нам',
          href: site.socials.find((social) => social.label === 'Instagram')?.href,
          target: '_blank',
        }}
        secondary={{ label: 'Майстер-класи', to: '/masterclasses' }}
      />
    </>
  )
}
