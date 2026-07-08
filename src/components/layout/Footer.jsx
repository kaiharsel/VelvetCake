import { Link } from 'react-router-dom'
import { nav, site } from '../../data/site'
import BrandMark from '../ui/BrandMark'
import SocialLink from '../ui/SocialLink'

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-cream/10 bg-ink pt-20">
      <div className="container-shell">
        <div className="grid gap-14 pb-16 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <BrandMark className="h-10 w-auto shrink-0 object-contain md:h-11" />
              <div className="flex items-baseline gap-[2px]">
                <span className="font-display text-4xl text-cream">Velvet</span>
                <span className="font-display text-4xl italic text-gold-300">Cake</span>
              </div>
            </div>
            <p className="mt-6 max-w-sm text-pretty leading-relaxed text-mute">
              Авторська кондитерська темного люксу. Драматичні торти й десерти
              ручної роботи з {site.founded} року
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
              {site.socials.map((social) => (
                <li key={social.label}>
                  <SocialLink social={social} className="w-full" />
                </li>
              ))}
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

          </div>
        </div>

        {/* Oversized wordmark */}
        <div className="block w-full select-none pb-8 pt-4 text-center md:border-t md:border-cream/10 md:pb-0 md:pt-10">
          <span className="block font-display text-[18vw] leading-none text-cream/[0.07]">
            VelvetCake
          </span>
        </div>

      </div>
    </footer>
  )
}
