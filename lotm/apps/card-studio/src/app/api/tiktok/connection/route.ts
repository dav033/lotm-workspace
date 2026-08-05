import { NextResponse } from 'next/server'
import {
  getTikTokConfig,
  getTikTokConnection,
  toTikTokConnectionView,
} from '@/server/tiktok'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    getTikTokConfig()
  } catch {
    return NextResponse.json(toTikTokConnectionView(null, false))
  }

  try {
    return NextResponse.json(toTikTokConnectionView(await getTikTokConnection()))
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Could not read TikTok connection.' },
      { status: 500 },
    )
  }
}
