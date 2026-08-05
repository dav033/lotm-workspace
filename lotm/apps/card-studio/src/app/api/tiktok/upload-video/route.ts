import { NextResponse } from 'next/server'
import { uploadTikTokVideo } from '@/server/tiktok'
import { tiktokErrorResponse } from '@/server/tiktokHttp'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 600

export async function POST(request: Request) {
  try {
    const file = (await request.formData()).get('video')
    if (!(file instanceof File)) return NextResponse.json({ error: 'Select a video file.' }, { status: 400 })
    const result = await uploadTikTokVideo(file)
    return NextResponse.json({
      success: true,
      publishId: result.publishId,
      chunks: result.chunks,
      message: 'Video sent. Open the TikTok inbox notification on your phone.',
    })
  } catch (error) {
    return tiktokErrorResponse(error, 'Video upload failed.')
  }
}
