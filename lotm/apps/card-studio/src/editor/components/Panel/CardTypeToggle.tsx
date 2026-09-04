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
  'Pathway List',
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
  state: BuilderCardState
  set: (patch: Partial<BuilderCardState>) => void
}

const CARD_TYPE_GROUPS = [
  { label: 'Explanation', types: ['Tier Explanation', 'General Explanation', 'Simple Explanation', 'Pathway Explanation', 'Pathway List'] },
  { label: 'Ranking', types: ['Tierlist', 'Tier', 'Pathway', 'Map', 'Ritual Logic', 'Timeline'] },
  { label: 'Card', types: ['Character', 'Artifact', 'Tarot Member', 'Dossier', 'Corruption File', 'Breakdown'] },
  { label: 'Cover', types: ['Cover', 'Full Image Cover'] },
] as const

function selectType(
  cardType: BuilderCardState['type'],
  currentType: BuilderCardState['type'],
  state: BuilderCardState,
  set: Props['set'],
) {
  const migrated = cardType === 'Pathway List' && currentType === 'Pathway Explanation'
    ? {
        pathwayListPath: state.pathwayExplanationPath,
        pathwayListTitle: state.pathwayExplanationTitle,
        pathwayListItemsText: state.pathwayExplanationText
          .split('\n')
          .map((item) => item.replace(/^\s*\d+\s*[.)]\s*/, '').trim())
          .filter(Boolean)
          .join('\n'),
        pathwayListBackgroundImage: state.pathwayExplanationBackgroundImage,
      }
    : cardType === 'Pathway Explanation' && currentType === 'Pathway List'
      ? {
          pathwayExplanationPath: state.pathwayListPath,
          pathwayExplanationTitle: state.pathwayListTitle,
          pathwayExplanationText: state.pathwayListItemsText,
          pathwayExplanationBackgroundImage: state.pathwayListBackgroundImage,
        }
      : {}

  set({
    type: cardType,
    ...(cardType === currentType ? {} : { fontSizes: {} }),
    ...(cardType === 'Tier Explanation' ? { explanationPath: null } : {}),
    ...migrated,
  })
}

export default function CardTypeToggle({ type, state, set }: Props) {
  return (
    <>
      <select className="type-select" value={type} onChange={(event) => selectType(event.target.value as BuilderCardState['type'], type, state, set)}>
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
                  onClick={() => selectType(cardType, type, state, set)}
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
