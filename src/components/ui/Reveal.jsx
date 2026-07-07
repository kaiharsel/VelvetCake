import { useReveal } from '../../hooks/useReveal'

/**
 * Convenience wrapper: renders a container whose [data-reveal] descendants
 * animate in on scroll. Use the `as` prop to pick the element.
 */
export default function Reveal({
  as: Tag = 'div',
  y,
  stagger,
  start,
  className = '',
  children,
  ...rest
}) {
  const ref = useReveal({ y, stagger, start })
  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  )
}
