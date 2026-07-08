import { useLayoutEffect, useRef } from 'react'
import DessertCard from '../ui/DessertCard'
import ChevronRight from '../ui/ChevronRight'
import Button from '../ui/Button'
import DelayedLink from '../ui/DelayedLink'
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
      const distance = () => Math.max(0, trackEl.scrollWidth - window.innerWidth)
      const tween = gsap.to(trackEl, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: () => `+=${distance()}`,
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
        <Button
          to="/menu"
          variant="outline"
          size="sm"
          className="hidden shrink-0 md:inline-flex"
        >
          Усе меню
        </Button>
      </div>

      {/* Mobile: native swipe carousel. Desktop: horizontal pinned track. */}
      <div className="md:flex md:min-h-0 md:flex-1 md:items-center">
        <div
          ref={track}
          className="flex snap-x snap-mandatory scroll-px-12 gap-5 overflow-x-auto pb-4 pl-12 pr-8 pt-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:snap-none md:gap-8 md:overflow-visible md:px-0 md:py-0 md:pl-[max(1.5rem,calc((100vw-1600px)/2+4rem))] md:pr-[12vw]"
        >
          {rail.map((d) => (
            <div
              key={d.slug}
              className="w-[74vw] shrink-0 snap-center first:snap-start sm:w-[52vw] md:w-[27vw] md:snap-align-none lg:w-[21vw]"
            >
              <DessertCard dessert={d} ratio="3 / 4" showTagline={false} />
            </div>
          ))}
          {/* Tail CTA card */}
          <div className="flex w-[74vw] shrink-0 snap-center items-stretch sm:w-[52vw] md:w-[21vw] md:snap-align-none">
            <DelayedLink
              to="/menu"
              className="focus-ring group flex w-full flex-1 flex-col items-center justify-center gap-4 rounded-[3px] border border-cream/15 text-center transition-all duration-500 active:scale-[0.99] data-[pending=true]:scale-[0.97] data-[pending=true]:border-blood-400 md:hover:border-blood-400"
            >
              <span className="font-display text-3xl italic text-cream">
                Дивитись все
              </span>
              <span className="flex items-center gap-2 text-sm uppercase tracking-[0.14em] text-blood-400 transition-transform group-data-[pending=true]:translate-x-1 md:group-hover:translate-x-1">
                30+ десертів <ChevronRight />
              </span>
            </DelayedLink>
          </div>
        </div>
      </div>
    </section>
  )
}
