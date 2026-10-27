import { useId, useState } from 'react'
import { Plus } from 'lucide-react'
import { highlights } from '../../content'
import { useMediaQuery } from '../../lib/media'
import { T, type FlowProps, type RegisterBeat } from '../../lib/stage'
import { FlowSection } from '../FlowSection'
import { Reveal } from '../Reveal'

const pad = (n: number) => String(n).padStart(2, '0')

function Intro({ stage }: { stage?: boolean }) {
  const attr = stage ? { 'data-hl-intro': '' } : {}
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
      <div>
        <p {...attr} className="kicker">
          05 <span className="text-paper/40">—</span> Impact
        </p>
        <h2
          {...attr}
          className={`mt-3 font-display font-extrabold uppercase ${stage ? 't-display' : 'text-[clamp(2.6rem,min(12vw,11svh),5rem)] leading-[0.9]'}`}
        >
          Receipts.
        </h2>
      </div>
      <p {...attr} className="t-body max-w-[36ch] text-mute">
        Four problems, what was actually wrong, and what changed after.
      </p>
    </div>
  )
}

/* ------------------------------------------------------------------ Stage */

export function HighlightsStage() {
  return (
    <div data-hl-content className="safe-y flex h-full flex-col">
      <div className="frame">
        <Intro stage />
      </div>
      {/* Stops short of the chapter rail; the right edge fades so the next card
          reads as "more this way" rather than cut off. */}
      <div data-hl-window className="strip-window relative mt-[clamp(1.25rem,5dvh,4rem)] min-h-0 flex-1 overflow-hidden">
                <div data-hl-strip className="flex h-full w-max items-center pl-[clamp(1.25rem,4vw,4.5rem)] will-change-transform">
          {highlights.map((h, i) => (
            <article
              key={h.id}
              data-hl
              className="flex w-[clamp(18rem,27vw,32rem)] shrink-0 flex-col border-l border-line px-[clamp(1.25rem,2.5vw,2.75rem)]"
            >
              <span aria-hidden className="text-outline font-display text-[clamp(3rem,min(8vw,13dvh),9rem)] font-black leading-none">
                {pad(i + 1)}
              </span>
              <p className="kicker mt-[clamp(0.75rem,4dvh,2.5rem)]">{h.where}</p>
              <h3 className="t-title mt-3 font-display font-extrabold uppercase">{h.title}</h3>
              <p className="t-body mt-4 max-w-[46ch] text-paper/80">{h.body}</p>
              <p className="mt-5 font-mono text-xs text-signal">{h.stack}</p>
            </article>
          ))}
          <div aria-hidden className="w-[clamp(1.25rem,6vw,6rem)] shrink-0 border-l border-line" />
        </div>
      </div>
    </div>
  )
}

export const registerHighlights: RegisterBeat = ({ tl, q, root, enterAt, settleAt, exitAt, k }) => {
  const enter = enterAt ?? 0
  const exit = exitAt ?? settleAt + 1.5
  const strip = q('[data-hl-strip]')[0]
  // Function-based so ScrollTrigger's invalidateOnRefresh re-measures on resize.
  // On very wide screens the strip may already fit; it still drifts a little.
  const view = q('[data-hl-window]')[0]
  const travel = () => Math.min(-80 * k, -(strip.scrollWidth - view.clientWidth))

  tl.fromTo(q('[data-hl-intro]'), { autoAlpha: 0, y: 40 * k }, { autoAlpha: 1, y: 0, stagger: 0.05, duration: T }, enter)
  tl.fromTo(strip, { x: () => root.clientWidth * 0.55 * k }, { x: 0, duration: T + 0.1, ease: 'power2.out' }, enter)
  tl.fromTo(q('[data-hl]'), { autoAlpha: 0 }, { autoAlpha: 1, stagger: 0.08, duration: 0.2 }, enter + 0.1)
  // The horizontal pass: vertical scroll drives the strip sideways.
  tl.to(strip, { x: travel, duration: exit - (enter + T + 0.1) }, enter + T + 0.1)

  // Strip parked at its start, every card faded in. The rest arrives sideways.
  const restAt = enter + T + 0.15
  if (exitAt === null) return restAt
  tl.to(q('[data-hl-intro]'), { autoAlpha: 0, y: -30 * k, duration: T * 0.6 }, exitAt)
  tl.to(strip, { x: `-=${160 * k}`, autoAlpha: 0, duration: T, ease: 'power1.in' }, exitAt)
  return restAt
}

/* ------------------------------------------------------------------- Flow */

export function HighlightsFlow({ snap }: FlowProps) {
  // Phones get an accordion (fits one snap point on an SE); wider touch
  // screens have the room to show every card open.
  const wide = useMediaQuery('(min-width: 768px)')
  const [open, setOpen] = useState(() => (window.matchMedia('(max-height: 760px)').matches ? -1 : 0))
  const baseId = useId()

  return (
    <FlowSection id="highlights" label="Impact" snap={snap} className="justify-center gap-6">
      <Intro />
      <ol className="border-t border-line md:grid md:grid-cols-2 md:gap-x-10 md:border-t-0">
        {highlights.map((h, i) => {
          const isOpen = wide || open === i
          const panelId = `${baseId}-${h.id}`
          const heading = (
            <>
              <span className="pt-1 font-mono text-xs text-signal">{pad(i + 1)}</span>
              <span className="flex-1">
                <span className="block font-display text-[clamp(1.35rem,min(6vw,4.6svh),2.1rem)] font-extrabold uppercase leading-[0.95]">
                  {h.title}
                </span>
                <span className="mt-1.5 block font-mono text-[0.7rem] text-mute">{h.stack}</span>
              </span>
            </>
          )
          return (
            <Reveal
              as="li"
              key={h.id}
              delay={i * 0.06}
              // Offset the second column: a staggered ledger, not a grid of tiles.
              className={`border-b border-line md:border-t ${i % 2 ? 'md:mt-8' : ''}`}
            >
              {wide ? (
                <h3 className="flex items-start gap-4 pb-3 pt-4">{heading}</h3>
              ) : (
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="press flex min-h-[44px] w-full items-start gap-4 py-4 text-left active:bg-ink2"
                  >
                    {heading}
                    <Plus
                      aria-hidden
                      className={`mt-1 h-5 w-5 shrink-0 text-mute transition-transform ${isOpen ? 'rotate-45 text-signal' : ''}`}
                    />
                  </button>
                </h3>
              )}
              <div id={panelId} className="collapse-grid" data-open={isOpen}>
                <div>
                  <p className="pb-2 pl-8 text-[0.95rem] leading-relaxed text-paper/80 md:leading-normal">{h.body}</p>
                  <p className="kicker pb-5 pl-8">{h.where}</p>
                </div>
              </div>
            </Reveal>
          )
        })}
      </ol>
    </FlowSection>
  )
}
