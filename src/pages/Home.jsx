import Seo from '../components/ui/Seo'
import Marquee from '../components/ui/Marquee'
import Hero from '../components/home/Hero'
import Intro from '../components/home/Intro'
import PopularDesserts from '../components/home/PopularDesserts'
import Categories from '../components/home/Categories'
import Advantages from '../components/home/Advantages'
import Gallery from '../components/home/Gallery'
import MasterclassTeaser from '../components/home/MasterclassTeaser'
import Testimonials from '../components/home/Testimonials'
import FaqSection from '../components/shared/FaqSection'
import CtaSection from '../components/shared/CtaSection'
import { faq } from '../data/content'

const marqueeItems = [
  'Торти',
  'Капкейки',
  'Бенто',
  'Кенді бар',
  'Майстер-класи',
  'Доставка по Львову',
  '5 років досвіду',
  'Ручна робота',
]

export default function Home() {
  return (
    <>
      <Seo
        title=""
        description="VelvetCake (Львів) — авторська кондитерська. Торти, капкейки, бенто, кенді бар та майстер-класи ручної роботи. Швидке замовлення по тел. 093 106 79 43."
        path="/"
      />
      <Hero />

      <div className="border-y border-cream/10 bg-ink-800 py-5 font-display text-2xl italic text-cream/80 md:text-3xl">
        <Marquee items={marqueeItems} />
      </div>

      <Intro />
      <PopularDesserts />
      <Categories />
      <Advantages />
      <Gallery />
      <MasterclassTeaser />
      <Testimonials />
      <FaqSection items={faq} />
      <CtaSection />
    </>
  )
}
