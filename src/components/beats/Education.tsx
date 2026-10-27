import { education } from '../../content'
import { T, type FlowProps, type RegisterBeat } from '../../lib/stage'
import { FlowSection } from '../FlowSection'
import { Reveal } from '../Reveal'

// "Bachelor of Science" / "in Information Technology"
const [degreeA, degreeB] = education.degree.split(' in ')

/* ------------------------------------------------------------------ Stage */
// Restrained on purpose: no card, no chrome, pushed right of centre.

export function EducationStage() {
  return (
    <div className="frame safe-y grid h-full grid-cols-12 content-center gap-x-6 gap-y-6">
      <p data-edu className="kicker col-span-12 lg:col-span-3 lg:col-start-2 lg:pt-3">
        06 <span className="text-paper/40">—</span> Education
      </p>
      <div className="col-span-12 lg:col-span-7 lg:col-start-5">
        <p className="t-title font-display font-extrabold uppercase">
          <span className="mask">
            <span data-edu-line className="block">
              {degreeA}
            </span>
          </span>
          <span className="mask">
            <span data-edu-line className="block text-mute">
              in {degreeB}
            </span>
          </span>
        </p>
        <p data-edu className="mt-6 text-lg">
          {education.school}
        </p>
        <p data-edu className="kicker mt-1">
          {education.place}
        </p>
        <p data-edu className="t-body mt-[clamp(1.5rem,6dvh,3.5rem)] max-w-[42ch] italic text-mute">
          {education.aside}
        </p>
      </div>
    </div>
  )
}

export const registerEducation: RegisterBeat = ({ tl, q, enterAt, exitAt, k }) => {
  const enter = enterAt ?? 0
  tl.fromTo(q('[data-edu-line]'), { yPercent: 110 }, { yPercent: 0, stagger: 0.08, duration: T, ease: 'power2.out' }, enter)
  tl.fromTo(q('[data-edu]'), { autoAlpha: 0, y: 16 * k }, { autoAlpha: 1, y: 0, stagger: 0.05, duration: T * 0.8 }, enter + 0.1)
  const restAt = enter + 0.75
  if (exitAt === null) return restAt
  tl.to(q('[data-edu-line]'), { yPercent: -110, stagger: 0.05, duration: T * 0.8, ease: 'power2.in' }, exitAt)
  tl.to(q('[data-edu]'), { autoAlpha: 0, duration: T * 0.6 }, exitAt)
  return restAt
}

/* ------------------------------------------------------------------- Flow */

export function EducationFlow({ snap }: FlowProps) {
  return (
    <FlowSection id="education" label="Education" snap={snap} className="justify-center gap-6">
      <p className="kicker">
        06 <span className="text-paper/40">—</span> Education
      </p>
      <Reveal className="md:ml-[25%]">
        <p className="font-display text-[clamp(1.9rem,9vw,3.6rem)] font-extrabold uppercase leading-[0.95]">
          {degreeA} <span className="block text-mute">in {degreeB}</span>
        </p>
        <p className="mt-5 text-lg">{education.school}</p>
        <p className="kicker mt-1">{education.place}</p>
        <p className="mt-8 max-w-[40ch] italic text-mute">{education.aside}</p>
      </Reveal>
    </FlowSection>
  )
}
