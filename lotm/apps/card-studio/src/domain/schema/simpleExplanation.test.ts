import assert from 'node:assert/strict'
import test from 'node:test'
import { CardContentSchema, fromBuilderCardState, filenameForCard, toBuilderCardState } from './index'

test('Simple Explanation conserva un unico bloque de texto al volver del editor', () => {
  const text = 'Centered text grows from the middle and shrinks as it gets longer.'
  const simple = CardContentSchema.parse({
    type: 'Simple Explanation',
    text,
  })

  const state = toBuilderCardState(simple)
  assert.equal(state.simpleExplanationText, text)
  assert.deepEqual(fromBuilderCardState(state), simple)
  assert.equal(filenameForCard(simple), 'simple-explanation_centered-text-grows-from-the-middle-and-shrinks-as-it-gets-longer')
})

test('Simple Explanation conserva controles de composicion', () => {
  const simple = CardContentSchema.parse({
    type: 'Simple Explanation',
    text: 'Placed near the top.',
    fontSizeMin: 12,
    fontSizeMax: 24,
    position: 'top',
  })

  const state = toBuilderCardState(simple)
  assert.equal(state.simpleExplanationMinFontSize, 12)
  assert.equal(state.simpleExplanationMaxFontSize, 24)
  assert.equal(state.simpleExplanationPosition, 'top')
  assert.deepEqual(fromBuilderCardState(state), simple)
})
