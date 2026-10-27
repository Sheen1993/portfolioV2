import type { ComponentType } from 'react'

/**
 * Timeline units: 1 unit = one viewport-height of scrolling through the track.
 * T is the length of a beat-to-beat handoff. Neighbouring handoffs overlap by
 * T/2, so there is never a frame where the stage is empty.
 */
export const T = 0.5

export interface StageContext {
  tl: gsap.core.Timeline
  /** The beat's layer inside the pinned stage. */
  root: HTMLElement
  /** Scoped querySelectorAll for the beat's layer. */
  q: (selector: string) => HTMLElement[]
  /** Start of this beat's entrance, or null for the first beat (already on screen). */
  enterAt: number | null
  /** When the beat is fully settled. Also where its timeline label sits. */
  settleAt: number
  /** Start of this beat's exit, or null for the last beat. */
  exitAt: number | null
  /** Tablet-width pinned mode: shorter distances, fewer moving parts. */
  compact: boolean
  /** Distance multiplier: 1 on desktop, smaller in compact mode. */
  k: number
}

/**
 * Adds the beat's tweens to the master timeline. Returns the time at which the
 * beat is fully on screen (every entrance/reveal finished, exit not started);
 * chapter navigation lands there. Defaults to `settleAt`.
 */
export type RegisterBeat = (ctx: StageContext) => number | void

export interface FlowProps {
  /** Static mode (reduced motion) doesn't snap and never needs full-height beats. */
  snap: boolean
}

export interface BeatDefinition {
  id: string
  /** Short chapter name for the progress indicator. */
  label: string
  /** Scroll distance on the desktop track, in viewport heights. */
  weight: number
  /** Pinned-stage render: absolutely layered, animated by `register`. */
  Stage: ComponentType<{ compact: boolean }>
  /** Snap-carousel / reduced-motion render. */
  Flow: ComponentType<FlowProps>
  register: RegisterBeat
}
