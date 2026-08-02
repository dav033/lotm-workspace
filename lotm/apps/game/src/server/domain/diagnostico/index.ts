import 'server-only'
// Punto de entrada del diagnostico. Reexporta exactamente la API publica que
// existia en el modulo unico, para no tocar a sus consumidores.

export type {
  DiagAdvance,
  DiagBestRoute,
  DiagElement,
  DiagElementResult,
  DiagParticipation,
  DiagRecipe,
  DiagRitual,
  DiagRitualSequenceMismatch,
  DiagRouteKind,
  DiagSequence,
  DiagTrigger,
} from './tipos'

export { etiquetaRuta, resumenParticipacion } from './calculos'

export { analizarProgresion } from './analisis'

export {
  calcularAlcanzables,
  detectarCiclos,
  elementosInalcanzables,
  elementosSinUso,
  recetasDuplicadas,
  ritualesConSecuenciaOrigenInconsistente,
} from './inspecciones'
