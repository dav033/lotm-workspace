import { NextResponse } from 'next/server'
import {
  exchangeTikTokCode,
  oauthStateCookieOptions,
  TIKTOK_STATE_COOKIE,
} from '@/server/tiktok'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const target = new URL('/cartas', request.url)
  const params = new URL(request.url).searchParams
  const response = (key: string, value: string) => {
    target.searchParams.set(key, value)
    const redirect = NextResponse.redirect(target)
    redirect.cookies.set(TIKTOK_STATE_COOKIE, '', oauthStateCookieOptions(0))
    return redirect
  }

  const providerError = params.get('error')
  if (providerError) return response('tiktok_error', providerError)

  const state = params.get('state')
  const expectedState = request.headers.get('cookie')
    ?.split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${TIKTOK_STATE_COOKIE}=`))
    ?.slice(TIKTOK_STATE_COOKIE.length + 1)
  if (!state || !expectedState || state !== decodeURIComponent(expectedState)) return response('tiktok_error', 'invalid_oauth_state')

  const code = params.get('code')
  if (!code) return response('tiktok_error', 'missing_authorization_code')

  try {
    await exchangeTikTokCode(code)
    target.searchParams.set('tiktok_connected', '1')
    const redirect = NextResponse.redirect(target)
    redirect.cookies.set(TIKTOK_STATE_COOKIE, '', oauthStateCookieOptions(0))
    return redirect
  } catch (error) {
    return response('tiktok_error', error instanceof Error ? error.message : 'oauth_callback_failed')
  }
}
