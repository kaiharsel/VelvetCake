import { useLayoutEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../../lib/gsap'

/**
 * Word-by-word opacity fill driven by scroll progress — the signature
 * editorial "statement" effect. Muted words brighten to cream as they pass.
 */
export default function ScrollText({
  text,
  className = '',
  mobileStart = 'top 90%',
  desktopStart = 'top 78%',
  desktopEnd = 'bottom 60%',
}) {
  const ref = useRef(null)
  const words = text.split(' ')

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const spans = el.querySelectorAll('[data-word]')

    if (prefersReducedMotion) {
      gsap.set(spans, { opacity: 1 })
      return
    }

    const ctx = gsap.context(() => {
      const isMobile = window.matchMedia('(max-width: 767px)').matches

      gsap.set(spans, { opacity: 0.16 })

      if (isMobile) {
        gsap.to(spans, {
          opacity: 1,
          duration: 1.1,
          ease: 'power2.out',
          stagger: 0.026,
          scrollTrigger: {
            trigger: el,
            start: mobileStart,
            once: true,
          },
        })
        return
      }

      gsap.to(spans, {
        opacity: 1,
        ease: 'none',
        stagger: 0.5,
        scrollTrigger: {
          trigger: el,
          start: desktopStart,
          end: desktopEnd,
          scrub: true,
        },
      })
    }, el)
    return () => ctx.revert()
  }, [desktopEnd, desktopStart, mobileStart, text])

  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <span key={i}>
          <span data-word className="inline-block">
            {w}
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </p>
  )
}
