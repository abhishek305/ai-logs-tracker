import { Mastra } from '@mastra/core/mastra'
import { createJournalAgent } from './agents/journal-agent.js'
import { journalWorkflow } from '../workflows/journal-workflow.js'
import type { ModelConfig } from '../config/model.js'

export function createMastraInstance(modelConfig?: Partial<ModelConfig>) {
  const agent = createJournalAgent(modelConfig)

  return new Mastra({
    agents: { 'journal-agent': agent },
    workflows: { journalWorkflow },
  })
}

export const mastra = createMastraInstance()
