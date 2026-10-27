import { MotionConfig } from 'framer-motion'
import { CustomCursor } from './components/CustomCursor'
import { FlowExperience } from './components/FlowExperience'
import { PinnedExperience } from './components/PinnedExperience'
import { CURSOR_QUERY, useExperienceMode, useMediaQuery } from './lib/media'

export default function App() {
  const { mode, compact } = useExperienceMode()
  const cursor = useMediaQuery(CURSOR_QUERY)

  return (
    <MotionConfig reducedMotion="user">
      {mode === 'pinned' ? (
        <PinnedExperience compact={compact} />
      ) : (
        <FlowExperience key={mode} snap={mode === 'snap'} />
      )}
      {mode === 'pinned' && cursor && <CustomCursor />}
      <div aria-hidden className="grain" />
    </MotionConfig>
  )
}
