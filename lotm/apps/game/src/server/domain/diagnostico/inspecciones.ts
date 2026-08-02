import 'server-only'
// Inspecciones derivadas del analisis: alcanzabilidad, duplicados y ciclos.

import type {
  DiagAdvance,
  DiagElement,
  DiagRecipe,
  DiagRitual,
  DiagRitualSequenceMismatch,
  DiagSequence,
  DiagTrigger,
} from './tipos'
import { analizarProgresion } from './analisis'

// ---------------------------------------------------------------------------
// Funciones de compatibilidad (se mantienen para no romper el panel)
// ---------------------------------------------------------------------------

export function calcularAlcanzables(
  elements: DiagElement[],
  recipes: DiagRecipe[],
  sequences: DiagSequence[] = [],
  advances: DiagAdvance[] = [],
  triggers: DiagTrigger[] = [],
): Set<string> {
  const analisis = analizarProgresion(elements, recipes, sequences, advances, triggers)
  return new Set(
    elements.filter((e) => analisis.get(e.id)?.reachable).map((e) => e.id),
  )
}

export function elementosInalcanzables(
  elements: DiagElement[],
  recipes: DiagRecipe[],
  sequences: DiagSequence[] = [],
  advances: DiagAdvance[] = [],
  triggers: DiagTrigger[] = [],
): DiagElement[] {
  const analisis = analizarProgresion(elements, recipes, sequences, advances, triggers)
  return elements.filter((e) => e.isActive && !analisis.get(e.id)?.reachable)
}

/** Recetas que comparten inputKey (datos antiguos o importaciones inválidas). */
export function recetasDuplicadas(recipes: DiagRecipe[]): Map<string, DiagRecipe[]> {
  const byKey = new Map<string, DiagRecipe[]>()
  for (const r of recipes) {
    const list = byKey.get(r.inputKey) ?? []
    list.push(r)
    byKey.set(r.inputKey, list)
  }
  return new Map([...byKey.entries()].filter(([, list]) => list.length > 1))
}

export function ritualesConSecuenciaOrigenInconsistente(
  rituals: DiagRitual[],
  advances: DiagAdvance[],
  sequences: DiagSequence[],
): DiagRitualSequenceMismatch[] {
  const advanceById = new Map(advances.map((advance) => [advance.id, advance]))
  const sequenceById = new Map(sequences.map((sequence) => [sequence.id, sequence]))

  return rituals.flatMap((ritual) => {
    const advance = advanceById.get(ritual.advanceId)
    const sourceSequenceNumber = advance
      ? (sequenceById.get(advance.sourceSequenceId)?.number ?? null)
      : null
    return sourceSequenceNumber === ritual.requiredSequenceNumber
      ? []
      : [
          {
            ritualId: ritual.id,
            ritualName: ritual.name,
            requiredSequenceNumber: ritual.requiredSequenceNumber,
            sourceSequenceNumber,
          },
        ]
  })
}

/**
 * Ciclos en el grafo ingrediente → resultado (A produce B y B produce A).
 * Solo advertencia: pueden ser intencionales. Devuelve los ciclos hallados
 * como listas de ids de elementos.
 */
export function detectarCiclos(recipes: DiagRecipe[]): string[][] {
  const edges = new Map<string, Set<string>>()
  for (const r of recipes.filter((x) => x.isActive)) {
    for (const ing of r.ingredients) {
      if (!edges.has(ing.elementId)) edges.set(ing.elementId, new Set())
      for (const oid of r.outputElementIds) {
        edges.get(ing.elementId)?.add(oid)
      }
    }
  }

  const cycles: string[][] = []
  const seenCycleKeys = new Set<string>()
  const state = new Map<string, 'visiting' | 'done'>()
  const stack: string[] = []

  const visit = (node: string) => {
    state.set(node, 'visiting')
    stack.push(node)
    for (const next of edges.get(node) ?? []) {
      const s = state.get(next)
      if (s === 'visiting') {
        const start = stack.indexOf(next)
        const cycle = stack.slice(start)
        const key = [...cycle].sort().join('>')
        if (!seenCycleKeys.has(key)) {
          seenCycleKeys.add(key)
          cycles.push([...cycle, next])
        }
      } else if (!s) {
        visit(next)
      }
    }
    stack.pop()
    state.set(node, 'done')
  }

  for (const node of edges.keys()) {
    if (!state.has(node)) visit(node)
  }
  return cycles
}

/**
 * Elementos "sin uso": no son iniciales, no participan en ninguna receta
 * válida, avance, ritual o desbloqueo activo, ni representan una secuencia.
 */
export function elementosSinUso(
  elements: DiagElement[],
  recipes: DiagRecipe[],
  sequences: DiagSequence[],
  advances: DiagAdvance[],
  rituals: DiagRitual[],
  triggers: DiagTrigger[] = [],
): DiagElement[] {
  const analisis = analizarProgresion(elements, recipes, sequences, advances, triggers)
  const secuenciaElementIds = new Set(sequences.map((s) => s.elementId))
  const activos = elements.filter((e) => e.isActive)

  return elements.filter((e) => {
    if (!e.isActive || e.isStarter) return false
    const part = analisis.get(e.id)?.participation
    if (!part) return false
    const enRitual = rituals.some(
      (r) => r.isActive && r.ingredients.some((i) => i.elementId === e.id),
    )
    const enTrigger = triggers.some(
      (t) => t.elementId === e.id || t.triggerId === e.id,
    )
    const enSpontaneous =
      e.unlockedByType != null ||
      e.unlockedBySequenceNumber != null ||
      e.unlockedAtDiscoveryCount != null ||
      e.requiredElementIds.length > 0
    const esRequisitoAND = activos.some((x) => x.requiredElementIds.includes(e.id))
    return (
      part.total === 0 &&
      !secuenciaElementIds.has(e.id) &&
      !enRitual &&
      !enTrigger &&
      !enSpontaneous &&
      !esRequisitoAND
    )
  })
}
