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
import { masterclasses as codeMasterclasses } from '../data/content'
import { db } from './firebase'
import { codeMasterclassSlugs, normalizeMasterclass } from './masterclassesMerge'

// Re-export the pure helpers so consumers keep one import path. Public pages
// import from ./masterclassesMerge directly to avoid this module's Firebase deps.
export {
  codeMasterclassSlugs,
  mergeMasterclassesWithCode,
} from './masterclassesMerge'

const masterclassesRef = collection(db, 'masterclasses')

export function subscribeMasterclasses(onChange, onError, { includeHidden = false } = {}) {
  return onSnapshot(
    query(masterclassesRef, orderBy('order', 'asc'), limit(50)),
    (snapshot) => {
      const items = snapshot.docs
        .map((item) => normalizeMasterclass({ id: item.id, ...item.data(), slug: item.id }))
        .filter((item) => includeHidden || item.visible !== false)
      onChange(items)
    },
    onError,
  )
}

export async function saveMasterclass(masterclass) {
  const normalized = normalizeMasterclass(masterclass)
  if (!normalized.slug) {
    throw new Error('Masterclass slug is required')
  }

  await setDoc(
    doc(db, 'masterclasses', normalized.slug),
    { ...normalized, updatedAt: serverTimestamp() },
    { merge: true },
  )
}

export async function deleteMasterclass(slug) {
  // A code-defined class can't be truly removed — mark it deleted so the merge
  // hides it. A CMS-only class is removed outright.
  if (codeMasterclassSlugs.has(slug)) {
    await setDoc(
      doc(db, 'masterclasses', slug),
      { slug, deleted: true, updatedAt: serverTimestamp() },
      { merge: true },
    )
  } else {
    await deleteDoc(doc(db, 'masterclasses', slug))
  }
}

export async function resyncMasterclassesFromCode() {
  const snapshot = await getDocs(query(masterclassesRef, limit(50)))
  await Promise.all(snapshot.docs.map((item) => deleteDoc(item.ref)))
  await Promise.all(
    codeMasterclasses.map((masterclass, index) =>
      setDoc(doc(db, 'masterclasses', masterclass.slug), {
        ...normalizeMasterclass(masterclass, index),
        updatedAt: serverTimestamp(),
      }),
    ),
  )
}
