import { motion, useMotionValue, useSpring } from 'framer-motion'
import type { PointerEvent, ReactNode } from 'react'
import { CURSOR_QUERY, REDUCED_MOTION_QUERY, useMediaQuery } from '../lib/media'

interface MagneticProps {
  children: ReactNode
  className?: string
  /** 0..1 — how far the element leans toward the pointer. */
  strength?: number
}

/**
 * Leans its child toward the pointer. Only live on large fine-pointer screens;
 * on touch it renders a plain wrapper and the child's :active state does the work.
 */
export function Magnetic({ children, className, strength = 0.3 }: MagneticProps) {
  const finePointer = useMediaQuery(CURSOR_QUERY)
  const reduced = useMediaQuery(REDUCED_MOTION_QUERY)
  const enabled = finePointer && !reduced
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 16, mass: 0.4 })
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 16, mass: 0.4 })

  if (!enabled) return <span className={`inline-block ${className ?? ''}`}>{children}</span>

  const onMove = (e: PointerEvent<HTMLSpanElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.span
      className={`inline-block ${className ?? ''}`}
      style={{ x, y }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.span>
  )
}
