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
