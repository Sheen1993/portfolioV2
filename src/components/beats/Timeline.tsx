import { gsap } from 'gsap'
import { roles, type Role } from '../../content'
import { T, type FlowProps, type RegisterBeat } from '../../lib/stage'
import { useNav } from '../context'
import { FlowSection } from '../FlowSection'
import { Reveal } from '../Reveal'

const pad = (n: number) => String(n).padStart(2, '0')
const byId = Object.fromEntries(roles.map((r) => [r.id, r])) as Record<string, Role>

const railLabel = (r: Role) => `${r.years[0]} — ${r.years[1] ?? 'now'}`
const shortName = (r: Role) => r.company.split(' ')[0]

/* ------------------------------------------------------- Role compositions */
// Below md (touch path only — the pinned stage never renders that narrow) long
// work lists become a sideways swipe carousel, so each role fits one snap point.
const carousel =
  'max-md:-mx-5 max-md:flex max-md:snap-x max-md:snap-mandatory max-md:gap-3 max-md:overflow-x-auto max-md:overscroll-x-contain max-md:scroll-px-5 max-md:px-5 no-scrollbar'
const card = 'max-md:w-[80%] max-md:shrink-0 max-md:snap-start max-md:border max-md:border-line max-md:p-4'

function SwipeHint({ count }: { count: number }) {
  return (
    <p aria-hidden className="kicker mt-3 flex items-center gap-2 md:hidden">
      <span className="text-signal">←→</span> Swipe · {count} items
    </p>
  )
}

/** Every role shares one shape: a numbered two-column ledger. */
function LedgerRole({ id }: { id: string }) {
  const r = byId[id]
  const words = r.company.split(' ')
  const last = words.pop()
  return (
    <article>
      <p className="kicker">
        {r.title} <span className="text-paper/40">·</span> <span className="text-signal">{r.period}</span>
      </p>
      <h3 className="mt-2 break-words font-display text-[clamp(1.8rem,min(4.8vw,8dvh),5.5rem)] font-extrabold uppercase leading-[0.9]">
        {words.join(' ')} <br className="hidden sm:block" />
        {last}
      </h3>
      {r.tenures && (
        <p className="mt-2 flex flex-wrap gap-x-8 gap-y-1 font-mono text-[0.72rem] text-paper/80">
          {r.tenures.map((t) => (
            <span key={t.kind}>
              <span className="text-signal">{t.kind}</span> {t.from} – {t.to}
            </span>
          ))}
        </p>
      )}
      {r.lede && <p className="t-body mt-3 max-w-[52ch] italic text-paper/80">{r.lede}</p>}
      <ol className={`mt-[clamp(1rem,3dvh,2.25rem)] grid gap-x-10 gap-y-[clamp(0.5rem,1.6dvh,1.1rem)] md:grid-cols-2 ${carousel}`}>
        {r.work.map((w, i) => (
          <li data-work key={w.name} className={`grid grid-cols-[2rem_1fr] border-t border-line pt-2 ${card}`}>
            <span className="pt-0.5 font-mono text-xs text-signal">{pad(i + 1)}</span>
            <div>
              <h4 className="font-semibold leading-snug">{w.name}</h4>
              <p className="mt-0.5 text-[0.86rem] leading-snug text-mute lg:text-[0.92rem]">{w.detail}</p>
            </div>
          </li>
        ))}
      </ol>
      <SwipeHint count={r.work.length} />
    </article>
  )
}

/* ------------------------------------------------------------------ Stage */

const jumpLabel = (r: Role) => `work-${r.id}`

