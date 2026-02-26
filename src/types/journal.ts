import { z } from 'zod'

export const SKILL_TAXONOMY = [
  'Agentic System Design',
  'Workflow Engineering',
  'Prompt Engineering',
  'AI Tool Evaluation',
  'Knowledge Management',
  'Productivity Optimization',
  'Frontend Architecture',
  'Backend Architecture',
  'Testing Automation',
  'Developer Experience',
] as const

export const CATEGORY_VALUES = [
  'Learning',
  'Productivity',
  'Discovery',
] as const

export const RawJournalInputSchema = z.object({
  rawText: z.string().min(1),
  date: z.string(),
})

export type RawJournalInput = z.infer<typeof RawJournalInputSchema>

export const ClassifiedEntrySchema = z.object({
  category: z.enum(CATEGORY_VALUES),
  areaOfWork: z.string(),
  aiToolUsed: z.string(),
  taskTopic: z.string(),
})

export type ClassifiedEntry = z.infer<typeof ClassifiedEntrySchema>

export const ClassifyStepOutputSchema = ClassifiedEntrySchema.extend({
  rawText: z.string(),
  date: z.string(),
})

export type ClassifyStepOutput = z.infer<typeof ClassifyStepOutputSchema>

export const ExpandedEntrySchema = z.object({
  whatIDid: z.string(),
  outcomeImpact: z.string(),
})

export type ExpandedEntry = z.infer<typeof ExpandedEntrySchema>

export const ExpandStepOutputSchema = ClassifyStepOutputSchema.extend({
  whatIDid: z.string(),
  outcomeImpact: z.string(),
})

export type ExpandStepOutput = z.infer<typeof ExpandStepOutputSchema>

export const SkillMappingSchema = z.object({
  skillUpskilled: z.enum(SKILL_TAXONOMY),
})

export type SkillMapping = z.infer<typeof SkillMappingSchema>

export const JournalEntrySchema = z.object({
  date: z.string(),
  rawText: z.string(),
  category: z.enum(CATEGORY_VALUES),
  areaOfWork: z.string(),
  aiToolUsed: z.string(),
  taskTopic: z.string(),
  whatIDid: z.string(),
  outcomeImpact: z.string(),
  skillUpskilled: z.enum(SKILL_TAXONOMY),
})

export type JournalEntry = z.infer<typeof JournalEntrySchema>
