'use client'

export type VideoFormat = 'card' | 'shorts'

export async function downloadVideo(form: FormData, formats: readonly VideoFormat[] = ['card', 'shorts']) {
  for (const format of formats) {
    form.set('format', format)
    const response = await fetch('/api/cards/video', { method: 'POST', body: form })
    if (!response.ok) {
      const body = await response.json().catch(() => null) as { error?: string } | null
      throw new Error(body?.error ?? `No se pudo generar el video (HTTP ${response.status}).`)
    }
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = response.headers.get('Content-Disposition')?.match(/filename="([^"]+)"/)?.[1]
      ?? `cartas-${format}.mp4`
    anchor.click()
    URL.revokeObjectURL(url)
  }
}
