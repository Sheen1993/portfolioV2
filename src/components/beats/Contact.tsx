import { ArrowUp, ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'
import { contact, profile } from '../../content'
import { T, type FlowProps, type RegisterBeat } from '../../lib/stage'
import { useNav } from '../context'
import { FlowSection } from '../FlowSection'
import { Magnetic } from '../Magnetic'
import { Reveal } from '../Reveal'

const linkClass =
  'press group inline-flex min-h-[44px] items-center gap-3 hover:text-signal active:text-signal'

function Details() {
  return (
    <ul className="space-y-1">
      <li>
        <Magnetic strength={0.2}>
          <a href={`mailto:${profile.email}`} className={`${linkClass} max-w-full text-[clamp(1.05rem,1.45vw,1.4rem)]`}>
            <Mail aria-hidden className="h-5 w-5 shrink-0 text-signal" />
            <span className="break-all">{profile.email}</span>
            <ArrowUpRight
              aria-hidden
              className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
        </Magnetic>
      </li>
      <li>
        <Magnetic strength={0.2}>
          <a href={profile.phone.href} className={`${linkClass} text-[clamp(1rem,1.2vw,1.15rem)]`}>
            <Phone aria-hidden className="h-5 w-5 shrink-0 text-signal" />
            {profile.phone.display}
          </a>
        </Magnetic>
      </li>
      <li className="inline-flex min-h-[44px] items-center gap-3 text-mute">
        <MapPin aria-hidden className="h-5 w-5 shrink-0" />
        {profile.city}, {profile.country}
      </li>
    </ul>
  )
}

function Footer({ stage }: { stage?: boolean }) {
  const { toTop } = useNav()
  return (
    <footer
      {...(stage ? { 'data-ct-foot': '' } : {})}
      className="kicker flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-line pt-3"
    >
      <span>
        © {new Date().getFullYear()} {profile.fullName}
      </span>
      <Magnetic strength={0.3}>
        <button type="button" onClick={toTop} className={`${linkClass} gap-2 uppercase`}>
          Back to the top <ArrowUp aria-hidden className="h-4 w-4" />
        </button>
      </Magnetic>
    </footer>
  )
}

/* ------------------------------------------------------------------ Stage */

export function ContactStage() {
  return (
    <div className="frame safe-y flex h-full flex-col">
      <p data-ct-intro className="kicker">
        07 <span className="text-paper/40">—</span> Contact
      </p>
      <div className="my-auto grid grid-cols-12 items-end gap-x-6 gap-y-8">
        <h2 className="col-span-12 font-display text-[clamp(3rem,min(8.6vw,16dvh),11rem)] font-extrabold uppercase leading-[0.86] lg:col-span-8">
          <span className="mask pl-[9.6vw]">
            <span data-ct-line className="block">
              {contact.heading[0]}
            </span>
          </span>
          <span className="mask">
            <span data-ct-line className="block">
              {contact.heading[1]}
            </span>
          </span>
          <span className="mask pl-[9vw]">
            <span data-ct-line className="block">
              <span className="text-signal">{contact.heading[2]}</span>
            </span>
          </span>
        </h2>
        <div data-ct-details className="col-span-12 space-y-5 md:col-span-8 lg:col-span-4">
          <p className="t-body max-w-[38ch] text-paper/80">{contact.body}</p>
          <Details />
        </div>
      </div>
      <Footer stage />
    </div>
  )
}

export const registerContact: RegisterBeat = ({ tl, q, enterAt, k }) => {
  const enter = enterAt ?? 0
  tl.fromTo(q('[data-ct-intro]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: T * 0.6 }, enter)
  // Heading lines sweep in from the left, not up: the last beat moves differently.
  tl.fromTo(
    q('[data-ct-line]'),
    { xPercent: -40 * k, autoAlpha: 0 },
    { xPercent: 0, autoAlpha: 1, stagger: 0.1, duration: T, ease: 'power3.out' },
    // Wait for Education's lines to clear before the heading sweeps in.
    enter + 0.2,
  )
  tl.fromTo(q('[data-ct-details]'), { autoAlpha: 0, y: 30 * k }, { autoAlpha: 1, y: 0, duration: T }, enter + 0.2)
  tl.fromTo(q('[data-ct-foot]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: T * 0.6 }, enter + 0.35)
  // Heading lines finish at enter + 0.2 + 0.1 + T.
  return enter + 0.9
}

/* ------------------------------------------------------------------- Flow */

export function ContactFlow({ snap }: FlowProps) {
  return (
    <FlowSection id="contact" label="Contact" snap={snap} className="gap-8">
      <p className="kicker">
        07 <span className="text-paper/40">—</span> Contact
      </p>
      <div className="my-auto space-y-8">
        <Reveal as="h2" from="left" className="font-display text-[clamp(3rem,15vw,8rem)] font-extrabold uppercase leading-[0.86]">
          <span className="block md:pl-[7vw]">{contact.heading[0]}</span>
          <span className="block">
            {contact.heading[1].replace(/one\.$/, '')}
            <span className="text-signal">one.</span>
          </span>
        </Reveal>
        <Reveal delay={0.15} className="space-y-5 md:ml-auto md:max-w-[34rem]">
          <p className="max-w-[38ch] text-paper/80">{contact.body}</p>
          <Details />
        </Reveal>
      </div>
      <Footer />
    </FlowSection>
  )
}
