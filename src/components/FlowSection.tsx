import type { ReactNode } from 'react'

interface FlowSectionProps {
  id: string
  label: string
  snap: boolean
  className?: string
  children: ReactNode
}

/**
 * One beat in the snap carousel (full-height snap point) or in the static
 * reduced-motion page (natural height). Beats taller than the screen still
 * work: browsers allow free scrolling inside an oversized snap area.
 */
export function FlowSection({ id, label, snap, className = '', children }: FlowSectionProps) {
  return (
    <section
      id={`beat-${id}`}
      data-flow-beat={id}
      aria-label={label}
      className={`frame safe-y relative flex flex-col ${snap ? 'min-h-full snap-start' : 'py-16'} ${className}`}
    >
      {children}
    </section>
  )
}
