import { Link } from 'react-router-dom'
import { nav, site } from '../../data/site'
import { useSmoothScroll } from './SmoothScroll'
import BrandMark from '../ui/BrandMark'

export default function Footer() {
  const lenis = useSmoothScroll()
  const toTop = () =>
    lenis ? lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="relative overflow-hidden border-t border-cream/10 bg-ink pt-20">
      <div className="container-shell">
        <div className="grid gap-14 pb-16 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <BrandMark className="h-11 w-11" />
              <div className="flex items-baseline gap-[2px]">
                <span className="font-display text-4xl text-cream">Velvet</span>
                <span className="font-display text-4xl italic text-gold-300">Cake</span>
              </div>
            </div>
            <p className="mt-6 max-w-sm text-pretty leading-relaxed text-mute">
              Авторська кондитерська темного люксу. Драматичні торти й десерти
              ручної роботи з {site.founded} року.
            </p>
            <a
              href={site.mapHref}
              target="_blank"
              rel="noreferrer"
              className="focus-ring mt-6 inline-block text-sm text-sand transition-colors hover:text-cream"
            >
              {site.address}
            </a>
          </div>

          {/* Nav */}
          <div className="md:col-span-3">
            <h4 className="eyebrow mb-6">Навігація</h4>
            <ul className="space-y-3">
              {nav.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="focus-ring text-cream/80 transition-colors hover:text-blood-400"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/menu"
                  className="focus-ring text-cream/80 transition-colors hover:text-blood-400"
                >
                  Оформити замовлення
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacts + hours */}
          <div className="md:col-span-4">
            <h4 className="eyebrow mb-6">Контакти</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={site.phoneHref}
                  className="focus-ring text-lg text-cream transition-colors hover:text-blood-400"
                >
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={site.emailHref}
                  className="focus-ring text-cream/80 transition-colors hover:text-blood-400"
                >
                  {site.email}
                </a>
              </li>
            </ul>

            <h4 className="eyebrow mb-4 mt-8">Графік роботи</h4>
            <ul className="space-y-2 text-cream/80">
              {site.hours.map((h) => (
                <li key={h.day} className="flex justify-between gap-6 border-b border-cream/10 pb-2">
                  <span>{h.day}</span>
                  <span className="text-mute">{h.time}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-4">
              {site.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="focus-ring rounded-full border border-cream/20 px-4 py-2 text-xs uppercase tracking-[0.14em] text-cream/80 transition-colors hover:border-blood-400 hover:text-blood-400"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Oversized wordmark */}
        <button
          type="button"
          onClick={toTop}
          aria-label="Нагору"
          className="focus-ring group block w-full select-none border-t border-cream/10 pt-10 text-center"
        >
          <span className="block font-display text-[18vw] leading-none text-cream/[0.07] transition-colors duration-700 group-hover:text-blood/20">
            VelvetCake
          </span>
        </button>

        <div className="flex flex-col items-center justify-between gap-3 py-8 text-xs text-mute md:flex-row">
          <p>
            © {new Date().getFullYear()} {site.name}. Усі права захищено.
          </p>
          <button
            type="button"
            onClick={toTop}
            className="focus-ring uppercase tracking-[0.14em] transition-colors hover:text-cream"
          >
            Нагору <span className="inline-block text-[1.4em] leading-none align-middle">↑</span>
          </button>
        </div>
      </div>
    </footer>
  )
}
