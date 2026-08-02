// Formas del estado del juego y contrato de los slices de zustand.

import type { StateCreator } from 'zustand'
import type {
  AchievementPublicData,
  ApprenticeMemoryDelta,
  ResolvedCombineResult,
} from '@/shared/tipos'
import type { PublicRitualState } from '@/shared/ritualKnowledge'
import type { AbilityKey, PlayerAbilities, PotentialTier } from '@/shared/habilidades'
import type {
  EstadoMemoriaAprendiz,
  ModoInteraccion,
  ResultadoVidente,
} from '../estadoHabilidades'
import type {
  DestinoArrastre,
  ElementoDescubierto,
  EstadoJuego,
  InstanciaBandeja,
  PayloadArrastre,
  RecetaPendiente,
  TransicionFase,
} from '../tipos'

export type Aviso = { id: number; texto: string; tono: 'bruma' | 'peligro' }

export type JuegoState = {
  estado: EstadoJuego | null
  errorCarga: boolean
  slots: (ElementoDescubierto | null)[]
  combinando: boolean
  resultado: ResolvedCombineResult | null
  fallo: number // contador: reinicia la animación de sacudida
  /** Contador de resoluciones: re-monta tarjeta y partículas aunque se repita receta. */
  sello: number
  avisos: Aviso[]
  reiniciando: boolean
  faseAvanzando: boolean
  transicionFase: TransicionFase | null
  aperturasFase: string[]
  pendientes: RecetaPendiente[]
  logrosPendientes: AchievementPublicData[]
  tutorialAvance: boolean
  /** Slugs descubiertos en esta sesión: llevan la insignia «Nuevo» en el panel. */
  recientes: string[]
  /** Ficha en vuelo durante el arrastre (la posición la mueve el ghost, sin React). */
  arrastre: { payload: PayloadArrastre } | null
  objetivo: DestinoArrastre
  /** Conserva el primer elemento para encadenar pruebas sin reconstruir la mesa. */
  modoRapido: boolean
  /** Instancias visuales distribuidas por el jugador durante la sesión. */
  bandeja: InstanciaBandeja[]
  ritualState: PublicRitualState
  pendingRitualRisk: PendingRitualRisk | null
  ritualActionLoading: boolean
  abilities: PlayerAbilities
  modoInteraccion: ModoInteraccion
  seerCargando: boolean
  seerResultado: ResultadoVidente | null
  mysteryActivo: boolean
  mysteryCargando: boolean
  potencialPorElemento: Record<string, PotentialTier>
  memoriaAprendiz: EstadoMemoriaAprendiz
  cinematicMode: boolean

  iniciar: (esAdmin: boolean) => void
  cargarEstado: () => Promise<void>
  mostrarAviso: (texto: string, tono?: Aviso['tono']) => void
  cerrarAviso: (id: number) => void
  colocar: (el: ElementoDescubierto) => void
  retirar: (i: number) => void
  limpiar: () => void
  colocarEnSlot: (i: number, slug: string, origen?: PayloadArrastre['origen']) => void
  usarResultado: (elementId: string) => void
  autocompletarPendiente: (recipeId: string) => void
  combinarPendiente: (recipeId: string) => void
  ejecutarCombinacion: (
    slugA: string,
    slugB: string,
    opts: OpcionesCombinacion,
  ) => Promise<void>
  combinarDirecto: (slugA: string, slugB: string) => void
  reiniciar: () => Promise<void>
  avanzarFase: () => Promise<void>
  cerrarTransicionFase: () => void
  realizarRitual: (ritualId: string) => Promise<void>
  cancelarRiesgoRitual: () => void
  confirmarRiesgoRitual: () => Promise<void>
  cerrarLogro: () => void
  cerrarTutorialAvance: () => void
  setArrastre: (a: { payload: PayloadArrastre } | null) => void
  setObjetivo: (d: DestinoArrastre) => void
  marcarVisto: (slug: string) => void
  activarModoVidente: () => void
  cancelarModoVidente: () => void
  analizarConVidente: (elementId: string) => Promise<void>
  alternarMystery: () => Promise<void>
  refrescarPotencial: () => Promise<void>
  cargarMemoriaAprendiz: () => Promise<void>
  aplicarDeltaMemoriaAprendiz: (delta: ApprenticeMemoryDelta) => void
  alternarModoRapido: () => void
  toggleCinematicMode: () => void
  agregarABandeja: (slug: string, x: number, y: number) => void
  moverEnBandeja: (instanceId: string, x: number, y: number) => void
  combinarEnBandeja: (
    sourceInstanceId: string | null,
    targetInstanceId: string,
    sourceSlug: string,
    x: number,
    y: number,
  ) => void
  quitarDeBandeja: (instanceId: string) => void
  limpiarBandeja: () => void
}

export type OpcionesCombinacion = (
  | { origen: 'mesa' | 'directo' }
  | {
      origen: 'bandeja'
      bandeja: {
        sourceInstanceId: string | null
        targetInstanceId: string
        x: number
        y: number
      }
    }
) & { confirmRitualRisk?: boolean }

export type PendingRitualRisk = {
  elementos: [string, string]
  opciones: OpcionesCombinacion
}

/** Cada slice aporta un trozo de JuegoState y comparte set/get con los demas. */
export type SliceDeJuego<T> = StateCreator<JuegoState, [], [], T>
