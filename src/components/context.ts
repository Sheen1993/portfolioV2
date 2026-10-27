import { createContext, useContext, type RefObject } from 'react'

/**
 * Scroll root for Framer's whileInView in snap mode (the snap container), or
 * undefined in static mode (document scroll).
 */
export const FlowRootContext = createContext<RefObject<HTMLElement> | undefined>(undefined)
export const useFlowRoot = () => useContext(FlowRootContext)

/** Mode-specific navigation, so beats don't need to know how scrolling works. */
export const NavContext = createContext<{ toTop: () => void }>({
  toTop: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
})
export const useNav = () => useContext(NavContext)
