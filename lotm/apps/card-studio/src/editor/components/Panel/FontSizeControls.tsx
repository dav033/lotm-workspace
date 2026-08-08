import React from 'react'
import type { BuilderCardState } from '../../../domain/schema'

const FONT_SCALE_PRESETS = [
  ['Small', 80],
  ['Default', 100],
  ['Large', 120],
  ['Very large', 150],
] as const

type Props = {
  state: BuilderCardState
  set: (patch: Partial<BuilderCardState>) => void
}

export default function FontSizeControls({ state, set }: Props) {
  const scale = state.fontSizes.all ?? 100

  const update = (value: number) => {
    const nextScale = Math.max(60, Math.min(160, Math.round(value)))
    set({ fontSizes: nextScale === 100 ? {} : { all: nextScale } })
  }

  return (
    <div className="background-opacity-control font-size-control">
      <div className="background-opacity-head">
        <label htmlFor="font-size-scale">Text size</label>
        <output htmlFor="font-size-scale">{scale}%</output>
      </div>
      <input
        className="background-opacity-range"
        id="font-size-scale"
        name="fontSizeScale"
        type="range"
        min="60"
        max="160"
        step="1"
        value={scale}
        onChange={(event) => update(Number(event.target.value))}
      />
      <div className="toggle background-opacity-presets" role="group" aria-label="Text size presets">
        {FONT_SCALE_PRESETS.map(([label, value]) => (
          <button
            type="button"
            className={'seg' + (scale === value ? ' sel' : '')}
            aria-pressed={scale === value}
            key={label}
            onClick={() => update(value)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
