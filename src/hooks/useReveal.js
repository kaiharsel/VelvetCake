import { useLayoutEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsap'

/**
 * Scroll-triggered reveal. Returns a ref to attach to a container; every
 * element inside carrying `data-reveal` animates up + fades in as it enters
 * the viewport, honouring an optional stagger.
 *
 * @param {Object} opts
 * @param {number} opts.y      travel distance in px (default 48)
 * @param {number} opts.stagger seconds between items (default 0.09)
 * @param {string} opts.start  ScrollTrigger start (default 'top 82%')
 */
export function useReveal({ y = 48, stagger = 0.09, start = 'top 82%' } = {}) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return

    const targets = root.querySelectorAll('[data-reveal]')
    if (!targets.length) return

    if (prefersReducedMotion) {
      gsap.set(targets, { opacity: 1, y: 0 })
      return
    }

    const ctx = gsap.context(() => {
      gsap.from(targets, {
        y,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger,
        scrollTrigger: {
          trigger: root,
          start,
        },
      })
    }, root)

    return () => ctx.revert()
  }, [y, stagger, start])

  return ref
}
