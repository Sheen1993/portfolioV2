import { useMasterScrollTimeline } from '../hooks/useMasterScrollTimeline'
import { beats } from './beats'
import { ChapterRail } from './ChapterRail'

/**
 * Desktop/tablet-with-mouse path. The track is just scroll distance; the stage
 * is pinned over it and every beat is a layer the master timeline swaps in place.
 */
export function PinnedExperience({ compact }: { compact: boolean }) {
  const { trackRef, stageRef, progressRef, active, total, jumpTo } = useMasterScrollTimeline({ beats, compact })

  return (
    <>
      {/* Rail first: it's the keyboard route between beats (see the hook). */}
      <ChapterRail beats={beats} active={active} progressRef={progressRef} onJump={jumpTo} />
      <main ref={trackRef} className="relative" style={{ height: `calc(${total + 1} * 100dvh)` }}>
        <div ref={stageRef} className="pinned-stage relative h-dvh w-full overflow-hidden">
          {beats.map((b) => (
            <section key={b.id} data-beat={b.id} aria-label={b.label} className="stage-layer">
              <b.Stage compact={compact} />
            </section>
          ))}
        </div>
      </main>
    </>
  )
}
