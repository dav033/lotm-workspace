import { NextResponse } from 'next/server'
import { uploadTikTokCarousel } from '@/server/tiktok'
import { tiktokErrorResponse } from '@/server/tiktokHttp'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const input = await request.json()
    const result = await uploadTikTokCarousel(input)
    return NextResponse.json({
      success: true,
      publishId: result.publishId,
      message: 'Carousel sent. Open the TikTok inbox notification on your phone.',
    })
  } catch (error) {
    return tiktokErrorResponse(error, 'Carousel upload failed.')
  }
}
