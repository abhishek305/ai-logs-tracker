import { createWorkflow } from '@mastra/core/workflows'
import { RawJournalInputSchema, JournalEntrySchema } from '../types/journal.js'
import { classifyStep } from './steps/classify.step.js'
import { expandImpactStep } from './steps/expand-impact.step.js'
import { mapSkillStep } from './steps/map-skill.step.js'

export const journalWorkflow = createWorkflow({
  id: 'journal-workflow',
  inputSchema: RawJournalInputSchema,
  outputSchema: JournalEntrySchema,
})
  .then(classifyStep)
  .then(expandImpactStep)
  .then(mapSkillStep)
  .commit()
