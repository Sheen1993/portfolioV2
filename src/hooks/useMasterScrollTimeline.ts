import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { PINNED_QUERY } from '../lib/media'
import { T, type BeatDefinition } from '../lib/stage'

gsap.registerPlugin(ScrollTrigger, useGSAP)

interface Options {
  beats: BeatDefinition[]
  compact: boolean
}

/**
 * Owns the pinned stage, the scroll track that feeds it, and the single master
 * timeline every beat registers its slice onto.
 *
 * Track height = (sum of beat weights + 1) viewports. The +1 is the stage's own
 * height, so scroll distance is exactly `total` viewports and timeline time maps
 * 1:1 to "viewports scrolled".
 */
export function useMasterScrollTimeline({ beats, compact }: Options) {
  const trackRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<ScrollTrigger | null>(null)
  const activeRef = useRef(0)
  const [active, setActive] = useState(0)

  const starts = useMemo(() => {
    let t = 0
    return beats.map((b) => {
      const s = t
      t += b.weight
      return s
    })
  }, [beats])
  const total = useMemo(() => beats.reduce((sum, b) => sum + b.weight, 0), [beats])

  useGSAP(
    () => {
      // JS-level guard: never wire up pinning/scrubbing on touch or small
      // screens, even if this component were somehow rendered there.
      if (!window.matchMedia(PINNED_QUERY).matches) return
      const stage = stageRef.current
      const track = trackRef.current
      if (!stage || !track) return

      const layers = beats.map((b) => stage.querySelector<HTMLElement>(`[data-beat="${b.id}"]`)!)
      layers.forEach((layer, i) => gsap.set(layer, { autoAlpha: i === 0 ? 1 : 0 }))
      setLayerActive(layers, 0)
      activeRef.current = 0
      setActive(0)

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: track,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          pin: stage,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate(self) {
            if (progressRef.current) {
              progressRef.current.style.transform = `scaleY(${self.progress})`
            }
            const time = self.progress * total
            let idx = 0
            for (let i = 0; i < starts.length; i++) if (time >= starts[i] - 0.001) idx = i
            if (idx !== activeRef.current) {
              activeRef.current = idx
              setLayerActive(layers, idx)
              setActive(idx)
            }
          },
        },
      })

      beats.forEach((beat, i) => {
        const root = layers[i]
        const start = starts[i]
        const end = start + beat.weight
        const first = i === 0
        const last = i === beats.length - 1
        const enterAt = first ? null : start - T / 2
        const settleAt = first ? 0 : start + T / 2
        const exitAt = last ? null : end - T

        // Layer visibility: autoAlpha also toggles `visibility`, so off-stage
        // beats cost nothing to paint.
        if (enterAt !== null) tl.set(root, { autoAlpha: 1 }, enterAt)
        if (!last) tl.set(root, { autoAlpha: 0 }, end)

        const restAt = beat.register({
          tl,
          root,
          q: gsap.utils.selector(root) as (s: string) => HTMLElement[],
          enterAt,
          settleAt,
          exitAt,
          compact,
          k: compact ? 0.55 : 1,
        })
        // The label is where chapter navigation lands: the beat fully revealed.
        tl.addLabel(beat.id, typeof restAt === 'number' ? restAt : settleAt)
      })

      // Pin the timeline's duration to the track length so scroll maps 1:1.
      tl.set({}, {}, total)
      triggerRef.current = tl.scrollTrigger ?? null

      // Off-stage layers are visibility:hidden, so Tab never reaches them; the
      // chapter rail (first in DOM order) is the keyboard route between beats.

      // Webfonts change the width of the highlights strip and the name lines.
      document.fonts?.ready.then(() => ScrollTrigger.refresh())

      return () => {
        triggerRef.current = null
      }
    },
    // revertOnUpdate: rebuilding (e.g. crossing lg -> compact) fully reverts the
    // previous timeline + pin first, so hot reloads and mode flips never stack
    // duplicate ScrollTriggers.
    { scope: stageRef, dependencies: [beats, compact, total, starts], revertOnUpdate: true },
  )

  // Debounced refresh on resize + rotation. invalidateOnRefresh re-reads any
  // function-based values (e.g. the highlights strip distance).
  useEffect(() => {
    let timer: number | undefined
    const onResize = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 150)
    }
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
    }
  }, [])

  const jumpTo = useCallback(
    (index: number, behavior: ScrollBehavior = 'smooth') => {
      const st = triggerRef.current
      const beat = beats[index]
      if (!st || !beat) return
      window.scrollTo({ top: st.labelToScroll(beat.id), behavior })
    },
    [beats],
  )

  /** Scroll to any label a beat added to the master timeline. */
  const jumpToLabel = useCallback((label: string, behavior: ScrollBehavior = 'smooth') => {
    const st = triggerRef.current
    if (!st) return
    window.scrollTo({ top: st.labelToScroll(label), behavior })
  }, [])

  return { trackRef, stageRef, progressRef, active, total, jumpTo, jumpToLabel }
}

function setLayerActive(layers: HTMLElement[], index: number) {
  layers.forEach((layer, i) => {
    layer.dataset.active = String(i === index)
  })
}
