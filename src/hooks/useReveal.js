import { useLayoutEffect, useRef } from 'react'
import { gsap, prefersReducedMotion, ScrollTrigger } from '../lib/gsap'

/**
 * Scroll-triggered reveal. Returns a ref to attach to a container; every
 * element inside carrying `data-reveal` animates up + fades in as it enters
 * the viewport, honouring an optional stagger.
 *
 * @param {Object} opts
 * @param {number} opts.y      travel distance in px (default 48)
 * @param {number} opts.stagger seconds between items (default 0.09)
 * @param {string} opts.start  ScrollTrigger start (default 'top 104%')
 */
export function useReveal({ y = 36, stagger = 0.08, start = 'top 104%' } = {}) {
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

    let tween
    let hasRevealed = false

    gsap.set(targets, { y, opacity: 0 })

    const reveal = () => {
      if (hasRevealed) return
      hasRevealed = true

      tween = gsap.to(
        targets,
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          ease: 'power3.out',
          stagger,
          clearProps: 'transform,opacity',
        },
      )
    }

    const trigger = ScrollTrigger.create({
      trigger: root,
      start,
      invalidateOnRefresh: true,
      onEnter: reveal,
      onEnterBack: reveal,
    })

    const revealIfAlreadyVisible = requestAnimationFrame(() => {
      const rect = root.getBoundingClientRect()
      const isVisible =
        rect.top < window.innerHeight * 1.04 &&
        rect.bottom > window.innerHeight * 0.08

      if (isVisible) reveal()
    })

    return () => {
      cancelAnimationFrame(revealIfAlreadyVisible)
      trigger.kill()
      tween?.kill()
      gsap.set(targets, { clearProps: 'transform,opacity' })
    }
  }, [y, stagger, start])

  return ref
}
