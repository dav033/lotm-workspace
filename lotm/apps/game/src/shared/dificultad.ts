export type DiagDifficulty =
  | 'trivial'
  | 'easy'
  | 'moderate'
  | 'hard'
  | 'extreme'
  | 'impossible'

export const DIFICULTAD_LABELS: Record<DiagDifficulty, string> = {
  trivial: 'Trivial',
  easy: 'Fácil',
  moderate: 'Moderada',
  hard: 'Difícil',
  extreme: 'Extrema',
  impossible: 'Inalcanzable',
}

export const DIFICULTAD_ORDEN: Record<DiagDifficulty, number> = {
  impossible: 100,
  extreme: 5,
  hard: 4,
  moderate: 3,
  easy: 2,
  trivial: 1,
}

export function colorDificultad(difficulty: DiagDifficulty): string {
  switch (difficulty) {
    case 'impossible':
      return 'bg-wine/20 text-wine'
    case 'extreme':
      return 'bg-red-900/30 text-red-200'
    case 'hard':
      return 'bg-orange-900/30 text-orange-200'
    case 'moderate':
      return 'bg-yellow-900/30 text-yellow-200'
    case 'easy':
      return 'bg-green-900/30 text-green-200'
    case 'trivial':
      return 'bg-brass/20 text-brass'
  }
}
