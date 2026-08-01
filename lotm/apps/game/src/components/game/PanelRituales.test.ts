import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import type { PublicRitualState } from '@/server/domain/ritualKnowledge'
import { PanelRituales } from './PanelRituales'

function render(ritualState: PublicRitualState) {
  return renderToStaticMarkup(
    createElement(PanelRituales, {
      ritualState,
      actionLoading: false,
      onRealizar: () => undefined,
    }),
  )
}

describe('PanelRituales', () => {
  it('no reserva espacio en estado oculto', () => {
    assert.equal(render({ status: 'HIDDEN', groups: [] }), '')
  })

  it('muestra una tarjeta genérica sin contenido ritual en estado sellado', () => {
    const html = render({ status: 'SEALED', groups: [] })
    assert.match(html, /Ritual knowledge sealed/)
    assert.match(html, /beyond your understanding/)
    assert.doesNotMatch(html, /Preparation completed/)
    assert.doesNotMatch(html, /Discovered ingredients/)
  })

  it('muestra ingredientes y protección sin nombrar la secuencia destino', () => {
    const html = render({
      status: 'UNLOCKED',
      groups: [
        {
          groupKey: 'group',
          sourceSequence: {
            elementId: 'source',
            name: 'Escriba',
            number: 6,
            pathwayName: 'Camino de la Puerta',
            iconKey: 'book-open',
          },
          protected: true,
          options: [
            {
              ritualId: 'ritual',
              optionLabel: 'Preparación ritual',
              completed: true,
              canPerform: false,
              ingredients: [
                {
                  name: 'Constelación',
                  iconKey: 'sparkles',
                  quantity: 1,
                  discovered: true,
                },
              ],
            },
          ],
        },
      ],
    })
    assert.match(html, /Preparation for the next ascension of Escriba/)
    assert.match(html, /Constelación/)
    assert.match(html, /Discovered/)
    assert.match(html, /Ascension protected/)
    assert.doesNotMatch(html, /Traveler/)
  })
})
