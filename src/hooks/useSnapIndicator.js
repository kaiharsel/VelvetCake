import { useEffect, useRef, useState } from 'react'

export function useSnapIndicator({ count = 0, itemSelector = '[data-snap-item]' } = {}) {
  const frame = useRef(null)
  const [active, setActive] = useState(0)

  useEffect(() => () => {
    if (frame.current) cancelAnimationFrame(frame.current)
  }, [])

  useEffect(() => {
    setActive((current) => Math.min(current, Math.max(count - 1, 0)))
  }, [count])

  const handleScroll = (event) => {
    const rail = event.currentTarget
    if (frame.current) return

    frame.current = requestAnimationFrame(() => {
      const cards = Array.from(rail.querySelectorAll(itemSelector))
      if (!cards.length) {
        frame.current = null
        return
      }

      const center = rail.scrollLeft + rail.clientWidth / 2
      let nearest = 0
      let nearestDistance = Infinity

      cards.forEach((card, index) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2
        const distance = Math.abs(center - cardCenter)
        if (distance < nearestDistance) {
          nearest = index
          nearestDistance = distance
        }
      })

      setActive(Math.min(nearest, Math.max(count - 1, 0)))
      frame.current = null
    })
  }

  return { active, handleScroll }
}
