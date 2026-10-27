import type { RefObject } from 'react'
import type { BeatDefinition } from '../lib/stage'

interface ChapterRailProps {
  beats: BeatDefinition[]
  active: number
  progressRef: RefObject<HTMLDivElement>
  onJump: (index: number) => void
}

/** Pinned-mode chapter nav: named chapters + a thin scrub-progress line. */
export function ChapterRail({ beats, active, progressRef, onJump }: ChapterRailProps) {
  return (
    <nav
      aria-label="Chapters"
      className="fixed top-1/2 z-50 -translate-y-1/2 bg-ink/90 py-2 pl-2"
      style={{ right: 'max(0.75rem, env(safe-area-inset-right))' }}
    >
      <div className="flex items-stretch gap-3">
        <ol>
          {beats.map((b, i) => {
            const current = i === active
            return (
              <li key={b.id}>
                <button
                  type="button"
                  onClick={() => onJump(i)}
                  aria-current={current ? 'step' : undefined}
                  className="press group flex min-h-[40px] w-full items-center justify-end gap-2 font-mono text-[0.68rem] uppercase tracking-[0.12em]"
                >
                  <span
                    aria-hidden
                    className={`h-px bg-signal transition-all duration-300 ${current ? 'w-3' : 'w-0'}`}
                  />
                  <span
                    className={
                      current ? 'text-signal' : 'text-mute transition-colors group-hover:text-paper group-active:text-signal'
                    }
                  >
                    {b.label}
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
        <div aria-hidden className="relative my-3 w-px bg-line">
          <div ref={progressRef} className="absolute inset-0 origin-top bg-signal" style={{ transform: 'scaleY(0)' }} />
        </div>
      </div>
    </nav>
  )
}
