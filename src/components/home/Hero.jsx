import { useLayoutEffect, useRef } from 'react'
import Figure from '../ui/Figure'
import Button from '../ui/Button'
import { gsap, prefersReducedMotion } from '../../lib/gsap'

export default function Hero() {
  const root = useRef(null)
  const imageWrap = useRef(null)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return

    const ctx = gsap.context(() => {
      // Intro timeline — lines rise, image scales down into frame.
      if (!prefersReducedMotion) {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
        tl.from('[data-hero-line] > span', {
          yPercent: 115,
          duration: 1.2,
          stagger: 0.12,
        })
          .from(
            '[data-hero-fade]',
            { opacity: 0, y: 24, duration: 1, stagger: 0.1 },
            '-=0.7',
          )
          .from(
            imageWrap.current,
            { scale: 1.15, duration: 1.6, ease: 'power3.out' },
            0,
          )

        // Parallax drift on the hero image as the page scrolls away.
        gsap.to(imageWrap.current, {
          yPercent: 18,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })
      }

      // Pointer parallax — subtle, desktop only.
      const onMove = (e) => {
        if (prefersReducedMotion) return
        const rx = (e.clientX / window.innerWidth - 0.5) * 2
        const ry = (e.clientY / window.innerHeight - 0.5) * 2
        gsap.to(imageWrap.current, {
          x: rx * 18,
          y: ry * 18,
          duration: 0.8,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      }
      const mq = window.matchMedia('(pointer: fine)')
      if (mq.matches) window.addEventListener('mousemove', onMove)
      return () => window.removeEventListener('mousemove', onMove)
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={root}
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-wine-900 pb-10 pt-28 md:pb-16"
    >
      {/* Background image + placeholder */}
      <div className="absolute inset-0 -z-0">
        <div ref={imageWrap} className="absolute inset-[-8%]">
          <Figure
            tone="wine"
            ratio="auto"
            priority
            label="Головне фото"
            className="h-full w-full"
            // src="/desserts/hero.jpg"  ← додайте фото сюди
          />
        </div>
        {/* Cinematic vignette + gradient for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/50" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_-10%,transparent_35%,rgba(12,8,9,0.85)_100%)]" />
      </div>

      <div className="container-shell relative z-10">
        <h1 className="display-hero font-display text-cream">
          <span data-hero-line className="reveal-line">
            <span className="block">Робимо смак свята</span>
          </span>
          <span data-hero-line className="reveal-line">
            <span className="block italic text-blood-400">незабутнім</span>
          </span>
        </h1>

        <div className="mt-10 flex flex-col gap-8 md:mt-14 md:flex-row md:items-end md:justify-between">
          <p
            data-hero-fade
            className="max-w-md text-pretty text-base leading-relaxed text-cream/80 md:text-lg"
          >
            Замовте торт у подарунок або просто почастуйте себе смачненьким.
            Ми втілимо ваші солодкі бажання в реальність і подаруємо приємні
            емоції та спогади
          </p>

          <div data-hero-fade className="flex flex-wrap items-center gap-4">
            <Button to="/menu" size="lg">
              Обрати десерт
            </Button>
            <Button to="/masterclasses" variant="outline" size="lg" arrow={false}>
              Майстер-класи
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
