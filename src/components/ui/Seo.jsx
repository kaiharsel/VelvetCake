import { useEffect } from 'react'
import { site } from '../../data/site'

/**
 * Lightweight per-page SEO: sets document.title and the meta description /
 * canonical without pulling in a helmet dependency.
 */
export default function Seo({ title, description, path = '' }) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${site.name}` : `${site.name} — ${site.tagline}`
    document.title = fullTitle

    const setMeta = (selector, attr, value) => {
      let el = document.head.querySelector(selector)
      if (!el) {
        el = document.createElement('meta')
        const [key, val] = selector.replace(/meta\[|\]/g, '').split('=')
        el.setAttribute(key, val.replace(/["']/g, ''))
        document.head.appendChild(el)
      }
      el.setAttribute(attr, value)
    }

    if (description) {
      setMeta('meta[name="description"]', 'content', description)
      setMeta('meta[property="og:description"]', 'content', description)
    }
    setMeta('meta[property="og:title"]', 'content', fullTitle)

    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (canonical) {
      canonical.setAttribute('href', `https://velvetcake.example${path}`)
    }
  }, [title, description, path])

  return null
}
