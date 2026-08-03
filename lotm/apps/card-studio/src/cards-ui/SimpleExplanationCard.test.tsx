import assert from 'node:assert/strict'
import test from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import SimpleExplanationCard, { simpleExplanationFontSize } from './SimpleExplanationCard'

test('Simple Explanation centra texto y reduce letra al crecer contenido', () => {
  const short = 'A short explanation.'
  const long = 'A longer explanation. '.repeat(35)
  const html = renderToStaticMarkup(React.createElement(SimpleExplanationCard, { text: short }))
  const denseHtml = renderToStaticMarkup(React.createElement(SimpleExplanationCard, { text: long }))

  assert.match(html, /simple-explanation-card/)
  assert.match(html, /simple-explanation-text[^>]*>A short explanation\./)
  assert.match(html, /--simple-explanation-size:28px/)
  assert.ok(simpleExplanationFontSize(long) < simpleExplanationFontSize(short))
  assert.match(denseHtml, new RegExp(`--simple-explanation-size:${simpleExplanationFontSize(long)}px`))
})

test('Simple Explanation acepta rango de fuente y posicion vertical', () => {
  const html = renderToStaticMarkup(React.createElement(SimpleExplanationCard, {
    text: 'A short explanation.',
    fontSizeMin: 18,
    fontSizeMax: 24,
    position: 'bottom',
  }))

  assert.match(html, /simple-explanation-bottom/)
  assert.match(html, /--simple-explanation-size:24px/)
})
