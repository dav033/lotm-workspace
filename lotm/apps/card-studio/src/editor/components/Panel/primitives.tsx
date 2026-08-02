/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react'
import { PATHWAYS, PATH_NAMES } from '../../../domain/pathways'

const BACKGROUND_OPACITY_PRESETS = [
  ['Low', 25],
  ['Medium', 45],
  ['High', 65],
  ['Very high', 85],
]

// Searchable pathway combobox. Focusing clears the field so you can type a new
// search instantly; Enter commits the first match; Escape/blur restores the
// committed pathway. The typed text is a local draft, so clearing it to search
// never leaves an invalid pathway.
export function PathwayCombo({ value, onPick }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const blurTimer = useRef(null)

  // Show the committed pathway whenever the field is closed/idle.
  useEffect(() => { if (!open) setQuery('') }, [value, open])

  const filter = query.trim().toLowerCase()
  const matches = PATH_NAMES.filter((n) => n.toLowerCase().includes(filter))

  const commit = (n) => {
    onPick(n)
    setOpen(false)
    setQuery('')
    inputRef.current?.blur()
  }

  return (
    <>
      <input
        ref={inputRef}
        value={open ? query : value}
        placeholder="Type to search…"
        autoComplete="off"
        onFocus={() => { setQuery(''); setOpen(true) }}
        onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && matches.length) { e.preventDefault(); commit(matches[0]) }
          else if (e.key === 'Escape') { setOpen(false); inputRef.current?.blur() }
        }}
        onBlur={() => {
          blurTimer.current = setTimeout(() => { setOpen(false); setQuery('') }, 150)
        }}
      />
      <div className={'combo-list' + (open ? ' open' : '')}>
        {matches.length === 0 ? (
          <div className="none">No results</div>
        ) : (
          matches.map((n, i) => (
            <div
              key={n}
              className={'opt' + (i === 0 ? ' active' : '')}
              onMouseDown={(e) => {
                e.preventDefault()
                clearTimeout(blurTimer.current)
                commit(n)
              }}
            >
              {n}
              <span className="s0">Seq 0 · {PATHWAYS[n][9]}</span>
            </div>
          ))
        )}
      </div>
    </>
  )
}

export function SeqSelect({ path, value, onChange }) {
  return (
    <select value={value} onChange={(e) => onChange(Number(e.target.value))}>
      {Array.from({ length: 10 }, (_, i) => 9 - i).map((n) => (
        <option key={n} value={n}>Seq {n} · {PATHWAYS[path][9 - n]}</option>
      ))}
    </select>
  )
}

// Campo de imagen de fondo. Cada carta guarda la suya en un campo distinto del
// estado, asi que el nombre llega por prop y el input vive aqui dentro para no
// compartir un unico ref entre secciones.
export function BackgroundOpacityField({ value = 65, set }) {
  const opacity = Math.max(0, Math.min(100, value))
  return (
    <div className="background-opacity-control">
      <div className="background-opacity-head">
        <label htmlFor="background-opacity">Background visibility</label>
        <output htmlFor="background-opacity">{opacity}%</output>
      </div>
      <input
        className="background-opacity-range"
        id="background-opacity"
        name="backgroundOpacity"
        type="range"
        min="0"
        max="100"
        step="1"
        value={opacity}
        onChange={(event) => set({ backgroundOpacity: Number(event.target.value) })}
      />
      <div className="toggle background-opacity-presets" role="group" aria-label="Background visibility presets">
        {BACKGROUND_OPACITY_PRESETS.map(([label, preset]) => (
          <button
            type="button"
            className={'seg' + (opacity === preset ? ' sel' : '')}
            aria-pressed={opacity === preset}
            key={label}
            onClick={() => set({ backgroundOpacity: preset })}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function BackgroundField({ value, field, opacity, set, onUploadImage, help }) {
  const inputRef = useRef(null)
  return (
    <div className="field">
      <label>Background image (optional)</label>
      <div className="actions tier-background-actions">
        <button className="btn-img" onClick={() => inputRef.current?.click()}>
          {value ? 'Replace image' : 'Upload image'}
        </button>
        {value && <button className="btn-img" onClick={() => set({ [field]: null })}>Remove</button>}
      </div>
      <p className="field-help">
        {value ? 'Using a custom background.' : help}
      </p>
      <BackgroundOpacityField value={opacity} set={set} />
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        aria-label="Choose background image"
        hidden
        onChange={(event) => {
          onUploadImage(event.target.files[0], field)
          event.target.value = ''
        }}
      />
    </div>
  )
}
