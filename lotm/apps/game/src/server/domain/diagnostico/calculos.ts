import 'server-only'
// Calculadores puros y etiquetas del diagnostico. Sin acceso a datos.

import type { DiagDifficulty } from '@/shared/dificultad'
import type { DiagBestRoute, DiagParticipation, DiagRouteKind } from './tipos'

// ---------------------------------------------------------------------------
// Helpers internos
// ---------------------------------------------------------------------------

export function totalQuantity(items: { quantity: number }[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}

function idsUnicos(ids: string[]): string[] {
  return [...new Set(ids)]
}

export function costoConjunto(
  ids: string[],
  costos: Map<string, number | null>,
): number | null {
  let total = 0
  for (const id of idsUnicos(ids)) {
    const c = costos.get(id)
    if (c == null) return null
    total += c
  }
  return total
}

export function profundidadConjunto(
  ids: string[],
  profundidades: Map<string, number | null>,
): number | null {
  let max = -1
  for (const id of idsUnicos(ids)) {
    const p = profundidades.get(id)
    if (p == null) return null
    if (p > max) max = p
  }
  return max === -1 ? 0 : max
}

export function dificultadDe(
  costo: number | null,
  profundidad: number | null,
  requiereRitual: boolean,
  alternativas: number,
  alcanzable: boolean,
  tipoRuta: DiagRouteKind,
): DiagDifficulty {
  if (!alcanzable) return 'impossible'
  if (tipoRuta === 'starter') return 'trivial'
  const penalizacionAlternativas = alternativas <= 1 ? 1 : 0
  const bonusProfundidad = (profundidad ?? 0) > 3 ? 1 : 0
  const score =
    (costo ?? 0) + (requiereRitual ? 3 : 0) + bonusProfundidad + penalizacionAlternativas
  if (score <= 1) return 'trivial'
  if (score <= 3) return 'easy'
  if (score <= 6) return 'moderate'
  if (score <= 10) return 'hard'
  return 'extreme'
}

export function resumenRutas(
  recetasValidas: number,
  alternativasAvance: number,
  alternativasRitual: number,
  alternativasEspontaneas: number,
  alternativasFallo: number,
  esInicial: boolean,
): string {
  const partes: string[] = []
  if (esInicial) partes.push('Inicial')
  if (recetasValidas > 0) partes.push(`${recetasValidas} receta${recetasValidas === 1 ? '' : 's'}`)
  if (alternativasAvance > 0 && alternativasRitual === 0)
    partes.push(`${alternativasAvance} avance${alternativasAvance === 1 ? '' : 's'}`)
  if (alternativasRitual > 0)
    partes.push(`${alternativasRitual} ritual${alternativasRitual === 1 ? '' : 's'}`)
  if (alternativasEspontaneas > 0)
    partes.push(`${alternativasEspontaneas} desbloqueo${alternativasEspontaneas === 1 ? '' : 's'}`)
  if (alternativasFallo > 0)
    partes.push(`${alternativasFallo} fallo${alternativasFallo === 1 ? '' : 's'}`)
  return partes.length > 0 ? partes.join(' · ') : '—'
}

export function resumenParticipacion(p: DiagParticipation): string {
  return `${p.total} (R:${p.recipes} A:${p.advances} Ri:${p.rituals} D:${p.spontaneous})`
}

/** Etiqueta corta y legible de la mejor ruta encontrada hacia un elemento. */
export function etiquetaRuta(ruta: DiagBestRoute): string {
  if (ruta.kind === 'unreachable') return 'Sin ruta válida'
  if (ruta.kind === 'starter') return 'Inicial'
  if (ruta.kind === 'spontaneous') return ruta.label
  if (ruta.kind === 'recipe') return `Receta ${ruta.detail}`
  if (ruta.kind === 'advance') return `Ascensión ${ruta.detail}`
  return `Fallo ${ruta.detail}`
}

export function compararRutas(
  a: { costo: number | null; profundidad: number | null },
  b: { costo: number | null; profundidad: number | null },
): boolean {
  // a es mejor que b? Igualdad no mejora: evita oscilaciones por tie-break.
  const ca = a.costo ?? Infinity
  const cb = b.costo ?? Infinity
  if (ca !== cb) return ca < cb
  const pa = a.profundidad ?? Infinity
  const pb = b.profundidad ?? Infinity
  return pa < pb
}

