import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, resolve as pathResolve } from 'node:path'

const noop = pathToFileURL(pathResolve(dirname(fileURLToPath(import.meta.url)), 'server-only-noop.mjs')).href

export async function resolve(specifier, context, nextResolve) {
  if (specifier === 'server-only') return { url: noop, shortCircuit: true }
  return nextResolve(specifier, context)
}
