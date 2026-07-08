import Seo from '../components/ui/Seo'
import Button from '../components/ui/Button'

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
          Сторінки не існує або її прибрали. Повернімося туди, де смачно
        </p>
        <Button to="/" size="lg" className="mt-10">
          На головну
        </Button>
      </div>
    </section>
  )
}
