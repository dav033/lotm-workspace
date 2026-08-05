import { NextResponse } from 'next/server'
import { disconnectTikTok } from '@/server/tiktok'
import { tiktokErrorResponse } from '@/server/tiktokHttp'

export const runtime = 'nodejs'

export async function POST() {
  try {
    await disconnectTikTok()
    return NextResponse.json({ success: true })
  } catch (error) {
    return tiktokErrorResponse(error, 'Could not disconnect TikTok.')
  }
}
