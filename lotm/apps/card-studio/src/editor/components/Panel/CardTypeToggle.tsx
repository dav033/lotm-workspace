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
  'Pathway Explanation',
  'Breakdown',
  'Map',
  'Tarot Member',
  'Corruption File',
  'Ritual Logic',
]

type Props = {
  type: BuilderCardState['type']
  set: (patch: Partial<BuilderCardState>) => void
}

export default function CardTypeToggle({ type, set }: Props) {
  return (
    <div className="toggle">
      {CARD_TYPES.map((cardType) => (
        <button
          key={cardType}
          className={'seg' + (type === cardType ? ' sel' : '')}
          onClick={() => set({
            type: cardType,
            ...(cardType === 'Tier Explanation' ? { explanationPath: null } : {}),
          })}
        >
          {cardType}
        </button>
      ))}
    </div>
  )
}
