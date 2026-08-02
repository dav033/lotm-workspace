import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { DEFAULT_STATE } from '../editor/cardSeeds'
import type { CardKind } from './cardProps'
import { accentForState } from './cardProps'

// El editor tiñe su cromo con el acento de la carta abierta, sea del tipo que
// sea. Cuando el mapper solo lo emitia para la familia estandar, abrir
// cualquier otra carta rompia el editor entero con "reading 'c'" y ni el
// typecheck ni los goldens lo veian. Esta prueba cubre las doce familias.

const FAMILIES: CardKind[] = [
  'Character',
  'Artifact',
  'Cover',
  'Full Image Cover',
  'Tier',
  'Pathway',
  'Tier Explanation',
  'General Explanation',
  'Pathway Explanation',
  'Breakdown',
  'Map',
  'Tarot Member',
]

describe('accentForState', () => {
  for (const type of FAMILIES) {
    it(`da un acento utilizable para ${type}`, () => {
      const accent = accentForState({ ...DEFAULT_STATE, type })

      assert.ok(accent, `${type} no devolvio acento`)
      assert.match(accent.c, /^#[0-9a-f]{6}$/i, `${type}: color invalido`)
      assert.match(accent.d, /^#[0-9a-f]{6}$/i, `${type}: color profundo invalido`)
      assert.equal(typeof accent.pct, 'number')
      assert.ok(accent.pct >= 0 && accent.pct <= 100, `${type}: pct fuera de rango`)
    })
  }

  it('las portadas comparten el dorado y los rangos de tier no', () => {
    const cover = accentForState({ ...DEFAULT_STATE, type: 'Cover' })
    const fullCover = accentForState({ ...DEFAULT_STATE, type: 'Full Image Cover' })
    const tierS = accentForState({ ...DEFAULT_STATE, type: 'Tier', tierRank: 'S' })
    const tierF = accentForState({ ...DEFAULT_STATE, type: 'Tier', tierRank: 'F' })

    assert.deepEqual(cover, fullCover)
    assert.notDeepEqual(tierS, tierF)
  })

  it('un rango o camino desconocido cae en el valor por defecto en vez de romper', () => {
    const tier = accentForState({ ...DEFAULT_STATE, type: 'Tier', tierRank: 'no-existe' })
    const pathway = accentForState({ ...DEFAULT_STATE, type: 'Pathway', pathwayCardPath: 'no-existe' })

    assert.deepEqual(tier, accentForState({ ...DEFAULT_STATE, type: 'Tier', tierRank: 'S' }))
    assert.deepEqual(
      pathway,
      accentForState({ ...DEFAULT_STATE, type: 'Pathway', pathwayCardPath: 'Fool' }),
    )
  })
})
