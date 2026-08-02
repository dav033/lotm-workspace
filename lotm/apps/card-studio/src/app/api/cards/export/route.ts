import { NextResponse } from 'next/server'
import { cardsRepository } from '@/server/cardsDb'
import { createCardsZip } from '@/server/export'
import { CardPngRenderer } from '@/server/render/renderer'
import { slugify } from '@/domain/slug'

export const dynamic = 'force-dynamic'

// The editor and MCP now share the same server renderer. This keeps a section
// download pixel-identical to the ZIP export used by the external tools.
export async function GET(request: Request) {
  const partId = new URL(request.url).searchParams.get('part')
  const universeId = new URL(request.url).searchParams.get('universe')
  const cards = (await cardsRepository.listCards()).filter((card) => (
    (!partId || card.part.id === partId) && (!universeId || card.universe.id === universeId)
  ))
  if (!cards.length) return NextResponse.json({ error: 'No hay cartas para exportar.' }, { status: 404 })

  const renderer = await CardPngRenderer.create()
  try {
    const archive = await createCardsZip(cards, (content) => renderer.render(content))
    return new Response(archive as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${slugify(partId ?? 'lotm-cards')}.zip"`,
        'Cache-Control': 'no-store',
      },
    })
  } finally {
    await renderer.close()
  }
}
