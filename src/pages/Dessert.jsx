import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Seo from '../components/ui/Seo'
import Figure from '../components/ui/Figure'
import Reveal from '../components/ui/Reveal'
import DessertCard from '../components/ui/DessertCard'
import Button from '../components/ui/Button'
import OrderDialog from '../components/shared/OrderDialog'
import { categories } from '../data/desserts'
import { useDessert } from '../hooks/useDesserts'

const catLabel = (id) => categories.find((c) => c.id === id)?.label || ''
const fmtPrice = (p) => String(p)

export default function Dessert() {
  const { slug } = useParams()
  const { dessert, related } = useDessert(slug)
  const [activeImg, setActiveImg] = useState(0)
  const [orderOpen, setOrderOpen] = useState(false)

  const fallbackImage = dessert?.image || (dessert ? `/desserts/${dessert.slug}.webp` : '')
  const gallery = [
    fallbackImage,
    ...(dessert && Array.isArray(dessert.gallery) ? dessert.gallery : []),
  ]
    .filter(Boolean)
    .filter((image, index, images) => images.indexOf(image) === index)
    .slice(0, 4)
  const activeImage = gallery[activeImg] || gallery[0] || fallbackImage

  useEffect(() => {
    setActiveImg(0)
  }, [slug])

  useEffect(() => {
    if (gallery.length && activeImg >= gallery.length) {
      setActiveImg(0)
    }
  }, [activeImg, gallery.length])

  if (!dessert) {
    return (
      <div className="grid min-h-[70vh] place-items-center px-6 text-center">
        <div>
          <p className="font-display text-4xl italic text-cream">Десерт не знайдено</p>
          <Button to="/menu" className="mt-8">
            До меню
          </Button>
        </div>
      </div>
    )
  }

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
                  src={activeImage}
                  alt={`${dessert.name}, фото ${activeImg + 1}`}
                  tone={dessert.tone}
                  ratio="4 / 5"
                  priority
                  label={`${dessert.name}, фото ${activeImg + 1}`}
                />
              </div>
              <div className="mt-4 grid grid-cols-4 gap-3">
                {gallery.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setActiveImg(index)}
                    aria-label={`Показати фото ${index + 1}`}
                    className={`focus-ring overflow-hidden rounded-[3px] ring-1 transition ${
                      activeImg === index ? 'ring-blood-400' : 'ring-cream/10 hover:ring-cream/40'
                    }`}
                  >
                    <Figure
                      src={image}
                      alt=""
                      tone={dessert.tone}
                      ratio="1 / 1"
                      label={`${index + 1}`}
                    />
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
                    <div className="flex items-end gap-2 whitespace-nowrap">
                      <span className="pb-[3px] text-xs font-semibold uppercase leading-none tracking-[0.14em] text-mute">
                        Від
                      </span>
                      <span className="price-display translate-y-[5px] text-5xl font-semibold leading-none tracking-tight text-cream">
                        {fmtPrice(dessert.price)}
                      </span>
                      <span className="pb-[2px] text-lg leading-none text-mute">
                        грн {dessert.unit}
                      </span>
                    </div>
                    <p className="mt-5 border-t border-cream/10 pt-3 text-xs uppercase tracking-[0.1em] text-mute">
                      Оформлення за 2–5 днів
                    </p>
                  </div>
                  <Button
                    onClick={() => setOrderOpen(true)}
                    size="lg"
                  >
                    Оформити замовлення
                  </Button>
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
              <Button
                to="/menu"
                variant="outline"
                size="sm"
                className="hidden shrink-0 md:inline-flex"
              >
                Усе меню
              </Button>
            </div>
            <Reveal
              className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
              stagger={0.1}
              y={50}
            >
              {related.map((d) => (
                <div key={d.slug} data-reveal>
                  <DessertCard dessert={d} showTagline={false} />
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
