export const ADVANCE_TOKEN_PREFIX = 'advance-'

export function advanceToken(id: string): string {
  return `${ADVANCE_TOKEN_PREFIX}${id}`
}

export function advanceIdFromToken(token: string): string | null {
  if (!token.startsWith(ADVANCE_TOKEN_PREFIX)) return null
  const id = token.slice(ADVANCE_TOKEN_PREFIX.length)
  return id || null
}
