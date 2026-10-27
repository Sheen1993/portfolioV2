import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useFlowRoot } from './context'

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  /** Horizontal entrance instead of vertical. */
  from?: 'below' | 'left'
  as?: 'div' | 'li' | 'p' | 'span' | 'h2' | 'h3'
}

/**
 * Cheap entrance for the snap / static paths. Under MotionConfig
 * reducedMotion="user", Framer drops the transform and keeps the fade.
 */
export function Reveal({ children, className, delay = 0, from = 'below', as = 'div' }: RevealProps) {
  const root = useFlowRoot()
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, x: from === 'left' ? -24 : 0, y: from === 'below' ? 22 : 0 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ root, once: true, amount: 0.25 }}
      transition={{ duration: 0.55, delay, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </Tag>
  )
}
