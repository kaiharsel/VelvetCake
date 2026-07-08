import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const delay = 500

const isMobilePrimaryClick = (event) =>
  typeof window !== 'undefined' &&
  window.matchMedia('(max-width: 767px)').matches &&
  event.button === 0 &&
  !event.metaKey &&
  !event.ctrlKey &&
  !event.shiftKey &&
  !event.altKey

export default function DelayedLink({ to, className = '', onClick, children, ...rest }) {
  const navigate = useNavigate()
  const timer = useRef(null)
  const [pending, setPending] = useState(false)

  useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <Link
      to={to}
      data-pending={pending || undefined}
      aria-busy={pending || undefined}
      className={`${className} ${pending ? 'mobile-interaction-pending' : ''}`}
      onClick={(event) => {
        if (!isMobilePrimaryClick(event)) {
          onClick?.(event)
          return
        }

        event.preventDefault()
        event.persist?.()
        if (pending) return

        setPending(true)
        timer.current = window.setTimeout(() => {
          onClick?.(event)
          navigate(to)
        }, delay)
      }}
      {...rest}
    >
      {children}
    </Link>
  )
}
