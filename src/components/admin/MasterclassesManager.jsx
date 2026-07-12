import { useEffect, useMemo, useState } from 'react'
import ConfirmDialog from './ConfirmDialog'
import {
  deleteMasterclass,
  mergeMasterclassesWithCode,
  saveMasterclass,
  subscribeMasterclasses,
} from '../../lib/masterclassesCms'

const inputClass =
  'w-full rounded-md border border-wine-700/70 bg-ink px-4 py-3 text-sm text-cream placeholder:text-mute transition-colors focus:border-blood-400/70 focus:outline-none focus:ring-1 focus:ring-blood-400/30'
const labelClass = 'mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-mute'

const cleanSlug = (value) =>
  String(value || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')

const emptyDraft = {
  slug: '',
  title: '',
  duration: '1,5–2 год',
  seats: '6-12',
  price: '',
  text: '',
  visible: true,
}

const toDraft = (mc) => ({
  ...emptyDraft,
  ...mc,
  price: mc.price ? String(mc.price) : '',
})

function EditCard({ mc, isNew = false, nextOrder = 1, onSaved, onDelete, onCancelNew }) {
  const [draft, setDraft] = useState(() => (isNew ? { ...emptyDraft } : toDraft(mc)))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const set = (key, value) => setDraft((prev) => ({ ...prev, [key]: value }))

  const handleSave = async () => {
    setError('')
    if (!draft.title.trim()) {
      setError('Вкажіть назву')
      return
    }
    const slug = isNew ? cleanSlug(draft.slug || draft.title) : draft.slug
    if (!slug) {
      setError('Вкажіть назву або slug')
      return
    }

    setSaving(true)
    try {
      await saveMasterclass({
        ...draft,
        slug,
        price: Number(draft.price) || 0,
        order: isNew ? nextOrder : Number(mc.order) || nextOrder,
        visible: draft.visible !== false,
      })
      onSaved(isNew)
    } catch (err) {
      console.error(err)
      setError('Не вдалося зберегти. Перевірте права Firestore')
    } finally {
      setSaving(false)
    }
  }

  return (
    <article className="rounded-2xl border border-wine-700/45 bg-ink-800 p-5">
      {!isNew && (
        <div className="mb-4 flex items-center justify-end">
          <label className="flex cursor-pointer select-none items-center gap-2 text-xs text-mute">
            <input
              type="checkbox"
              checked={draft.visible !== false}
              onChange={(event) => set('visible', event.target.checked)}
              className="h-4 w-4 accent-blood-400"
            />
            Показувати на сайті
          </label>
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isNew && (
          <div className="sm:col-span-2 lg:col-span-4">
            <label className={labelClass}>Slug (латиницею, необовʼязково)</label>
            <input
              className={inputClass}
              value={draft.slug}
              onChange={(event) => set('slug', event.target.value)}
              placeholder="згенерується з назви, якщо порожньо"
            />
          </div>
        )}
        <div className="sm:col-span-2 lg:col-span-4">
          <label className={labelClass}>Назва</label>
          <input className={inputClass} value={draft.title} onChange={(event) => set('title', event.target.value)} placeholder="Барбі" />
        </div>
        <div>
          <label className={labelClass}>Тривалість</label>
          <input className={inputClass} value={draft.duration} onChange={(event) => set('duration', event.target.value)} placeholder="1,5–2 год" />
        </div>
        <div>
          <label className={labelClass}>Місць</label>
          <input className={inputClass} value={draft.seats} onChange={(event) => set('seats', event.target.value)} placeholder="6-12" />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Ціна, грн</label>
          <input className={inputClass} type="number" inputMode="numeric" value={draft.price} onChange={(event) => set('price', event.target.value)} placeholder="1500" />
        </div>
        <div className="sm:col-span-2 lg:col-span-4">
          <label className={labelClass}>Опис</label>
          <textarea className={`${inputClass} min-h-24 resize-y`} value={draft.text} onChange={(event) => set('text', event.target.value)} placeholder="Короткий опис теми оформлення" />
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-md border border-blood-400/40 bg-blood/10 px-4 py-2.5 text-sm text-blood-400">{error}</p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="focus-ring rounded-full bg-cream px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-blood-400 hover:text-cream disabled:pointer-events-none disabled:opacity-60"
        >
          {saving ? 'Зберігаємо…' : 'Зберегти'}
        </button>
        {isNew ? (
          <button
            type="button"
            onClick={onCancelNew}
            className="focus-ring rounded-full border border-cream/20 px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-cream transition-colors hover:border-blood-400 hover:text-blood-400"
          >
            Скасувати
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onDelete(mc)}
            className="focus-ring rounded-full border border-blood-400/45 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-blood-400 transition-colors hover:bg-blood hover:text-cream"
          >
            Видалити
          </button>
        )}
      </div>
    </article>
  )
}

function HiddenCard({ mc, onShow, onDelete }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-blood-400/25 bg-blood/5 opacity-70 transition-opacity hover:opacity-100">
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <div className="min-w-0">
          <p className="truncate font-display text-2xl leading-tight text-cream/60">
            {mc.title || mc.slug}
          </p>
          <p className="mt-1 text-xs text-mute/70">
            {mc.slug} · {mc.price} грн
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-blood-400/35 bg-blood/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-blood-400">
          Приховано
        </span>
      </div>
      <div className="flex gap-3 border-t border-blood-400/15 px-4 pb-4 pt-3">
        <button
          type="button"
          onClick={() => onShow(mc)}
          className="focus-ring flex-1 rounded-full bg-cream px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-blood-400 hover:text-cream"
        >
          Показати
        </button>
        <button
          type="button"
          onClick={() => onDelete(mc)}
          className="focus-ring rounded-full border border-blood-400/45 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-blood-400 transition-colors hover:bg-blood hover:text-cream"
        >
          Видалити
        </button>
      </div>
    </article>
  )
}

