import { useLayoutEffect, useRef, useState } from 'react'
import Figure from '../ui/Figure'
import { advantages } from '../../data/content'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../../lib/gsap'

const tones = ['wine', 'ink', 'blood']

export default function Advantages() {
  const section = useRef(null)
  const [active, setActive] = useState(0)

  useLayoutEffect(() => {
    const el = section.current
    if (!el) return

    const mm = gsap.matchMedia()
    mm.add('(min-width: 768px)', () => {
      const ctx = gsap.context(() => {
        const items = gsap.utils.toArray('[data-adv-item]')
        items.forEach((item, i) => {
          ScrollTrigger.create({
            trigger: item,
            start: 'top center',
            end: 'bottom center',
            onToggle: (self) => self.isActive && setActive(i),
          })
          if (!prefersReducedMotion) {
            gsap.from(item.querySelector('[data-adv-media]'), {
              yPercent: 12,
              opacity: 0.4,
              ease: 'none',
              scrollTrigger: {
                trigger: item,
                start: 'top bottom',
                end: 'top center',
                scrub: true,
              },
            })
            gsap.from(item.querySelector('[data-adv-copy]'), {
              y: 36,
              opacity: 0,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: item,
                start: 'top 72%',
              },
            })
          }
        })
      }, el)

      return () => ctx.revert()
    })

    return () => mm.revert()
  }, [])

  const handleMobileScroll = (event) => {
    const rail = event.currentTarget
    const center = rail.scrollLeft + rail.clientWidth / 2
    const cards = Array.from(rail.children)
    let nearest = 0
    let nearestDistance = Infinity

    cards.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2
      const distance = Math.abs(center - cardCenter)
      if (distance < nearestDistance) {
        nearest = index
        nearestDistance = distance
      }
    })

    setActive(nearest)
  }

  return (
    <section ref={section} className="relative bg-ink py-24 md:py-32">
      <div className="container-shell">
        {/* Mobile horizontal carousel */}
        <div className="md:hidden">
          <div className="mb-8 pl-2">
            <div className="relative h-20 overflow-hidden">
              {advantages.map((a, i) => (
                <span
                  key={a.no}
                  className={`absolute inset-0 font-display text-[6rem] leading-[0.8] text-blood/30 transition-all duration-700 ease-velvet ${
                    i === active
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-5 opacity-0'
                  }`}
                >
                  {a.no}
                </span>
              ))}
            </div>
            <div className="relative mt-4 h-20 overflow-hidden">
              {advantages.map((a, i) => (
                <h3
                  key={a.no}
                  className={`absolute inset-0 font-display text-[2.25rem] leading-[0.92] text-cream transition-all duration-700 ease-velvet ${
                    i === active
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-5 opacity-0'
                  }`}
                >
                  {a.title}
                </h3>
              ))}
            </div>
          </div>
          <div className="mt-6 flex gap-2 pl-2">
            {advantages.map((a, i) => (
              <span
                key={a.no}
                className={`h-[3px] rounded-full transition-all duration-500 ${
                  i === active ? 'w-10 bg-blood-400' : 'w-4 bg-cream/20'
                }`}
              />
            ))}
          </div>

          <div
            onScroll={handleMobileScroll}
            className="-mx-6 mt-10 flex snap-x snap-mandatory scroll-px-8 gap-5 overflow-x-auto px-8 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {advantages.map((a, i) => (
              <article key={a.no} className="w-[82vw] shrink-0 snap-center first:snap-start">
                <div className="overflow-hidden rounded-[3px]">
                  <Figure
                    tone={tones[i % tones.length]}
                    ratio="5 / 4"
                    label={a.title}
                    // src={`/desserts/adv-${a.no}.jpg`}
                  />
                </div>
                <p className="mt-6 max-w-md text-pretty leading-relaxed text-mute">
                  {a.text}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="hidden gap-10 md:grid md:grid-cols-12">
          {/* Sticky index */}
          <div className="hidden md:col-span-5 md:block">
            <div className="md:sticky md:top-[22vh]">
              <div className="flex items-start gap-6">
                <span className="font-display text-[22vw] leading-[0.8] text-blood/25 md:text-[9rem]">
                  {advantages[active].no}
                </span>
              </div>
              <div className="relative mt-4 h-40">
                {advantages.map((a, i) => (
                  <div
                    key={a.no}
                    className={`absolute inset-0 transition-all duration-700 ease-velvet ${
                      i === active
                        ? 'translate-y-0 opacity-100'
                        : 'pointer-events-none translate-y-4 opacity-0'
                    }`}
                  >
                    <h3 className="display-lg font-display text-cream">
                      {a.title}
                    </h3>
                  </div>
                ))}
              </div>
              {/* Progress dots */}
              <div className="mt-6 flex gap-2">
                {advantages.map((a, i) => (
                  <span
                    key={a.no}
                    className={`h-[3px] rounded-full transition-all duration-500 ${
                      i === active ? 'w-10 bg-blood-400' : 'w-4 bg-cream/20'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Scrolling media + copy */}
          <div className="md:col-span-7 md:col-start-6">
            <div className="flex flex-col gap-16 md:gap-[18vh]">
              {advantages.map((a, i) => (
                <div key={a.no} data-adv-item className="md:min-h-[70vh]">
                  <div data-adv-media className="overflow-hidden rounded-[3px]">
                    <Figure
                      tone={tones[i % tones.length]}
                      ratio="5 / 4"
                      label={a.title}
                      // src={`/desserts/adv-${a.no}.jpg`}
                    />
                  </div>
                  <div data-adv-copy className="mt-6 flex items-start gap-4">
                    <div>
                      <p className="mt-3 max-w-md text-pretty leading-relaxed text-mute md:text-lg">
                        {a.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
