import { useLayoutEffect, useRef } from 'react'
import Figure from '../ui/Figure'
import Reveal from '../ui/Reveal'
import Button from '../ui/Button'
import { gsap, prefersReducedMotion } from '../../lib/gsap'

export default function MasterclassTeaser() {
  const media = useRef(null)

  useLayoutEffect(() => {
    if (prefersReducedMotion) return
    const el = media.current
    if (!el) return
    if (!window.matchMedia('(min-width: 768px)').matches) return

    const ctx = gsap.context(() => {
      gsap.to(el.querySelector('[data-mc-img]'), {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section className="relative bg-ink py-24 md:py-32">
      <div className="container-shell">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-20">
          <div ref={media} className="relative order-2 overflow-hidden rounded-[3px] md:order-1">
            <div data-mc-img className="scale-110">
              <Figure
                src="/desserts/masterclass-home.png"
                alt="Майстер-клас VelvetCake"
                tone="wine"
                ratio="4 / 5"
                label="Майстер-клас"
              />
            </div>
            <div className="absolute bottom-5 left-5 rounded-full border border-cream/15 bg-ink/85 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-cream/85 shadow-[0_10px_28px_rgba(0,0,0,0.28)] backdrop-blur-md">
              6–12 у групі
            </div>
          </div>

          <Reveal className="order-1 md:order-2" stagger={0.1} y={40}>
            <h2 className="display-xl font-display text-cream" data-reveal>
              Створи свій <span className="italic text-blood-400">бенто-торт</span>
            </h2>
            <p className="mt-6 max-w-md text-pretty leading-relaxed text-mute md:text-lg" data-reveal>
              Створи свій перший бенто-торт у приємній компанії. Попередній
              досвід не потрібен. Ми працюємо в невеликих групах і допомагаємо
              на кожному етапі. У результаті ти забереш із собою власний торт і
              круті емоції
            </p>
            <ul className="mt-8 space-y-3 text-cream/80" data-reveal>
              {['Невеликі дружні групи', 'Навіть без досвіду', 'Забираєш торт із собою'].map(
                (li) => (
                  <li key={li} className="flex items-center gap-3">
                    <span className="text-blood-400">✦</span>
                    {li}
                  </li>
                ),
              )}
            </ul>
            <div className="mt-10" data-reveal>
              <Button to="/masterclasses" variant="light">
                Обрати майстер-клас
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
