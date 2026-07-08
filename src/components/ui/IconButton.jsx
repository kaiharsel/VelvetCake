const sizes = {
  sm: 'h-10 w-10',
  md: 'h-12 w-12',
  lg: 'h-14 w-14',
}

export default function IconButton({
  children,
  size = 'md',
  className = '',
  ...rest
}) {
  return (
    <button
      type="button"
      className={`focus-ring inline-flex shrink-0 items-center justify-center rounded-full border border-cream/20 bg-ink/90 text-cream shadow-[0_12px_32px_rgba(0,0,0,0.3)] backdrop-blur-md transition-all duration-300 active:scale-95 active:border-blood-400 active:bg-blood data-[active=true]:scale-95 data-[active=true]:border-blood-400 data-[active=true]:bg-blood md:hover:border-blood-400 md:hover:bg-blood ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
