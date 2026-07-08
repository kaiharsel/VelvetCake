import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { site } from '../../data/site'
import { createLead } from '../../lib/leads'
import Button from '../ui/Button'
import IconButton from '../ui/IconButton'
import { useSmoothScroll } from '../layout/SmoothScroll'
import { useScrollLock } from '../../hooks/useScrollLock'

/**
 * Accessible order-request modal. Front-end only: on submit it shows a
 * success state (wire `onSubmit` to your backend / CRM when ready).
 */
export default function OrderDialog({ open, onClose, product }) {
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const lenis = useSmoothScroll()

  // iOS-safe scroll lock (position:fixed body) shared with the burger menu.
  useScrollLock(open, lenis)

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open) {
      setSent(false)
      setSubmitting(false)
      setError('')
    }
  }, [open])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const form = e.currentTarget
    const data = new FormData(form)

    try {
      await createLead({
        type: 'order',
        source: 'order-dialog',
        product,
        name: data.get('name'),
        phone: data.get('phone'),
        preferredDate: data.get('date'),
        note: data.get('note'),
      })
      form.reset()
      setSent(true)
    } catch (err) {
      console.error(err)
      setError('Не вдалося надіслати заявку. Перевірте Firebase або спробуйте ще раз')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex h-[100dvh] items-center justify-center overflow-hidden px-3 pt-[max(0.75rem,env(safe-area-inset-top,0px))] pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Оформлення замовлення"
        >
          <div className="absolute inset-0 bg-ink/80 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex max-h-full min-h-0 w-full max-w-lg overflow-hidden rounded-lg border border-blood-400/20 bg-ink-800"
          >
            <IconButton
              onClick={onClose}
              aria-label="Закрити"
              size="sm"
              className="absolute right-3 top-3 z-20 text-mute md:right-5 md:top-5 md:hover:text-cream"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </IconButton>

            <div
              data-lenis-prevent
              style={{ WebkitOverflowScrolling: 'touch' }}
              className="min-h-0 w-full flex-1 touch-pan-y overflow-y-auto overscroll-contain p-5 pt-16 [scrollbar-width:thin] sm:p-8 sm:pt-16 md:p-10 md:pt-16"
            >
            {sent ? (
              <div className="flex min-h-[22rem] flex-col items-center justify-center py-6 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blood text-2xl text-cream">
                  ✓
                </div>
                <h2 className="font-display text-3xl text-cream">Дякуємо!</h2>
                <p className="mt-4 max-w-sm text-pretty text-mute">
                  Ми отримали заявку{product ? ` на «${product}»` : ''} і звʼяжемось
                  з вами протягом години в робочий час
                </p>
                <Button
                  onClick={onClose}
                  variant="outline"
                  arrow={false}
                  className="mt-8"
                >
                  Закрити
                </Button>
              </div>
            ) : (
              <>
                <h2 className="pr-10 font-display text-3xl text-cream">
                  {product ? `Замовити «${product}»` : 'Залишити заявку'}
                </h2>
                <p className="mt-3 text-sm text-mute">
                  Заповніть форму. Ми уточнимо деталі та підтвердимо замовлення
                </p>

                <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                  <Field label="Ваше імʼя" name="name" required placeholder="Олена" />
                  <Field
                    label="Телефон"
                    name="phone"
                    type="tel"
                    required
                    placeholder="+380 __ ___ __ __"
                  />
                  <Field
                    label="Бажана дата"
                    name="date"
                    type="date"
                  />
                  <div>
                    <label
                      htmlFor="ord-note"
                      className="mb-2 block text-[11px] uppercase tracking-[0.14em] text-mute"
                    >
                      Побажання
                    </label>
                    <textarea
                      id="ord-note"
                      name="note"
                      rows={3}
                      defaultValue={product ? `Десерт: ${product}. ` : ''}
                      placeholder="Кількість персон, тематика, побажання…"
                      className="w-full resize-none rounded-md border border-wine-700/70 bg-ink px-4 py-3 text-cream placeholder:text-mute transition-colors focus:border-blood-400/70 focus:outline-none focus:ring-1 focus:ring-blood-400/30"
                    />
                  </div>

                  {error && (
                    <p className="rounded-md border border-blood-400/40 bg-blood/10 px-4 py-3 text-sm text-blood-400">
                      {error}
                    </p>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    arrow={false}
                    disabled={submitting}
                    className="w-full"
                  >
                    {submitting ? 'Надсилаємо…' : 'Надіслати заявку'}
                  </Button>
                  <p className="text-center text-xs text-mute">
                    або зателефонуйте{' '}
                    <a href={site.phoneHref} className="text-blood-400 hover:underline">
                      {site.phone}
                    </a>
                  </p>
                </form>
              </>
            )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Field({ label, name, type = 'text', ...rest }) {
  return (
    <div>
      <label
        htmlFor={`ord-${name}`}
        className="mb-2 block text-[11px] uppercase tracking-[0.14em] text-mute"
      >
        {label}
      </label>
      <input
        id={`ord-${name}`}
        name={name}
        type={type}
        className={`min-w-0 w-full rounded-md border border-wine-700/70 bg-ink px-4 py-3 text-base text-cream placeholder:text-mute transition-colors focus:border-blood-400/70 focus:outline-none focus:ring-1 focus:ring-blood-400/30 ${
          type === 'date'
            ? 'block h-12 min-h-12 max-w-full appearance-none overflow-hidden py-0 leading-normal'
            : ''
        }`}
        {...rest}
      />
    </div>
  )
}
