import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

function Item({ q, a, isOpen, onToggle, index }) {
  return (
    <div className="border-t border-cream/12">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          className="focus-ring flex w-full items-center justify-between gap-6 py-6 text-left md:py-8"
        >
          <span className="flex items-baseline gap-4 md:gap-6">
            <span className="font-sans text-xs text-blood-400">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="font-display text-xl leading-tight text-cream md:text-2xl">
              {q}
            </span>
          </span>
          <span className="relative h-5 w-5 shrink-0">
            <span className="absolute left-1/2 top-1/2 h-px w-5 -translate-x-1/2 -translate-y-1/2 bg-cream" />
            <span
              className={`absolute left-1/2 top-1/2 h-5 w-px -translate-x-1/2 -translate-y-1/2 bg-cream transition-transform duration-500 ease-velvet ${
                isOpen ? 'scale-y-0' : 'scale-y-100'
              }`}
            />
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-8 pl-8 text-pretty leading-relaxed text-mute md:pl-12 md:text-lg">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Accordion({ items, defaultOpen = 0 }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-cream/12">
      {items.map((item, i) => (
        <Item
          key={item.q}
          {...item}
          index={i}
          isOpen={open === i}
          onToggle={() => setOpen(open === i ? -1 : i)}
        />
      ))}
    </div>
  )
}
