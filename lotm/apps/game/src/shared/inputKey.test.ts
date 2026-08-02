import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { buildPairInputKey, buildRecipeInputKey, parseInputKey } from './inputKey'

describe('buildPairInputKey', () => {
  it('Ojo + Moneda equivale a Moneda + Ojo', () => {
    assert.equal(buildPairInputKey('ojo', 'moneda'), buildPairInputKey('moneda', 'ojo'))
  })

  it('Ojo + Ojo agrega a cantidad 2', () => {
    assert.equal(buildPairInputKey('ojo', 'ojo'), buildRecipeInputKey([{ slug: 'ojo', quantity: 2 }]))
    assert.equal(buildPairInputKey('ojo', 'ojo'), 'ojo*2')
  })

  it('coincide exactamente con buildRecipeInputKey para el mismo par', () => {
    assert.equal(
      buildPairInputKey('ojo', 'vision'),
      buildRecipeInputKey([
        { slug: 'ojo', quantity: 1 },
        { slug: 'vision', quantity: 1 },
      ]),
    )
  })

  it('rechaza slugs inválidos igual que buildRecipeInputKey', () => {
    assert.throws(() => buildPairInputKey('Ojo Grande', 'moneda'))
  })
})

describe('inputKey — servidor y cliente comparten la misma implementación', () => {
  it('expone una implementación única compartida por servidor y cliente', () => {
    assert.equal(typeof buildPairInputKey, 'function')
    assert.equal(typeof buildRecipeInputKey, 'function')
    assert.equal(typeof parseInputKey, 'function')
  })
})
