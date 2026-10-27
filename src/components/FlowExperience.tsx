import { useEffect, useMemo, useRef, useState } from 'react'
import { beats } from './beats'
import { FlowRootContext, NavContext } from './context'

const beatIndex = (id: string) => beats.findIndex((b) => id === b.id || id.startsWith(`${b.id}-`))

/**
 * Touch + reduced-motion path. `snap`: a full-screen scroll-snap carousel inside
 * its own scroll container (keeps iOS chrome from resizing it mid-swipe).
 * Static: an ordinary stacked page. Neither loads any scroll-driven GSAP.
 */
export function FlowExperience({ snap }: { snap: boolean }) {
  const containerRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          const idx = beatIndex((e.target as HTMLElement).dataset.flowBeat ?? '')
          if (idx >= 0) setActive(idx)
        }
      },
      // A 1%-tall band across the middle: whichever beat crosses it is current.
      { root: snap ? container : null, rootMargin: '-49% 0px -50% 0px', threshold: 0 },
    )
    container.querySelectorAll('[data-flow-beat]').forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [snap])

  const nav = useMemo(
    () => ({
      toTop: () => {
        const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const target = snap ? containerRef.current : window
        target?.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' })
      },
    }),
    [snap],
  )

  return (
    <NavContext.Provider value={nav}>
      <FlowRootContext.Provider value={snap ? containerRef : undefined}>
        <main
          ref={containerRef}
          className={snap ? 'h-dvh snap-y snap-mandatory overflow-y-auto overscroll-y-contain' : undefined}
        >
          {beats.map((b) => (
            <b.Flow key={b.id} snap={snap} />
          ))}
        </main>
      </FlowRootContext.Provider>

      {/* Chapter ticks on the right edge: out of the way of thumbs and text. */}
      <div
        aria-hidden
        className="pointer-events-none fixed top-1/2 z-50 flex -translate-y-1/2 flex-col items-end gap-1.5"
        style={{ right: 'max(0.25rem, env(safe-area-inset-right))' }}
      >
        {beats.map((b, i) => (
          <span
            key={b.id}
            className={`block h-[2px] transition-all duration-300 ${i === active ? 'w-2.5 bg-signal' : 'w-1.5 bg-paper/25'}`}
          />
        ))}
      </div>
    </NavContext.Provider>
  )
}
