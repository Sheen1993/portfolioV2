import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ArrowDown } from 'lucide-react'
import { profile } from '../../content'
import { T, type FlowProps, type RegisterBeat } from '../../lib/stage'
import { FlowSection } from '../FlowSection'
import { Reveal } from '../Reveal'

const lines = [profile.firstName, profile.middleName, profile.lastName]

function CebuTime() {
  const fmt = () =>
    new Intl.DateTimeFormat('en-GB', {
      timeZone: profile.timeZone,
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date())
  const [time, setTime] = useState(fmt)
  useEffect(() => {
    const id = window.setInterval(() => setTime(fmt()), 20_000)
    return () => window.clearInterval(id)
  }, [])
  return <time>{time}</time>
}

function TopBar() {
  return (
    <header data-hero-top className="flex items-start justify-between gap-4 whitespace-nowrap">
      <p className="kicker">
        Portfolio
        <span className="hidden sm:inline">
          {' '}
          <span className="text-paper/40">/</span> {new Date().getFullYear()}
        </span>
      </p>
      <p className="kicker text-right">
        {profile.city.split(' ')[0]}
        <span className="hidden sm:inline"> {profile.city.split(' ').slice(1).join(' ')}</span>{' '}
        <span className="text-paper">·</span> <CebuTime /> PHT
      </p>
    </header>
  )
}

function Meta() {
  return (
    <>
      <p className="font-display text-[clamp(1.5rem,2.4vw,2.4rem)] font-extrabold uppercase leading-none">
        {profile.role}
      </p>
      <p className="mt-2 text-paper/90">
        {profile.city}, {profile.country}
      </p>
      <p className="t-body mt-5 max-w-[30ch] text-mute">{profile.oneLiner}</p>
    </>
  )
}

const lineClass = (i: number) =>
  // Middle name sits indented and quieter — it's the one nobody uses.
  i === 1 ? 'pl-[9vw] text-mute' : ''

/* ------------------------------------------------------------------ Stage */

export function HeroStage({ compact }: { compact: boolean }) {
  const ref = useRef<HTMLDivElement>(null)

  // Name reveal on load: per-character stagger, independent of scroll.
  useGSAP(
    () => {
      gsap.from('.hero-char', {
        yPercent: 118,
        duration: compact ? 0.8 : 1.1,
        ease: 'expo.out',
        stagger: 0.035,
        delay: 0.15,
      })
      gsap.from('[data-hero-meta] > *, [data-hero-cue]', {
        autoAlpha: 0,
        y: 14,
        stagger: 0.07,
        delay: 0.75,
        duration: 0.6,
        ease: 'power2.out',
      })
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className="frame safe-y flex h-full flex-col">
      <TopBar />
      <div className="mt-auto grid grid-cols-12 items-end gap-x-6">
        <h1
          aria-label={profile.fullName}
          className="t-name col-span-12 font-display font-extrabold uppercase tracking-[-0.005em] lg:col-span-9"
        >
          {lines.map((line, i) => (
            <span key={line} aria-hidden className={`mask ${lineClass(i)}`}>
              <span data-hero-line className="block">
                {line.split('').map((ch, j) => (
                  <span key={j} className="hero-char inline-block">
                    {ch}
                  </span>
                ))}
                {i === 2 && <span className="hero-char inline-block text-signal">.</span>}
              </span>
            </span>
          ))}
        </h1>
        <div
          data-hero-meta
          className="col-span-12 mt-8 md:col-span-6 md:col-start-7 lg:col-span-3 lg:mt-0 lg:pb-[1.4vw]"
        >
          <Meta />
        </div>
      </div>
      <div data-hero-cue className="kicker mt-[clamp(1rem,4dvh,3rem)] flex items-center gap-3">
        <span className="h-px w-10 bg-mute" />
        Scroll — it’s all one scene
        <ArrowDown aria-hidden className="animate-cue h-4 w-4 text-signal" />
      </div>
    </div>
  )
}

export const registerHero: RegisterBeat = ({ tl, q, exitAt, k }) => {
  // Cue leaves the moment scrolling starts; the name drifts up a touch.
  tl.to(q('[data-hero-cue]'), { autoAlpha: 0, y: 12, duration: 0.12 }, 0.02)
  tl.to(q('h1'), { y: -30 * k, duration: exitAt ?? 0.5 }, 0)
  if (exitAt === null) return
  // Exit: each name line slides up out of its mask, top line first.
  tl.to(q('[data-hero-line]'), { yPercent: -112, stagger: 0.07, duration: T - 0.14, ease: 'power2.in' }, exitAt)
  tl.to(q('[data-hero-meta]'), { autoAlpha: 0, x: 48 * k, duration: T * 0.7 }, exitAt)
  tl.to(q('[data-hero-top]'), { autoAlpha: 0, duration: T * 0.5 }, exitAt)
}

/* ------------------------------------------------------------------- Flow */

export function HeroFlow({ snap }: FlowProps) {
  return (
    <FlowSection id="hero" label="Introduction" snap={snap} className={snap ? '' : 'min-h-svh'}>
      <TopBar />
      <div className="mt-auto grid grid-cols-12 items-end gap-x-6 pt-10">
        <h1
          aria-label={profile.fullName}
          className="col-span-12 font-display text-[clamp(3.6rem,min(22vw,16svh),12rem)] font-extrabold uppercase leading-[0.84] md:text-[clamp(3.4rem,min(18vw,20svh),19rem)] lg:col-span-9"
        >
          {lines.map((line, i) => (
            <span key={line} aria-hidden className={`mask ${lineClass(i)}`}>
              <Reveal as="span" className="block" delay={0.08 * i}>
                {line}
                {i === 2 && <span className="text-signal">.</span>}
              </Reveal>
            </span>
          ))}
        </h1>
        <Reveal delay={0.3} className="col-span-12 mt-7 md:col-span-6 md:col-start-7 lg:col-span-3 lg:mt-0 lg:pb-[1.4vw]">
          <Meta />
        </Reveal>
      </div>
      <p className="kicker mt-[clamp(1.25rem,5svh,3rem)] flex items-center gap-3">
        <span className="h-px w-8 bg-mute" />
        {snap ? 'Swipe up' : 'Scroll'}
        <ArrowDown aria-hidden className="animate-cue h-4 w-4 text-signal" />
      </p>
    </FlowSection>
  )
}