export default function MasterclassesManager() {
  const [cmsList, setCmsList] = useState([])
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [adding, setAdding] = useState(false)
  const [deletePrompt, setDeletePrompt] = useState(null)
  const [showPrompt, setShowPrompt] = useState(null)

  useEffect(() => {
    return subscribeMasterclasses(
      setCmsList,
      (err) => {
        console.error(err)
        setError('Не вдалося завантажити майстер-класи. Перевірте Firestore rules')
      },
      { includeHidden: true },
    )
  }, [])

  const masterclasses = useMemo(
    () => mergeMasterclassesWithCode(cmsList, { includeHidden: true }),
    [cmsList],
  )

  const visibleList = masterclasses.filter((mc) => mc.visible !== false)
  const hiddenList = masterclasses.filter((mc) => mc.visible === false)
  const nextOrder =
    masterclasses.reduce((max, mc) => Math.max(max, Number(mc.order) || 0), 0) + 1

  const flash = (message) => {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2500)
  }

  const setVisibility = async (mc, visible) => {
    setError('')
    try {
      await saveMasterclass({
        ...mc,
        visible,
        price: Number(mc.price) || 0,
        order: Number(mc.order) || 0,
      })
      flash(visible ? 'Показано на сайті' : 'Приховано')
    } catch (err) {
      console.error(err)
      setError('Не вдалося змінити видимість. Перевірте права Firestore')
    }
  }

  const confirmShow = async () => {
    if (!showPrompt) return
    const mc = showPrompt
    setShowPrompt(null)
    await setVisibility(mc, true)
  }

  const confirmDelete = async () => {
    if (!deletePrompt) return
    const { slug } = deletePrompt
    setDeletePrompt(null)
    setError('')
    try {
      await deleteMasterclass(slug)
      // Reload so the list rebuilds cleanly after removal.
      window.setTimeout(() => window.location.reload(), 250)
    } catch (err) {
      console.error(err)
      setError('Не вдалося видалити. Перевірте права Firestore')
    }
  }

  return (
    <section className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-xl text-sm text-mute">
          Редагуйте теми для секції «Оберіть свою тему». Зміни зʼявляться на сайті одразу
        </p>
        <button
          type="button"
          onClick={() => setAdding(true)}
          disabled={adding}
          className="focus-ring rounded-full bg-blood px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-cream transition-colors hover:bg-blood-400 disabled:pointer-events-none disabled:opacity-60"
        >
          Додати
        </button>
      </div>

      {error && (
        <p className="mt-4 rounded-md border border-blood-400/40 bg-blood/10 px-4 py-3 text-sm text-blood-400">{error}</p>
      )}
      {notice && (
        <p className="mt-4 rounded-md border border-blood-400/25 bg-blood/5 px-4 py-3 text-sm text-cream/80">{notice}</p>
      )}

      <div className="mt-6 space-y-4">
        {adding && (
          <EditCard isNew nextOrder={nextOrder} onSaved={() => { setAdding(false); flash('Збережено') }} onCancelNew={() => setAdding(false)} />
        )}

        {!adding && masterclasses.length === 0 && (
          <div className="grid min-h-60 place-items-center overflow-hidden rounded-xl border border-cream/10 bg-ink px-5 py-16 text-center">
            <div>
              <p className="font-display text-3xl italic text-cream">Тем ще немає</p>
              <p className="mt-3 text-sm text-mute">
                Додайте першу тему для секції «Оберіть свою тему»
              </p>
            </div>
          </div>
        )}

        {visibleList.map((mc) => (
          <EditCard
            key={mc.slug}
            mc={mc}
            onSaved={() => flash('Збережено')}
            onDelete={(item) => setDeletePrompt({ slug: item.slug, title: item.title })}
          />
        ))}

        {hiddenList.map((mc) => (
          <HiddenCard
            key={mc.slug}
            mc={mc}
            onShow={(item) => setShowPrompt(item)}
            onDelete={(item) => setDeletePrompt({ slug: item.slug, title: item.title })}
          />
        ))}
      </div>

      <ConfirmDialog
        open={Boolean(deletePrompt)}
        title="Видалити майстер-клас?"
        description={deletePrompt ? `«${deletePrompt.title || deletePrompt.slug}» буде видалено.` : ''}
        confirmLabel="Видалити"
        onCancel={() => setDeletePrompt(null)}
        onConfirm={confirmDelete}
      />

      <ConfirmDialog
        open={Boolean(showPrompt)}
        title="Показати на сайті?"
        description={showPrompt ? `«${showPrompt.title || showPrompt.slug}» знову зʼявиться на сайті.` : ''}
        confirmLabel="Показати"
        onCancel={() => setShowPrompt(null)}
        onConfirm={confirmShow}
      />
    </section>
  )
}
