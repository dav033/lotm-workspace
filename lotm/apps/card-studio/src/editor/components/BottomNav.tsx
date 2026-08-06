/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
'use client'

const ITEMS = [
  ['card', 'Carta'],
  ['cards', 'Cartas'],
  ['images', 'Imágenes'],
  ['publish', 'Publicar'],
]

export default function BottomNav({ active, onSelect }) {
  return (
    <nav className="bottom-nav" aria-label="Mobile editor navigation">
      {ITEMS.map(([value, label]) => (
        <button
          key={value}
          type="button"
          className={active === value ? 'active' : ''}
          aria-current={active === value ? 'page' : undefined}
          onClick={() => onSelect(value)}
        >
          {label}
        </button>
      ))}
    </nav>
  )
}
