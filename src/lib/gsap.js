// Single place to register GSAP plugins so every module shares one instance.
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Don't refresh every ScrollTrigger when mobile browsers grow/shrink their
// toolbar on scroll — that recalculation is a big source of jank on phones.
ScrollTrigger.config({ ignoreMobileResize: true })

// Sensible defaults for the whole site.
gsap.defaults({ ease: 'power3.out', duration: 1 })

export const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export { gsap, ScrollTrigger }
