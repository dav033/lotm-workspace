import React from 'react'
import type { BuilderCardState } from '../../../domain/schema'

type Role = { key: string; label: string }

export const FONT_SIZE_ROLES: Partial<Record<BuilderCardState['type'], Role[]>> = {
  Character: [
    { key: 'name', label: 'Name' },
    { key: 'sequenceNumber', label: 'Sequence number' },
    { key: 'sequenceName', label: 'Sequence name' },
    { key: 'label', label: 'Stat labels' },
    { key: 'value', label: 'Stat values' },
    { key: 'placeholder', label: 'Image placeholder' },
  ],
  Artifact: [
    { key: 'name', label: 'Name' },
    { key: 'sequenceNumber', label: 'Sequence number' },
    { key: 'sequenceName', label: 'Sequence name' },
    { key: 'label', label: 'Stat labels' },
    { key: 'value', label: 'Stat values' },
    { key: 'placeholder', label: 'Image placeholder' },
  ],
  Cover: [
    { key: 'title', label: 'Title' },
    { key: 'part', label: 'Part number' },
    { key: 'subtitle', label: 'Subtitle' },
    { key: 'placeholder', label: 'Image placeholder' },
  ],
  'Full Image Cover': [
    { key: 'title', label: 'Title' },
    { key: 'placeholder', label: 'Image placeholder' },
  ],
  Tier: [
    { key: 'pathwayLabel', label: 'Pathway label' },
    { key: 'pathway', label: 'Pathway name' },
    { key: 'sequence', label: 'Sequence' },
    { key: 'rankLabel', label: 'Tier label' },
    { key: 'rank', label: 'Tier rank' },
    { key: 'sectionLabel', label: 'Section label' },
    { key: 'points', label: 'Points' },
    { key: 'footer', label: 'Footer' },
    { key: 'empty', label: 'Empty state' },
  ],
  Pathway: [
    { key: 'pathwayLabel', label: 'Pathway label' },
    { key: 'pathway', label: 'Pathway name' },
    { key: 'sequence', label: 'Sequence' },
    { key: 'points', label: 'Points' },
    { key: 'footer', label: 'Footer' },
    { key: 'empty', label: 'Empty state' },
  ],
  'Tier Explanation': [
    { key: 'rank', label: 'Tier rank' },
    { key: 'body', label: 'Description' },
  ],
  'General Explanation': [
    { key: 'pathway', label: 'Pathway name' },
    { key: 'title', label: 'Title' },
    { key: 'body', label: 'Body' },
  ],
  'Pathway Explanation': [
    { key: 'meta', label: 'Pathway & counter' },
    { key: 'title', label: 'Title' },
    { key: 'body', label: 'Description' },
  ],
  Breakdown: [
    { key: 'meta', label: 'Kicker & range' },
    { key: 'title', label: 'Title' },
    { key: 'label', label: 'Section labels' },
    { key: 'body', label: 'Section text' },
  ],
  'Tarot Member': [
    { key: 'meta', label: 'Header metadata' },
    { key: 'tarotTitle', label: 'Tarot title' },
    { key: 'name', label: 'Name' },
    { key: 'label', label: 'Section labels' },
    { key: 'body', label: 'Main description' },
    { key: 'detail', label: 'Detail text' },
    { key: 'footer', label: 'Footer' },
  ],
  'Corruption File': [
    { key: 'meta', label: 'Header metadata' },
    { key: 'title', label: 'Incident title' },
    { key: 'label', label: 'Panel labels' },
    { key: 'body', label: 'Panel text' },
    { key: 'footer', label: 'Footer' },
  ],
  'Ritual Logic': [
    { key: 'meta', label: 'Header metadata' },
    { key: 'pathway', label: 'Pathway' },
    { key: 'title', label: 'Sequence title' },
    { key: 'label', label: 'Section labels' },
    { key: 'heading', label: 'Section headings' },
    { key: 'body', label: 'Section text' },
    { key: 'note', label: 'Evidence note' },
    { key: 'footer', label: 'Footer' },
  ],
  Timeline: [
    { key: 'meta', label: 'Header metadata' },
    { key: 'era', label: 'Era' },
    { key: 'kicker', label: 'Kicker' },
    { key: 'title', label: 'Title' },
    { key: 'body', label: 'Consequence' },
    { key: 'note', label: 'Evidence note' },
    { key: 'move', label: 'Arc movements' },
    { key: 'footer', label: 'Footer' },
  ],
}

type Props = {
  state: BuilderCardState
  set: (patch: Partial<BuilderCardState>) => void
}

export default function FontSizeControls({ state, set }: Props) {
  const roles = FONT_SIZE_ROLES[state.type]
  if (!roles?.length) return null

  const update = (key: string, rawValue: string) => {
    const next = { ...state.fontSizes }
    const value = Number(rawValue)
    if (!rawValue || !Number.isFinite(value)) delete next[key]
    else next[key] = Math.max(8, Math.min(200, Math.round(value)))
    set({ fontSizes: next })
  }

  return (
    <div className="font-size-controls">
      <div className="typography-controls-head">
        <label>Font sizes</label>
        <p className="field-help">Leave a field empty to keep the responsive card default.</p>
      </div>
      <div className="font-size-grid">
        {roles.map(({ key, label }) => (
          <label key={key}>
            {label}
            <span className="font-size-input">
              <input
                type="number"
                name={`font-size-${key}`}
                min="8"
                max="200"
                step="1"
                inputMode="numeric"
                autoComplete="off"
                placeholder="Auto"
                value={state.fontSizes[key] ?? ''}
                onChange={(event) => update(key, event.target.value)}
              />
              <span aria-hidden="true">px</span>
            </span>
          </label>
        ))}
      </div>
      {Object.keys(state.fontSizes).length > 0 && (
        <button type="button" className="typography-reset" onClick={() => set({ fontSizes: {} })}>
          Reset all font sizes
        </button>
      )}
    </div>
  )
}
