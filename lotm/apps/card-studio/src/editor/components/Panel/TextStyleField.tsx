import React from 'react'
import type { MapTextStyles, TextStyle } from '../../../domain/schema'
import { TEXT_STYLE_FONTS } from '../../../domain/schema'

type TextStyleRole = keyof MapTextStyles
type TextStyleDefaults = Required<{
  [Key in keyof TextStyle]: NonNullable<TextStyle[Key]>
}>

export const MAP_TEXT_STYLE_DEFAULTS: Record<TextStyleRole, TextStyleDefaults> = {
  title: {
    fontFamily: 'Playfair Display', fontSize: 44, fontWeight: 900,
    lineHeight: 0.9, letterSpacing: 0, color: '#faf7f0', textTransform: 'none',
  },
  label: {
    fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 700,
    lineHeight: 1.1, letterSpacing: 0.16, color: '#8a8579', textTransform: 'uppercase',
  },
  value: {
    fontFamily: 'Archivo', fontSize: 16, fontWeight: 800,
    lineHeight: 1.18, letterSpacing: 0, color: '#faf7f0', textTransform: 'none',
  },
  footer: {
    fontFamily: 'JetBrains Mono', fontSize: 13, fontWeight: 700,
    lineHeight: 1.2, letterSpacing: 0.14, color: '#e3bd77', textTransform: 'uppercase',
  },
}

type Props = {
  role: TextStyleRole
  label: string
  value?: TextStyle
  onChange: (patch: TextStyle) => void
  onReset: () => void
}

const WEIGHTS = [400, 500, 600, 700, 800, 900] as const

export default function TextStyleField({ role, label, value = {}, onChange, onReset }: Props) {
  const defaults = MAP_TEXT_STYLE_DEFAULTS[role]
  const current = { ...defaults, ...value }

  return (
    <details className="typography-field">
      <summary>
        <span>{label}</span>
        <span className="typography-field-state">
          {Object.keys(value).length ? 'Custom' : 'Default'}
        </span>
      </summary>
      <div className="typography-grid">
        <label>
          Font
          <select
            value={current.fontFamily}
            onChange={(event) => onChange({ fontFamily: event.target.value as TextStyle['fontFamily'] })}
          >
            {TEXT_STYLE_FONTS.map((font) => <option key={font} value={font}>{font}</option>)}
          </select>
        </label>
        <label>
          Size (px)
          <input
            type="number"
            min="8"
            max="96"
            step="1"
            value={current.fontSize}
            onChange={(event) => onChange({ fontSize: Math.max(8, Math.min(96, Number(event.target.value) || defaults.fontSize)) })}
          />
        </label>
        <label>
          Weight
          <select
            value={current.fontWeight}
            onChange={(event) => onChange({ fontWeight: Number(event.target.value) as TextStyle['fontWeight'] })}
          >
            {WEIGHTS.map((weight) => <option key={weight} value={weight}>{weight}</option>)}
          </select>
        </label>
        <label>
          Line height
          <input
            type="number"
            min="0.75"
            max="2"
            step="0.05"
            value={current.lineHeight}
            onChange={(event) => onChange({ lineHeight: Math.max(0.75, Math.min(2, Number(event.target.value) || defaults.lineHeight)) })}
          />
        </label>
        <label>
          Letter spacing (em)
          <input
            type="number"
            min="-0.08"
            max="0.35"
            step="0.01"
            value={current.letterSpacing}
            onChange={(event) => onChange({ letterSpacing: Math.max(-0.08, Math.min(0.35, Number(event.target.value) || 0)) })}
          />
        </label>
        <label>
          Color
          <input
            type="color"
            value={current.color}
            aria-label={`${label} color`}
            onChange={(event) => onChange({ color: event.target.value })}
          />
        </label>
        <label>
          Case
          <select
            value={current.textTransform}
            onChange={(event) => onChange({ textTransform: event.target.value as TextStyle['textTransform'] })}
          >
            <option value="none">As written</option>
            <option value="uppercase">Uppercase</option>
          </select>
        </label>
        <button type="button" className="typography-reset" onClick={onReset}>
          Reset {label.toLowerCase()} style
        </button>
      </div>
    </details>
  )
}
