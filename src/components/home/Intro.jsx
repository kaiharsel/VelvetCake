import Reveal from '../ui/Reveal'
import ScrollText from '../ui/ScrollText'

const stats = [
  { value: '100+', label: 'відгуків' },
  { value: '100%', label: 'натуральне' },
  { value: '5+', label: 'років досвіду' },
  { value: '50+', label: 'десертів' },
]

export default function Intro() {
  return (
    <section className="relative bg-ink py-24 md:py-40">
      <div className="container-shell">
        <div className="grid gap-14 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-11 md:col-start-2">
            <ScrollText
              text="Для мене кондитерське мистецтво є проявом любові. Солодощі створюють маленьке свято, а десерти дарують людям радість і роблять їх трішки щасливішими"
              className="display-lg max-w-4xl text-balance font-display text-cream"
            />

            <Reveal
              className="mt-16 grid grid-cols-2 gap-10 border-t border-cream/10 pt-12 lg:grid-cols-4"
              stagger={0.12}
            >
              {stats.map((s) => (
                <div key={s.label} data-reveal>
                  <div className="font-display text-5xl text-blood-400 md:text-6xl">
                    {s.value}
                  </div>
                  <div className="mt-2 text-sm uppercase tracking-[0.12em] text-mute">
                    {s.label}
                  </div>
                </div>
              ))}
            </Reveal>

            <Reveal className="mt-12" y={30}>
              <p
                className="max-w-2xl text-pretty leading-relaxed text-mute md:text-lg"
                data-reveal
              >
                Спочатку це було невеликим захопленням, яке, волею долі,
                перетворилося на професію. Кондитерство стало моїм покликанням
                і розкрило талант, який багато років чекав свого часу
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
