import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Seo from '../components/ui/Seo'
import Figure from '../components/ui/Figure'
import Reveal from '../components/ui/Reveal'
import DessertCard from '../components/ui/DessertCard'
import OrderDialog from '../components/shared/OrderDialog'
import { categories, getDessert, getRelated } from '../data/desserts'

const catLabel = (id) => categories.find((c) => c.id === id)?.label || ''
const fmtPrice = (p) => new Intl.NumberFormat('uk-UA').format(p)

export default function Dessert() {
  const { slug } = useParams()
  const dessert = getDessert(slug)
  const [activeImg, setActiveImg] = useState(0)
  const [orderOpen, setOrderOpen] = useState(false)

  if (!dessert) {
    return (
      <div className="grid min-h-[70vh] place-items-center px-6 text-center">
        <div>
          <p className="font-display text-4xl italic text-cream">Десерт не знайдено</p>
          <Link
            to="/menu"
            className="focus-ring mt-8 inline-block rounded-full bg-blood px-7 py-3 text-sm uppercase tracking-[0.14em] text-cream"
          >
            До меню
          </Link>
        </div>
      </div>
    )
  }

  const related = getRelated(slug, 3)
  const gallery = [0, 1, 2, 3] // placeholder frames until real photos arrive

  return (
    <>
      <Seo
        title={dessert.name}
        description={dessert.short}
        path={`/menu/${slug}`}
      />

      <article className="bg-ink pt-28 md:pt-36">
        <div className="container-shell">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-mute">
            <Link to="/" className="focus-ring hover:text-cream">Головна</Link>
            <span>/</span>
            <Link to="/menu" className="focus-ring hover:text-cream">Меню</Link>
            <span>/</span>
            <span className="text-cream/80">{dessert.name}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Gallery */}
            <div>
              <div className="overflow-hidden rounded-[4px]">
                <Figure
                  key={activeImg}
                  tone={dessert.tone}
                  ratio="4 / 5"
                  priority
                  label={`${dessert.name} · фото ${activeImg + 1}`}
                  // src={`/desserts/${slug}-${activeImg + 1}.jpg`}
                />
              </div>
              <div className="mt-4 grid grid-cols-4 gap-3">
                {gallery.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setActiveImg(g)}
                    aria-label={`Показати фото ${g + 1}`}
                    className={`focus-ring overflow-hidden rounded-[3px] ring-1 transition ${
                      activeImg === g ? 'ring-blood-400' : 'ring-cream/10 hover:ring-cream/40'
                    }`}
                  >
                    <Figure tone={dessert.tone} ratio="1 / 1" label={`${g + 1}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <Reveal stagger={0.08}>
                <div className="flex items-center gap-3" data-reveal>
                  <span className="rounded-full bg-blood/15 px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-blood-400">
                    {catLabel(dessert.category)}
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.12em] text-mute">
                    {dessert.tagline}
                  </span>
                </div>

                <h1 className="display-lg mt-5 font-display text-cream" data-reveal>
                  {dessert.name}
                </h1>

                <p className="mt-5 max-w-md text-pretty leading-relaxed text-mute md:text-lg" data-reveal>
                  {dessert.description}
                </p>

                {/* Specs */}
                <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-[4px] border border-cream/10 bg-cream/5" data-reveal>
                  <Spec term="Вага" value={dessert.weight} />
                  <Spec term="Порції" value={dessert.servings} />
                  <Spec term="Категорія" value={catLabel(dessert.category)} />
                  <Spec term="Алергени" value={dessert.allergens} />
                </dl>

                {/* Composition */}
                <div className="mt-8" data-reveal>
                  <h2 className="eyebrow mb-4">Склад</h2>
                  <ul className="flex flex-wrap gap-2">
                    {dessert.composition.map((c) => (
                      <li
                        key={c}
                        className="rounded-full border border-cream/15 px-4 py-2 text-sm text-cream/80"
                      >
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price + order */}
                <div
                  className="mt-10 flex flex-col gap-5 border-t border-cream/10 pt-8 sm:flex-row sm:items-center sm:justify-between"
                  data-reveal
                >
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-5xl text-cream">
                        {fmtPrice(dessert.price)}
                      </span>
                      <span className="text-lg text-mute">грн {dessert.unit}</span>
                    </div>
                    <p className="mt-1 text-xs text-mute">Оформлення за 2–5 днів</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOrderOpen(true)}
                    className="focus-ring group inline-flex items-center justify-center gap-3 rounded-full bg-blood px-8 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-cream transition-colors hover:bg-blood-400"
                  >
                    Оформити замовлення
                    <span className="inline-block text-[1.4em] leading-none transition-transform group-hover:translate-x-1">→</span>
                  </button>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Related */}
          <section className="mt-28 border-t border-cream/10 pt-16 md:mt-40">
            <div className="mb-10 flex items-end justify-between">
              <h2 className="display-lg font-display text-cream">
                Схожі <span className="italic text-blood-400">десерти</span>
              </h2>
              <Link
                to="/menu"
                className="focus-ring hidden shrink-0 border-b border-cream/30 pb-1 text-sm uppercase tracking-[0.14em] text-cream transition-colors hover:border-blood-400 hover:text-blood-400 md:inline-block"
              >
                Усе меню <span className="inline-block text-[1.4em] leading-none align-middle">→</span>
              </Link>
            </div>
            <Reveal
              className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
              stagger={0.1}
              y={50}
            >
              {related.map((d) => (
                <div key={d.slug} data-reveal>
                  <DessertCard dessert={d} />
                </div>
              ))}
            </Reveal>
          </section>
        </div>

        <div className="h-24 md:h-32" />
      </article>

      <OrderDialog
        open={orderOpen}
        onClose={() => setOrderOpen(false)}
        product={dessert.name}
      />
    </>
  )
}

function Spec({ term, value }) {
  return (
    <div className="bg-ink px-5 py-4">
      <dt className="text-[11px] uppercase tracking-[0.12em] text-mute">{term}</dt>
      <dd className="mt-1 text-cream">{value}</dd>
    </div>
  )
}
