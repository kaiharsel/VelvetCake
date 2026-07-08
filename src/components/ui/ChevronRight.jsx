export default function ChevronRight({ className = '' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-5 w-5 shrink-0 ${className}`}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m8 4 8 8-8 8"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
