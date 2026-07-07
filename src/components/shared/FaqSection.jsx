import SectionHeading from '../ui/SectionHeading'
import Accordion from '../ui/Accordion'
import Reveal from '../ui/Reveal'

/**
 * Reusable FAQ block — used on Home and Masterclasses.
 */
export default function FaqSection({
  title = (
    <>
      Часті <span className="italic text-blood-400">запитання</span>
    </>
  ),
  items,
  className = '',
}) {
  return (
    <section className={`relative bg-ink py-24 md:py-32 ${className}`}>
      <div className="container-shell">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="md:sticky md:top-32">
              <SectionHeading title={title} />
              <p className="mt-6 max-w-xs text-mute">
                Не знайшли відповідь? Напишіть нам — відповідаємо швидко.
              </p>
            </div>
          </div>
          <div className="md:col-span-8">
            <Reveal y={30}>
              <div data-reveal>
                <Accordion items={items} />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
