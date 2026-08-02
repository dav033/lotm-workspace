'use client'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import type { VistaFases } from '@/shared/adminTree'
import { ESTADO_META, type EstadoElemento } from './types'

export function RitualGrid({
  rituals,
  elementById,
  stateOf,
  preparedRitualIds,
  selectedRitualId,
  saving,
  onSelect,
  onToggle,
  emptyMessage,
}: {
  rituals: VistaFases['rituals']
  elementById: Map<string, VistaFases['elements'][number]>
  stateOf: (ritual: VistaFases['rituals'][number]) => EstadoElemento
  preparedRitualIds: ReadonlySet<string>
  selectedRitualId: string | null
  saving: boolean
  onSelect: (id: string) => void
  onToggle: (id: string) => void
  emptyMessage: string
}) {
  if (rituals.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-line p-6 text-center text-sm text-fog">
        {emptyMessage}
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-2 2xl:grid-cols-2">
      {rituals.map((ritual) => {
        const state = stateOf(ritual)
        const meta = ESTADO_META[state]
        const selected = selectedRitualId === ritual.id
        const source = elementById.get(ritual.sourceElementId)?.name ?? 'Origen desconocido'
        const target = elementById.get(ritual.targetElementId)?.name ?? 'Destino desconocido'
        const ingredients = ritual.ingredientElementIds
          .map((id) => elementById.get(id)?.name ?? '?')
          .join(' + ')
        return (
          <article
            key={ritual.id}
            className={`flex min-h-40 flex-col rounded-lg border p-3 ${meta.className} ${
              selected ? 'ring-2 ring-brass ring-offset-2 ring-offset-ink' : ''
            }`}
          >
            <button
              type="button"
              aria-haspopup="dialog"
              onClick={() => onSelect(ritual.id)}
              className="flex flex-1 flex-col rounded-md text-left transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-brass"
            >
              <span className="flex min-w-0 items-start gap-2.5">
                <span className="rounded-md border border-current/25 bg-black/15 p-1.5">
                  <Sparkles aria-hidden="true" className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{ritual.name}</span>
                  <span className="mt-0.5 block truncate text-[10px] uppercase tracking-wider opacity-70">
                    {preparedRitualIds.has(ritual.id) ? 'Preparado' : meta.label}
                  </span>
                </span>
                {!ritual.advanceIsActive && (
                  <span className="shrink-0 rounded-full border border-wine/50 px-2 py-0.5 text-[10px] uppercase tracking-wider text-wine">
                    Avance inactivo
                  </span>
                )}
              </span>
              <span className="mt-3 block text-xs leading-5 opacity-85">
                <span className="font-medium">{source}</span> → <span className="font-medium">{target}</span>
              </span>
              <span className="line-clamp-2 text-xs leading-5 opacity-70">
                {ingredients || 'Sin ingredientes'} · protege {ritual.advanceName}
              </span>
            </button>
            <div className="mt-auto flex items-center justify-end gap-2 border-t border-current/15 pt-3">
              <Link
                href={`/admin/rituales?editar=${ritual.id}`}
                className="rounded-md border border-current/25 px-2.5 py-1.5 text-xs transition hover:bg-black/15 focus-visible:ring-2 focus-visible:ring-brass"
              >
                Editar
              </Link>
              <button
                type="button"
                disabled={saving}
                onClick={() => onToggle(ritual.id)}
                className={`rounded-md border px-2.5 py-1.5 text-xs transition focus-visible:ring-2 focus-visible:ring-brass disabled:opacity-50 ${
                  ritual.isActive
                    ? 'border-wine/60 text-wine hover:bg-wine/10'
                    : 'border-brass/45 text-brass hover:bg-brass/10'
                }`}
              >
                {ritual.isActive ? 'Bloquear' : 'Activar'}
              </button>
            </div>
          </article>
        )
      })}
    </div>
  )
}
