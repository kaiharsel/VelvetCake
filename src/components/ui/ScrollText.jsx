import { useLayoutEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../../lib/gsap'

/**
 * Word-by-word opacity fill driven by scroll progress — the signature
 * editorial "statement" effect. Muted words brighten to cream as they pass.
 */
export default function ScrollText({ text, className = '' }) {
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
      gsap.set(spans, { opacity: 0.16 })
      gsap.to(spans, {
        opacity: 1,
        ease: 'none',
        stagger: 0.5,
        scrollTrigger: {
          trigger: el,
          start: 'top 78%',
          end: 'bottom 60%',
          scrub: true,
        },
      })
    }, el)
    return () => ctx.revert()
  }, [text])

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
