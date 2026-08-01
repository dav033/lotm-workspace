import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'
import { CardPngRenderer } from '../../src/cards/render'
import { CardContentSchema, filenameForCard, type CardContent } from '../../src/cards/schema'

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const workspaceRoot = path.resolve(appRoot, '../..')
const fixturePath = path.join(appRoot, 'test', 'visual', 'fixtures.json')
const goldenDir = path.join(workspaceRoot, 'data', 'card-goldens')
const MAX_DIFFERING_PIXELS = 0.005

function decodePng(buffer: Buffer): PNG {
  return PNG.sync.read(buffer)
}

async function loadFixtures(): Promise<CardContent[]> {
  const raw = JSON.parse(await readFile(fixturePath, 'utf8')) as unknown
  return CardContentSchema.array().parse(raw)
}

const fixtures = await loadFixtures()
const renderer = await CardPngRenderer.create(appRoot)
const failures: string[] = []

try {
  for (const fixture of fixtures) {
    const filename = `${filenameForCard(fixture)}.png`
    const expected = decodePng(await readFile(path.join(goldenDir, filename)))
    const actual = decodePng(await renderer.render(fixture))

    if (actual.width !== expected.width || actual.height !== expected.height) {
      failures.push(`${filename}: dimensions ${actual.width}x${actual.height} != ${expected.width}x${expected.height}`)
      continue
    }

    const differingPixels = pixelmatch(
      expected.data,
      actual.data,
      undefined,
      expected.width,
      expected.height,
      { threshold: 0.1 },
    )
    const ratio = differingPixels / (expected.width * expected.height)
    console.log(`${filename}: ${(ratio * 100).toFixed(3)}% different`)
    if (ratio > MAX_DIFFERING_PIXELS) failures.push(`${filename}: ${(ratio * 100).toFixed(3)}% > 0.5% threshold`)
  }
} finally {
  await renderer.close()
}

if (failures.length > 0) {
  console.error('Visual golden check failed:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exitCode = 1
} else {
  console.log(`Visual golden check passed for ${fixtures.length} fixtures.`)
}
