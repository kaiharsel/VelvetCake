import { useEffect } from 'react'

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Підтвердити',
  cancelLabel = 'Скасувати',
  loading = false,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!open) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onCancel?.()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onCancel, open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[120] grid place-items-center px-4 py-6">
      <button
        type="button"
        aria-label="Закрити повідомлення"
        onClick={onCancel}
        className="absolute inset-0 cursor-default bg-ink-900/80 backdrop-blur-md"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-confirm-title"
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-blood-400/25 bg-ink-800 p-5 shadow-[0_28px_90px_rgba(0,0,0,0.6)] sm:p-6"
      >
        <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-blood-400/70 to-transparent" />

        <div className="flex items-start gap-4">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-blood-400/35 bg-blood/10 text-blood-400">
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden="true">
              <path d="M10 6.2v4.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M10 13.8h.01" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
              <path
                d="M8.8 3.6 2.6 14.3c-.5.9.1 2 1.2 2h12.4c1.1 0 1.7-1.1 1.2-2L11.2 3.6c-.5-.9-1.9-.9-2.4 0Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="min-w-0">
            <h2 id="admin-confirm-title" className="font-display text-3xl leading-none text-cream">
              {title}
            </h2>
            {description && (
              <p className="mt-3 text-sm leading-relaxed text-mute">
                {description}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="focus-ring rounded-full border border-blood-400/25 bg-ink px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-mute transition-colors hover:border-blood-400/50 hover:text-cream disabled:pointer-events-none disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="focus-ring rounded-full bg-blood px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-cream transition-colors hover:bg-blood-400 disabled:pointer-events-none disabled:opacity-60"
          >
            {loading ? 'Виконуємо' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
