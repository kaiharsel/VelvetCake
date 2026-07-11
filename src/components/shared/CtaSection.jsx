import { useLayoutEffect, useRef } from 'react'
import Figure from '../ui/Figure'
import Button from '../ui/Button'
import { gsap, prefersReducedMotion } from '../../lib/gsap'
import { site } from '../../data/site'

/**
 * Closing call-to-action with a big statement over a darkened image.
 */
export default function CtaSection({
  title = (
    <>
      Торт чекає <br />
      <span className="italic text-blood-400">Ви готові скуштувати?</span>
    </>
  ),
  primary = { label: 'Оформити замовлення', to: '/menu' },
  secondary = null,
}) {
  const root = useRef(null)

  useLayoutEffect(() => {
    if (prefersReducedMotion) return
    const el = root.current
    if (!el) return
    if (!window.matchMedia('(min-width: 768px)').matches) return

    const ctx = gsap.context(() => {
      gsap.to(el.querySelector('[data-cta-img]'), {
        scale: 1.15,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    }, el)
    return () => ctx.revert()
  }, [])

  // Freeze the section height on touch devices so it doesn't twitch when an iOS
  // in-app browser (Telegram) grows/shrinks its toolbar on scroll. We pin the
  // rendered height once and only re-measure on a width (orientation) change,
  // ignoring the toolbar-driven height changes. Same approach as the hero.
  useLayoutEffect(() => {
    const section = root.current
    if (!section) return
    const isTouch =
      navigator.maxTouchPoints > 0 || 'ontouchstart' in window
    if (!isTouch) return
    let lastWidth = window.innerWidth
    const pin = () => {
      section.style.minHeight = ''
      section.style.minHeight = `${section.offsetHeight}px`
    }
    pin()
    const onResize = () => {
      if (window.innerWidth !== lastWidth) {
        lastWidth = window.innerWidth
        pin()
      }
    }
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', pin)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', pin)
    }
  }, [])

  return (
    <section ref={root} className="relative flex min-h-[80svh] items-center overflow-hidden">
      <div className="absolute inset-0">
        <div data-cta-img className="h-full w-full">
          {/* No photo on purpose — the wine placeholder is the intended look. */}
          <Figure
            tone="wine"
            ratio="auto"
            className="h-full w-full"
            label="CTA"
          />
        </div>
        <div className="absolute inset-0 bg-ink/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/60" />
      </div>

      <div className="container-shell relative z-10 py-24 text-center">
        <h2 className="display-xl mx-auto max-w-4xl text-balance font-display text-cream">
          {title}
        </h2>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Button to={primary.to} href={primary.href} target={primary.target} variant="primary" size="lg">
            {primary.label}
          </Button>
          {secondary && (
            <Button to={secondary.to} variant="outline" size="lg" arrow={false}>
              {secondary.label}
            </Button>
          )}
        </div>
        <a
          href={site.phoneHref}
          className="focus-ring mt-10 inline-block font-display text-2xl text-cream/90 transition-colors hover:text-blood-400 md:text-3xl"
        >
          {site.phone}
        </a>
      </div>
    </section>
  )
}
