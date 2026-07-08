import { useEffect, useMemo, useState } from 'react'
import {
  getDessert as getCodeDessert,
  getRelated as getCodeRelated,
} from '../data/desserts'
import { mergeDessertsWithCode, subscribeDesserts } from '../lib/cms'

export function useDesserts() {
  const [items, setItems] = useState(() => mergeDessertsWithCode([]))
  const [source, setSource] = useState('code')

  useEffect(() => {
    return subscribeDesserts(
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
