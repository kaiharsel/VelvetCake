// Pure dessert-shaping logic with NO Firebase imports, so public pages can
// render the code-defined catalog synchronously without pulling the Firestore
// SDK into their bundle. Firebase-backed CMS operations live in cms.js.
import { desserts as codeDesserts } from '../data/desserts'

const normalizeList = (value) => {
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean)
  if (typeof value !== 'string') return []
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
}

const normalizeGallery = (value, mainImage = '') =>
  normalizeList(value)
    .filter((item) => item !== mainImage)
    .slice(0, 3)

export const normalizeDessert = (dessert, index = 0) => ({
  slug: dessert.slug,
  name: dessert.name || '',
  category: dessert.category || 'deserty',
  tagline: dessert.tagline || '',
  price: Number(dessert.price) || 0,
  unit: dessert.unit || 'за шт',
  priceNote: dessert.priceNote || '',
  weight: dessert.weight || '',
  servings: dessert.servings || '',
  tone: dessert.tone || 'wine',
  short: dessert.short || '',
  description: dessert.description || '',
  composition: normalizeList(dessert.composition),
  features: normalizeList(dessert.features),
  allergens: dessert.allergens || '',
  featured: Boolean(dessert.featured),
  visible: dessert.visible !== false,
  deleted: Boolean(dessert.deleted),
  image: dessert.image || '',
  gallery: normalizeGallery(dessert.gallery, dessert.image || ''),
  order: Number.isFinite(Number(dessert.order)) ? Number(dessert.order) : index,
})

export const codeDessertSlugs = new Set(codeDesserts.map((dessert) => dessert.slug))

export const mergeDessertsWithCode = (
  cmsDesserts,
  { includeHidden = false } = {},
) => {
  const merged = new Map(
    codeDesserts.map((dessert, index) => [
      dessert.slug,
      {
        ...normalizeDessert(dessert, index),
        fromCode: true,
      },
    ]),
  )

  cmsDesserts.forEach((dessert, index) => {
    const normalized = normalizeDessert(dessert, index)
    if (normalized.deleted) {
      merged.delete(normalized.slug)
      return
    }
    merged.set(normalized.slug, {
      ...normalized,
      fromCode: false,
    })
  })

  return Array.from(merged.values())
    .filter((dessert) => includeHidden || dessert.visible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
}
