import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
} from 'firebase/storage'
import { desserts as codeDesserts } from '../data/desserts'
import { db, storage } from './firebase'

const dessertsRef = collection(db, 'desserts')

const deleteStorageTree = async (folderRef) => {
  const result = await listAll(folderRef)

  await Promise.all([
    ...result.items.map((itemRef) => deleteObject(itemRef)),
    ...result.prefixes.map((prefixRef) => deleteStorageTree(prefixRef)),
  ])
}

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

const normalizeDessert = (dessert, index = 0) => ({
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

export function subscribeDesserts(onChange, onError, { includeHidden = false } = {}) {
  return onSnapshot(
    query(dessertsRef, orderBy('order', 'asc'), limit(200)),
    (snapshot) => {
      const items = snapshot.docs
        .map((item) => normalizeDessert({ id: item.id, ...item.data(), slug: item.id }))
        .filter((item) => includeHidden || item.visible !== false)
      onChange(items)
    },
    onError,
  )
}

export async function saveDessert(dessert) {
  const normalized = normalizeDessert(dessert)
  if (!normalized.slug) {
    throw new Error('Dessert slug is required')
  }

  await setDoc(
    doc(db, 'desserts', normalized.slug),
    {
      ...normalized,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

export async function deleteDessert(slug) {
  await deleteDoc(doc(db, 'desserts', slug))
}

export async function uploadDessertImage(slug, file) {
  if (!slug || !file) throw new Error('Slug and file are required')

  const extension = file.name.split('.').pop()?.toLowerCase() || 'png'
  const safeExtension = extension.replace(/[^a-z0-9]/g, '') || 'png'
  const imageRef = ref(storage, `desserts/${slug}/main.${safeExtension}`)

  await uploadBytes(imageRef, file, {
    contentType: file.type || 'image/png',
  })

  return getDownloadURL(imageRef)
}

export async function uploadDessertGalleryImage(slug, file, position) {
  if (!slug || !file || !position) throw new Error('Slug, file and position are required')

  const extension = file.name.split('.').pop()?.toLowerCase() || 'png'
  const safeExtension = extension.replace(/[^a-z0-9]/g, '') || 'png'
  const imageRef = ref(storage, `desserts/${slug}/gallery-${position}.${safeExtension}`)

  await uploadBytes(imageRef, file, {
    contentType: file.type || 'image/png',
  })

  return getDownloadURL(imageRef)
}

export async function resyncDessertsFromCode() {
  const snapshot = await getDocs(query(dessertsRef, limit(200)))

  deleteStorageTree(ref(storage, 'desserts')).catch((err) => {
    console.warn('Dessert photo cleanup skipped:', err)
  })

  await Promise.all(snapshot.docs.map((item) => deleteDoc(item.ref)))
  await Promise.all(
    codeDesserts.map((dessert, index) =>
      setDoc(doc(db, 'desserts', dessert.slug), {
        ...normalizeDessert(dessert, index),
        updatedAt: serverTimestamp(),
      }),
    ),
  )
}
