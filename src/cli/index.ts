#!/usr/bin/env node

import 'dotenv/config'
import { Command } from 'commander'
import { createMastraInstance } from '../mastra/index.js'
import { appendJournalEntry } from '../writers/excel-writer.js'
import type { JournalEntry } from '../types/journal.js'
import type { ModelProvider } from '../config/model.js'

const program = new Command()

program
  .name('journal')
  .description('AI-powered work journal — classify, expand impact, and map skills')
  .version('1.0.0')

interface LogOptions {
  date: string
  provider?: ModelProvider
  model?: string
}

program
  .command('log')
  .description('Log a new journal entry')
  .argument('<text>', 'Raw journal entry text (wrap in quotes)')
  .option('-d, --date <date>', 'Entry date (YYYY-MM-DD)')
  .option('-p, --provider <provider>', 'Model provider: openai or ollama')
  .option('-m, --model <model>', 'Model name (e.g. gpt-4o-mini, llama3.2, mistral)')
  .action(async (text: string, options: LogOptions) => {
    const date = options.date ?? new Date().toISOString().split('T')[0]
    const provider = options.provider
    const model = options.model

    const mastra = createMastraInstance({ provider, model })
    const providerLabel = provider ?? process.env.MODEL_PROVIDER ?? 'openai'
    const modelLabel = model ?? process.env.MODEL_NAME ?? (providerLabel === 'ollama' ? 'llama3.2' : 'gpt-4o-mini')

    console.log(`\n Processing journal entry with ${providerLabel}/${modelLabel}...\n`)

    try {
      const workflow = mastra.getWorkflow('journalWorkflow')
      const run = await workflow.createRunAsync()

      const result = await run.start({
        inputData: {
          rawText: text,
          date,
        },
      })

      if (result.status === 'success') {
        const entry = result.result as JournalEntry

        console.log(' Classification')
        console.log(`   Category:       ${entry.category}`)
        console.log(`   Area of Work:   ${entry.areaOfWork}`)
        console.log(`   AI Tool Used:   ${entry.aiToolUsed}`)
        console.log(`   Task Topic:     ${entry.taskTopic}`)
        console.log()
        console.log(' Impact')
        console.log(`   What I Did:     ${entry.whatIDid}`)
        console.log(`   Impact:         ${entry.outcomeImpact}`)
        console.log()
        console.log(' Skill')
        console.log(`   Upskilled:      ${entry.skillUpskilled}`)
        console.log()

        const filePath = await appendJournalEntry(entry)
        console.log(` Saved to: ${filePath}\n`)
      } else if (result.status === 'failed') {
        const err = result.error
        const errorMsg = err instanceof Error ? err.message : String(err)
        const firstLine = errorMsg.split('\n')[0]
        console.error(' Workflow failed:', firstLine)
        process.exit(1)
      } else {
        console.error(` Workflow ended with status: ${result.status}`)
        process.exit(1)
      }
    } catch (error) {
      console.error(' Error:', error instanceof Error ? error.message : error)
      process.exit(1)
    }
  })

program.parse()
