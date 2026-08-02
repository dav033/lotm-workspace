'use client'
import { TriangleAlert } from 'lucide-react'
import { IconoElemento } from '@/components/game/IconoElemento'
import type { VistaFases } from '@/shared/adminTree'
import { ESTADO_META, type EstadoElemento } from './types'
import { FichaElemento } from './FichaElemento'

export function BlockingReasons({
  targetName,
  blockers,
  conditions,
  terminalReason,
  stateOf,
  onSelect,
  title = 'Bloqueado en esta fase',
  description = 'Frontera mínima de la ruta más cercana. Los intermediarios construibles están omitidos.',
}: {
  targetName: string
  blockers: VistaFases['elements']
  conditions: string[]
  terminalReason: string
  stateOf: (element: VistaFases['elements'][number]) => EstadoElemento
  onSelect: (id: string) => void
  title?: string
  description?: string
}) {
  return (
    <section aria-label={`${title} de ${targetName}`} className="mt-4 rounded-lg border border-amber-500/35 bg-amber-950/10 p-3">
      <div className="flex items-center gap-2 text-amber-100">
        <TriangleAlert aria-hidden="true" className="h-4 w-4 shrink-0" />
        <h4 className="text-xs uppercase tracking-[0.16em]">{title}</h4>
      </div>
      {blockers.length > 0 || conditions.length > 0 ? (
        <>
          <p className="mt-2 text-xs leading-5 text-fog">{description}</p>
          {blockers.length > 0 && (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {blockers.map((element) => {
                const meta = ESTADO_META[stateOf(element)]
                return (
                  <button
                    key={element.id}
                    type="button"
                    onClick={() => onSelect(element.id)}
                    className={`flex min-w-0 items-center gap-2 rounded-md border p-2 text-left transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-brass ${meta.className}`}
                  >
                    <IconoElemento iconKey={element.iconKey} className="h-5 w-5 shrink-0" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-medium">{element.name}</span>
                      <span className="block text-[10px] uppercase tracking-wider opacity-70">{meta.label}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          )}
          {conditions.length > 0 && (
            <ul className="mt-3 space-y-1 text-xs text-amber-100/85">
              {conditions.map((condition) => <li key={condition}>· {condition}</li>)}
            </ul>
          )}
        </>
      ) : (
        <p className="mt-2 text-xs leading-5 text-fog">{terminalReason}</p>
      )}
    </section>
  )
}
