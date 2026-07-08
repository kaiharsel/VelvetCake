import { useEffect, useId, useRef, useState } from 'react'

const normalizeOption = (option) =>
  typeof option === 'string'
    ? { value: option, label: option }
    : {
        value: option.value ?? option.id,
        label: option.label ?? option.value ?? option.id,
      }

export default function AdminSelect({
  value,
  options,
  onChange,
  ariaLabel,
  className = '',
  align = 'left',
}) {
  const id = useId()
  const rootRef = useRef(null)
  const [open, setOpen] = useState(false)
  const normalizedOptions = options.map(normalizeOption)
  const selected =
    normalizedOptions.find((option) => option.value === value) ||
    normalizedOptions[0]

  useEffect(() => {
    if (!open) return undefined

    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const pick = (nextValue) => {
    onChange(nextValue)
    setOpen(false)
  }

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => setOpen((current) => !current)}
        className={`focus-ring group flex w-full items-center justify-between gap-3 rounded-full border px-4 py-2.5 text-left text-sm transition-all duration-300 ${
          open
            ? 'border-blood-400 bg-blood/15 text-cream shadow-[0_14px_38px_rgba(0,0,0,0.28)]'
            : 'border-wine-700/70 bg-ink text-cream hover:border-blood-400/60 hover:bg-blood/10'
        }`}
      >
        <span className="min-w-0 truncate">{selected?.label || 'Оберіть'}</span>
        <span
          className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-all duration-300 ${
            open
              ? 'rotate-180 border-blood-400 bg-blood text-cream'
              : 'border-wine-700/70 bg-ink-800 text-blood-400 group-hover:border-blood-400/60'
          }`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none">
            <path
              d="m5.5 8 4.5 4 4.5-4"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {open && (
        <div
          id={id}
          role="listbox"
          className={`absolute top-[calc(100%+0.5rem)] z-50 min-w-full overflow-hidden rounded-2xl border border-blood-400/25 bg-ink-800 p-1.5 shadow-[0_22px_70px_rgba(0,0,0,0.42)] ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {normalizedOptions.map((option) => {
            const active = option.value === value
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => pick(option.value)}
                className={`flex w-full items-center justify-between gap-4 rounded-xl px-3.5 py-2.5 text-left text-sm transition-colors ${
                  active
                    ? 'bg-blood text-cream'
                    : 'text-mute hover:bg-blood/10 hover:text-cream'
                }`}
              >
                <span className="whitespace-nowrap">{option.label}</span>
                {active && (
                  <span className="text-xs text-cream/80" aria-hidden="true">
                    ✓
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
