import { gsap } from 'gsap'
import { roles, type Role } from '../../content'
import { T, type FlowProps, type RegisterBeat } from '../../lib/stage'
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

// Same screen real estate, three different shapes: a ledger, a tenure chart
// with a table, and a pull quote. The jobs weren't alike either.

/** Cody: six products, so a numbered two-column ledger. */
function CodyRole() {
  const r = byId.cody
  return (
    <article>
      <p className="kicker">
        {r.title} <span className="text-paper/40">·</span> <span className="text-signal">{r.period}</span>
      </p>
      <h3 className="t-display mt-2 font-display font-extrabold uppercase">
        Cody Web <br className="hidden sm:block" />
        Development
      </h3>
      <p className="t-body mt-3 max-w-[52ch] italic text-paper/80">{r.lede}</p>
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

/** Evotech: two stints with a gap, so show the gap. Work reads as a spec table. */
function EvotechRole() {
  const r = byId.evotech
  const min = 2016
  const span = 10
  return (
    <article>
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
        <div>
          <p className="kicker">{r.title}</p>
          <h3 className="t-title mt-2 font-display font-extrabold uppercase">
            Evotech Software <br className="hidden sm:block" />
            Solutions
          </h3>
        </div>
        <p className="t-body max-w-[34ch] italic text-paper/80">{r.lede}</p>
      </div>

      <div className="mt-[clamp(1rem,3dvh,2rem)]" aria-label={r.period}>
        <div className="relative h-3">
          <div className="absolute inset-x-0 top-1/2 h-px bg-line" />
          {r.tenures?.map((t) => (
            <div
              key={t.kind}
              className="absolute top-0 h-3"
              style={{
                left: `${((t.start - min) / span) * 100}%`,
                width: `${((t.end - t.start) / span) * 100}%`,
                background:
                  t.kind === 'Full-time'
                    ? '#ff5a1f'
                    : 'repeating-linear-gradient(-45deg, #ff5a1f 0 2px, transparent 2px 6px)',
              }}
            />
          ))}
        </div>
        <div aria-hidden className="mt-1.5 flex justify-between font-mono text-[0.65rem] text-mute">
          {Array.from({ length: span + 1 }, (_, i) => (
            <span key={i} className={i % 2 ? 'hidden sm:inline' : ''}>
              ’{String(min + i).slice(2)}
            </span>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-x-8 gap-y-1 font-mono text-[0.72rem] text-paper/80">
          {r.tenures?.map((t) => (
            <span key={t.kind}>
              <span className="text-signal">{t.kind}</span> {t.from} – {t.to}
            </span>
          ))}
          <span className="text-mute">(the gap is N-PAX)</span>
        </div>
      </div>

      <dl className={`mt-[clamp(0.75rem,2.5dvh,1.75rem)] border-t border-line max-md:border-t-0 ${carousel}`}>
        {r.work.map((w) => (
          <div
            data-work
            key={w.name}
            className={`grid content-start gap-x-8 gap-y-1 border-b border-line py-[clamp(0.45rem,1.3dvh,0.85rem)] md:grid-cols-[minmax(9rem,15rem)_1fr] ${card}`}
          >
            <dt className="font-mono text-[0.8rem] text-paper">{w.name}</dt>
            <dd className="text-[0.88rem] leading-snug text-mute lg:text-[0.95rem]">{w.detail}</dd>
          </div>
        ))}
      </dl>
      <SwipeHint count={r.work.length} />
    </article>
  )
}

/** N-PAX: the lede does the talking; one main job, two supporting ones. */
function NpaxRole() {
  const r = byId.npax
  const [first, ...rest] = r.lede.split('. ')
  const [main, ...others] = r.work
  return (
    <article className="grid grid-cols-12 gap-x-6">
      <p className="kicker col-span-12">
        {r.title} <span className="text-paper/40">·</span> {r.company} <span className="text-paper/40">·</span>{' '}
        <span className="text-signal">{r.period}</span>
      </p>
      <blockquote className="t-display col-span-12 mt-3 font-display font-extrabold uppercase lg:col-span-11">
        {first}. <span className="text-mute">{rest.join('. ')}</span>
      </blockquote>
      <div className="col-span-12 mt-[clamp(1.25rem,4dvh,3rem)] grid gap-x-12 gap-y-5 md:grid-cols-[1.35fr_1fr]">
        <div data-work className="border-l-2 border-signal pl-5">
          <h4 className="font-display text-[clamp(1.5rem,2.4vw,2.4rem)] font-extrabold uppercase leading-none">
            {main.name}
          </h4>
          <p className="t-body mt-2 max-w-[44ch] text-paper/80">{main.detail}</p>
        </div>
        <ul className="space-y-4">
          {others.map((w) => (
            <li data-work key={w.name}>
              <h4 className="font-mono text-[0.8rem] uppercase tracking-[0.12em] text-paper">{w.name}</h4>
              <p className="mt-1 text-[0.9rem] leading-snug text-mute">{w.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}

const compositions: Record<string, () => JSX.Element> = {
  cody: CodyRole,
  evotech: EvotechRole,
  npax: NpaxRole,
}

/* ------------------------------------------------------------------ Stage */

function VerticalRail() {
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
          <li key={r.id} data-rail-node={i} className="flex items-start gap-4 opacity-[0.35]">
            <span data-rail-dot className="mt-1 h-3 w-3 shrink-0 border border-signal bg-ink" />
            <span>
              <span className="block font-mono text-xs tracking-wide text-paper">{railLabel(r)}</span>
              <span className="block font-display text-xl font-extrabold uppercase">{shortName(r)}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}

/** Below lg the rail turns horizontal and sits above the role. */
function HorizontalRail() {
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
          <li key={r.id} data-rail-node={i} className="flex flex-col items-start gap-2 opacity-[0.35] last:items-end">
            <span data-rail-dot className="h-3 w-3 border border-signal bg-ink" />
            <span className="font-mono text-[0.7rem] text-paper">
              {railLabel(r)} · {shortName(r)}
            </span>
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
          const Composition = compositions[r.id]
          return (
            <div key={r.id} data-role={r.id} className="absolute inset-0 flex flex-col justify-center">
              <Composition />
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
        const Composition = compositions[r.id]
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
              <Composition />
            </Reveal>
          </FlowSection>
        )
      })}
    </>
  )
}
