import { useEffect, useId, useRef, useState } from 'react'

const normalizeOption = (option) =>
  typeof option === 'string'
    ? { value: option, label: option }
    : {
        value: option.value ?? option.id,
        label: option.label ?? option.value ?? option.id,
        meta: option.meta,
      }

export default function FormSelect({
  id: inputId,
  name,
  value,
  options,
  onChange,
  ariaLabel,
  placeholder = 'Оберіть',
  className = '',
}) {
  const id = useId()
  const rootRef = useRef(null)
  const [open, setOpen] = useState(false)
  const normalizedOptions = options.map(normalizeOption)
  const selected = normalizedOptions.find((option) => option.value === value)

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
      {name && <input type="hidden" name={name} value={value ?? ''} />}

      <button
        id={inputId}
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => setOpen((current) => !current)}
        className={`focus-ring group flex min-h-12 w-full items-center justify-between gap-3 rounded-md border px-4 py-3 text-left text-cream transition-all duration-300 ${
          open
            ? 'border-blood-400 bg-blood/15 shadow-[0_14px_38px_rgba(0,0,0,0.28)]'
            : 'border-wine-700/70 bg-ink hover:border-blood-400/60 hover:bg-blood/10'
        }`}
      >
        <span className="min-w-0 truncate text-base">
          {selected?.label || placeholder}
        </span>
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
          data-lenis-prevent
          className="absolute left-0 top-[calc(100%+0.5rem)] z-50 max-h-72 w-full touch-pan-y overflow-y-auto overscroll-contain rounded-2xl border border-blood-400/25 bg-ink-800 p-1.5 shadow-[0_22px_70px_rgba(0,0,0,0.42)] [scrollbar-width:thin]"
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
                className={`flex w-full items-center justify-between gap-4 rounded-xl px-3.5 py-3 text-left transition-colors ${
                  active
                    ? 'bg-blood text-cream'
                    : 'text-mute hover:bg-blood/10 hover:text-cream'
                }`}
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm">{option.label}</span>
                  {option.meta && (
                    <span className="mt-0.5 block text-xs text-current/65">
                      {option.meta}
                    </span>
                  )}
                </span>
                {active && (
                  <span className="shrink-0 text-xs text-cream/80" aria-hidden="true">
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
