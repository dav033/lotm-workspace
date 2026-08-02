import assert from 'node:assert/strict'
import path from 'node:path'
import test from 'node:test'
import { resolveWorkspacePath, workspaceRoot } from './paths'

test('resuelve rutas CARDS relativas desde la raiz del workspace', () => {
  assert.equal(resolveWorkspacePath('./data/cards.db', 'data/fallback.db'), path.join(workspaceRoot, 'data/cards.db'))
})

test('conserva rutas CARDS absolutas', () => {
  const absolutePath = path.join(workspaceRoot, 'custom', 'cards.db')
  assert.equal(resolveWorkspacePath(absolutePath, 'data/fallback.db'), absolutePath)
})
