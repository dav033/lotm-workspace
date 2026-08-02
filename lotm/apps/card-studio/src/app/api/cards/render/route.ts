import { NextResponse } from 'next/server'
import { CardContentSchema } from '@/domain/schema'
import { CardPngRenderer } from '@/server/render/renderer'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json() as { card?: unknown }
    const content = CardContentSchema.parse(body.card)
    const renderer = await CardPngRenderer.create()
    try {
      return new Response(await renderer.render(content) as unknown as BodyInit, {
        headers: { 'Content-Type': 'image/png', 'Cache-Control': 'no-store' },
      })
    } finally {
      await renderer.close()
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'No se pudo renderizar la carta.' },
      { status: 400 },
    )
  }
}
