import { NextResponse } from 'next/server'

export function tiktokErrorResponse(error: unknown, fallback: string): NextResponse {
  const message = error instanceof Error ? error.message : fallback
  console.error('[tiktok]', message)
  return NextResponse.json({ error: message }, { status: 400 })
}
