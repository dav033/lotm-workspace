export const FEATURE_KEYS = ['ADVANCEMENT_RITUALS'] as const

export const FEATURE_DEFINITIONS = [
  {
    key: 'ADVANCEMENT_RITUALS',
    label: 'Rituales de avance',
    description: 'Permite preparar rituales y aplicar avances que requieren uno.',
    defaultMinimumPhaseSortOrder: 6,
  },
] as const

export type FeatureKey = (typeof FEATURE_KEYS)[number]
export type FeatureState = Record<FeatureKey, boolean>

/**
 * Estado de las features del juego. **Siempre todas activas, sin límites.**
 *
 * Decisión del propietario (ADR-006): el archivo no debe esconderle nada a
 * quien lo usa. Los parámetros se conservan —las filas `FeatureGate` siguen
 * existiendo, el panel de fases las sigue editando y la exportación las sigue
 * incluyendo— pero ya no deciden nada: son el ajuste que habría que volver a
 * leer aquí si algún día se quisiera recuperar el escalonado por fase.
 *
 * Ojo al alcance: como la autenticación está desactivada (ADR-001) no existe
 * forma de distinguir al propietario de un visitante, así que esto abre las
 * features para todo el mundo, no solo para el panel admin.
 */
export function resolveFeatureState(
  _gates: readonly { key: string; minimumPhaseSortOrder: number }[],
  _currentPhaseSortOrder: number,
): FeatureState {
  return Object.fromEntries(FEATURE_DEFINITIONS.map(({ key }) => [key, true])) as FeatureState
}
