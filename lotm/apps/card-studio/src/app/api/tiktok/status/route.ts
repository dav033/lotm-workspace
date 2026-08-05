import { NextResponse } from 'next/server'
import { fetchTikTokStatus } from '@/server/tiktok'
import { tiktokErrorResponse } from '@/server/tiktokHttp'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { publishId } = await request.json()
    return NextResponse.json(await fetchTikTokStatus(String(publishId ?? '')))
  } catch (error) {
    return tiktokErrorResponse(error, 'Could not read TikTok status.')
  }
}
