/**
 * Seamless CSS marquee. Duplicates its items so the loop has no seam.
 * Pauses on hover; static under reduced-motion (animation disabled via CSS).
 */
export default function Marquee({ items, className = '', separator = '✦' }) {
  const row = (
    <div className="flex shrink-0 items-center gap-10 pr-10">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-10">
          <span className="whitespace-nowrap">{item}</span>
          <span className="text-blood-400" aria-hidden="true">
            {separator}
          </span>
        </span>
      ))}
    </div>
  )

  return (
    <div className={`group flex overflow-hidden ${className}`}>
      <div className="flex animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        {row}
        {row}
      </div>
    </div>
  )
}
