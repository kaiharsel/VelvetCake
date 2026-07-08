export default function CarouselDots({ count, active, className = '' }) {
  if (count <= 1) return null

  return (
    <div className={`flex gap-2 ${className}`} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={`h-[3px] rounded-full transition-all duration-500 ${
            i === active ? 'w-10 bg-blood-400' : 'w-4 bg-cream/20'
          }`}
        />
      ))}
    </div>
  )
}
