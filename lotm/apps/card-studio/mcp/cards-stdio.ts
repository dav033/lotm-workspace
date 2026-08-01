import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { CardRepository } from '../src/cards/repository'
import { createCardsMcpServer } from '../src/cards/mcp'

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const workspaceRoot = path.resolve(appRoot, '../..')
for (const envFile of [path.join(appRoot, '.env'), path.join(workspaceRoot, '.env')]) {
  try {
    process.loadEnvFile(envFile)
    break
  } catch { /* .env is optional */ }
}

const repository = new CardRepository()
const liveViewUrl = process.env.CARDS_LIVE_VIEW_URL || 'http://localhost:3002/cartas/vivo'
const server = createCardsMcpServer({ repository, liveViewUrl })

async function shutdown() {
  await server.close()
  repository.close()
}

process.once('SIGINT', () => void shutdown().finally(() => process.exit(0)))
process.once('SIGTERM', () => void shutdown().finally(() => process.exit(0)))

try {
  await server.connect(new StdioServerTransport())
} catch (error) {
  console.error('[cards-mcp:stdio]', error)
  repository.close()
  process.exit(1)
}
