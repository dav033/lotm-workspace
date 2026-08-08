import assert from 'node:assert/strict'
import test from 'node:test'
import React, { type ComponentType } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import PathwayCard from '../../../cards-ui/PathwayCard'
import { CardContentSchema, fromBuilderCardState, toBuilderCardState } from '../../../domain/schema'
import { DEFAULT_STATE } from '../../cardSeeds'
import { CARD_TYPES } from './CardTypeToggle'
import FontSizeControls, { FONT_SIZE_ROLES } from './FontSizeControls'

test('every card family with fixed typography exposes font-size controls', () => {
  const automaticFamilies = new Set(['Map', 'Simple Explanation'])
  for (const type of CARD_TYPES) {
    if (automaticFamilies.has(type)) {
      assert.equal(FONT_SIZE_ROLES[type], undefined)
    } else {
      assert.ok(FONT_SIZE_ROLES[type]?.length, `${type} is missing font-size roles`)
    }
  }
})

test('font-size overrides survive schema and editor round trips', () => {
  const content = CardContentSchema.parse({
    type: 'Pathway',
    pathway: 'Moon',
    points: ['A remedy for everything.'],
    backgroundOpacity: 65,
    fontSizes: { pathway: 31, points: 19, footer: 17 },
  })

  const state = toBuilderCardState(content)
  assert.deepEqual(state.fontSizes, { pathway: 31, points: 19, footer: 17 })
  assert.deepEqual(fromBuilderCardState(state), content)
  assert.throws(() => CardContentSchema.parse({ ...content, fontSizes: { points: 201 } }))
})

test('font-size controls show saved values and card renderers apply them inline', () => {
  const controls = renderToStaticMarkup(React.createElement(FontSizeControls, {
    state: { ...DEFAULT_STATE, type: 'Pathway', fontSizes: { points: 19 } },
    set: () => undefined,
  }))
  assert.match(controls, /Font sizes/)
  assert.match(controls, /name="font-size-points"/)
  assert.match(controls, /value="19"/)

  const Pathway = PathwayCard as ComponentType<Record<string, unknown>>
  const card = renderToStaticMarkup(React.createElement(Pathway, {
    path: 'Moon',
    icon: '/moon.png',
    sequence: null,
    sequenceName: null,
    tier: { c: '#fff', d: '#333' },
    text: 'A remedy for everything.',
    fontSizes: { pathway: 31, points: 19 },
  }))
  assert.match(card, /tier-path" style="font-size:31px"/)
  assert.match(card, /<li style="font-size:19px">/)
})
