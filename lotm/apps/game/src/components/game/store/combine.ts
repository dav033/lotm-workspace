import type { CombineResult } from '@/shared/tipos'

export function parseCombineResult(value: unknown): CombineResult {
  if (!value || typeof value !== 'object' || !('kind' in value)) {
    throw new Error('Invalid combination response.')
  }
  return value as CombineResult
}
