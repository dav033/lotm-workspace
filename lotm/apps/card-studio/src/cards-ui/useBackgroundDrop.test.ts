import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { renderToStaticMarkup } from 'react-dom/server'
import React, { type ComponentType } from 'react'
import BreakdownCard from './BreakdownCard'
import MapCard from './MapCard'
import PathwayExplanationCard from './PathwayExplanationCard'

const cards: Array<[string, ComponentType<Record<string, unknown>>, Record<string, unknown>]> = [
  ['Breakdown', BreakdownCard as ComponentType<Record<string, unknown>>,
    { kicker: 'Authority', title: 'Seals', does: 'a', doesNot: 'b', edgeLabel: 'Edge', edgeText: 'c' }],
  ['Map', MapCard as ComponentType<Record<string, unknown>>,
    { title: 'The chain', entriesText: 'Means -> Door' }],
  ['Pathway Explanation', PathwayExplanationCard as ComponentType<Record<string, unknown>>,
    { pathway: 'Door', index: 2, total: 22, title: 'Un *gancho*.', description: 'Texto.' }],
]

describe('soltar imagen en las fichas', () => {
  it('sin manejador las cartas se renderizan estaticas', () => {
    for (const [name, Card, props] of cards) {
      const html = renderToStaticMarkup(React.createElement(Card, props))
      assert.doesNotMatch(html, /dragover/, `${name} no deberia marcarse`)
    }
  })

  it('con manejador siguen renderizando sin romperse', () => {
    for (const [name, Card, props] of cards) {
      const html = renderToStaticMarkup(
        React.createElement(Card, { ...props, onDropBackground: () => undefined }),
      )
      assert.match(html, /class="ficha/, `${name} deberia seguir siendo una ficha`)
      assert.doesNotMatch(html, /dragover/, `${name} no arranca en estado de arrastre`)
    }
  })
})
