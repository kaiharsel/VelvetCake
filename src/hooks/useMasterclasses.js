import { useEffect, useState } from 'react'
import { mergeMasterclassesWithCode } from '../lib/masterclassesMerge'

export function useMasterclasses() {
  const [items, setItems] = useState(() => mergeMasterclassesWithCode([]))

  useEffect(() => {
    // Load the Firestore-backed CMS lazily, after paint, so firebase stays off
    // the critical path. The page already renders the code list above.
    let unsubscribe = null
    let cancelled = false

    import('../lib/masterclassesCms')
      .then(({ subscribeMasterclasses }) => {
        if (cancelled) return
        unsubscribe = subscribeMasterclasses(
          // Fetch hidden docs too so a hidden code-class override reaches the
          // merge; mergeMasterclassesWithCode (default) then filters them out.
          (nextItems) => setItems(mergeMasterclassesWithCode(nextItems)),
          (err) => {
            console.warn('Masterclasses CMS fallback:', err)
            setItems(mergeMasterclassesWithCode([]))
          },
          { includeHidden: true },
        )
      })
      .catch((err) => {
        console.warn('Masterclasses CMS load failed:', err)
      })

    return () => {
      cancelled = true
      if (unsubscribe) unsubscribe()
    }
  }, [])

  return { masterclasses: items }
}
