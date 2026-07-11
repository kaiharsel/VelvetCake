import { useEffect, useMemo, useState } from 'react'
import {
  getDessert as getCodeDessert,
  getRelated as getCodeRelated,
} from '../data/desserts'
import { mergeDessertsWithCode } from '../lib/dessertsMerge'

export function useDesserts() {
  const [items, setItems] = useState(() => mergeDessertsWithCode([]))
  const [source, setSource] = useState('code')

  useEffect(() => {
    // Load the Firestore-backed CMS lazily, after paint, so firebase stays off
    // the critical path. The page already renders the code catalog above.
    let unsubscribe = null
    let cancelled = false

    import('../lib/cms')
      .then(({ subscribeDesserts }) => {
        if (cancelled) return
        unsubscribe = subscribeDesserts(
          (nextItems) => {
            setItems(mergeDessertsWithCode(nextItems))
            setSource(nextItems.length ? 'firebase' : 'code')
          },
          (err) => {
            console.warn('Desserts CMS fallback:', err)
            setItems(mergeDessertsWithCode([]))
            setSource('code')
          },
          { includeHidden: true },
        )
      })
      .catch((err) => {
        console.warn('Desserts CMS load failed:', err)
      })

    return () => {
      cancelled = true
      if (unsubscribe) unsubscribe()
    }
  }, [])

  return { desserts: items, source }
}

export function useDessert(slug) {
  const { desserts, source } = useDesserts()

  const dessert = useMemo(() => {
    return desserts.find((item) => item.slug === slug) || getCodeDessert(slug)
  }, [desserts, slug])

  const related = useMemo(() => {
    if (!dessert) return getCodeRelated(slug, 3)

    const sameCat = desserts.filter(
      (item) => item.slug !== slug && item.category === dessert.category,
    )
    const others = desserts.filter(
      (item) => item.slug !== slug && item.category !== dessert.category,
    )
    return [...sameCat, ...others].slice(0, 3)
  }, [dessert, desserts, slug])

  return { dessert, related, source }
}
