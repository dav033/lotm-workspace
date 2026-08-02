'use client'

import { useMemo } from 'react'
import { ArbolConexiones } from '../../ArbolConexiones'
import type { VistaFases } from '@/shared/adminTree'
import { construirSubgrafoFase } from '../subgrafoFase'
import type { GrafoFases } from './types'

export function GrafoDeFase({
  grafo,
  phase,
  previousPhase,
  inactiveRecipeIds,
  selectedElementId,
  onSelectElement,
}: {
  grafo: GrafoFases
  phase: VistaFases['phases'][number]
  previousPhase: VistaFases['phases'][number] | undefined
  inactiveRecipeIds: readonly string[]
  selectedElementId: string | null
  onSelectElement: (id: string | null) => void
}) {
  const subgrafo = useMemo(() => {
    return construirSubgrafoFase({
      nodos: grafo.nodos,
      aristas: grafo.aristas,
      phaseElementIds: phase.ownElementIds,
      initialElementIds: phase.initialElementIds,
      reachableElementIds: phase.reachableElementIds,
      previousReachableElementIds: previousPhase?.reachableElementIds ?? [],
      inactiveRecipeIds,
    })
  }, [grafo, phase, previousPhase, inactiveRecipeIds])

  const selectedNodeId = selectedElementId && subgrafo.nodos.some(
    (nodo) => nodo.id === `el:${selectedElementId}`,
  )
    ? `el:${selectedElementId}`
    : null

  return (
    <section
      aria-labelledby={`mapa-fase-${phase.id}`}
      className="mist-card rounded-xl border border-brass/25 p-4"
    >
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2
            id={`mapa-fase-${phase.id}`}
            className="font-[family-name:var(--font-display)] text-xl text-parchment"
          >
            Mapa de conexiones de {phase.name}
          </h2>
          <p className="mt-1 text-xs text-fog">
            Rutas que vuelven alcanzables los nuevos elementos de la etapa.
          </p>
        </div>
        <span className="rounded-full border border-line px-2.5 py-1 text-xs tabular-nums text-fog">
          {subgrafo.nodos.length} nodos · {subgrafo.aristas.length} conexiones
        </span>
      </div>
      {subgrafo.nodos.length === 0 ? (
        <p className="rounded-lg border border-line bg-black/15 p-4 text-sm text-fog">
          Esta fase todavía no tiene elementos ni conexiones.
        </p>
      ) : (
        <ArbolConexiones
          nodos={subgrafo.nodos}
          aristas={subgrafo.aristas}
          caminos={grafo.caminos}
          seleccionId={selectedNodeId}
          onSeleccionChange={(id) => {
            onSelectElement(id?.startsWith('el:') ? id.slice(3) : null)
          }}
          mostrarDetalle={false}
          titulo={`Dependencias de ${phase.name}`}
          subtitulo="Selecciona un elemento para abrir su expediente y editarlo."
        />
      )}
    </section>
  )
}


