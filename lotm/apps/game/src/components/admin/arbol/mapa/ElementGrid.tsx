'use client'
import Link from 'next/link'
import { Check, LockKeyhole, Trash2, TriangleAlert } from 'lucide-react'
import { IconoElemento } from '@/components/game/IconoElemento'
import type { VistaFases } from '@/shared/adminTree'
import { ESTADO_META, type EstadoElemento } from './types'

export function ElementGrid({
  elements,
  selectedElementId,
  stateOf,
  onSelect,
  emptyMessage,
  impactoDe,
  labelOf,
  onRemove,
  removeDisabled,
}: {
  elements: VistaFases['elements']
  selectedElementId: string | null
  stateOf: (element: VistaFases['elements'][number]) => EstadoElemento
  onSelect: (id: string) => void
  emptyMessage: string
  impactoDe?: (id: string) => number
  labelOf?: (element: VistaFases['elements'][number]) => string
  onRemove?: (element: VistaFases['elements'][number]) => void
  removeDisabled?: boolean
}) {
  if (elements.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-line p-6 text-center text-sm text-fog">
        {emptyMessage}
      </p>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3">
      {elements.map((element) => {
        const state = stateOf(element)
        const meta = ESTADO_META[state]
        const selected = selectedElementId === element.id
        return (
          <div key={element.id} className="group relative">
            <button
              type="button"
              onClick={() => onSelect(element.id)}
              aria-pressed={selected}
              className={`min-h-28 w-full rounded-lg border p-3 text-left transition ${meta.className} ${
                selected
                  ? 'ring-2 ring-brass ring-offset-2 ring-offset-ink'
                  : '[@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-0.5'
              }`}
            >
              <div className={`flex items-start justify-between gap-2 ${onRemove ? 'pr-8' : ''}`}>
                <IconoElemento iconKey={element.iconKey} className="h-6 w-6 shrink-0" />
                {state === 'disponible' && <Check className="h-4 w-4" />}
                {state === 'frontera' && <TriangleAlert className="h-4 w-4" />}
                {state === 'bloqueado' && <LockKeyhole className="h-4 w-4" />}
              </div>
              <span className="mt-3 block text-sm font-medium">{element.name}</span>
              <span className="mt-1 block text-[10px] uppercase tracking-wider opacity-70">
                {labelOf?.(element) ?? meta.label}
                {impactoDe && <> · {impactoDe(element.id)} en cadena</>}
              </span>
            </button>
            {onRemove && (
              <button
                type="button"
                aria-label={`Quitar ${element.name} de los elementos iniciales`}
                title={`Quitar ${element.name} de la fase`}
                disabled={removeDisabled}
                onClick={() => onRemove(element)}
                className="pointer-events-none absolute right-2 top-2 rounded-md border border-wine/50 bg-ink/90 p-1.5 text-wine opacity-0 transition hover:border-wine hover:bg-wine/15 hover:text-parchment focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-wine disabled:opacity-35 group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100 [@media(pointer:coarse)]:pointer-events-auto [@media(pointer:coarse)]:opacity-70"
              >
                <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
