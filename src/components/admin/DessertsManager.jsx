import { useEffect, useMemo, useRef, useState } from 'react'
import { categories } from '../../data/desserts'
import { useSmoothScroll } from '../layout/SmoothScroll'
import AdminSelect from './AdminSelect'
import ConfirmDialog from './ConfirmDialog'
import {
  codeDessertSlugs,
  deleteDessert,
  mergeDessertsWithCode,
  saveDessert,
  subscribeDesserts,
  uploadDessertImage,
  uploadDessertGalleryImage,
} from '../../lib/cms'

const editableCategories = categories.filter((category) => category.id !== 'all')
const gallerySlots = [0, 1, 2]
const emptyGalleryFiles = () => gallerySlots.map(() => null)
const reloadCrm = () => {
  window.setTimeout(() => window.location.reload(), 250)
}

const emptyDraft = {
  slug: '',
  name: '',
  category: 'deserty',
  tagline: '',
  price: '',
  unit: 'за шт',
  priceNote: '',
  weight: '',
  servings: '',
  tone: 'wine',
  short: '',
  description: '',
  composition: '',
  features: '',
  allergens: '',
  featured: false,
  visible: true,
  image: '',
  gallery: [],
  order: '',
}

const toText = (value) => (Array.isArray(value) ? value.join('\n') : value || '')
const toList = (value) =>
  String(value || '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)

const toDraft = (dessert) => ({
  ...emptyDraft,
  ...dessert,
  composition: toText(dessert.composition),
  features: toText(dessert.features),
  gallery: (Array.isArray(dessert.gallery) ? dessert.gallery : toList(dessert.gallery))
    .filter((item) => item && item !== dessert.image)
    .slice(0, 3),
})

const cleanSlug = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')

export default function DessertsManager() {
  const lenis = useSmoothScroll()
  const editorRef = useRef(null)
  const [cmsDesserts, setCmsDesserts] = useState([])
  const [selectedSlug, setSelectedSlug] = useState('')
  const [draft, setDraft] = useState(emptyDraft)
  const [isNew, setIsNew] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [galleryFiles, setGalleryFiles] = useState(emptyGalleryFiles)
  const [galleryPreviews, setGalleryPreviews] = useState(emptyGalleryFiles)
  const [query, setQuery] = useState('')
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [deletePrompt, setDeletePrompt] = useState(null)
  const [showPrompt, setShowPrompt] = useState(null)

  useEffect(() => {
    return subscribeDesserts(
      setCmsDesserts,
      (err) => {
        console.error(err)
        setError('Не вдалося завантажити товари. Перевірте Firestore rules')
      },
      { includeHidden: true },
    )
  }, [])

  useEffect(() => {
    if (!imageFile) {
      setImagePreview('')
      return undefined
    }

    const nextPreview = URL.createObjectURL(imageFile)
    setImagePreview(nextPreview)

    return () => URL.revokeObjectURL(nextPreview)
  }, [imageFile])

  useEffect(() => {
    const nextPreviews = galleryFiles.map((file) => (file ? URL.createObjectURL(file) : ''))
    setGalleryPreviews(nextPreviews)

    return () => {
      nextPreviews.forEach((preview) => {
        if (preview) URL.revokeObjectURL(preview)
      })
    }
  }, [galleryFiles])

  const desserts = useMemo(
    () => mergeDessertsWithCode(cmsDesserts, { includeHidden: true }),
    [cmsDesserts],
  )

  useEffect(() => {
    if (isNew) return
    const selected = desserts.find((item) => item.slug === selectedSlug) || desserts[0]
    if (!selected) return
    setSelectedSlug(selected.slug)
    setDraft(toDraft(selected))
  }, [desserts, isNew, selectedSlug])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const items = q
      ? desserts.filter((dessert) =>
          [dessert.name, dessert.slug, dessert.category, dessert.short]
            .join(' ')
            .toLowerCase()
            .includes(q),
        )
      : desserts

    return items
      .map((dessert, index) => ({ dessert, index }))
      .sort((a, b) => {
        const aHidden = a.dessert.visible === false ? 1 : 0
        const bHidden = b.dessert.visible === false ? 1 : 0
        return aHidden - bHidden || a.index - b.index
      })
      .map(({ dessert }) => dessert)
  }, [desserts, query])

  const codePreviewImage =
    draft.slug && codeDessertSlugs.has(draft.slug) ? `/desserts/${draft.slug}.webp` : ''
  const previewImage = imagePreview || draft.image || codePreviewImage
  const galleryUrls = Array.isArray(draft.gallery) ? draft.gallery : []
  const hasProducts = desserts.length > 0

  const updateDraft = (field, value) => {
    setDraft((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const updateGalleryUrl = (index, value) => {
    setDraft((current) => {
      const nextGallery = Array.isArray(current.gallery) ? [...current.gallery] : []
      nextGallery[index] = value

      return {
        ...current,
        gallery: nextGallery.slice(0, 3),
      }
    })
  }

  const updateGalleryFile = (index, file) => {
    setGalleryFiles((current) =>
      current.map((currentFile, fileIndex) => (fileIndex === index ? file : currentFile)),
    )
  }

  const removeGalleryImage = (index) => {
    setGalleryFiles((current) =>
      current.map((currentFile, fileIndex) => (fileIndex === index ? null : currentFile)),
    )
    setDraft((current) => {
      const nextGallery = Array.isArray(current.gallery) ? [...current.gallery] : []
      nextGallery[index] = ''

      return {
        ...current,
        gallery: nextGallery,
      }
    })
  }

  const scrollToEditor = () => {
    requestAnimationFrame(() => {
      const editor = editorRef.current
      if (!editor) return

      const top = window.scrollY + editor.getBoundingClientRect().top - 24
      if (lenis) {
        lenis.scrollTo(top, { offset: 0 })
        return
      }

      window.scrollTo({ top, left: 0, behavior: 'smooth' })
    })
  }

  const selectDessert = (dessert) => {
    setIsNew(false)
    setSelectedSlug(dessert.slug)
    setDraft(toDraft(dessert))
    setImageFile(null)
    setGalleryFiles(emptyGalleryFiles())
    setNotice('')
    setError('')
    scrollToEditor()
  }

  const addDessert = () => {
    setIsNew(true)
    setSelectedSlug('')
    setDraft({
      ...emptyDraft,
      order: desserts.length,
    })
    setImageFile(null)
    setGalleryFiles(emptyGalleryFiles())
    setNotice('')
    setError('')
  }

  const handleSave = async (event) => {
    event.preventDefault()
    setSaving(true)
    setNotice('')
    setError('')

    try {
      const slug = cleanSlug(draft.slug)
      if (!slug) throw new Error('Потрібен slug латиницею')

      let image = draft.image
      if (imageFile) {
        image = await uploadDessertImage(slug, imageFile)
      }

      const currentGallery = (Array.isArray(draft.gallery) ? draft.gallery : toList(draft.gallery))
        .filter((item) => item && item !== image)
        .slice(0, 3)
      const uploadedGallery = await Promise.all(
        galleryFiles.map((file, index) =>
          file ? uploadDessertGalleryImage(slug, file, index + 1) : currentGallery[index] || '',
        ),
      )
      const gallery = uploadedGallery
        .map((item) => String(item || '').trim())
        .filter((item) => item && item !== image)
        .filter(Boolean)
        .slice(0, 3)

      await saveDessert({
        ...draft,
        slug,
        image,
        gallery,
        price: Number(draft.price) || 0,
        order: Number(draft.order) || 0,
        composition: toList(draft.composition),
        features: toList(draft.features),
      })

      setIsNew(false)
      setSelectedSlug(slug)
      setImageFile(null)
      setGalleryFiles(emptyGalleryFiles())
      setDraft((current) => ({ ...current, slug, image, gallery }))
      setNotice('Товар збережено')
    } catch (err) {
      console.error(err)
      setError(err.message || 'Не вдалося зберегти товар')
    } finally {
      setSaving(false)
    }
  }

  const saveProductVisibility = async (dessert, visible) => {
    setSaving(true)
    setNotice('')
    setError('')

    try {
      await saveDessert({
        ...dessert,
        visible,
        price: Number(dessert.price) || 0,
        order: Number(dessert.order) || 0,
        composition: Array.isArray(dessert.composition)
          ? dessert.composition
          : toList(dessert.composition),
        features: Array.isArray(dessert.features)
          ? dessert.features
          : toList(dessert.features),
      })

      if (draft.slug === dessert.slug) {
        setDraft((current) => ({ ...current, visible }))
      }
      setNotice(visible ? 'Товар показано на сайті' : 'Товар приховано')
    } catch (err) {
      console.error(err)
      setError('Не вдалося змінити видимість товару')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteClick = () => {
    if (!draft.slug || isNew) return

    setDeletePrompt({
      dessert: { ...draft },
      title: 'Видалити товар?',
      description: `Товар “${draft.name || draft.slug}” зникне з меню сайту`,
      confirmLabel: 'Видалити',
    })
  }

  const confirmShow = async () => {
    if (!showPrompt) return
    const dessert = showPrompt
    setShowPrompt(null)
    await saveProductVisibility(dessert, true)
  }

  const confirmDeleteDessert = async () => {
    if (!deletePrompt) return

    const dessertToDelete = deletePrompt.dessert
    setDeletePrompt(null)
    setSaving(true)
    setNotice('')
    setError('')

    try {
      if (codeDessertSlugs.has(dessertToDelete.slug)) {
        await saveDessert({
          ...dessertToDelete,
          visible: false,
          deleted: true,
          price: Number(dessertToDelete.price) || 0,
          order: Number(dessertToDelete.order) || 0,
          composition: Array.isArray(dessertToDelete.composition)
            ? dessertToDelete.composition
            : toList(dessertToDelete.composition),
          features: Array.isArray(dessertToDelete.features)
            ? dessertToDelete.features
            : toList(dessertToDelete.features),
        })
      } else {
        await deleteDessert(dessertToDelete.slug)
      }

      setIsNew(false)
      setSelectedSlug('')
      setDraft(emptyDraft)
      setImageFile(null)
      setGalleryFiles(emptyGalleryFiles())
      setNotice('Товар видалено')
      reloadCrm()
    } catch (err) {
      console.error(err)
      setError('Не вдалося видалити товар')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <section className="mt-6 grid gap-5 lg:grid-cols-[21rem_minmax(0,1fr)]">
      <aside className="rounded-2xl border border-blood-400/15 bg-ink-800 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-3xl text-cream">Товари</h2>
            <p className="mt-1 text-sm text-mute">{desserts.length} товарів</p>
          </div>
          <button
            type="button"
            onClick={addDessert}
            className="focus-ring rounded-full bg-blood px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-cream transition-colors hover:bg-blood-400"
          >
            Додати
          </button>
        </div>

        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Пошук товару…"
          className="mt-4 w-full rounded-full border border-wine-700/70 bg-ink px-4 py-2.5 text-sm text-cream placeholder:text-mute transition-colors focus:border-blood-400/70 focus:outline-none focus:ring-1 focus:ring-blood-400/30"
        />

        <div className="mt-4 space-y-2">
          {filtered.length === 0 ? (
            <p className="rounded-xl border border-blood-400/15 bg-ink px-4 py-8 text-center text-sm text-mute">
              Товарів немає. Додайте товар
            </p>
          ) : (
            filtered.map((dessert) => (
              <article
                key={dessert.slug}
                className={`overflow-hidden rounded-xl border transition-colors ${
                  selectedSlug === dessert.slug && !isNew
                    ? dessert.visible === false
                      ? 'border-blood-400 bg-blood/10 opacity-75'
                      : 'border-blood-400 bg-blood/15'
                    : dessert.visible === false
                      ? 'border-blood-400/25 bg-blood/5 opacity-65 hover:opacity-90'
                    : 'border-wine-700/55 bg-ink hover:border-blood-400/50'
                }`}
              >
                <button
                  type="button"
                  onClick={() => selectDessert(dessert)}
                  className="w-full px-4 py-3 text-left"
                >
                  <span className="flex items-center justify-between gap-3">
                    <span
                      className={`block font-display text-xl leading-tight ${
                        dessert.visible === false ? 'text-cream/55' : 'text-cream'
                      }`}
                    >
                      {dessert.name || dessert.slug}
                    </span>
                    {dessert.visible === false && (
                      <span className="shrink-0 rounded-full border border-blood-400/35 bg-blood/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-blood-400">
                        Приховано
                      </span>
                    )}
                  </span>
                  <span
                    className={`mt-1 block text-xs ${
                      dessert.visible === false ? 'text-mute/60' : 'text-mute'
                    }`}
                  >
                    {dessert.slug} · {dessert.price} грн
                  </span>
                </button>

                {dessert.visible === false && (
                  <div className="border-t border-blood-400/15 px-3 pb-3">
                    <button
                      type="button"
                      onClick={() => setShowPrompt(dessert)}
                      disabled={saving}
                      className="focus-ring mt-3 w-full rounded-full bg-cream px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-blood-400 hover:text-cream disabled:pointer-events-none disabled:opacity-60"
                    >
                      Показати
                    </button>
                  </div>
                )}
              </article>
            ))
          )}
        </div>
      </aside>

      {!hasProducts && !isNew ? (
        <div
          ref={editorRef}
          className="grid place-items-center rounded-2xl border border-dashed border-blood-400/25 bg-ink-800 px-6 py-16 text-center"
        >
          <div className="max-w-sm">
            <p className="font-display text-3xl italic text-cream">Товарів ще немає</p>
            <p className="mt-2 text-sm leading-relaxed text-mute">
              Натисніть “Додати товар”, щоб створити перший товар і заповнити його поля
            </p>
          </div>
        </div>
      ) : (
      <form
        ref={editorRef}
        onSubmit={handleSave}
        className="rounded-2xl border border-blood-400/15 bg-ink-800 p-4 sm:p-6"
      >
        <div className="flex flex-col gap-4 border-b border-cream/10 pb-5 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="font-display text-4xl text-cream">
              {isNew ? 'Новий товар' : draft.name || 'Оберіть товар'}
            </h2>
            <p className="mt-2 max-w-xl text-sm text-mute">
              Зміни після збереження одразу підтягуються на сторінці меню та
              сторінці товару
            </p>
          </div>
          <div className="flex w-full flex-col items-start gap-2 md:w-auto md:items-end">
            <button
              type="submit"
              disabled={saving}
              className="focus-ring rounded-full bg-cream px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-blood-400 hover:text-cream disabled:pointer-events-none disabled:opacity-60"
            >
              {saving ? 'Зберігаємо…' : 'Зберегти'}
            </button>
            {!isNew && draft.slug && (
              <button
                type="button"
                onClick={handleDeleteClick}
                disabled={saving}
                className="focus-ring rounded-full border border-blood-400/45 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-blood-400 transition-colors hover:bg-blood hover:text-cream disabled:pointer-events-none disabled:opacity-60"
              >
                Видалити
              </button>
            )}
          </div>
        </div>

        {(notice || error) && (
          <p
            className={`mt-5 rounded-md border px-4 py-3 text-sm ${
              error
                ? 'border-blood-400/40 bg-blood/10 text-blood-400'
                : 'border-cream/15 bg-cream/5 text-cream'
            }`}
          >
            {error || notice}
          </p>
        )}

        <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Назва">
              <input
                value={draft.name}
                onChange={(event) => updateDraft('name', event.target.value)}
                placeholder="Бенто з полуницею"
                required
                className="cms-input"
              />
            </Field>
            <Field label="URL товару">
              <input
                value={draft.slug}
                onChange={(event) => updateDraft('slug', cleanSlug(event.target.value))}
                placeholder="bento-z-polunytseiu"
                required
                disabled={!isNew}
                className="cms-input disabled:opacity-60"
              />
            </Field>
            <Field label="Категорія">
              <AdminSelect
                value={draft.category}
                options={editableCategories}
                onChange={(nextCategory) => updateDraft('category', nextCategory)}
                ariaLabel="Категорія товару"
              />
            </Field>
            <Field label="Коротка мітка">
              <input
                value={draft.tagline}
                onChange={(event) => updateDraft('tagline', event.target.value)}
                placeholder="ніжний крем і свіжі ягоди"
                className="cms-input"
              />
            </Field>
            <Field label="Ціна">
              <input
                type="number"
                min="0"
                value={draft.price}
                onChange={(event) => updateDraft('price', event.target.value)}
                placeholder="1500"
                className="cms-input"
              />
            </Field>
            <Field label="Одиниця">
              <input
                value={draft.unit}
                onChange={(event) => updateDraft('unit', event.target.value)}
                placeholder="за кг або за шт"
                className="cms-input"
              />
            </Field>
            <Field label="Текст ціни">
              <input
                value={draft.priceNote}
                onChange={(event) => updateDraft('priceNote', event.target.value)}
                placeholder="оформлення за 2–5 днів"
                className="cms-input"
              />
            </Field>
            <Field label="Порядок">
              <input
                type="number"
                min="0"
                value={draft.order}
                onChange={(event) => updateDraft('order', event.target.value)}
                placeholder="10"
                className="cms-input"
              />
            </Field>
            <Field label="Вага">
              <input
                value={draft.weight}
                onChange={(event) => updateDraft('weight', event.target.value)}
                placeholder="від 1 кг"
                className="cms-input"
              />
            </Field>
            <Field label="Порції">
              <input
                value={draft.servings}
                onChange={(event) => updateDraft('servings', event.target.value)}
                placeholder="6–8 порцій"
                className="cms-input"
              />
            </Field>
            <Field label="Алергени">
              <input
                value={draft.allergens}
                onChange={(event) => updateDraft('allergens', event.target.value)}
                placeholder="глютен, молоко, яйця"
                className="cms-input"
              />
            </Field>

            <Field label="Короткий опис" className="md:col-span-2">
              <textarea
                rows={2}
                value={draft.short}
                onChange={(event) => updateDraft('short', event.target.value)}
                placeholder="маленький торт у коробці для подарунка або камерного свята"
                className="cms-input resize-y"
              />
            </Field>
            <Field label="Повний опис" className="md:col-span-2">
              <textarea
                rows={4}
                value={draft.description}
                onChange={(event) => updateDraft('description', event.target.value)}
                placeholder="опишіть смак, начинку, декор, для яких подій підходить десерт"
                className="cms-input resize-y"
              />
            </Field>
            <ListEditor
              label="Склад"
              value={draft.composition}
              onChange={(nextValue) => updateDraft('composition', nextValue)}
              addLabel="Додати складник"
              placeholder="шоколадний бісквіт"
            />
            <ListEditor
              label="Особливості"
              value={draft.features}
              onChange={(nextValue) => updateDraft('features', nextValue)}
              addLabel="Додати особливість"
              placeholder="можна адаптувати дизайн"
            />
          </div>

          <aside className="space-y-4">
            <div className="rounded-xl border border-blood-400/15 bg-ink p-4">
              <p className="text-[11px] uppercase tracking-[0.14em] text-mute">Публікація</p>
              <label className="mt-4 flex items-center gap-3 text-sm text-cream">
                <input
                  type="checkbox"
                  checked={draft.visible}
                  onChange={(event) => updateDraft('visible', event.target.checked)}
                  className="h-4 w-4 accent-blood-400"
                />
                Показувати на сайті
              </label>
              <label className="mt-3 flex items-center justify-between gap-3 text-sm text-cream">
                <span className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={draft.featured}
                    onChange={(event) => updateDraft('featured', event.target.checked)}
                    className="h-4 w-4 accent-blood-400"
                  />
                  <span>Вибране</span>
                </span>
                <span className="group relative inline-flex">
                  <button
                    type="button"
                    aria-label="Що означає Вибране"
                    className="grid h-7 w-7 place-items-center rounded-full border border-blood-400/45 bg-blood/10 text-blood-400 transition-colors hover:border-blood-400 hover:bg-blood hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blood-400/70"
                  >
                    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
                      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.6" />
                      <path d="M10 9.1v4.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                      <path d="M10 6.6h.01" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                    </svg>
                  </button>
                  <span className="pointer-events-none absolute bottom-[calc(100%+0.65rem)] right-0 z-50 w-56 rounded-xl border border-blood-400/20 bg-ink-800 px-4 py-3 text-xs leading-relaxed text-mute opacity-0 shadow-[0_18px_60px_rgba(0,0,0,0.45)] transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
                    Вибране — товар буде показуватись у блоці “Улюбленці
                    гостей” на головній сторінці
                  </span>
                </span>
              </label>
            </div>

            <div className="rounded-xl border border-blood-400/15 bg-ink p-4">
              <p className="text-[11px] uppercase tracking-[0.14em] text-mute">Фото</p>
              {previewImage ? (
                <div className="relative mt-4 overflow-hidden rounded-lg border border-blood-400/15 bg-ink-800">
                  <img
                    src={previewImage}
                    alt=""
                    className="aspect-[4/5] w-full object-cover"
                  />
                  {imagePreview && (
                    <span className="absolute left-3 top-3 rounded-full border border-blood-400/35 bg-ink-900/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-blood-400 backdrop-blur">
                      Попередній перегляд
                    </span>
                  )}
                </div>
              ) : (
                <div className="mt-4 grid aspect-[4/5] w-full place-items-center rounded-lg border border-blood-400/15 bg-ink-800 px-4 text-center text-xs leading-relaxed text-mute">
                  Фото ще не вибрано
                </div>
              )}
              <label className="mt-4 block text-sm text-mute">
                URL або локальний шлях
                <input
                  value={draft.image}
                  onChange={(event) => updateDraft('image', event.target.value)}
                  placeholder="/desserts/bento-tort.webp"
                  className="cms-input mt-2"
                />
              </label>
              <div className="mt-4">
                <p className="text-sm text-mute">Завантажити нове фото</p>
                <label className="focus-within:ring-blood-400/70 mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-full border border-blood-400/35 bg-blood/10 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-blood-400 transition-all duration-200 hover:-translate-y-0.5 hover:border-blood-400 hover:bg-blood hover:text-cream focus-within:ring-2 active:translate-y-0">
                  <input
                    key={imageFile?.name || 'empty-file-input'}
                    type="file"
                    accept="image/*"
                    onChange={(event) => setImageFile(event.target.files?.[0] || null)}
                    className="sr-only"
                  />
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
                    <path d="M10 13.5v-8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                    <path d="M6.8 8.4 10 5.2l3.2 3.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M5 14.5v.6c0 .8.6 1.4 1.4 1.4h7.2c.8 0 1.4-.6 1.4-1.4v-.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  </svg>
                  {imageFile ? 'Замінити фото' : 'Обрати фото'}
                </label>
                {imageFile && (
                  <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-blood-400/15 bg-ink-800 px-3 py-2">
                    <span className="min-w-0 truncate text-xs text-mute">
                      {imageFile.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => setImageFile(null)}
                      className="shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-blood-400 transition-colors hover:bg-blood/15 hover:text-cream"
                    >
                      Прибрати
                    </button>
                  </div>
                )}
              </div>
              {imageFile && (
                <p className="mt-3 text-xs text-blood-400">
                  Нове фото завантажиться після натискання “Зберегти”
                </p>
              )}

              <div className="mt-6 border-t border-blood-400/15 pt-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-mute">
                    Додаткові фото
                  </p>
                  <span className="rounded-full bg-blood/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-blood-400">
                    до 3 фото
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-mute/80">
                  Разом з основним фото на сторінці товару буде до 4 фото
                </p>

                <div className="mt-4 space-y-3">
                  {gallerySlots.map((slot) => (
                    <GallerySlot
                      key={slot}
                      index={slot}
                      url={galleryUrls[slot] || ''}
                      preview={galleryPreviews[slot] || galleryUrls[slot] || ''}
                      fileName={galleryFiles[slot]?.name || ''}
                      onUrlChange={(nextUrl) => updateGalleryUrl(slot, nextUrl)}
                      onFileChange={(file) => updateGalleryFile(slot, file)}
                      onRemove={() => removeGalleryImage(slot)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </form>
      )}
      </section>

      <ConfirmDialog
        open={Boolean(deletePrompt)}
        title={deletePrompt?.title}
        description={deletePrompt?.description}
        confirmLabel={deletePrompt?.confirmLabel}
        loading={saving}
        onCancel={() => setDeletePrompt(null)}
        onConfirm={confirmDeleteDessert}
      />

      <ConfirmDialog
        open={Boolean(showPrompt)}
        title="Показати на сайті?"
        description={showPrompt ? `«${showPrompt.title || showPrompt.slug}» знову зʼявиться на сайті.` : ''}
        confirmLabel="Показати"
        loading={saving}
        onCancel={() => setShowPrompt(null)}
        onConfirm={confirmShow}
      />
    </>
  )
}

function Field({ label, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-[11px] uppercase tracking-[0.14em] text-mute">
        {label}
      </span>
      {children}
    </label>
  )
}

function ListEditor({ label, value, onChange, addLabel, placeholder }) {
  const items = String(value || '').split('\n')

  const updateItem = (index, nextItem) => {
    const nextItems = [...items]
    nextItems[index] = nextItem
    onChange(nextItems.join('\n'))
  }

  const addItem = (index = items.length - 1) => {
    const nextItems = [...items]
    nextItems.splice(index + 1, 0, '')
    onChange(nextItems.join('\n'))
  }

  const removeItem = (index) => {
    const nextItems = items.filter((_, itemIndex) => itemIndex !== index)
    onChange(nextItems.length ? nextItems.join('\n') : '')
  }

  return (
    <div className="block">
      <span className="mb-2 block text-[11px] uppercase tracking-[0.14em] text-mute">
        {label}
      </span>
      <div className="rounded-2xl border border-blood-400/15 bg-ink p-3">
        <div className="space-y-2">
          {items.map((item, index) => (
            <div
              key={`${label}-${index}`}
              className="grid grid-cols-[2.25rem_minmax(0,1fr)_2.25rem] items-center gap-2 rounded-xl border border-wine-700/45 bg-ink-800 px-2.5 py-2 transition-colors focus-within:border-blood-400/60"
            >
              <span className="text-center font-price text-lg leading-none text-blood-400">
                {String(index + 1).padStart(2, '0')}
              </span>
              <input
                value={item}
                onChange={(event) => updateItem(index, event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    addItem(index)
                  }
                }}
                placeholder={placeholder}
                className="min-w-0 bg-transparent py-1.5 text-sm text-cream placeholder:text-mute/55 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => removeItem(index)}
                disabled={items.length === 1 && !item.trim()}
                aria-label="Видалити пункт"
                className="grid h-8 w-8 place-items-center rounded-full text-mute transition-colors hover:bg-blood/15 hover:text-blood-400 disabled:pointer-events-none disabled:opacity-35"
              >
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
                  <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => addItem()}
          className="focus-ring mt-3 w-full rounded-full border border-blood-400/35 bg-blood/10 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-blood-400 transition-colors hover:border-blood-400 hover:bg-blood hover:text-cream"
        >
          {addLabel}
        </button>
      </div>
    </div>
  )
}

function GallerySlot({
  index,
  url,
  preview,
  fileName,
  onUrlChange,
  onFileChange,
  onRemove,
}) {
  const hasPhoto = Boolean(preview || url || fileName)

  return (
    <div className="rounded-2xl border border-blood-400/15 bg-ink-800 p-3">
      <div className="flex gap-3">
        <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl border border-blood-400/15 bg-ink">
          {preview ? (
            <img src={preview} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center text-center font-price text-2xl text-blood-400/70">
              {String(index + 1).padStart(2, '0')}
            </div>
          )}
          {fileName && (
            <span className="absolute left-1.5 top-1.5 rounded-full bg-ink-900/85 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.1em] text-blood-400 backdrop-blur">
              Нове
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-cream">Додаткове фото {index + 1}</p>
            {hasPhoto && (
              <button
                type="button"
                onClick={onRemove}
                className="rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-blood-400 transition-colors hover:bg-blood/15 hover:text-cream"
              >
                Прибрати
              </button>
            )}
          </div>

          <input
            value={url}
            onChange={(event) => onUrlChange(event.target.value)}
            placeholder="/desserts/bento-detail.webp"
            className="cms-input mt-2 h-9 px-3 text-xs"
          />

          {fileName && (
            <p className="mt-2 truncate text-[11px] text-mute">{fileName}</p>
          )}

          <label className="focus-within:ring-blood-400/70 mt-2 inline-flex cursor-pointer items-center justify-center rounded-full border border-blood-400/35 bg-blood/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-blood-400 transition-all duration-200 hover:-translate-y-0.5 hover:border-blood-400 hover:bg-blood hover:text-cream focus-within:ring-2 active:translate-y-0">
            <input
              key={`${index}-${fileName || 'empty'}`}
              type="file"
              accept="image/*"
              onChange={(event) => onFileChange(event.target.files?.[0] || null)}
              className="sr-only"
            />
            {hasPhoto ? 'Замінити' : 'Обрати'}
          </label>
        </div>
      </div>
    </div>
  )
}
