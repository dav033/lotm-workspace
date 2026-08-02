import 'server-only'
// Formas del documento de exportacion nominal (v2/v4).

import type { PhaseRule } from '@/shared/phaseRules'

export type RecetaNominal = {
  tipo: 'RECETA'
  nombre?: string
  ingredientes: string[]
  descubrimientosMinimos: number
  isActive: boolean
}

export type ElementoDesencadenanteNominal = {
  elemento: string
  camino?: string
  secuencia?: number
  nombreSecuencia?: string
}

export type OrigenElementoNominal =
  | { tipo: 'INICIAL' }
  | { tipo: 'APERTURA_FASE'; fase: string }
  | { tipo: 'SIN_ORIGEN_CONFIGURADO' }
  | RecetaNominal
  | {
      tipo: 'AVANCE'
      nombreInterno: string
      camino: string
      origen: SecuenciaResumida
      destino: SecuenciaResumida
      ingredientes: string[]
      isActive: boolean
    }
  | {
      tipo: 'FALLO_RITUAL'
      nombre: string
      avance: string
      camino: string
      origen: SecuenciaResumida
      destino: SecuenciaResumida
      requiredSequenceNumber: number
      ingredientes: string[]
      isActive: boolean
    }
  | { tipo: 'DESBLOQUEO_TIPO'; tipoElemento: string }
  | { tipo: 'DESBLOQUEO_SECUENCIA'; secuencia: number; alcance: 'CUALQUIER_CAMINO' }
  | { tipo: 'DESBLOQUEO_CANTIDAD'; cantidadMinima: number }
  | { tipo: 'DESBLOQUEO_ELEMENTO'; desencadenante: ElementoDesencadenanteNominal }
  | { tipo: 'DESBLOQUEO_CONJUNTO'; requisitos: ElementoDesencadenanteNominal[] }

// Receta donde el elemento participa como ingrediente (la otra dirección de
// `combinaciones`: no quién lo produce, sino qué ayuda a producir).
export type UsoRecetaNominal = {
  tipo: 'USO_RECETA'
  nombre?: string
  ingredientes: string[]
  produce: string[]
  descubrimientosMinimos: number
  isActive: boolean
}

export type UsoAvanceNominal = {
  tipo: 'USO_AVANCE'
  nombreInterno: string
  camino: string
  origen: SecuenciaResumida
  destino: SecuenciaResumida
  isActive: boolean
}

export type UsoRitualNominal = {
  tipo: 'USO_RITUAL'
  nombre: string
  avance: string
  isActive: boolean
}

export type ElementoNominal = {
  tipo: 'ELEMENTO'
  slug: string
  nombre: string
  descripcion: string
  tipoElemento: string
  nivel: number
  categorias: string[]
  isActive: boolean
  // Progresión: el mismo análisis que alimenta el panel de diagnóstico.
  alcanzable: boolean
  /** Pasos encadenados de la ruta más corta desde un elemento inicial. */
  profundidad: number | null
  dificultad: string
  /** Mejor forma de conseguirlo hoy, en lenguaje humano. */
  rutaMasFacil: string
  /** Resumen de vías alternativas ("2 recetas · 1 avance"). */
  resumenRutas: string
  faseApertura: string | null
  condicionesDesbloqueo: {
    cualquieraDe: ElementoDesencadenanteNominal[]
    todas: {
      tipoElemento: string | null
      secuencia: number | null
      cantidadMinima: number | null
      elementos: ElementoDesencadenanteNominal[]
    }
  }
  // Bloqueos espontáneos (qué lo despierta) y su reverso (a quién despierta).
  desbloqueadoPorTipo: string | null
  desbloqueadoPorSecuencia: number | null
  desbloqueadoPorCantidad: number | null
  desbloqueadoPorCualquieraDe: string[]
  desbloqueadoPorTodos: string[]
  desbloquea: string[]
  esRequisitoDe: string[]
  camino?: string
  secuencia?: number
  nombreSecuencia?: string
  // Combinaciones en ambas direcciones: quién lo produce y dónde participa.
  combinaciones: RecetaNominal[]
  usosEnRecetas: UsoRecetaNominal[]
  usosEnAvances: UsoAvanceNominal[]
  usosEnRituales: UsoRitualNominal[]
  origenes: OrigenElementoNominal[]
}

export type RitualNominal = {
  tipo: 'RITUAL'
  nombre: string
  isActive: boolean
  requiredSequenceNumber: number
  ingredientes: string[]
  consecuenciasFallo: string[]
}

export type AvanceNominal = {
  tipo: 'AVANCE'
  nombreInterno: string
  isActive: boolean
  ingredientes: string[]
}

export type SecuenciaResumida = {
  tipo: 'SECUENCIA'
  numero: number
  nombre: string
  elemento: string
}

export type AscensionNominal = {
  tipo: 'ASCENSION'
  origen: SecuenciaResumida
  destino: SecuenciaResumida
  avance: AvanceNominal
  rituales: RitualNominal[]
}

export type SecuenciaNominal = {
  tipo: 'SECUENCIA'
  numero: number
  nombre: string
  elemento: string
  ascensiones: AscensionNominal[]
}

export type CaminoNominal = {
  tipo: 'CAMINO'
  nombre: string
  isActive: boolean
  secuencias: SecuenciaNominal[]
}

export type NodoNominal =
  | FaseNominal
  | ElementoNominal
  | RecetaNominal
  | CaminoNominal
  | SecuenciaNominal
  | AscensionNominal
  | AvanceNominal
  | RitualNominal

export type FaseNominal = {
  tipo: 'FASE'
  slug: string
  nombre: string
  descripcion: string
  orden: number
  isActive: boolean
  cierreAlcanzableAnterior: number
  reglaAvance: PhaseRule
  resumenRegla: string
  mensajeCelebracion: string
  elementosIniciales: string[]
}

export type DocumentoElementosNominal = {
  version: 4
  exportadoEn: string
  fases: FaseNominal[]
  elementos: ElementoNominal[]
  caminos: CaminoNominal[]
}

// Exportación nominal para lectura humana o LLM: contrato TypeScript explícito,
// sin garantías de compatibilidad con formas anteriores. Cada nodo lleva un
// discriminador literal para que el tipo sea inequívoco. La v3 añade
// procedencia completa en ambos sentidos (quién produce cada cosa y dónde se
// usa) más la profundidad y dificultad del análisis de progresión.
