// Global site configuration — contacts, hours, socials, navigation.
// Real data from the confectionery's Instagram (@velvet_cake_lviv).
export const site = {
  name: 'VelvetCake',
  tagline: 'Авторська кондитерська',
  founded: 2021, // 5 років досвіду
  city: 'Львів',
  phone: '093 106 79 43',
  phoneHref: 'tel:+380931067943',
  email: 'hello@velvetcake.lviv.ua', // ← замініть на реальний e-mail за наявності
  emailHref: 'mailto:hello@velvetcake.lviv.ua',
  address: 'Львів, Україна',
  mapHref: 'https://maps.google.com/?q=Velvet+Cake+Львів',
  hours: [
    { day: 'Вт — Нд', time: '10:00 — 19:00' },
    { day: 'Понеділок', time: 'Вихідний' },
  ],
  socials: [
    {
      label: 'Instagram',
      href: 'https://instagram.com/velvet_cake_lviv',
      handle: '@velvet_cake_lviv',
    },
    {
      label: 'Telegram',
      href: 'https://t.me/Velvet_cake_lviv',
      handle: '@Velvet_cake_lviv',
    },
  ],
}

export const nav = [
  { label: 'Головна', to: '/' },
  { label: 'Меню', to: '/menu' },
  { label: 'Майстер-класи', to: '/masterclasses' },
]
