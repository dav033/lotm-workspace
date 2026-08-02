import type { PhaseRule } from './phaseRules'

export type FaseVista = {
  id: string
  slug: string
  name: string
  description: string
  sortOrder: number
  unlockAtDiscoveryCount: number
  celebrationMessage: string | null
  isActive: boolean
  advancementRule: PhaseRule
  advancementRuleSummary: string
  reachableElementIds: string[]
  reachableRitualIds: string[]
  preparedRitualIds: string[]
  availableElementIds: string[]
  unreachableAvailableElementIds: string[]
  frontierElementIds: string[]
  impactElementIdsBySourceId: Record<string, string[]>
  blockersByElementId: Record<string, { elementIds: string[]; conditions: string[]; steps: number | null }>
  ritualBlockersById: Record<string, { elementIds: string[]; conditions: string[]; steps: number | null }>
  initialElementIds: string[]
  newReachableElementIds: string[]
  ownElementIds: string[]
  newReachableRitualIds: string[]
  ownRitualIds: string[]
}

export type ElementoFaseVista = {
  id: string
  slug: string
  name: string
  description: string
  iconKey: string
  type: string
  isBeyonderSequence: boolean
  tier: number
  isStarter: boolean
  isActive: boolean
  unlockedAtDiscoveryCount: number | null
  requiredElementIds: string[]
  availableFromPhaseId: string | null
  availableFromPhaseOrder: number | null
  availableFromPhaseIsActive?: boolean
}

export type RecetaFaseVista = {
  id: string
  name: string
  inputKey: string
  isActive: boolean
  successText: string
  hintText: string
  ingredientes: { elementId: string; quantity: number }[]
  outputs: { elementId: string; quantity: number; chance: number; sortOrder: number }[]
  ingredientElementIds: string[]
  outputElementIds: string[]
}

export type AvanceFaseVista = {
  id: string
  internalName: string
  isActive: boolean
  sourceElementId: string
  targetElementId: string
  sourceSequenceNumber: number
  targetSequenceNumber: number
  ingredientElementIds: string[]
}

export type RitualFaseVista = {
  id: string
  name: string
  inputKey: string
  isActive: boolean
  requiredSequenceNumber: number
  advanceId: string
  advanceName: string
  advanceIsActive: boolean
  sourceElementId: string
  targetElementId: string
  ingredientElementIds: string[]
  failureOutputElementIds: string[]
}

export type VistaFases = {
  phases: FaseVista[]
  featureGates: { key: string; minimumPhaseSortOrder: number }[]
  caminos: { id: string; name: string }[]
  categorias: { id: string; name: string }[]
  recipeOutputElementIds: string[]
  elements: ElementoFaseVista[]
  recipes: RecetaFaseVista[]
  advances: AvanceFaseVista[]
  rituals: RitualFaseVista[]
}

export type EspinaSecuencia = {
  numero: number
  nombre: string
  descripcion: string | null
  elementoId: string
  elementoNombre: string
  elementoDescripcion: string
  iconKey: string
  tipo: string
  activo: boolean
  recetas: string[]
  desbloqueos: string[]
  usadoEnRecetas: number
}

export type EspinaRitual = {
  nombre: string
  exigeSecuencia: number
  ingredientes: string
  fallos: string[]
  activo: boolean
}

export type EspinaAvance = {
  nombre: string
  deNumero: number
  aNumero: number
  ingredientes: string
  activo: boolean
  rituales: EspinaRitual[]
}

export type EspinaCamino = {
  camino: { id: string; nombre: string; descripcion: string; index: number }
  secuencias: EspinaSecuencia[]
  avances: EspinaAvance[]
}

export type ResumenImportacion = {
  fases: number
  featureGates: number
  categorias: number
  elementos: number
  caminos: number
  secuencias: number
  recetas: number
  avances: number
  rituales: number
  logros: number
  problemas: string[]
}
