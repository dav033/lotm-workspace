import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { CardPngRenderer } from '../src/cards/render'
import { CardContentSchema, filenameForCard, type CardContent } from '../src/cards/schema'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const fixturePath = path.join(projectRoot, 'test-visual', 'fixtures.json')
const outputDir = path.join(projectRoot, 'data', 'card-goldens')

async function loadFixtures(): Promise<CardContent[]> {
  const raw = JSON.parse(await readFile(fixturePath, 'utf8')) as unknown
  return CardContentSchema.array().parse(raw)
}

const fixtures = await loadFixtures()
await mkdir(outputDir, { recursive: true })

const renderer = await CardPngRenderer.create(projectRoot)
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

console.log(`Recorded ${fixtures.length} visual goldens in ${path.relative(projectRoot, outputDir)}.`)
