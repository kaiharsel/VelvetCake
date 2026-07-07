import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { prefersReducedMotion } from '../../lib/gsap'

const base =
  'group relative inline-flex items-center justify-center gap-3 rounded-full font-sans text-[13px] font-semibold uppercase tracking-[0.14em] transition-colors duration-500 ease-velvet focus-ring'

const sizes = {
  md: 'px-7 py-3.5',
  lg: 'px-9 py-4',
}

const variants = {
  primary: 'bg-blood text-cream hover:bg-blood-400',
  outline:
    'border border-cream/30 text-cream hover:border-cream hover:bg-cream hover:text-ink',
  ghost: 'text-cream hover:text-ember',
  light: 'bg-cream text-ink hover:bg-ember hover:text-cream',
}

function Arrow() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[1.35em] w-[1.35em] transition-transform duration-500 ease-velvet group-hover:translate-x-1"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * Polymorphic, magnetic call-to-action.
 * Renders a router <Link> (`to`), an <a> (`href`) or a <button>.
 */
export default function Button({
  children,
  to,
  href,
  variant = 'primary',
  size = 'md',
  arrow = true,
  magnetic = true,
  className = '',
  ...rest
}) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.4 })
  const tx = useTransform(sx, (v) => v)
  const ty = useTransform(sy, (v) => v)

  const onMove = (e) => {
    if (!magnetic || prefersReducedMotion || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * 0.3)
    y.set((e.clientY - (r.top + r.height / 2)) * 0.3)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`
  const inner = (
    <>
      <span>{children}</span>
      {arrow && <Arrow />}
    </>
  )

  const motionProps = {
    ref,
    className: cls,
    style: { x: tx, y: ty },
    onMouseMove: onMove,
    onMouseLeave: reset,
    ...rest,
  }

  if (to) {
    return (
      <motion.div style={{ x: tx, y: ty }} className="inline-flex">
        <Link
          ref={ref}
          to={to}
          className={cls}
          onMouseMove={onMove}
          onMouseLeave={reset}
          {...rest}
        >
          {inner}
        </Link>
      </motion.div>
    )
  }
  if (href) {
    return (
      <motion.a href={href} {...motionProps}>
        {inner}
      </motion.a>
    )
  }
  return (
    <motion.button type="button" {...motionProps}>
      {inner}
    </motion.button>
  )
}
