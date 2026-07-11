// Pure masterclass-shaping logic with NO Firebase imports, so the public
// Masterclasses page can render the code-defined list synchronously without
// pulling the Firestore SDK into its bundle. Firebase-backed CMS operations
// live in masterclassesCms.js.
import { masterclasses as codeMasterclasses } from '../data/content'

export const normalizeMasterclass = (mc, index = 0) => ({
  slug: mc.slug,
  title: mc.title || '',
  duration: mc.duration || '',
  // seats is a free-form label (e.g. "6-12"), stored as text.
  seats: mc.seats != null ? String(mc.seats) : '',
  price: Number(mc.price) || 0,
  text: mc.text || '',
  visible: mc.visible !== false,
  deleted: Boolean(mc.deleted),
  // 1-based order for a friendlier CRM ("Порядок" 1, 2, 3, …).
  order: Number.isFinite(Number(mc.order)) ? Number(mc.order) : index + 1,
})

export const codeMasterclassSlugs = new Set(
  codeMasterclasses.map((mc) => mc.slug),
)

export const mergeMasterclassesWithCode = (
  cmsMasterclasses,
  { includeHidden = false } = {},
) => {
  const merged = new Map(
    codeMasterclasses.map((mc, index) => [
      mc.slug,
      { ...normalizeMasterclass(mc, index), fromCode: true },
    ]),
  )

  cmsMasterclasses.forEach((mc, index) => {
    const normalized = normalizeMasterclass(mc, index)
    if (normalized.deleted) {
      merged.delete(normalized.slug)
      return
    }
    merged.set(normalized.slug, { ...normalized, fromCode: false })
  })

  return Array.from(merged.values())
    .filter((mc) => includeHidden || mc.visible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
}
