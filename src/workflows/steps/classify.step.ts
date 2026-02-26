import { createStep } from '@mastra/core/workflows'
import {
  RawJournalInputSchema,
  ClassifiedEntrySchema,
  ClassifyStepOutputSchema,
} from '../../types/journal.js'

const CLASSIFY_PROMPT = `You are a senior engineering architect classifying a work journal entry.

Classify the following journal entry text.

Classification rules:

1. category (exactly one of: "Learning", "Productivity", "Discovery"):
   - "Learning" = experimenting, studying, researching
   - "Productivity" = using AI to accelerate delivery
   - "Discovery" = evaluating or sharing new tools

2. areaOfWork:
   Short phrase, max 4 words.
   Examples: Workflow Automation, Agent Architecture, Frontend Architecture, Knowledge Management, Testing Automation

3. aiToolUsed:
   Extract explicitly from text if present. If missing, infer responsibly.

4. taskTopic:
   Concise one-line summary of task.

Return strict JSON only with keys: category, areaOfWork, aiToolUsed, taskTopic`

export const classifyStep = createStep({
  id: 'classify-entry',
  description: 'Classify raw journal text into structured category, area, tool, and topic',
  inputSchema: RawJournalInputSchema,
  outputSchema: ClassifyStepOutputSchema,
  execute: async ({ inputData, mastra }) => {
    const agent = mastra?.getAgent('journal-agent')
    if (!agent) throw new Error('journal-agent not registered')

    const response = await agent.generate(
      `${CLASSIFY_PROMPT}\n\nJournal entry:\n"${inputData.rawText}"`,
      { output: ClassifiedEntrySchema },
    )

    const classified = response.object
    if (!classified) throw new Error('Classification returned empty result')

    return {
      ...classified,
      rawText: inputData.rawText,
      date: inputData.date,
    }
  },
})
