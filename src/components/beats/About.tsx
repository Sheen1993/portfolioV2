import { Fragment } from 'react'
import { about, profile, type Run } from '../../content'
import { T, type FlowProps, type RegisterBeat } from '../../lib/stage'
import { FlowSection } from '../FlowSection'
import { Reveal } from '../Reveal'

function Runs({ runs }: { runs: Run[] }) {
  return (
    <>
      {runs.map((r, i) =>
        typeof r === 'string' ? (
          <Fragment key={i}>{r}</Fragment>
        ) : (
          <span key={i} className="text-signal">
            {r.mark}
          </span>
        ),
      )}
    </>
  )
}

function Kicker(props: Record<string, string>) {
  return (
    <p {...props} className="kicker">
      02 <span className="text-paper/40">—</span> The short version
    </p>
  )
}

function Currently(props: Record<string, string>) {
  return (
    <p {...props} className="kicker leading-relaxed">
      Currently <span className="text-paper/40">—</span> <span className="text-paper">{profile.now}</span>
    </p>
  )
}

/** "Day to day" / "Lately": a small two-column ledger under a hairline rule. */
function Details({ stage }: { stage?: boolean }) {
  return (
    <div className="relative">
      <div {...(stage ? { 'data-about-rule': '' } : {})} className="h-px origin-left bg-line" />
      <dl>
        {about.details.map((d) => (
          <div
            key={d.label}
            {...(stage ? { 'data-about-row': '' } : {})}
            className="grid gap-x-8 gap-y-1 border-b border-line py-[clamp(0.7rem,2dvh,1.1rem)] sm:grid-cols-[8.5rem_1fr]"
          >
            <dt className="kicker pt-[0.2em]">{d.label}</dt>
            <dd className="text-[clamp(1rem,min(1.15vw,2.4dvh),1.3rem)] leading-snug text-paper/75 [text-wrap:pretty]">
              <Runs runs={d.runs} />
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

const numeralClass = 'block font-display font-black leading-[0.86] tracking-[-0.02em] text-paper'
const leadClass = 'font-normal leading-[1.2] tracking-[-0.012em] [text-wrap:pretty]'

/* ------------------------------------------------------------------ Stage */
// Two columns: the number as the anchor on the left, the sentence and the
// specifics on the right. Nothing is hard-broken, so no orphans at any width.

export function AboutStage() {
  return (
    <div className="frame safe-y flex h-full flex-col">
      <Kicker data-about-kicker="" />
      <div className="my-auto grid grid-cols-12 items-end gap-x-[clamp(1.5rem,4vw,5rem)] gap-y-8">
        <div data-about-left className="col-span-4 xl:col-span-4">
          {/* Size lives on the mask so its em-based padding matches the glyph. */}
          <span className="mask text-[clamp(9rem,min(30vw,50dvh),30rem)]" aria-hidden>
            <span data-about-num className={numeralClass}>
              {about.years}
            </span>
          </span>
          <div className="mt-[clamp(1rem,3dvh,2rem)] space-y-3 border-t border-line pt-3">
            <p data-about-meta className="kicker text-paper">
              {about.yearsLabel}
            </p>
            <Currently data-about-meta="" />
          </div>
        </div>

        <div data-about-right className="col-span-8 space-y-[clamp(1.5rem,5dvh,3rem)] xl:col-span-7">
          <p className={`${leadClass} max-w-[34ch] text-[clamp(1.35rem,min(2.35vw,4.6dvh),2.9rem)]`}>
            {about.lead.map((runs, i) => (
              <span key={i} data-about-phrase>
                <Runs runs={runs} />
              </span>
            ))}
          </p>
          <Details stage />
        </div>
      </div>
    </div>
  )
}

export const registerAbout: RegisterBeat = ({ tl, q, enterAt, exitAt, k }) => {
  const enter = enterAt ?? 0
  const exit = exitAt ?? enter + 2

  tl.fromTo(q('[data-about-kicker]'), { autoAlpha: 0, x: -40 * k }, { autoAlpha: 1, x: 0, duration: T }, enter)
  // The numeral rises out of its mask with the entrance.
  tl.fromTo(q('[data-about-num]'), { yPercent: 100 }, { yPercent: 0, duration: T, ease: 'power3.out' }, enter)
  tl.fromTo(q('[data-about-meta]'), { autoAlpha: 0 }, { autoAlpha: 1, stagger: 0.08, duration: 0.2 }, enter + 0.3)

  // The lead lights up phrase by phrase: dim text brightens at scrolling pace.
  // Inline spans, so wrapping stays natural; only opacity animates.
  const phrases = q('[data-about-phrase]')
  const from = enter + 0.1
  const step = 0.2
  phrases.forEach((p, i) => {
    tl.fromTo(p, { opacity: 0.14 }, { opacity: 1, duration: step, ease: 'power1.out' }, from + i * step)
  })

  // Then the specifics: rule draws, rows settle in.
  const detailsAt = from + phrases.length * step
  tl.fromTo(q('[data-about-rule]'), { scaleX: 0 }, { scaleX: 1, duration: 0.2, ease: 'power2.out' }, detailsAt)
  tl.fromTo(
    q('[data-about-row]'),
    { autoAlpha: 0, y: 16 * k },
    { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.2, ease: 'power2.out' },
    detailsAt + 0.05,
  )
  // Everything is in by ~detailsAt + 0.35; hold still until the exit.
  const restAt = Math.max(detailsAt + 0.4, exit - 0.12)

  if (exitAt === null) return restAt
  tl.to(q('[data-about-num]'), { yPercent: -100, duration: T, ease: 'power2.in' }, exitAt)
  tl.to(q('[data-about-right]'), { y: -60 * k, autoAlpha: 0, duration: T, ease: 'power1.in' }, exitAt)
  tl.to(q('[data-about-kicker], [data-about-meta]'), { autoAlpha: 0, duration: T * 0.6 }, exitAt)
  return restAt
}

/* ------------------------------------------------------------------- Flow */

export function AboutFlow({ snap }: FlowProps) {
  return (
    <FlowSection id="about" label="About" snap={snap} className="justify-center gap-[clamp(1rem,3svh,2rem)]">
      <Kicker />
      <div className="my-auto space-y-[clamp(1rem,3.5svh,2.25rem)] md:grid md:grid-cols-12 md:items-end md:gap-x-10 md:space-y-0">
        <Reveal className="flex items-end gap-4 md:col-span-4 md:block">
          <span aria-hidden className={`${numeralClass} text-[clamp(5rem,min(28vw,15svh),20rem)] md:text-[clamp(8rem,min(24vw,34svh),20rem)]`}>
            {about.years}
          </span>
          <span className="block space-y-2 pb-1 md:mt-5 md:border-t md:border-line md:pt-3">
            <span className="kicker block text-paper">{about.yearsLabel}</span>
            <span className="hidden md:block">
              <Currently />
            </span>
          </span>
        </Reveal>
        <div className="space-y-[clamp(1rem,3.5svh,2.25rem)] md:col-span-8">
          <Reveal as="p" delay={0.08} className={`${leadClass} text-[clamp(1.25rem,5.6vw,2.4rem)] md:text-[clamp(1.35rem,min(2.6vw,4.4svh),2.4rem)]`}>
            {about.lead.map((runs, i) => (
              <Runs key={i} runs={runs} />
            ))}
          </Reveal>
          <Reveal delay={0.16}>
            <Details />
          </Reveal>
        </div>
      </div>
      <div className="md:hidden">
        <Currently />
      </div>
    </FlowSection>
  )
}
