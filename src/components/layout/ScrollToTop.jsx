import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ScrollTrigger } from '../../lib/gsap'
import { useSmoothScroll } from './SmoothScroll'

/**
 * On every route change: jump to the top and refresh ScrollTrigger once the
 * new page has painted, so pinned/scrubbed sections measure correctly.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation()
  const lenis = useSmoothScroll()

  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo(0, 0)
    }
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [pathname, lenis])

  return null
}
