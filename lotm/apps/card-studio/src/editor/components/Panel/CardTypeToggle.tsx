import React from 'react'
import type { BuilderCardState } from '../../../domain/schema'

export const CARD_TYPES: BuilderCardState['type'][] = [
  'Character',
  'Artifact',
  'Cover',
  'Full Image Cover',
  'Tier',
  'Pathway',
  'Tier Explanation',
  'General Explanation',
  'Simple Explanation',
  'Pathway Explanation',
  'Breakdown',
  'Map',
  'Tarot Member',
  'Corruption File',
  'Ritual Logic',
  'Timeline',
]

type Props = {
  type: BuilderCardState['type']
  set: (patch: Partial<BuilderCardState>) => void
}

const CARD_TYPE_GROUPS = [
  { label: 'Explanation', types: [CARD_TYPES[6], CARD_TYPES[7], CARD_TYPES[8], CARD_TYPES[9]] },
  { label: 'Pathway', types: [CARD_TYPES[4], CARD_TYPES[5], CARD_TYPES[11], CARD_TYPES[15]] },
  { label: 'Card', types: [CARD_TYPES[0], CARD_TYPES[1], CARD_TYPES[12], CARD_TYPES[13], CARD_TYPES[14], CARD_TYPES[10]] },
  { label: 'Cover', types: [CARD_TYPES[2], CARD_TYPES[3]] },
]

function selectType(cardType: BuilderCardState['type'], set: Props['set']) {
  set({
    type: cardType,
    ...(cardType === 'Tier Explanation' ? { explanationPath: null } : {}),
  })
}

export default function CardTypeToggle({ type, set }: Props) {
  return (
    <>
      <select className="type-select" value={type} onChange={(event) => selectType(event.target.value as BuilderCardState['type'], set)}>
        {CARD_TYPE_GROUPS.map((group) => (
          <optgroup key={group.label} label={group.label}>
            {group.types.map((cardType) => <option key={cardType} value={cardType}>{cardType}</option>)}
          </optgroup>
        ))}
      </select>
      <div className="type-groups">
        {CARD_TYPE_GROUPS.map((group) => (
          <fieldset className="type-group" key={group.label}>
            <legend>{group.label}</legend>
            <div className="toggle">
              {group.types.map((cardType) => (
                <button
                  key={cardType}
                  type="button"
                  className={'seg' + (type === cardType ? ' sel' : '')}
                  onClick={() => selectType(cardType, set)}
                >
                  {cardType}
                </button>
              ))}
            </div>
          </fieldset>
        ))}
      </div>
    </>
  )
}
