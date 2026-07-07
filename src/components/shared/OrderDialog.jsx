import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { site } from '../../data/site'

/**
 * Accessible order-request modal. Front-end only: on submit it shows a
 * success state (wire `onSubmit` to your backend / CRM when ready).
 */
export default function OrderDialog({ open, onClose, product }) {
  const [sent, setSent] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  useEffect(() => {
    if (!open) setSent(false)
  }, [open])

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: POST to backend / Telegram bot / CRM.
    setSent(true)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] grid place-items-center p-4"
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
            className="relative w-full max-w-lg overflow-hidden rounded-lg border border-cream/15 bg-ink-800 p-8 md:p-10"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Закрити"
              className="focus-ring absolute right-5 top-5 text-2xl text-mute transition-colors hover:text-cream"
            >
              ×
            </button>

            {sent ? (
              <div className="py-8 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blood text-2xl text-cream">
                  ✓
                </div>
                <h2 className="font-display text-3xl text-cream">Дякуємо!</h2>
                <p className="mt-4 text-mute">
                  Ми отримали заявку{product ? ` на «${product}»` : ''} і звʼяжемось
                  з вами протягом години в робочий час.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="focus-ring mt-8 rounded-full bg-cream px-7 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ember hover:text-cream"
                >
                  Закрити
                </button>
              </div>
            ) : (
              <>
                <h2 className="font-display text-3xl text-cream">
                  {product ? `Замовити «${product}»` : 'Залишити заявку'}
                </h2>
                <p className="mt-3 text-sm text-mute">
                  Заповніть форму — ми уточнимо деталі та підтвердимо замовлення.
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
                      className="focus-ring w-full resize-none rounded-md border border-cream/20 bg-ink px-4 py-3 text-cream placeholder:text-mute focus:border-cream/50"
                    />
                  </div>

                  <button
                    type="submit"
                    className="focus-ring w-full rounded-full bg-blood py-4 text-sm font-semibold uppercase tracking-[0.14em] text-cream transition-colors hover:bg-blood-400"
                  >
                    Надіслати заявку
                  </button>
                  <p className="text-center text-xs text-mute">
                    або зателефонуйте{' '}
                    <a href={site.phoneHref} className="text-blood-400 hover:underline">
                      {site.phone}
                    </a>
                  </p>
                </form>
              </>
            )}
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
        className="focus-ring w-full rounded-md border border-cream/20 bg-ink px-4 py-3 text-cream placeholder:text-mute focus:border-cream/50"
        {...rest}
      />
    </div>
  )
}
