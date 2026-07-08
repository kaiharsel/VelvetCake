import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ScrollTrigger } from '../../lib/gsap'
import { useSmoothScroll } from './SmoothScroll'
import ChevronRight from '../ui/ChevronRight'
import IconButton from '../ui/IconButton'

/**
 * On every route change: jump to the top and refresh ScrollTrigger once the
 * new page has painted, so pinned/scrubbed sections measure correctly.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation()
  const lenis = useSmoothScroll()
  const [visible, setVisible] = useState(false)
  const [activating, setActivating] = useState(false)
  const timer = useRef(null)

  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    lenis?.scrollTo(0, { immediate: true, force: true })

    const firstFrame = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      lenis?.scrollTo(0, { immediate: true, force: true })
      requestAnimationFrame(() => ScrollTrigger.refresh())
    })

    return () => cancelAnimationFrame(firstFrame)
  }, [pathname, lenis])

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY > 320)
    updateVisibility()
    window.addEventListener('scroll', updateVisibility, { passive: true })
    return () => window.removeEventListener('scroll', updateVisibility)
  }, [])

  useEffect(() => () => clearTimeout(timer.current), [])

  const toTop = () =>
    lenis ? lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: 'smooth' })

  const handleToTop = () => {
    const isMobile =
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 767px)').matches

    if (!isMobile) {
      toTop()
      return
    }

    clearTimeout(timer.current)
    setActivating(true)
    toTop()

    timer.current = window.setTimeout(() => {
      setActivating(false)
    }, 450)
  }

  return (
    <IconButton
      onClick={handleToTop}
      aria-label="Прокрутити нагору"
      aria-busy={activating || undefined}
      data-active={activating || undefined}
      size="lg"
      className={`fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] right-5 z-30 ${
        visible
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      <ChevronRight className="-rotate-90" />
    </IconButton>
  )
}
