import { createStep } from '@mastra/core/workflows'
import {
  ClassifyStepOutputSchema,
  ExpandedEntrySchema,
  ExpandStepOutputSchema,
} from '../../types/journal.js'

const EXPAND_PROMPT = `You are a Senior Engineering Manager writing performance review documentation.

Expand this structured journal entry into:

1. whatIDid:
   - Clear technical explanation
   - 2-4 sentences
   - Concrete actions taken

2. outcomeImpact:
   - Business or engineering measurable impact
   - Focus on time saved, complexity reduced, scalability improved, clarity increased
   - Avoid generic phrases like "helped a lot"

Tone: Concise, structured, professional, promotion-ready.

Return JSON only with keys: whatIDid, outcomeImpact`

export const expandImpactStep = createStep({
  id: 'expand-impact',
  description: 'Expand classified entry into promotion-ready impact statements',
  inputSchema: ClassifyStepOutputSchema,
  outputSchema: ExpandStepOutputSchema,
  execute: async ({ inputData, mastra }) => {
    const agent = mastra?.getAgent('journal-agent')
    if (!agent) throw new Error('journal-agent not registered')

    const context = [
      `Category: ${inputData.category}`,
      `Area of Work: ${inputData.areaOfWork}`,
      `AI Tool Used: ${inputData.aiToolUsed}`,
      `Task Topic: ${inputData.taskTopic}`,
      `Original Entry: "${inputData.rawText}"`,
    ].join('\n')

    const response = await agent.generate(
      `${EXPAND_PROMPT}\n\nEntry details:\n${context}`,
      { output: ExpandedEntrySchema },
    )

    const expanded = response.object
    if (!expanded) throw new Error('Impact expansion returned empty result')

    return {
      ...inputData,
      ...expanded,
    }
  },
})
