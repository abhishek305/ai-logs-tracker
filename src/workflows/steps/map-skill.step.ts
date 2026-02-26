import { createStep } from '@mastra/core/workflows'
import { SKILL_TAXONOMY } from '../../types/journal.js'
import {
  ExpandStepOutputSchema,
  SkillMappingSchema,
  JournalEntrySchema,
} from '../../types/journal.js'

const skillList = SKILL_TAXONOMY.join('\n- ')

const MAP_SKILL_PROMPT = `You are classifying engineering growth areas.

Map this entry to EXACTLY ONE skill from this taxonomy:
- ${skillList}

Rules:
- Choose the most dominant skill.
- Do not invent new skills.
- Return strict JSON only.

Return JSON with key: skillUpskilled`

export const mapSkillStep = createStep({
  id: 'map-skill',
  description: 'Map the journal entry to a single skill from the predefined taxonomy',
  inputSchema: ExpandStepOutputSchema,
  outputSchema: JournalEntrySchema,
  execute: async ({ inputData, mastra }) => {
    const agent = mastra?.getAgent('journal-agent')
    if (!agent) throw new Error('journal-agent not registered')

    const context = [
      `Category: ${inputData.category}`,
      `Area of Work: ${inputData.areaOfWork}`,
      `AI Tool Used: ${inputData.aiToolUsed}`,
      `Task Topic: ${inputData.taskTopic}`,
      `What I Did: ${inputData.whatIDid}`,
      `Outcome/Impact: ${inputData.outcomeImpact}`,
    ].join('\n')

    const response = await agent.generate(
      `${MAP_SKILL_PROMPT}\n\nEntry details:\n${context}`,
      { output: SkillMappingSchema },
    )

    const mapped = response.object
    if (!mapped) throw new Error('Skill mapping returned empty result')

    return {
      ...inputData,
      ...mapped,
    }
  },
})
