import assert from 'node:assert/strict'
import test from 'node:test'
import React, { type ComponentType } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import MapCard from '../../../cards-ui/MapCard'
import PathwayCard from '../../../cards-ui/PathwayCard'
import SimpleExplanationCard from '../../../cards-ui/SimpleExplanationCard'
import { fontSizeCss } from '../../../cards-ui/textStyle'
import { CardContentSchema, fromBuilderCardState, toBuilderCardState } from '../../../domain/schema'
import { DEFAULT_STATE } from '../../cardSeeds'
import FontSizeControls from './FontSizeControls'

test('font-size control is one accessible range with presets', () => {
  const controls = renderToStaticMarkup(React.createElement(FontSizeControls, {
    state: { ...DEFAULT_STATE, type: 'Pathway', fontSizes: { all: 120 } },
    set: () => undefined,
  }))

  assert.match(controls, /<label for="font-size-scale">Text size<\/label>/)
  assert.match(controls, /type="range" min="60" max="160" step="1" name="fontSizeScale" value="120"/)
  assert.match(controls, /<output for="font-size-scale">120%<\/output>/)
  assert.match(controls, /aria-label="Text size presets"/)
  assert.match(controls, />Default<\/button>/)
})

test('font scale survives schema and editor round trips for every card system', () => {
  const content = CardContentSchema.parse({
    type: 'Pathway',
    pathway: 'Moon',
    points: ['A remedy for everything.'],
    backgroundOpacity: 65,
    fontSizes: { all: 120 },
  })

  const state = toBuilderCardState(content)
  assert.deepEqual(state.fontSizes, { all: 120 })
  assert.deepEqual(fromBuilderCardState(state), content)
  const map = CardContentSchema.parse({
    type: 'Map',
    title: 'Map title',
    entries: [{ tags: 'Origin', value: 'One value' }],
    backgroundOpacity: 65,
    fontSizes: { all: 120 },
  })
  const simple = CardContentSchema.parse({
    type: 'Simple Explanation',
    text: 'One explanation.',
    fontSizes: { all: 120 },
  })
  for (const automaticContent of [map, simple]) {
    const automaticState = toBuilderCardState(automaticContent)
    assert.deepEqual(automaticState.fontSizes, { all: 120 })
    assert.deepEqual(fromBuilderCardState(automaticState), automaticContent)
  }
  assert.throws(() => CardContentSchema.parse({ ...content, fontSizes: { all: 59 } }))
  assert.throws(() => CardContentSchema.parse({ ...content, fontSizes: { all: 161 } }))
  assert.throws(() => CardContentSchema.parse({ ...content, fontSizes: { points: 201 } }))
})

test('font scale changes fixed, map, and automatic card typography', () => {
  const Pathway = PathwayCard as ComponentType<Record<string, unknown>>
  const pathway = renderToStaticMarkup(React.createElement(Pathway, {
    path: 'Moon',
    icon: '/moon.png',
    sequence: null,
    sequenceName: null,
    tier: { c: '#fff', d: '#333' },
    text: 'A remedy for everything.',
    fontSizes: { all: 120 },
  }))
  const Map = MapCard as ComponentType<Record<string, unknown>>
  const map = renderToStaticMarkup(React.createElement(Map, {
    title: 'Map title',
    entriesText: 'Origin -> Value',
    fontSizes: { all: 120 },
  }))
  const Simple = SimpleExplanationCard as ComponentType<Record<string, unknown>>
  const simple = renderToStaticMarkup(React.createElement(Simple, {
    text: 'One explanation.',
    fontSizes: { all: 120 },
  }))

  assert.match(pathway, /tier-path" style="zoom:1.2"/)
  assert.match(pathway, /<li style="zoom:1.2">/)
  assert.match(map, /map-title[^>]+style="zoom:1.2"/)
  assert.match(simple, /simple-explanation-text" style="zoom:1.2"/)
  assert.deepEqual(fontSizeCss({ points: 19, all: 120 }, 'points'), { fontSize: '19px' })
})
