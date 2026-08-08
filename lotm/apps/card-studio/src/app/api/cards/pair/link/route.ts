import { NextResponse } from 'next/server'
import { LinkCardPairSchema } from '@/domain/schema'
import { cardsRepository } from '@/server/cardsDb'
import { badRequest } from '@/server/apiError'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const cards = cardsRepository.linkCardPair(LinkCardPairSchema.parse(await request.json()))
    return NextResponse.json({ cards }, { status: 201 })
  } catch (error) {
    return badRequest(error, 'No se pudo enlazar la carta con su fundamento.')
  }
}
