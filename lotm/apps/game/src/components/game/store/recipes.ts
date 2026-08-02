import type { RecetaPendiente } from '../tipos'

export function unidadesDePendiente(pendientes: RecetaPendiente[], recipeId: string) {
  const receta = pendientes.find((candidate) => candidate.recipeId === recipeId)
  if (!receta) return []
  return receta.ingredientes.flatMap((ingredient) =>
    Array.from({ length: ingredient.quantity }, () => ({
      ...ingredient,
      firstDiscoveredAt: '',
      timesCreated: 0,
    })),
  )
}
