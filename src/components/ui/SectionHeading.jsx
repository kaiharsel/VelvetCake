import Reveal from './Reveal'

/**
 * Editorial section header: large display title with an optional lede
 * paragraph. Reveals on scroll.
 */
export default function SectionHeading({
  title,
  lede,
  align = 'left',
  className = '',
  titleClassName = 'display-lg',
}) {
  const alignment =
    align === 'center'
      ? 'items-center text-center'
      : align === 'right'
        ? 'items-end text-right'
        : 'items-start text-left'

  return (
    <Reveal
      className={`flex flex-col gap-5 ${alignment} ${className}`}
      stagger={0.12}
    >
      <h2
        className={`${titleClassName} text-balance text-cream`}
        data-reveal
      >
        {title}
      </h2>
      {lede && (
        <p
          className="max-w-xl text-pretty text-base leading-relaxed text-mute md:text-lg"
          data-reveal
        >
          {lede}
        </p>
      )}
    </Reveal>
  )
}
