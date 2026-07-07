import { Link } from 'react-router-dom'
import Seo from '../components/ui/Seo'

export default function NotFound() {
  return (
    <section className="grid min-h-[92svh] place-items-center bg-wine-900 px-6 text-center">
      <Seo title="Сторінку не знайдено" path="/404" />
      <div>
        <p className="eyebrow">Помилка 404</p>
        <h1 className="display-hero mt-6 font-display text-cream">
          Загубились у <span className="italic text-blood-400">темряві</span>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-pretty text-cream/70">
          Сторінки не існує або її прибрали. Повернімося туди, де смачно.
        </p>
        <Link
          to="/"
          className="focus-ring mt-10 inline-flex items-center gap-3 rounded-full bg-blood px-8 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-cream transition-colors hover:bg-blood-400"
        >
          На головну <span className="inline-block text-[1.4em] leading-none align-middle">→</span>
        </Link>
      </div>
    </section>
  )
}
