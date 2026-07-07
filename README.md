# VelvetCake

Преміальний сайт авторської кондитерської у стилі «темного люксу» — драматична
атмосфера, редакторська типографіка та scroll-based анімації рівня digital-агенції.

**Стек:** React 19 · Vite · Tailwind CSS · GSAP + ScrollTrigger · Lenis · Framer Motion · React Router

## Швидкий старт

```bash
npm install
npm run dev      # локальний сервер розробки
npm run build    # production-збірка у /dist
npm run preview  # локальний перегляд production-збірки
```

## Сторінки

| Маршрут           | Опис                                                   |
| ----------------- | ------------------------------------------------------ |
| `/`               | Головна: hero, про нас, популярне, категорії, переваги, галерея, майстер-класи, відгуки, FAQ, CTA |
| `/menu`           | Меню з пошуком і фільтрацією за категоріями             |
| `/menu/:slug`     | Сторінка окремого десерту з галереєю та схожими         |
| `/masterclasses`  | Майстер-класи: розклад, програма, галерея, форма запису |

## Структура

```
src/
├─ components/
│  ├─ layout/     SmoothScroll (Lenis), Navbar, Footer, ScrollToTop
│  ├─ ui/         Figure, Button, DessertCard, Accordion, Reveal, ScrollText…
│  ├─ home/       секції головної сторінки
│  └─ shared/     FaqSection, CtaSection, OrderDialog
├─ data/          site.js, desserts.js, content.js — увесь контент тут
├─ hooks/         useReveal
├─ lib/           gsap.js (реєстрація плагінів)
└─ pages/         Home, Menu, Dessert, Masterclasses, NotFound
```

## Як додати справжні фото

Зараз усі зображення — це стильні брендові плейсхолдери (компонент
[`Figure`](src/components/ui/Figure.jsx)). Коли надійдуть фото з Instagram:

1. Покладіть файли в `public/desserts/` (напр. `velvet-noir.jpg`).
2. Додайте `src` у відповідному місці — по всьому коду поряд із `<Figure … />`
   залишені підказки-коментарі (напр. `// src={`/desserts/${slug}.jpg`}`).
3. Плейсхолдер автоматично зникне, щойно фото завантажиться.

Головне hero-фото — у [`Hero.jsx`](src/components/home/Hero.jsx).

## Контент

Увесь текст, ціни, десерти, майстер-класи та контакти зібрані в `src/data/`.
Редагуйте ці файли — сторінки оновляться автоматично.

## Продуктивність та доступність

- Route-level code splitting (`React.lazy`) + розбиття вендорних чанків.
- Lazy-loading зображень, `prefers-reduced-motion` вимикає всі анімації.
- Семантичний HTML, focus-стани, skip-link, ARIA для інтерактивних елементів.
- Керовані SEO-мета на кожній сторінці ([`Seo`](src/components/ui/Seo.jsx)).

## Деплой на Vercel

Проєкт готовий до Vercel як є — [`vercel.json`](vercel.json) налаштовує SPA-rewrites
та кешування ассетів. Імпортуйте репозиторій або:

```bash
npm i -g vercel
vercel
```

## Ліцензія

Демонстраційний комерційний проєкт. Контент — вигаданий.
