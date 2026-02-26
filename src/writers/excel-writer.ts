import ExcelJS from 'exceljs'
import fs from 'node:fs'
import path from 'node:path'
import { CONFIG } from '../config/index.js'
import type { JournalEntry } from '../types/journal.js'

const COLUMNS: Partial<ExcelJS.Column>[] = [
  { header: 'Date', key: 'date', width: 14 },
  { header: 'Category', key: 'category', width: 16 },
  { header: 'Area of Work', key: 'areaOfWork', width: 24 },
  { header: 'AI Tool Used', key: 'aiToolUsed', width: 20 },
  { header: 'Task Topic', key: 'taskTopic', width: 32 },
  { header: 'What I Did', key: 'whatIDid', width: 50 },
  { header: 'Outcome / Impact', key: 'outcomeImpact', width: 50 },
  { header: 'Skill Upskilled', key: 'skillUpskilled', width: 28 },
]

async function ensureDirectory(dirPath: string): Promise<void> {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

async function getOrCreateWorkbook(filePath: string): Promise<{ workbook: ExcelJS.Workbook; worksheet: ExcelJS.Worksheet }> {
  const workbook = new ExcelJS.Workbook()

  if (fs.existsSync(filePath)) {
    await workbook.xlsx.readFile(filePath)
    const worksheet = workbook.getWorksheet('Journal') ?? workbook.addWorksheet('Journal')
    return { workbook, worksheet }
  }

  const worksheet = workbook.addWorksheet('Journal')
  worksheet.columns = COLUMNS

  const headerRow = worksheet.getRow(1)
  headerRow.font = { bold: true }
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' }

  return { workbook, worksheet }
}

export async function appendJournalEntry(entry: JournalEntry): Promise<string> {
  await ensureDirectory(CONFIG.outputDir)

  const filePath = CONFIG.excelFilePath
  const { workbook, worksheet } = await getOrCreateWorkbook(filePath)

  worksheet.addRow({
    date: entry.date,
    category: entry.category,
    areaOfWork: entry.areaOfWork,
    aiToolUsed: entry.aiToolUsed,
    taskTopic: entry.taskTopic,
    whatIDid: entry.whatIDid,
    outcomeImpact: entry.outcomeImpact,
    skillUpskilled: entry.skillUpskilled,
  })

  await workbook.xlsx.writeFile(filePath)
  return filePath
}
