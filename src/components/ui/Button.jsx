import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ChevronRight from './ChevronRight'

const base =
  'group relative inline-flex items-center justify-center gap-3 rounded-full font-sans text-[13px] font-semibold uppercase tracking-[0.14em] transition-[transform,background-color,border-color,color] duration-300 ease-velvet focus-ring'

const mobileActionDelay = 1000

const shouldDelayAction = (event, target) =>
  typeof window !== 'undefined' &&
  window.matchMedia('(max-width: 767px)').matches &&
  target !== '_blank' &&
  event.button === 0 &&
  !event.metaKey &&
  !event.ctrlKey &&
  !event.shiftKey &&
  !event.altKey

const sizes = {
  sm: 'px-6 py-2.5 text-[12px]',
  md: 'px-7 py-3.5',
  lg: 'px-9 py-4',
}

const variants = {
  primary: 'bg-blood text-cream md:hover:bg-blood-400',
  outline:
    'border border-cream/25 bg-ink/35 text-cream backdrop-blur-sm md:hover:border-blood-400 md:hover:bg-blood/25',
  ghost: 'text-cream md:hover:text-ember',
  light:
    'border border-cream/20 bg-ink-800 text-cream shadow-[0_12px_32px_rgba(0,0,0,0.28)] md:hover:border-blood-400 md:hover:bg-blood',
}

/**
 * Polymorphic call-to-action.
 * Renders a router <Link> (`to`), an <a> (`href`) or a <button>.
 */
export default function Button({
  children,
  to,
  href,
  variant = 'primary',
  size = 'md',
  arrow = true,
  className = '',
  onClick,
  type = 'button',
  target,
  ...rest
}) {
  const navigate = useNavigate()
  const timer = useRef(null)
  const [activating, setActivating] = useState(false)

  useEffect(() => () => clearTimeout(timer.current), [])

  const animateThen = (event, action) => {
    if (!shouldDelayAction(event, target)) {
      action()
      return
    }

    event.preventDefault()
    event.persist?.()
    if (activating) return

    setActivating(true)
    timer.current = window.setTimeout(() => {
      action()
      setActivating(false)
    }, mobileActionDelay)
  }

  const cls = `${base} ${sizes[size]} ${variants[variant]} ${
    activating ? 'scale-[0.96] border-blood-400 bg-blood-400' : ''
  } ${className}`
  const inner = (
    <>
      <span>{children}</span>
      {arrow && (
        <ChevronRight
          className={`transition-transform duration-300 ease-velvet md:group-hover:translate-x-1 ${
            activating ? 'translate-x-1' : ''
          }`}
        />
      )}
    </>
  )

  if (to) {
    return (
      <Link
        to={to}
        target={target}
        className={cls}
        aria-busy={activating || undefined}
        onClick={(event) => {
          if (!shouldDelayAction(event, target)) {
            onClick?.(event)
            return
          }
          animateThen(event, () => {
            onClick?.(event)
            navigate(to)
          })
        }}
        {...rest}
      >
        {inner}
      </Link>
    )
  }
  if (href) {
    return (
      <a
        href={href}
        target={target}
        className={cls}
        aria-busy={activating || undefined}
        onClick={(event) => {
          if (!shouldDelayAction(event, target)) {
            onClick?.(event)
            return
          }
          animateThen(event, () => {
            onClick?.(event)
            window.location.assign(href)
          })
        }}
        {...rest}
      >
        {inner}
      </a>
    )
  }
  return (
    <button
      type={type}
      className={cls}
      aria-busy={activating || undefined}
      onClick={(event) => {
        if (type === 'submit' || !onClick) return
        animateThen(event, () => onClick(event))
      }}
      {...rest}
    >
      {inner}
    </button>
  )
}
