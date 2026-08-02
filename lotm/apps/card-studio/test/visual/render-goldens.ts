import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { CardPngRenderer } from '../../src/server/render/renderer'
import { CardContentSchema, filenameForCard, type CardContent } from '../../src/domain/schema'

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const workspaceRoot = path.resolve(appRoot, '../..')
const fixturePath = path.join(appRoot, 'test', 'visual', 'fixtures.json')
const outputDir = path.join(workspaceRoot, 'data', 'card-goldens')

async function loadFixtures(): Promise<CardContent[]> {
  const raw = JSON.parse(await readFile(fixturePath, 'utf8')) as unknown
  return CardContentSchema.array().parse(raw)
}

const fixtures = await loadFixtures()
await mkdir(outputDir, { recursive: true })

const renderer = await CardPngRenderer.create(appRoot)
try {
  for (const fixture of fixtures) {
    const filename = `${filenameForCard(fixture)}.png`
    const image = await renderer.render(fixture)
    await writeFile(path.join(outputDir, filename), image)
    console.log(`recorded ${filename}`)
  }
} finally {
  await renderer.close()
}

console.log(`Recorded ${fixtures.length} visual goldens in ${path.relative(workspaceRoot, outputDir)}.`)
