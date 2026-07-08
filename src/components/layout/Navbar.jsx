import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { nav, site } from '../../data/site'
import SocialLink from '../ui/SocialLink'
import Button from '../ui/Button'
import { useSmoothScroll } from './SmoothScroll'
import BrandMark from '../ui/BrandMark'

function Logo({ onClick }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label={`${site.name}, головна`}
      className="focus-ring group flex items-center gap-2.5"
    >
      <BrandMark className="h-7 w-auto shrink-0 -translate-y-0.5 object-contain md:h-8" />
      <span className="flex items-baseline gap-[2px]">
        <span className="font-display text-2xl leading-none tracking-tight text-cream md:text-[26px]">
          Velvet
        </span>
        <span className="font-display text-2xl italic leading-none tracking-tight text-gold-300 md:text-[26px]">
          Cake
        </span>
      </span>
    </Link>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const lenis = useSmoothScroll()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on navigation
  useEffect(() => setOpen(false), [location.pathname])

  // Lock scroll while the overlay is open
  useEffect(() => {
    if (!lenis) return
    if (open) lenis.stop()
    else lenis.start()
  }, [open, lenis])

  return (
    <>
      <header
        className={`safe-area-top fixed inset-x-0 top-0 z-50 transition-colors duration-500 ease-velvet ${
          scrolled || open
            ? 'border-b border-cream/10 bg-ink/80 backdrop-blur-md'
            : 'border-b border-transparent'
        }`}
      >
        <div className="container-shell safe-area-inline flex h-[68px] items-center justify-between md:h-[76px]">
          <Logo />

          <nav className="hidden items-center gap-9 md:flex" aria-label="Головна навігація">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `focus-ring relative font-sans text-[13px] uppercase tracking-[0.14em] transition-colors duration-300 ${
                    isActive ? 'text-cream' : 'text-mute hover:text-cream'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    {isActive && (
                      <span className="absolute -bottom-2 left-1/2 h-[2px] w-5 -translate-x-1/2 rounded-full bg-blood-400" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Button
              to="/menu"
              size="sm"
              arrow={false}
              className="hidden md:inline-flex"
            >
              Замовити
            </Button>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Закрити меню' : 'Відкрити меню'}
              aria-expanded={open}
              className="focus-ring flex h-10 w-10 flex-col items-center justify-center gap-[5px] md:hidden"
            >
              <span
                className={`h-px w-6 bg-cream transition-transform duration-300 ${
                  open ? 'translate-y-[3px] rotate-45' : ''
                }`}
              />
              <span
                className={`h-px w-6 bg-cream transition-transform duration-300 ${
                  open ? '-translate-y-[3px] -rotate-45' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 h-[100dvh] overflow-hidden bg-ink md:hidden"
          >
            <div
              data-lenis-prevent
              style={{ WebkitOverflowScrolling: 'touch' }}
              className="container-shell safe-area-inline burger-menu-scroll h-full touch-pan-y overflow-y-auto overscroll-contain"
            >
              <div className="flex min-h-full flex-col justify-center gap-2 py-4">
              <div className="burger-nav-offset flex flex-col gap-2">
                {nav.map((item, i) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <NavLink
                      to={item.to}
                      className="burger-menu-link block border-b border-cream/10 py-5 font-display text-4xl text-cream"
                    >
                      {item.label}
                    </NavLink>
                  </motion.div>
                ))}
              </div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + nav.length * 0.08, duration: 0.5 }}
                className="burger-menu-contacts mt-8 flex flex-col gap-5 text-mute"
              >
                <div className="flex flex-col gap-1">
                  <a href={site.phoneHref} className="py-1 text-lg text-cream">
                    {site.phone}
                  </a>
                </div>
                <div className="grid gap-2">
                  {site.socials.map((social) => (
                    <SocialLink key={social.label} social={social} className="w-full" />
                  ))}
                </div>
                <Button
                  to="/menu"
                  size="lg"
                  arrow={false}
                  className="w-full"
                  onClick={() => setOpen(false)}
                >
                  Замовити
                </Button>
              </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
