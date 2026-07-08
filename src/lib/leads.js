import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db } from './firebase'

export const leadStatuses = [
  { id: 'new', label: 'Нова' },
  { id: 'in_progress', label: 'В роботі' },
  { id: 'done', label: 'Виконано' },
  { id: 'cancelled', label: 'Скасовано' },
]

export const leadTypes = {
  order: 'Замовлення',
  masterclass: 'Майстер-клас',
}

const leadsRef = collection(db, 'leads')

const clean = (value) => {
  if (typeof value !== 'string') return value
  return value.trim()
}

export async function createLead(payload) {
  const pageUrl = typeof window !== 'undefined' ? window.location.href : ''
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : ''

  return addDoc(leadsRef, {
    type: payload.type || 'order',
    status: 'new',
    name: clean(payload.name) || '',
    phone: clean(payload.phone) || '',
    preferredDate: clean(payload.preferredDate) || '',
    note: clean(payload.note) || '',
    product: clean(payload.product) || '',
    productSlug: clean(payload.productSlug) || '',
    classSlug: clean(payload.classSlug) || '',
    classTitle: clean(payload.classTitle) || '',
    seats: payload.seats ? Number(payload.seats) : null,
    source: clean(payload.source) || 'site',
    pageUrl,
    userAgent,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export function subscribeLeads(onChange, onError) {
  return onSnapshot(
    query(leadsRef, orderBy('createdAt', 'desc'), limit(100)),
    (snapshot) => {
      onChange(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })))
    },
    onError,
  )
}

export function updateLeadStatus(id, status) {
  return updateDoc(doc(db, 'leads', id), {
    status,
    updatedAt: serverTimestamp(),
  })
}

export function deleteLead(id) {
  return deleteDoc(doc(db, 'leads', id))
}

const demoLeads = [
  {
    type: 'order',
    status: 'new',
    name: 'Олена',
    phone: '+380 97 000 00 01',
    preferredDate: '2026-07-18',
    product: 'Бенто-торт',
    note: 'Потрібен ніжний напис для дня народження',
    source: 'demo-resync',
  },
  {
    type: 'order',
    status: 'in_progress',
    name: 'Марія',
    phone: '+380 67 000 00 02',
    preferredDate: '2026-08-02',
    product: 'Весільний торт',
    note: 'Білий мінімалістичний торт на 40 гостей',
    source: 'demo-resync',
  },
  {
    type: 'masterclass',
    status: 'new',
    name: 'Ірина',
    phone: '+380 93 000 00 03',
    classTitle: 'Класичні',
    classSlug: 'klasychni',
    seats: 2,
    note: 'Хоче прийти з подругою у вихідний день',
    source: 'demo-resync',
  },
]

export async function resyncDemoLeads() {
  const snapshot = await getDocs(query(leadsRef, limit(100)))
  await Promise.all(snapshot.docs.map((item) => deleteDoc(item.ref)))
  await Promise.all(demoLeads.map((lead) => createLead(lead)))
}
