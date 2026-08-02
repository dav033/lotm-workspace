import type { AbilityKey, PlayerAbilities } from '@/shared/habilidades'

export function nuevosDesbloqueos(
  antes: PlayerAbilities,
  despues: PlayerAbilities,
): AbilityKey[] {
  return (Object.keys(antes) as AbilityKey[]).filter(
    (key) => !antes[key].unlocked && despues[key].unlocked,
  )
}
