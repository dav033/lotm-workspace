import React from 'react'
import type { BuilderCardState } from '../../../domain/schema'

export const CARD_TYPES: BuilderCardState['type'][] = [
  'Character',
  'Artifact',
  'Cover',
  'Full Image Cover',
  'Tier',
  'Tierlist',
  'Pathway',
  'Tier Explanation',
  'General Explanation',
  'Simple Explanation',
  'Pathway Explanation',
  'Breakdown',
  'Map',
  'Tarot Member',
  'Dossier',
  'Corruption File',
  'Ritual Logic',
  'Timeline',
]

type Props = {
  type: BuilderCardState['type']
  set: (patch: Partial<BuilderCardState>) => void
}

const CARD_TYPE_GROUPS = [
  { label: 'Explanation', types: ['Tier Explanation', 'General Explanation', 'Simple Explanation', 'Pathway Explanation'] },
  { label: 'Ranking', types: ['Tierlist', 'Tier', 'Pathway', 'Map', 'Ritual Logic', 'Timeline'] },
  { label: 'Card', types: ['Character', 'Artifact', 'Tarot Member', 'Dossier', 'Corruption File', 'Breakdown'] },
  { label: 'Cover', types: ['Cover', 'Full Image Cover'] },
] as const

function selectType(cardType: BuilderCardState['type'], currentType: BuilderCardState['type'], set: Props['set']) {
  set({
    type: cardType,
    ...(cardType === currentType ? {} : { fontSizes: {} }),
    ...(cardType === 'Tier Explanation' ? { explanationPath: null } : {}),
  })
}

export default function CardTypeToggle({ type, set }: Props) {
  return (
    <>
      <select className="type-select" value={type} onChange={(event) => selectType(event.target.value as BuilderCardState['type'], type, set)}>
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
                  onClick={() => selectType(cardType, type, set)}
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
