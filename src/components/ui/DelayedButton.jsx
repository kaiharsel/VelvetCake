import { useEffect, useRef, useState } from 'react'

const delay = 500

export default function DelayedButton({
  children,
  onClick,
  type = 'button',
  className = '',
  ...rest
}) {
  const timer = useRef(null)
  const [pending, setPending] = useState(false)

  useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <button
      type={type}
      data-pending={pending || undefined}
      aria-busy={pending || undefined}
      className={`${className} ${pending ? 'mobile-interaction-pending' : ''}`}
      onClick={(event) => {
        const isMobile = window.matchMedia('(max-width: 767px)').matches
        if (!isMobile || type === 'submit') {
          onClick?.(event)
          return
        }

        event.preventDefault()
        event.persist?.()
        if (pending) return

        setPending(true)
        timer.current = window.setTimeout(() => {
          onClick?.(event)
          setPending(false)
        }, delay)
      }}
      {...rest}
    >
      {children}
    </button>
  )
}
