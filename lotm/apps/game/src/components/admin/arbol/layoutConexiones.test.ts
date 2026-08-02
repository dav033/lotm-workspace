import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { filtrarAristasVisibles } from './layoutConexiones'

describe('filtrarAristasVisibles', () => {
  it('conserva solo familias habilitadas', () => {
    const aristas = [
      { de: 'a', a: 'b', tipo: 'receta' as const, via: 'test' },
      { de: 'b', a: 'c', tipo: 'desbloqueo' as const, via: 'test' },
    ]
    assert.deepEqual(
      filtrarAristasVisibles(aristas, {
        receta: true,
        desbloqueo: false,
        progresion: true,
        fallo: false,
      }),
      [aristas[0]],
    )
  })
})
