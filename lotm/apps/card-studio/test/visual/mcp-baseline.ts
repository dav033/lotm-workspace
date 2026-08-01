import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const scratchDir = await mkdtemp(path.join(os.tmpdir(), 'lotm-mcp-baseline-'))
const dbPath = path.join(scratchDir, 'cards.db')
const transport = new StdioClientTransport({
  command: process.execPath,
  args: ['--import', 'tsx', 'mcp/cards-stdio.ts'],
  cwd: projectRoot,
  env: { ...process.env, CARDS_DB_PATH: dbPath, CARDS_LIVE_VIEW_URL: '' },
  stderr: 'pipe',
})
const client = new Client({ name: 'lotm-mcp-baseline', version: '1.0.0' })

try {
  await client.connect(transport)
  const tools = await client.listTools()
  const saved = await client.callTool({
    name: 'save_card_batch',
    arguments: {
      universe: { name: 'Baseline Scratch' },
      part: { name: 'Smoke' },
      cards: [{ type: 'Cover', title: 'Baseline Scratch', partNumber: '1' }],
    },
  })
  const library = await client.callTool({
    name: 'list_card_library',
    arguments: { universe: 'baseline-scratch', includeContent: true },
  })
  const exported = await client.callTool({
    name: 'export_cards_zip',
    arguments: { universe: 'baseline-scratch', filename: 'baseline-scratch.zip' },
  })
  const report = {
    tools: tools.tools.map(({ name, title, description, inputSchema }) => ({ name, title, description, inputSchema })),
    smoke: {
      save_card_batch: summarizeResult(saved),
      list_card_library: summarizeResult(library),
      export_cards_zip: summarizeResult(exported),
    },
  }
  await mkdir(path.join(projectRoot, 'docs'), { recursive: true })
  await writeFile(path.join(projectRoot, 'docs', 'mcp-surface-2026-08.json'), `${JSON.stringify(report, null, 2)}\n`)
  console.log(JSON.stringify({
    toolNames: tools.tools.map(({ name }) => name),
    smoke: Object.fromEntries(Object.entries(report.smoke).map(([name, result]) => [name, {
      isError: result.isError,
      contentTypes: result.contentTypes,
      text: result.text,
    }])),
  }, null, 2))
} finally {
  await client.close().catch(() => undefined)
  await rm(scratchDir, { recursive: true, force: true })
}

function summarizeResult(result: unknown) {
  const value = result as { isError?: boolean; content?: Array<{ type: string; text?: string }> }
  const text = value.content?.find((item) => item.type === 'text')?.text ?? null
  let parsed: unknown = null
  try { parsed = text ? JSON.parse(text) : null } catch { /* keep raw text for non-JSON errors */ }
  return {
    isError: value.isError ?? false,
    contentTypes: value.content?.map(({ type }) => type) ?? [],
    ...(isRecord(parsed) && 'saved' in parsed ? { saved: parsed.saved } : {}),
    ...(isRecord(parsed) && 'universes' in parsed && Array.isArray(parsed.universes)
      ? { universeCount: parsed.universes.length }
      : {}),
    ...(isRecord(parsed) && 'cardCount' in parsed ? { cardCount: parsed.cardCount } : {}),
    ...(parsed === null ? { text } : {}),
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}
