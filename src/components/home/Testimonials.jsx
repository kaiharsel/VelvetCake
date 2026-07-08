import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { testimonials } from '../../data/content'
import ChevronRight from '../ui/ChevronRight'

export default function Testimonials() {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => setI((v) => (v + 1) % testimonials.length), 5500)
    return () => clearInterval(id)
  }, [paused])

  const go = (dir) =>
    setI((v) => (v + dir + testimonials.length) % testimonials.length)

  const t = testimonials[i]

  return (
    <section
      className="relative overflow-hidden bg-wine-900 py-24 md:py-36"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Oversized quote mark */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-8 -translate-x-1/2 font-display text-[28vw] leading-none text-blood/10 md:text-[16rem]"
      >
        “
      </span>

      <div className="container-shell relative">
        <div className="mx-auto max-w-4xl text-center">
          <div className="relative min-h-[240px] md:min-h-[280px]">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="text-balance font-display text-3xl leading-snug text-cream md:text-[2.6rem] md:leading-[1.15]">
                  {t.quote}
                </p>
                <footer className="mt-8">
                  <div className="font-sans text-sm font-semibold uppercase tracking-[0.14em] text-cream">
                    {t.author}
                  </div>
                  <div className="mt-1 text-sm text-blood-400">{t.role}</div>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="mt-10 flex items-center justify-center gap-6">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Попередній відгук"
              className="focus-ring flex h-12 w-12 items-center justify-center rounded-full border border-cream/25 bg-ink/35 text-2xl leading-none text-cream transition-colors hover:border-blood-400 hover:bg-blood/25"
            >
              <ChevronRight className="rotate-180" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setI(idx)}
                  aria-label={`Відгук ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    idx === i ? 'w-8 bg-blood-400' : 'w-2 bg-cream/25'
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Наступний відгук"
              className="focus-ring flex h-12 w-12 items-center justify-center rounded-full border border-cream/25 bg-ink/35 text-2xl leading-none text-cream transition-colors hover:border-blood-400 hover:bg-blood/25"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
