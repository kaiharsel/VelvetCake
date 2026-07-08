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
import FaqSection from '../components/shared/FaqSection'
import {
  masterclasses,
  masterclassAudience,
  masterclassProgram,
  masterclassFaq,
} from '../data/content'
import { site } from '../data/site'
import { gsap, prefersReducedMotion } from '../lib/gsap'

const fmt = (p) => String(p)

export default function Masterclasses() {
  const heroRef = useRef(null)
  const [selected, setSelected] = useState(masterclasses[0].slug)
  const [sent, setSent] = useState(false)

  useLayoutEffect(() => {
    if (prefersReducedMotion) return
    const el = heroRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power4.out' } })
        .from('[data-mh-line] > span', { yPercent: 115, duration: 1.1, stagger: 0.12 })
        .from('[data-mh-fade]', { opacity: 0, y: 24, duration: 1, stagger: 0.1 }, '-=0.6')
      gsap.to('[data-mh-img]', {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
      })
    }, el)
    return () => ctx.revert()
  }, [])

  const handleBook = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <>
      <Seo
        title="Майстер-класи"
        description="Майстер-класи VelvetCake: дзеркальна глазур, авторські торти, тарти та макарони. Для будь-якого рівня. Забронюйте місце онлайн"
        path="/masterclasses"
      />

      {/* Hero */}
      <section
        ref={heroRef}
        className="relative flex min-h-[92svh] items-end overflow-hidden bg-wine-900 pb-16 pt-36"
      >
        <div className="absolute inset-0">
          <div data-mh-img className="absolute inset-[-8%]">
            <Figure tone="wine" ratio="auto" priority className="h-full w-full" label="Майстер-клас" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/50" />
        </div>

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
            {['Навіть без досвіду', 'Усе включено', '6–12 у групі', '1,5–2 год за 1500 грн'].map((t) => (
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
      <section className="bg-ink py-24 md:py-32">
        <div className="container-shell">
          <ScrollText
            text="Маленьке свято в студії: тісне коло, шість пар рук у борошні, теплі лампи і ритуал оформлення останнього шару крему"
            className="display-lg max-w-4xl text-balance font-display text-cream"
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
          <Reveal className="mt-14 flex flex-col" stagger={0.08} y={40}>
            {masterclasses.map((mc, i) => (
              <DelayedButton
                key={mc.slug}
                type="button"
                data-reveal
                onClick={() => {
                  setSelected(mc.slug)
                  document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
                className="group grid grid-cols-1 items-center gap-4 border-t border-cream/10 py-8 text-left transition-all duration-500 active:scale-[0.99] data-[pending=true]:scale-[0.99] data-[pending=true]:bg-cream/[0.03] last:border-b md:grid-cols-12 md:gap-6 md:hover:bg-cream/[0.03]"
              >
                <span className="font-display text-2xl text-blood/40 md:col-span-1">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="md:col-span-5">
                  <h3 className="font-display text-3xl text-cream transition-colors md:text-4xl md:group-hover:text-blood-400">
                    {mc.title}
                  </h3>
                  <p className="mt-2 max-w-md text-sm text-mute">{mc.text}</p>
                </div>
                <div className="text-sm text-cream/80 md:col-span-2">{mc.level}</div>
                <div className="text-sm text-cream/80 md:col-span-2">
                  {mc.duration}, {mc.seats} місць
                </div>
                <div className="flex items-center justify-between gap-4 md:col-span-2 md:justify-end">
                  <span className="price-display text-2xl font-semibold tracking-tight text-cream">
                    {fmt(mc.price)}<span className="ml-1 text-sm text-mute">грн</span>
                  </span>
                  <ChevronRight className="text-blood-400 transition-transform md:group-hover:translate-x-1" />
                </div>
              </DelayedButton>
            ))}
          </Reveal>
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
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {['Оформлення', 'Крем', 'Декор', 'Готовий бенто'].map((cap, i) => (
              <div key={cap} className={`overflow-hidden rounded-[3px] ${i % 2 ? 'md:mt-10' : ''}`}>
                <Figure tone={i % 2 ? 'blood' : 'wine'} ratio="4 / 5" label={cap} />
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

          <div className="rounded-lg border border-cream/15 bg-ink-800 p-8 md:p-10">
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
                    className="focus-ring w-full rounded-md border border-cream/20 bg-ink px-4 py-3 text-cream placeholder:text-mute focus:border-cream/50" />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="bk-phone" className="mb-2 block text-[11px] uppercase tracking-[0.14em] text-mute">Телефон</label>
                    <input id="bk-phone" name="phone" type="tel" required placeholder="+380 __ ___ __ __"
                      className="focus-ring w-full rounded-md border border-cream/20 bg-ink px-4 py-3 text-cream placeholder:text-mute focus:border-cream/50" />
                  </div>
                  <div>
                    <label htmlFor="bk-seats" className="mb-2 block text-[11px] uppercase tracking-[0.14em] text-mute">Місць</label>
                    <input id="bk-seats" name="seats" type="number" min="1" max="10" defaultValue="1"
                      className="focus-ring w-full rounded-md border border-cream/20 bg-ink px-4 py-3 text-cream focus:border-cream/50" />
                  </div>
                </div>
                <div>
                  <label htmlFor="bk-class" className="mb-2 block text-[11px] uppercase tracking-[0.14em] text-mute">Тема оформлення</label>
                  <select
                    id="bk-class"
                    name="class"
                    value={selected}
                    onChange={(e) => setSelected(e.target.value)}
                    className="focus-ring w-full appearance-none rounded-md border border-cream/20 bg-ink px-4 py-3 text-cream focus:border-cream/50"
                  >
                    {masterclasses.map((mc) => (
                      <option key={mc.slug} value={mc.slug}>
                        {mc.title}, {fmt(mc.price)} грн
                      </option>
                    ))}
                  </select>
                </div>
                <Button
                  type="submit"
                  size="lg"
                  arrow={false}
                  className="w-full"
                >
                  Забронювати місце
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