function VerticalRail() {
  const { toLabel } = useNav()
  return (
    <div className="relative mt-[clamp(1.5rem,5dvh,3.5rem)] hidden flex-1 lg:block">
      <svg
        aria-hidden
        className="absolute left-[5px] top-2 h-[calc(100%-1rem)] w-[2px] overflow-visible"
        viewBox="0 0 2 100"
        preserveAspectRatio="none"
      >
        <line x1="1" y1="0" x2="1" y2="100" stroke="#2d2924" strokeWidth="1.5" />
        <line
          data-rail-line
          x1="1"
          y1="0"
          x2="1"
          y2="100"
          stroke="#ff5a1f"
          strokeWidth="1.5"
          pathLength={100}
          strokeDasharray="100"
          strokeDashoffset="100"
        />
      </svg>
      <ol className="relative flex h-full flex-col justify-between">
        {roles.map((r, i) => (
          <li key={r.id} data-rail-node={i} className="opacity-[0.35] transition-opacity hover:!opacity-100">
            <button
              type="button"
              onClick={() => toLabel(jumpLabel(r))}
              aria-label={`Jump to ${r.company}`}
              className="press group flex items-start gap-4 text-left"
            >
              <span data-rail-dot className="mt-1 h-3 w-3 shrink-0 border border-signal bg-ink" />
              <span>
                <span className="block font-mono text-xs tracking-wide text-paper">{railLabel(r)}</span>
                <span className="block font-display text-xl font-extrabold uppercase group-hover:text-signal">
                  {shortName(r)}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}

/** Below lg the rail turns horizontal and sits above the role. */
function HorizontalRail() {
  const { toLabel } = useNav()
  return (
    <div className="relative mt-4 lg:hidden">
      <svg aria-hidden className="absolute left-0 right-0 top-[5px] h-[2px] w-full" viewBox="0 0 100 2" preserveAspectRatio="none">
        <line x1="0" y1="1" x2="100" y2="1" stroke="#2d2924" strokeWidth="1.5" />
        <line
          data-rail-line
          x1="0"
          y1="1"
          x2="100"
          y2="1"
          stroke="#ff5a1f"
          strokeWidth="1.5"
          pathLength={100}
          strokeDasharray="100"
          strokeDashoffset="100"
        />
      </svg>
      <ol className="relative flex justify-between">
        {roles.map((r, i) => (
          <li key={r.id} data-rail-node={i} className="opacity-[0.35] transition-opacity hover:!opacity-100">
            <button
              type="button"
              onClick={() => toLabel(jumpLabel(r))}
              aria-label={`Jump to ${r.company}`}
              className={`press group flex flex-col gap-2 ${i === roles.length - 1 ? 'items-end' : 'items-start'}`}
            >
              <span data-rail-dot className="h-3 w-3 border border-signal bg-ink" />
              <span className="font-mono text-[0.7rem] text-paper group-hover:text-signal">
                {railLabel(r)} · {shortName(r)}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}

export function TimelineStage() {
  return (
    <div data-tl-content className="frame safe-y grid h-full grid-cols-12 grid-rows-[auto_1fr] gap-x-8 gap-y-4 lg:grid-rows-1">
      <div className="col-span-12 flex flex-col lg:col-span-3">
        <p data-tl-intro className="kicker">
          04 <span className="text-paper/40">—</span> Work
        </p>
        <h2 data-tl-intro className="t-title mt-3 font-display font-extrabold uppercase">
          Where the <br className="hidden lg:block" />
          hours went.
        </h2>
        <div data-tl-intro className="flex flex-col lg:flex-1">
          <VerticalRail />
          <HorizontalRail />
        </div>
      </div>
      <div className="relative col-span-12 min-h-0 lg:col-span-9">
        {roles.map((r) => {
          return (
            <div key={r.id} data-role={r.id} className="absolute inset-0 flex flex-col justify-center">
              <LedgerRole id={r.id} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export const registerTimeline: RegisterBeat = ({ tl, q, root, enterAt, settleAt, exitAt, k }) => {
  const enter = enterAt ?? 0
  const exit = exitAt ?? settleAt + 3
  const roleEls = q('[data-role]')
  const nodes = (i: number) => q(`[data-rail-node="${i}"]`)
  const dots = (i: number) => q(`[data-rail-node="${i}"] [data-rail-dot]`)
  const work = (el: HTMLElement) => gsap.utils.toArray<HTMLElement>(el.querySelectorAll('[data-work]'))

  const light = (i: number, at: number) => {
    tl.to(nodes(i), { opacity: 1, duration: 0.15 }, at)
    tl.to(dots(i), { backgroundColor: '#ff5a1f', duration: 0.15 }, at)
  }

  // Enter: intro column slides in from the left, first role rises.
  tl.fromTo(q('[data-tl-intro]'), { autoAlpha: 0, x: -50 * k }, { autoAlpha: 1, x: 0, stagger: 0.05, duration: T }, enter)
  tl.fromTo(roleEls[0], { autoAlpha: 0, y: 60 * k }, { autoAlpha: 1, y: 0, duration: T }, enter + 0.1)
  tl.fromTo(work(roleEls[0]), { autoAlpha: 0, y: 14 * k }, { autoAlpha: 1, y: 0, stagger: 0.03, duration: 0.18 }, enter + 0.3)
  light(0, enter + 0.3)

  // Hold: the rail draws across the whole beat; roles swap at even intervals.
  const holdEnd = exit - 0.05
  const seg = (holdEnd - settleAt) / roleEls.length
  // The line reaches node i exactly as role i swaps in (settle + seg*i + 0.01).
  // autoRound: false — CSSPlugin rounds px values to integers by default.
  tl.fromTo(
    q('[data-rail-line]'),
    { strokeDashoffset: 100 },
    { strokeDashoffset: 0, autoRound: false, duration: seg * (roleEls.length - 1) + 0.01 },
    settleAt,
  )
  for (let i = 1; i < roleEls.length; i++) {
    const at = settleAt + seg * i - 0.15
    tl.to(roleEls[i - 1], { autoAlpha: 0, y: -50 * k, duration: 0.28, ease: 'power2.in' }, at)
    tl.fromTo(roleEls[i], { autoAlpha: 0, y: 50 * k }, { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out' }, at + 0.16)
    tl.fromTo(work(roleEls[i]), { autoAlpha: 0, y: 14 * k }, { autoAlpha: 1, y: 0, stagger: 0.03, duration: 0.18 }, at + 0.26)
    light(i, at + 0.16)
    tl.addLabel(`work-${roleEls[i].dataset.role}`, at + 0.6)
  }

  // Land on the first role with all its work items in (they finish ~enter + 0.63).
  const restAt = enter + 0.75
  tl.addLabel(`work-${roleEls[0].dataset.role}`, restAt)
  if (exitAt === null) return restAt
  tl.to(root.firstElementChild, { autoAlpha: 0, scale: 0.97, duration: T, ease: 'power1.in' }, exitAt)
  return restAt
}

/* ------------------------------------------------------------------- Flow */
// One snap point per role: no scrubbed swapping on touch.

export function TimelineFlow({ snap }: FlowProps) {
  return (
    <>
      {roles.map((r, i) => {
        return (
          <FlowSection key={r.id} id={i === 0 ? 'timeline' : `timeline-${r.id}`} label={`Work: ${r.company}`} snap={snap} className="gap-6">
            <div className="flex items-baseline justify-between gap-4">
              <p className="kicker">
                04 <span className="text-paper/40">—</span> Work
              </p>
              <p className="kicker">
                <span className="text-signal">{pad(i + 1)}</span> / {pad(roles.length)}
              </p>
            </div>
            {i === 0 && (
              <Reveal as="h2" className="font-display text-[clamp(2.2rem,10vw,4.5rem)] font-extrabold uppercase leading-[0.9]">
                Where the hours went.
              </Reveal>
            )}
            <Reveal delay={0.1} className="my-auto">
              <LedgerRole id={r.id} />
            </Reveal>
          </FlowSection>
        )
      })}
    </>
  )
}
