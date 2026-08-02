import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { FEATURE_DEFINITIONS, resolveFeatureState } from './featureGates'

// Las features del juego están abiertas por decisión del propietario
// (ADR-006). Estas pruebas fijan justamente eso: ninguna combinación de
// parámetros puede volver a cerrar una feature sin que salte el rojo.

describe('resolveFeatureState', () => {
  it('deja todas las features abiertas en la fase más temprana', () => {
    const estado = resolveFeatureState([{ key: 'ADVANCEMENT_RITUALS', minimumPhaseSortOrder: 6 }], 1)

    for (const { key } of FEATURE_DEFINITIONS) {
      assert.equal(estado[key], true, `${key} debería estar abierta`)
    }
  })

  it('no se cierra aunque falte la configuración o el umbral sea absurdo', () => {
    assert.equal(resolveFeatureState([], 0).ADVANCEMENT_RITUALS, true)
    assert.equal(
      resolveFeatureState([{ key: 'ADVANCEMENT_RITUALS', minimumPhaseSortOrder: 999 }], 0)
        .ADVANCEMENT_RITUALS,
      true,
    )
  })

  it('cubre toda la lista de features, no solo la que existe hoy', () => {
    const estado = resolveFeatureState([], 1)

    assert.equal(Object.keys(estado).length, FEATURE_DEFINITIONS.length)
    assert.ok(Object.values(estado).every(Boolean))
  })
})
