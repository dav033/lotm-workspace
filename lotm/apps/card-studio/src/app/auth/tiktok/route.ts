import { NextResponse } from 'next/server'
import {
  createOAuthState,
  getTikTokConfig,
  oauthStateCookieOptions,
  TIKTOK_STATE_COOKIE,
} from '@/server/tiktok'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const config = getTikTokConfig()
    const state = createOAuthState()
    const params = new URLSearchParams({
      client_key: config.clientKey,
      scope: 'user.info.basic,video.upload',
      response_type: 'code',
      redirect_uri: config.redirectUri,
      state,
    })
    const response = NextResponse.redirect(`https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`)
    response.cookies.set(TIKTOK_STATE_COOKIE, state, oauthStateCookieOptions())
    return response
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'TikTok is not configured.' },
      { status: 503 },
    )
  }
}
