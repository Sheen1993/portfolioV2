import type { ReactNode } from 'react'
import { motion, type Variants } from 'framer-motion'
import { skillGroups } from '../../content'
import { T, type FlowProps, type RegisterBeat } from '../../lib/stage'
import { useFlowRoot } from '../context'
import { FlowSection } from '../FlowSection'

const entryCount = skillGroups.reduce((n, g) => n + g.items.length, 0)

const fileVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.025 } },
}

const rowVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

interface RowProps {
  children: ReactNode
  motionRow?: boolean
  /** Hidden on short phones so the file fits one snap point. */
  optional?: boolean
}

function Row({ children, motionRow, optional }: RowProps) {
  const className = `code-line grid grid-cols-[2.2em_1fr] gap-x-3 sm:grid-cols-[2.6em_1fr] ${optional ? 'short-hide' : ''}`
  const inner = (
    <>
      {/* Numbered by a CSS counter, so rows hidden on small screens don't leave gaps. */}
      <span aria-hidden className="ln select-none text-right text-paper/25" />
      <div className="min-w-0">{children}</div>
    </>
  )
  return motionRow ? (
    <motion.div data-skill-row className={className} variants={rowVariants}>
      {inner}
    </motion.div>
  ) : (
    <div data-skill-row className={className}>
      {inner}
    </div>
  )
}

/**
 * The stack as a config file. Line numbers, section headers, comments — it's
 * how the list would actually live in a repo, and it reads faster than tags.
 */
function SkillsFile({ motionRows }: { motionRows?: boolean }) {
  const rows: ReactNode[] = []
  skillGroups.forEach((g, gi) => {
    rows.push(
      <Row key={`${g.key}-h`} motionRow={motionRows}>
        <h3 className="inline text-signal">[{g.key}]</h3>
      </Row>,
    )
    if (g.comment) {
      rows.push(
        <Row key={`${g.key}-c`} motionRow={motionRows} optional={g.key !== 'ai'}>
          <span className="text-mute"># {g.comment}</span>
        </Row>,
      )
    }
    rows.push(
      <Row key={`${g.key}-i`} motionRow={motionRows}>
        <span aria-hidden className="text-mute">
          items = [{' '}
        </span>
        <ul aria-label={g.key} className="inline">
          {g.items.map((item, j) => (
            <li key={item} data-skill className="mr-[0.55em] inline-block whitespace-nowrap">
              <span aria-hidden className="text-mute">“</span>
              <span className="decoration-signal decoration-1 underline-offset-[5px] transition-colors hover:text-signal hover:underline">
                {item}
              </span>
              <span aria-hidden className="text-mute">”{j < g.items.length - 1 ? ',' : ''}</span>
            </li>
          ))}
        </ul>
        <span aria-hidden className="text-mute">]</span>
      </Row>,
    )
    if (gi < skillGroups.length - 1) {
      rows.push(
        <Row key={`${g.key}-gap`} motionRow={motionRows} optional>
          {' '}
        </Row>,
      )
    }
  })

  return (
    <div className="border border-line bg-ink2 font-mono">
      <div className="flex items-center justify-between gap-4 border-b border-line px-3 py-2 text-[0.68rem] uppercase tracking-[0.14em] text-mute sm:px-4">
        <span>
          ~/sheen/<span className="text-paper">stack.toml</span>
        </span>
        <span>{entryCount} entries</span>
      </div>
      <div className="code-lines t-code px-2 py-3 sm:px-4">{rows}</div>
    </div>
  )
}

/* ------------------------------------------------------------------ Stage */

export function SkillsStage() {
  return (
    <div className="frame safe-y grid h-full grid-cols-12 content-center gap-x-6 gap-y-5 lg:content-stretch">
      <div className="col-span-12 flex flex-wrap items-end justify-between gap-x-8 gap-y-2 lg:col-span-4 lg:flex-col lg:flex-nowrap lg:items-start lg:justify-start">
        <p data-skills-intro className="kicker lg:mb-auto">
          03 <span className="text-paper/40">—</span> Stack
        </p>
        <h2 data-skills-intro className="t-display font-display font-extrabold uppercase">
          What’s <br className="hidden lg:block" />
          installed.
        </h2>
        <p data-skills-intro className="t-body hidden max-w-[30ch] text-mute lg:mt-5 lg:block">
          Grouped by where it runs. The comments are mine.
        </p>
      </div>
      <div data-skills-file className="col-span-12 lg:col-span-8 lg:self-center">
        <SkillsFile />
      </div>
    </div>
  )
}

export const registerSkills: RegisterBeat = ({ tl, q, enterAt, exitAt, compact, k }) => {
  const enter = enterAt ?? 0
  tl.fromTo(
    q('[data-skills-intro]'),
    { autoAlpha: 0, y: 40 * k },
    { autoAlpha: 1, y: 0, stagger: 0.06, duration: T },
    enter,
  )
  // The file panel wipes open left-to-right, then its contents type in.
  tl.fromTo(
    q('[data-skills-file]'),
    { clipPath: 'inset(0% 100% 0% 0%)' },
    { clipPath: 'inset(0% 0% 0% 0%)', duration: T, ease: 'power2.inOut' },
    enter + 0.1,
  )
  // Compact mode staggers whole rows (~20 elements) instead of every token (~40).
  tl.fromTo(
    q(compact ? '[data-skill-row]' : '[data-skill]'),
    { autoAlpha: 0, x: compact ? 0 : -8 },
    { autoAlpha: 1, x: 0, duration: 0.1, stagger: { amount: 0.4 } },
    enter + T * 0.6,
  )
  // Last token lands at enter + 0.3 + 0.4 + 0.1.
  const restAt = enter + 0.95

  if (exitAt === null) return restAt
  tl.to(q('[data-skills-file]'), { clipPath: 'inset(0% 0% 100% 0%)', duration: T, ease: 'power2.in' }, exitAt)
  tl.to(q('[data-skills-intro]'), { autoAlpha: 0, y: -40 * k, stagger: 0.04, duration: T * 0.7 }, exitAt)
  return restAt
}

/* ------------------------------------------------------------------- Flow */

export function SkillsFlow({ snap }: FlowProps) {
  const root = useFlowRoot()
  return (
    <FlowSection id="skills" label="Tech stack" snap={snap} className="justify-center gap-5">
      <div>
        <p className="kicker">
          03 <span className="text-paper/40">—</span> Stack
        </p>
        <h2 className="mt-3 font-display text-[clamp(2.4rem,11vw,5rem)] font-extrabold uppercase leading-[0.9]">
          What’s installed.
        </h2>
      </div>
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ root, once: true, amount: 0.15 }}
        variants={fileVariants}
      >
        <SkillsFile motionRows />
      </motion.div>
    </FlowSection>
  )
}
