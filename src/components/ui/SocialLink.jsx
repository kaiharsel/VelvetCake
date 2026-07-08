function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.1" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.4" cy="6.7" r="1.15" fill="currentColor" />
    </svg>
  )
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M21.2 3.6 18.3 18.9c-.2 1.1-.8 1.4-1.7.9l-4.5-3.4-2.2 2.2c-.2.2-.4.4-.9.4l.3-4.8 8.3-7.9c.4-.3-.1-.5-.6-.2L6.7 12.9l-4.4-1.5c-1-.3-1-1 .2-1.5l17.3-7.5c.8-.3 1.6.2 1.4 1.2Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function SocialLink({ social, className = '' }) {
  const isInstagram = social.label.toLowerCase() === 'instagram'

  return (
    <a
      href={social.href}
      target="_blank"
      rel="noreferrer"
      aria-label={`Відкрити ${social.label}`}
      className={`focus-ring group inline-flex min-w-[210px] items-center gap-3 rounded-full border border-cream/15 bg-ink/55 py-2 pl-2 pr-5 text-left backdrop-blur-sm transition-all duration-300 active:scale-[0.99] md:hover:border-blood-400 md:hover:bg-blood/15 ${className}`}
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blood/20 text-blood-400 transition-colors duration-300 md:group-hover:bg-blood md:group-hover:text-cream">
        {isInstagram ? <InstagramIcon /> : <TelegramIcon />}
      </span>
      <span className="min-w-0">
        <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-mute">
          {social.label}
        </span>
        <span className="block truncate text-sm text-cream">{social.handle}</span>
      </span>
    </a>
  )
}
