import 'server-only'
// Tipos de entrada y salida del diagnostico del arbol de combinaciones.

import type { DiagDifficulty } from '@/shared/dificultad'

// ---------------------------------------------------------------------------
// Tipos de entrada
// ---------------------------------------------------------------------------

export type DiagElement = {
  id: string
  slug: string
  name: string
  type: string
  isStarter: boolean
  isActive: boolean
  unlockedByType: string | null
  unlockedBySequenceNumber: number | null
  unlockedAtDiscoveryCount: number | null
  requiredElementIds: string[]
}

// Desencadenante espontáneo: `elementId` se desbloquea al descubrir `triggerId`.
export type DiagTrigger = { elementId: string; triggerId: string }

export type DiagRecipe = {
  id: string
  inputKey: string
  isActive: boolean
  outputElementIds: string[]
  ingredients: { elementId: string; quantity: number }[]
}

export type DiagSequence = {
  id: string
  elementId: string
  pathwayId: string
  number: number
  name: string
  isActive: boolean
}

export type DiagRitual = {
  id: string
  advanceId: string
  name: string
  inputKey: string
  isActive: boolean
  requiredSequenceNumber: number
  ingredients: { elementId: string; quantity: number }[]
  failureOutputIds: string[]
}

export type DiagAdvance = {
  id: string
  internalName: string
  inputKey: string
  isActive: boolean
  sourceSequenceId: string
  targetSequenceId: string
  ingredients: { elementId: string; quantity: number }[]
  rituals: DiagRitual[]
}

// ---------------------------------------------------------------------------
// Tipos de salida
// ---------------------------------------------------------------------------

export type DiagRouteKind =
  | 'starter'
  | 'spontaneous'
  | 'recipe'
  | 'advance'
  | 'ritual-failure'
  | 'unreachable'

export type DiagBestRoute = {
  kind: DiagRouteKind
  label: string
  detail: string
  id?: string
}

export type DiagParticipation = {
  recipes: number
  advances: number
  rituals: number
  spontaneous: number
  total: number
}

export type DiagElementResult = {
  elementId: string
  reachable: boolean
  depth: number | null
  cost: number | null
  alternatives: number
  routeSummary: string
  participation: DiagParticipation
  bestRoute: DiagBestRoute
  routeRequiresRitual: boolean
  difficulty: DiagDifficulty
}

export type DiagRitualSequenceMismatch = {
  ritualId: string
  ritualName: string
  requiredSequenceNumber: number
  sourceSequenceNumber: number | null
}

