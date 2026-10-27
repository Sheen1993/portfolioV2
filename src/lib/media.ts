import { useSyncExternalStore } from 'react'

/** Pinned + scrubbed timeline: tablet-and-up with a real mouse/trackpad. */
export const PINNED_QUERY = '(min-width: 768px) and (hover: hover) and (pointer: fine)'
/** Below lg the pinned scene runs in a reduced "compact" choreography. */
export const WIDE_QUERY = '(min-width: 1024px)'
/** Custom cursor + magnetic hover. Width alone isn't enough: big touchscreens exist. */
export const CURSOR_QUERY = '(min-width: 1024px) and (hover: hover) and (pointer: fine)'
export const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)'
export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

// Stable subscribe fns per query, so useSyncExternalStore doesn't resubscribe
// on every render.
const subscribers = new Map<string, (onChange: () => void) => () => void>()

function subscribe(query: string) {
  let fn = subscribers.get(query)
  if (!fn) {
    fn = (onChange) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    }
    subscribers.set(query, fn)
  }
  return fn
}

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    subscribe(query),
    () => window.matchMedia(query).matches,
    () => false,
  )
}

/**
 * - `pinned`: one pinned stage, GSAP master timeline driven by scroll.
 * - `snap`:   full-screen scroll-snap carousel, Framer Motion entrances only.
 * - `static`: prefers-reduced-motion. Plain stacked page, opacity fades only.
 */
export type ExperienceMode = 'pinned' | 'snap' | 'static'

export function useExperienceMode(): { mode: ExperienceMode; compact: boolean } {
  const reduced = useMediaQuery(REDUCED_MOTION_QUERY)
  const pinnable = useMediaQuery(PINNED_QUERY)
  const wide = useMediaQuery(WIDE_QUERY)
  const mode: ExperienceMode = reduced ? 'static' : pinnable ? 'pinned' : 'snap'
  return { mode, compact: mode === 'pinned' && !wide }
}
