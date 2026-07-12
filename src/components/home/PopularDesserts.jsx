import { useLayoutEffect, useMemo, useRef } from 'react'
import DessertCard from '../ui/DessertCard'
import ChevronRight from '../ui/ChevronRight'
import Button from '../ui/Button'
import DelayedLink from '../ui/DelayedLink'
import CarouselDots from '../ui/CarouselDots'
import { useDesserts } from '../../hooks/useDesserts'
import { useSnapIndicator } from '../../hooks/useSnapIndicator'
import { gsap, prefersReducedMotion } from '../../lib/gsap'

const railSlugs = [
  'klasychnyi-tort',
  'bento-tort',
  'kendi-bar',
  'vesilnyi-tort',
  'rulet',
  'kapkeiky',
]

export default function PopularDesserts() {
  const section = useRef(null)
  const track = useRef(null)
  const { desserts } = useDesserts()
  const rail = useMemo(
    () => railSlugs.map((slug) => desserts.find((d) => d.slug === slug)).filter(Boolean),
    [desserts],
  )
  const { active, handleScroll } = useSnapIndicator({ count: rail.length })

  const isEmpty = rail.length === 0

  useLayoutEffect(() => {
    if (prefersReducedMotion || isEmpty) return
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
          // Begin the sideways scroll only once the whole section has scrolled
          // up so its bottom edge meets the bottom of the viewport (fully in
          // view), rather than the moment its top touches the top.
          start: 'bottom bottom',
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
  }, [rail.length, isEmpty])

  return (
    <section
      ref={section}
      className={`relative overflow-hidden bg-ink py-24 ${
        isEmpty ? '' : 'md:flex md:h-[100svh] md:flex-col md:py-0'
      }`}
    >
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

      {isEmpty ? (
        <div className="container-shell grid place-items-center px-6 py-24 text-center md:py-32">
          <p className="font-display text-3xl italic text-cream md:text-4xl">
            Десерти скоро з'являться
          </p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-mute">
            Ми готуємо смачне меню — завітайте трохи згодом
          </p>
        </div>
      ) : (
        <div className="md:flex md:min-h-0 md:flex-1 md:items-center">
          <CarouselDots
            count={rail.length}
            active={active}
            className="container-shell mt-7 md:hidden"
          />
          <div
            ref={track}
            onScroll={handleScroll}
            className="flex snap-x snap-mandatory scroll-px-12 gap-5 overflow-x-auto pb-4 pl-12 pr-8 pt-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:snap-none md:gap-8 md:overflow-visible md:px-0 md:py-0 md:pl-[max(1.5rem,calc((100vw-1600px)/2+4rem))] md:pr-[12vw]"
          >
            {rail.map((d) => (
              <div
                key={d.slug}
                data-snap-item
                className="w-[74vw] shrink-0 snap-center first:snap-start sm:w-[52vw] md:w-[clamp(13rem,18vw,17rem)] md:snap-align-none"
              >
                <DessertCard dessert={d} ratio="3 / 4" showTagline={false} />
              </div>
            ))}

            <div className="flex w-[74vw] shrink-0 snap-center items-stretch sm:w-[52vw] md:w-[clamp(13rem,18vw,17rem)] md:snap-align-none">
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
      )}
    </section>
  )
}
