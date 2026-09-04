import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import test from 'node:test'
import { STYLE_FILES } from './styleFiles'

test('browser stylesheet incluye Pathway List antes de renderizar cartas', async () => {
  const css = await fs.readFile(new URL('./styles/index.css', import.meta.url), 'utf8')

  assert.ok(STYLE_FILES.includes('pathway-list.css'))
  assert.match(css, /@import ['"]\.\/pathway-list\.css['"];?/)
})
