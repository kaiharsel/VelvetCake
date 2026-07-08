import { useLayoutEffect, useRef } from 'react'
import SectionHeading from '../ui/SectionHeading'
import Figure from '../ui/Figure'
import { galleryCaptions } from '../../data/content'
import { gsap, prefersReducedMotion } from '../../lib/gsap'

const items = [
  { tone: 'wine', ratio: '4 / 5', col: 0 },
  { tone: 'blood', ratio: '1 / 1', col: 1 },
  { tone: 'ink', ratio: '4 / 5', col: 2 },
  { tone: 'ink', ratio: '4 / 5', col: 0 },
  { tone: 'wine', ratio: '4 / 5', col: 1 },
  { tone: 'blood', ratio: '1 / 1', col: 2 },
]

export default function Gallery() {
  const section = useRef(null)

  useLayoutEffect(() => {
    if (prefersReducedMotion) return
    const el = section.current
    if (!el) return
    const ctx = gsap.context(() => {
      // Columns drift at different speeds for depth.
      const speeds = [-60, 40, -90]
      gsap.utils.toArray('[data-col]').forEach((col, i) => {
        gsap.to(col, {
          y: speeds[i % speeds.length],
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      })
    }, el)
    return () => ctx.revert()
  }, [])

  const cols = [0, 1, 2].map((c) => items.filter((it) => it.col === c))

  return (
    <section ref={section} className="relative overflow-hidden bg-ink-800 py-24 md:py-36">
      <div className="container-shell">
        <SectionHeading
          align="center"
          className="mx-auto"
          title={
            <>
              Кожен десерт як <span className="italic text-blood-400">окрема сцена</span>
            </>
          }
          lede="Світло, фактура й колір продумані до дрібниць. Так виглядає темний люкс"
        />

        <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {cols.map((colItems, ci) => (
            <div
              key={ci}
              data-col
              className={`flex flex-col gap-4 md:gap-6 ${
                ci === 1 ? 'mt-10 md:mt-16' : ''
              } ${ci === 2 ? 'hidden md:flex' : ''}`}
            >
              {colItems.map((it, idx) => (
                <div
                  key={idx}
                  className="group relative overflow-hidden rounded-[3px]"
                >
                  <Figure
                    tone={it.tone}
                    ratio={it.ratio}
                    label={galleryCaptions[(ci * 2 + idx) % galleryCaptions.length]}
                    className="transition-transform duration-[1200ms] ease-velvet md:group-hover:scale-105"
                  />
                  <span className="absolute bottom-3 left-3 rounded-full bg-ink/70 px-3 py-1 text-[10px] uppercase tracking-[0.12em] text-cream/90 opacity-100 backdrop-blur-sm transition-opacity duration-500 md:opacity-0 md:group-hover:opacity-100">
                    {galleryCaptions[(ci * 2 + idx) % galleryCaptions.length]}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
