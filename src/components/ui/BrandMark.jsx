export default function BrandMark({ className = '', title = 'VelvetCake' }) {
  return (
    <img
      src="/brand/velvetcake-logo.webp"
      className={className}
      alt={title}
      width="1009"
      height="799"
      decoding="async"
    />
  )
}
