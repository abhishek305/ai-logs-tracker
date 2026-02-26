import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, '..', '..')

export const CONFIG = {
  outputDir: path.join(PROJECT_ROOT, 'output'),
  excelFileName: 'journal.xlsx',
  get excelFilePath() {
    return path.join(this.outputDir, this.excelFileName)
  },
} as const

export { SKILL_TAXONOMY, CATEGORY_VALUES } from '../types/journal.js'
