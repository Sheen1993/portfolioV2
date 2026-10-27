import type { BeatDefinition } from '../../lib/stage'
import { AboutFlow, AboutStage, registerAbout } from './About'
import { ContactFlow, ContactStage, registerContact } from './Contact'
import { EducationFlow, EducationStage, registerEducation } from './Education'
import { HeroFlow, HeroStage, registerHero } from './Hero'
import { HighlightsFlow, HighlightsStage, registerHighlights } from './Highlights'
import { SkillsFlow, SkillsStage, registerSkills } from './Skills'
import { TimelineFlow, TimelineStage, registerTimeline } from './Timeline'

/**
 * Order + scroll budget for the whole piece. Weight is in viewport-heights of
 * scrolling on the desktop track; the work timeline gets the most room.
 */
export const beats: BeatDefinition[] = [
  { id: 'hero', label: 'Intro', weight: 1, Stage: HeroStage, Flow: HeroFlow, register: registerHero },
  { id: 'about', label: 'About', weight: 1.8, Stage: AboutStage, Flow: AboutFlow, register: registerAbout },
  { id: 'skills', label: 'Stack', weight: 1.6, Stage: SkillsStage, Flow: SkillsFlow, register: registerSkills },
  { id: 'timeline', label: 'Work', weight: 3.4, Stage: TimelineStage, Flow: TimelineFlow, register: registerTimeline },
  { id: 'highlights', label: 'Impact', weight: 2.2, Stage: HighlightsStage, Flow: HighlightsFlow, register: registerHighlights },
  { id: 'education', label: 'Education', weight: 1.3, Stage: EducationStage, Flow: EducationFlow, register: registerEducation },
  { id: 'contact', label: 'Contact', weight: 1, Stage: ContactStage, Flow: ContactFlow, register: registerContact },
]
