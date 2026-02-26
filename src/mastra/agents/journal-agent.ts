import { Agent } from '@mastra/core/agent'
import { resolveModel, type ModelConfig } from '../../config/model.js'

const SYSTEM_PROMPT = `You are a structured data extraction engine for an engineering work journal.
Your sole purpose is to analyze raw journal text and return structured JSON data.

Rules:
- Always return valid JSON only.
- No markdown formatting.
- No explanations or commentary.
- No wrapping in code blocks.
- Be concise and precise.`

export function createJournalAgent(config?: Partial<ModelConfig>) {
  return new Agent({
    name: 'journal-agent',
    model: resolveModel(config),
    instructions: SYSTEM_PROMPT,
  })
}

export const journalAgent = createJournalAgent()
