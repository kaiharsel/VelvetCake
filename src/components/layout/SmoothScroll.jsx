import { createContext, useContext, useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../../lib/gsap'

const LenisContext = createContext(null)

export const useSmoothScroll = () => useContext(LenisContext)

/**
 * Drives page scroll with Lenis and keeps GSAP ScrollTrigger in sync.
 * Skips smoothing entirely when the user asks for reduced motion.
 */
export default function SmoothScroll({ children }) {
  const [lenis, setLenis] = useState(null)
  const rafHandleRef = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion) return

    const instance = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    })

    instance.on('scroll', ScrollTrigger.update)

    const onRaf = (time) => instance.raf(time * 1000)
    gsap.ticker.add(onRaf)
    gsap.ticker.lagSmoothing(0)
    rafHandleRef.current = onRaf

    setLenis(instance)

    return () => {
      gsap.ticker.remove(onRaf)
      instance.destroy()
      setLenis(null)
    }
  }, [])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}
