import { useLayoutEffect, useRef, useState } from 'react'
import Seo from '../components/ui/Seo'
import Figure from '../components/ui/Figure'
import Reveal from '../components/ui/Reveal'
import SectionHeading from '../components/ui/SectionHeading'
import ChevronRight from '../components/ui/ChevronRight'
import SocialLink from '../components/ui/SocialLink'
import Button from '../components/ui/Button'
import DelayedButton from '../components/ui/DelayedButton'
import ScrollText from '../components/ui/ScrollText'
import CarouselDots from '../components/ui/CarouselDots'
import FormSelect from '../components/ui/FormSelect'
import FaqSection from '../components/shared/FaqSection'
import { useSnapIndicator } from '../hooks/useSnapIndicator'
import {
  masterclassAudience,
  masterclassProgram,
  masterclassFaq,
} from '../data/content'
import { useMasterclasses } from '../hooks/useMasterclasses'
import { site } from '../data/site'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { createLead } from '../lib/leads'

const fmt = (p) => String(p)
const masterclassGallery = ['Оформлення', 'Крем', 'Декор', 'Готовий бенто']

export default function Masterclasses() {
  const heroRef = useRef(null)
  const { masterclasses } = useMasterclasses()
  const [selected, setSelected] = useState(masterclasses[0]?.slug || '')
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const { active: galleryActive, handleScroll: handleGalleryScroll } = useSnapIndicator({
    count: masterclassGallery.length,
  })

  useLayoutEffect(() => {
    const el = heroRef.current
    if (!el) return

    const image = el.querySelector('[data-mh-img]')
    let removePointerMove = () => {}

    const ctx = gsap.context(() => {
      if (!prefersReducedMotion) {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' }, paused: true })
        tl.from('[data-mh-line] > span', { yPercent: 115, duration: 1.1, stagger: 0.12 })
          .from('[data-mh-fade]', { opacity: 0, y: 24, duration: 1, stagger: 0.1 }, '-=0.6')
          .from(image, { scale: 1.15, duration: 1.6, ease: 'power3.out' }, 0)

        // Start once fonts are ready so the display font doesn't swap mid-intro
        // and reflow the animating text. Capped so a slow font can't stall it.
        let started = false
        const startIntro = () => {
          if (started) return
          started = true
          tl.play()
        }
        if (document.fonts?.ready) document.fonts.ready.then(startIntro)
        else startIntro()
        gsap.delayedCall(0.4, startIntro)

        // Desktop-only. In-app browsers (Telegram, Instagram, …) lie about
        // `hover`/`pointer` media queries, so detect a real touchscreen via
        // navigator.maxTouchPoints, which WebViews report honestly. Any touch
        // device is excluded, where scrubbed scroll movement feels jittery.
        const isTouch =
          navigator.maxTouchPoints > 0 || 'ontouchstart' in window
        const isDesktop =
          !isTouch && window.matchMedia('(min-width: 768px)').matches
        if (isDesktop) {
          gsap.to(image, {
            yPercent: 18,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
          })
        }

        const onMove = (event) => {
          const rx = (event.clientX / window.innerWidth - 0.5) * 2
          const ry = (event.clientY / window.innerHeight - 0.5) * 2
          gsap.to(image, {
            x: rx * 18,
            y: ry * 18,
            duration: 0.8,
            ease: 'power2.out',
            overwrite: 'auto',
          })
        }

        if (window.matchMedia('(pointer: fine)').matches) {
          window.addEventListener('mousemove', onMove)
          removePointerMove = () => window.removeEventListener('mousemove', onMove)
        }
      }
    }, el)

    return () => {
      removePointerMove()
      ctx.revert()
    }
  }, [])

  // Freeze the hero height on touch devices. iOS in-app browsers (Telegram)
  // grow/shrink their toolbar while scrolling, which changes viewport units
  // (vh/svh/lvh) and makes the bottom-anchored content and the cover image
  // jump. We pin the section to the load-time height and only re-measure on a
  // width (orientation) change, ignoring the toolbar-driven height changes.
  useLayoutEffect(() => {
    const section = heroRef.current
    if (!section) return
    const isTouch =
      navigator.maxTouchPoints > 0 || 'ontouchstart' in window
    if (!isTouch) return
    let lastWidth = window.innerWidth
    const pin = () => {
      section.style.minHeight = `${window.innerHeight}px`
    }
    pin()
    const onResize = () => {
      if (window.innerWidth !== lastWidth) {
        lastWidth = window.innerWidth
        pin()
      }
    }
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', pin)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', pin)
    }
  }, [])

  const handleBook = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const form = e.currentTarget
    const data = new FormData(form)
    const pickedClass = masterclasses.find((mc) => mc.slug === selected)

    try {
      await createLead({
        type: 'masterclass',
        source: 'masterclasses-page',
        name: data.get('name'),
        phone: data.get('phone'),
        seats: data.get('seats'),
        classSlug: selected,
        classTitle: pickedClass?.title,
        note: pickedClass ? `Тема: ${pickedClass.title}` : '',
      })
      form.reset()
      setSelected(masterclasses[0].slug)
      setSent(true)
    } catch (err) {
      console.error(err)
      setError('Не вдалося надіслати заявку. Перевірте Firebase або спробуйте ще раз')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Seo
        title="Майстер-класи"
        description="Майстер-класи бенто-тортів у Львові від VelvetCake. Для будь-якого рівня, навіть без досвіду. Заберете власний торт. Забронюйте місце онлайн"
        path="/masterclasses"
      />

      {/* Hero */}
      <section
        ref={heroRef}
        className="relative flex min-h-[100svh] items-end overflow-hidden bg-wine-900 pb-16 pt-36 md:min-h-[92svh]"
      >
        <div className="absolute inset-0">
          <div data-mh-img className="absolute inset-0 md:inset-[-8%]">
            <Figure
              src="/desserts/masterclasses-hero.webp"
              alt="Майстер-клас VelvetCake"
              tone="wine"
              ratio="auto"
              priority
              className="h-full w-full"
              label="Майстер-клас"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/50" />
          <div className="absolute inset-0 bg-ink/15" />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-[-1px] z-[1] h-20 bg-gradient-to-b from-transparent to-ink" />

        <div className="container-shell relative z-10">
          <h1 className="display-hero font-display text-cream">
            <span data-mh-line className="reveal-line"><span className="block">Збери свій</span></span>
            <span data-mh-line className="reveal-line">
              <span className="block italic text-blood-400">бенто-торт</span>
            </span>
          </h1>
          <p data-mh-fade className="mt-8 max-w-lg text-pretty text-cream/80 md:text-lg">
            Невелика дружня група, два теплі вечірні години та готовий торт у
            ваших руках. Кожен самостійно збирає й оформлює свій бенто у
            вибраній темі
          </p>
          <div data-mh-fade className="mt-10 flex flex-wrap gap-3">
            {['Навіть без досвіду', 'Усе включено'].map((t) => (
              <span
                key={t}
                className="rounded-full border border-cream/25 px-4 py-2 text-xs uppercase tracking-[0.12em] text-cream/80"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="relative -mt-px bg-ink py-24 md:py-32">
        <div className="container-shell">
          <ScrollText
            text="Маленьке свято в студії: тісне коло, шість пар рук у борошні, теплі лампи і ритуал оформлення останнього шару крему"
            className="display-lg max-w-4xl text-balance font-display text-cream"
            mobileStart="top 68%"
            desktopStart="top 66%"
            desktopEnd="bottom 48%"
          />
        </div>
      </section>

      {/* List of classes */}
      <section className="mobile-reveal-static bg-ink-800 py-24 md:py-32">
        <div className="container-shell">
          <SectionHeading
            title={<>Оберіть свою <span className="italic text-blood-400">тему</span></>}
            lede="П'ять напрямків оформлення. Іменинник або іменинниця обирає смак, начинку та тему. Решта групи разом збирає тортики в тому ж стилі"
          />
          {masterclasses.length === 0 ? (
            <div className="mt-14 grid place-items-center px-6 py-24 text-center md:py-28">
              <p className="font-display text-3xl italic text-cream md:text-4xl">
                Теми скоро зʼявляться
              </p>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-mute">
                Ми готуємо нові майстер-класи — завітайте трохи згодом
              </p>
            </div>
          ) : (
          <div className="mt-14 flex flex-col">
            {masterclasses.map((mc, i) => (
              <DelayedButton
                key={mc.slug}
                type="button"
                onClick={() => {
                  setSelected(mc.slug)
                  document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
                className="group grid grid-cols-1 items-center gap-4 border-t border-cream/10 py-8 text-left transition-all duration-500 active:scale-[0.99] data-[pending=true]:scale-[0.99] data-[pending=true]:bg-cream/[0.03] last:border-b md:grid-cols-12 md:gap-6 md:hover:bg-cream/[0.03]"
              >
                <span className="font-display text-4xl leading-none text-blood/40 md:col-span-1">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="md:col-span-6">
                  <h3 className="font-display text-3xl text-cream transition-colors md:text-4xl md:group-hover:text-blood-400">
                    {mc.title}
                  </h3>
                  <p className="mt-2 max-w-md text-sm text-mute">{mc.text}</p>
                </div>
                <div className="flex flex-col gap-2 text-sm text-cream/80 md:col-span-3 md:flex-row md:items-center md:gap-16">
                  <span className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-[0.14em] text-mute">Тривалість</span>
                    <span>{mc.duration}</span>
                  </span>
                  <span className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-[0.14em] text-mute">Місць</span>
                    <span>{mc.seats}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 md:col-span-2 md:justify-end">
                  <span className="price-display text-3xl font-semibold leading-none tracking-tight text-cream md:text-4xl">
                    {fmt(mc.price)}<span className="ml-1.5 align-baseline text-base leading-none text-cream/80 md:text-lg">грн</span>
                  </span>
                  <ChevronRight className="text-blood-400 transition-transform md:group-hover:translate-x-1" />
                </div>
              </DelayedButton>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* Audience */}
      <section className="bg-ink py-24 md:py-32">
        <div className="container-shell">
          <SectionHeading
            title={<>Формат і <span className="italic text-blood-400">бонуси</span></>}
          />
          <Reveal className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" stagger={0.1} y={50}>
            {masterclassAudience.map((a) => (
              <div
                key={a.title}
                data-reveal
                className="rounded-[4px] border border-cream/10 bg-cream/[0.02] p-7 transition-colors md:hover:border-blood-400/50"
              >
                <h3 className="font-display text-2xl text-cream">{a.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-mute">{a.text}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Program */}
      <section className="bg-ink-800 py-24 md:py-32">
        <div className="container-shell grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="md:sticky md:top-32">
              <SectionHeading
                title={<>Як минає <span className="italic text-blood-400">день</span></>}
              />
            </div>
          </div>
          <div className="md:col-span-8">
            <Reveal className="flex flex-col" stagger={0.1} y={40}>
              {masterclassProgram.map((p) => (
                <div
                  key={p.step}
                  data-reveal
                  className="grid grid-cols-[auto_1fr] gap-6 border-t border-cream/10 py-8 last:border-b"
                >
                  <span className="font-display text-4xl text-blood/40">{p.step}</span>
                  <div>
                    <h3 className="font-display text-2xl text-cream">{p.title}</h3>
                    <p className="mt-2 max-w-lg text-mute">{p.text}</p>
                  </div>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-ink py-20 md:py-28">
        <div className="container-shell">
          <SectionHeading
            title={<>Фото <span className="italic text-blood-400">процесу</span></>}
            lede="Кілька моментів з майстер-класу, атмосфери студії та готових бенто"
          />

          <CarouselDots
            count={masterclassGallery.length}
            active={galleryActive}
            className="mt-8 md:hidden"
          />

          <div
            onScroll={handleGalleryScroll}
            className="-mx-6 mt-10 flex snap-x snap-mandatory scroll-px-6 gap-5 overflow-x-auto px-6 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:hidden"
          >
            {masterclassGallery.map((cap, i) => (
              <div
                key={`mobile-${cap}`}
                data-snap-item
                className="relative w-[78vw] shrink-0 snap-center overflow-hidden rounded-[3px] first:snap-start sm:w-[56vw]"
              >
                <Figure
                  src={`/desserts/masterclasses-gallery-${i + 1}.webp`}
                  alt={cap}
                  tone={i % 2 ? 'blood' : 'wine'}
                  ratio="4 / 5"
                  label={cap}
                />
              </div>
            ))}
          </div>

          <div className="mt-14 hidden grid-cols-2 gap-4 md:grid md:grid-cols-4 md:gap-6">
            {masterclassGallery.map((cap, i) => (
              <div key={cap} className={`overflow-hidden rounded-[3px] ${i % 2 ? 'md:mt-10' : ''}`}>
                <Figure
                  src={`/desserts/masterclasses-gallery-${i + 1}.webp`}
                  alt={cap}
                  tone={i % 2 ? 'blood' : 'wine'}
                  ratio="4 / 5"
                  label={cap}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking form */}
      <section id="booking" className="scroll-mt-24 bg-wine-900 py-24 md:py-32">
        <div className="container-shell grid gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <SectionHeading
              title={<>Забронювати <span className="italic text-blood-400">майстер-клас</span></>}
              lede="Запишіться на найближчу дату й оберіть свою тему. Для дня народження додамо сюрприз від кондитерки"
            />
            <div className="mt-10 text-cream/80">
              <a href={site.phoneHref} className="focus-ring block font-display text-2xl text-cream hover:text-blood-400">
                {site.phone}
              </a>
              <div className="mt-5 flex flex-col gap-2 sm:items-start">
                {site.socials.map((social) => (
                  <SocialLink key={social.label} social={social} />
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-blood-400/15 bg-ink-800 p-8 md:p-10">
            {sent ? (
              <div className="py-10 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blood text-2xl text-cream">✓</div>
                <h3 className="font-display text-3xl text-cream">Заявку прийнято</h3>
                <p className="mt-4 text-mute">Ми звʼяжемось з вами, щоб підтвердити дату й деталі</p>
                <Button
                  onClick={() => setSent(false)}
                  variant="outline"
                  arrow={false}
                  className="mt-8"
                >
                  Записати ще одного
                </Button>
              </div>
            ) : (
              <form onSubmit={handleBook} className="space-y-4">
                <div>
                  <label htmlFor="bk-name" className="mb-2 block text-[11px] uppercase tracking-[0.14em] text-mute">Імʼя</label>
                  <input id="bk-name" name="name" required placeholder="Олена"
                    className="w-full rounded-md border border-wine-700/70 bg-ink px-4 py-3 text-cream placeholder:text-mute transition-colors focus:border-blood-400/70 focus:outline-none focus:ring-1 focus:ring-blood-400/30" />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="bk-phone" className="mb-2 block text-[11px] uppercase tracking-[0.14em] text-mute">Телефон</label>
                    <input id="bk-phone" name="phone" type="tel" required placeholder="+380 __ ___ __ __"
                      className="w-full rounded-md border border-wine-700/70 bg-ink px-4 py-3 text-cream placeholder:text-mute transition-colors focus:border-blood-400/70 focus:outline-none focus:ring-1 focus:ring-blood-400/30" />
                  </div>
                  <div>
                    <label htmlFor="bk-seats" className="mb-2 block text-[11px] uppercase tracking-[0.14em] text-mute">Місць</label>
                    <input id="bk-seats" name="seats" type="number" min="6" max="12" step="1" defaultValue="6" inputMode="numeric"
                      onInput={(e) => {
                        // Strip non-digits and never let the value exceed 12.
                        let v = e.target.value.replace(/\D/g, '')
                        if (v !== '' && Number(v) > 12) v = '12'
                        e.target.value = v
                      }}
                      onBlur={(e) => {
                        // Snap anything below the minimum (or empty) up to 6.
                        const n = Number(e.target.value)
                        if (e.target.value === '' || n < 6) e.target.value = '6'
                        else if (n > 12) e.target.value = '12'
                      }}
                      className="w-full rounded-md border border-wine-700/70 bg-ink px-4 py-3 text-cream transition-colors focus:border-blood-400/70 focus:outline-none focus:ring-1 focus:ring-blood-400/30" />
                  </div>
                </div>
                <div>
                  <label htmlFor="bk-class" className="mb-2 block text-[11px] uppercase tracking-[0.14em] text-mute">Тема оформлення</label>
                  <FormSelect
                    id="bk-class"
                    name="class"
                    value={selected}
                    onChange={setSelected}
                    ariaLabel="Тема оформлення"
                    options={masterclasses.map((mc) => ({
                      value: mc.slug,
                      label: mc.title,
                      meta: `${fmt(mc.price)} грн`,
                    }))}
                  />
                </div>
                {error && (
                  <p className="rounded-md border border-blood-400/40 bg-blood/10 px-4 py-3 text-sm text-blood-400">
                    {error}
                  </p>
                )}
                <Button
                  type="submit"
                  size="lg"
                  arrow={false}
                  disabled={submitting}
                  className="w-full"
                >
                  {submitting ? 'Надсилаємо…' : 'Забронювати місце'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      <FaqSection items={masterclassFaq} />
    </>
  )
}
