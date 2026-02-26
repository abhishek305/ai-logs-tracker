import { openai } from '@ai-sdk/openai'
import { createOllama } from 'ollama-ai-provider'
import type { LanguageModelV1 } from 'ai'

export type ModelProvider = 'openai' | 'ollama'

export interface ModelConfig {
  provider: ModelProvider
  model: string
}

const DEFAULTS: Record<ModelProvider, string> = {
  openai: 'gpt-4o-mini',
  ollama: 'llama3.2',
}

export function resolveModel(config?: Partial<ModelConfig>): LanguageModelV1 {
  const provider = config?.provider ?? (process.env.MODEL_PROVIDER as ModelProvider) ?? 'openai'
  const modelId = config?.model ?? process.env.MODEL_NAME ?? DEFAULTS[provider] ?? DEFAULTS.openai

  switch (provider) {
    case 'ollama': {
      const baseURL = process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434/api'
      const ollamaProvider = createOllama({ baseURL })
      return ollamaProvider(modelId) as LanguageModelV1
    }
    case 'openai':
    default:
      return openai(modelId) as LanguageModelV1
  }
}
