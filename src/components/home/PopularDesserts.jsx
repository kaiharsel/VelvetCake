import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import DessertCard from '../ui/DessertCard'
import { desserts } from '../../data/desserts'
import { gsap, prefersReducedMotion } from '../../lib/gsap'

// A curated selection for the rail.
const rail = [
  desserts.find((d) => d.slug === 'klasychnyi-tort'),
  desserts.find((d) => d.slug === 'bento-tort'),
  desserts.find((d) => d.slug === 'kendi-bar'),
  desserts.find((d) => d.slug === 'vesilnyi-tort'),
  desserts.find((d) => d.slug === 'pavlova'),
  desserts.find((d) => d.slug === 'kapkeiky'),
].filter(Boolean)

export default function PopularDesserts() {
  const section = useRef(null)
  const track = useRef(null)

  useLayoutEffect(() => {
    if (prefersReducedMotion) return
    const el = section.current
    const trackEl = track.current
    if (!el || !trackEl) return

    const mm = gsap.matchMedia()
    mm.add('(min-width: 768px)', () => {
      const distance = trackEl.scrollWidth - window.innerWidth
      const tween = gsap.to(trackEl, {
        x: -distance,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: () => `+=${distance}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
      return () => tween.kill()
    })

    return () => mm.revert()
  }, [])

  return (
    <section
      ref={section}
      className="relative overflow-hidden bg-ink py-24 md:flex md:h-[100svh] md:flex-col md:py-0"
    >
      {/* Header — sits in its own space above the rail */}
      <div className="container-shell flex items-end justify-between gap-6 border-b border-cream/10 pb-8 md:pb-10 md:pt-28">
        <div>
          <h2 className="display-lg font-display text-cream">
            Улюбленці <span className="italic text-blood-400">гостей</span>
          </h2>
        </div>
        <Link
          to="/menu"
          className="focus-ring hidden shrink-0 items-center gap-2 rounded-full border border-cream/25 px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-cream transition-colors hover:border-blood-400 hover:bg-blood-400 hover:text-ink md:inline-flex"
        >
          Усе меню <span className="inline-block text-[1.4em] leading-none align-middle">→</span>
        </Link>
      </div>

      {/* Desktop: horizontal pinned track. Mobile: native horizontal scroll. */}
      <div className="md:flex md:min-h-0 md:flex-1 md:items-center">
        <div
          ref={track}
          className="flex gap-5 overflow-x-auto pb-4 pt-10 [scrollbar-width:none] md:gap-8 md:overflow-visible md:py-0 md:pl-[max(1.5rem,calc((100vw-1600px)/2+4rem))] md:pr-[12vw]"
        >
          {rail.map((d) => (
            <div
              key={d.slug}
              className="w-[74vw] shrink-0 sm:w-[52vw] md:w-[27vw] lg:w-[21vw]"
            >
              <DessertCard dessert={d} ratio="3 / 4" />
            </div>
          ))}
          {/* Tail CTA card */}
          <div className="flex w-[74vw] shrink-0 items-center sm:w-[52vw] md:w-[21vw]">
            <Link
              to="/menu"
              className="focus-ring group flex aspect-[3/4] w-full flex-col items-center justify-center gap-4 rounded-[3px] border border-cream/15 text-center transition-colors hover:border-blood-400"
            >
              <span className="font-display text-3xl italic text-cream">
                Дивитись усе
              </span>
              <span className="text-sm uppercase tracking-[0.14em] text-blood-400 transition-transform group-hover:translate-x-1">
                30+ десертів <span className="inline-block text-[1.4em] leading-none align-middle">→</span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
