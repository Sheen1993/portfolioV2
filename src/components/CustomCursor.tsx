import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const INTERACTIVE = 'a, button, [data-cursor="hover"]'

/**
 * A dot that tracks the pointer exactly and a ring that trails it. The ring
 * swells over anything clickable. Mounted only under CURSOR_QUERY and without
 * reduced motion — the parent decides.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = dotRef.current!
    const ring = ringRef.current!
    document.documentElement.classList.add('has-cursor')

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, autoAlpha: 0 })
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power3' })
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power3' })
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' })
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' })

    let visible = false
    let hovering = false
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return
      if (!visible) {
        visible = true
        gsap.set([dot, ring], { x: e.clientX, y: e.clientY })
        gsap.to([dot, ring], { autoAlpha: 1, duration: 0.2 })
      }
      dotX(e.clientX)
      dotY(e.clientY)
      ringX(e.clientX)
      ringY(e.clientY)
    }
    const onOver = (e: PointerEvent) => {
      const hit = Boolean((e.target as Element).closest?.(INTERACTIVE))
      hovering = hit
      gsap.to(ring, { scale: hit ? 1.9 : 1, borderColor: hit ? '#ff5a1f' : '#ece6da', duration: 0.25 })
      gsap.to(dot, { scale: hit ? 0 : 1, duration: 0.2 })
    }
    const onLeave = () => {
      visible = false
      gsap.to([dot, ring], { autoAlpha: 0, duration: 0.2 })
    }
    const onDown = () => gsap.to(ring, { scale: hovering ? 1.5 : 0.75, duration: 0.1 })
    const onUp = () => gsap.to(ring, { scale: hovering ? 1.9 : 1, duration: 0.2 })

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      document.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      gsap.killTweensOf([dot, ring])
    }
  }, [])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[70]">
      <div ref={ringRef} className="fixed left-0 top-0 h-9 w-9 rounded-full border border-paper/80" />
      <div ref={dotRef} className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-signal" />
    </div>
  )
}
