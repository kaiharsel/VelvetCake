import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

function Item({ q, a, isOpen, onToggle, index }) {
  return (
    <div className="group border-t border-cream/10 transition-colors md:hover:bg-cream/[0.03]">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          className="focus-ring grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 py-8 text-left md:grid-cols-12 md:gap-6"
        >
          <span className="font-display text-2xl text-blood/40 md:col-span-1">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span
            className={`font-display text-3xl !normal-case leading-[0.95] transition-colors md:col-span-10 md:text-4xl ${
              isOpen ? 'text-blood-400' : 'text-cream md:group-hover:text-blood-400'
            }`}
          >
            {q}
          </span>
          <span className="relative h-6 w-6 shrink-0 justify-self-end text-blood-400 md:col-span-1">
            <span className="absolute left-1/2 top-1/2 h-px w-6 -translate-x-1/2 -translate-y-1/2 bg-current" />
            <span
              className={`absolute left-1/2 top-1/2 h-6 w-px -translate-x-1/2 -translate-y-1/2 bg-current transition-transform duration-500 ease-velvet ${
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
            <p className="max-w-2xl pb-8 pl-12 text-pretty leading-relaxed text-mute md:pl-[calc(8.333%+1.5rem)] md:text-lg">
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
    <div className="border-b border-cream/10">
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
