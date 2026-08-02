'use client'

import { useCallback } from 'react'

export async function downloadZip(partId?: string, filename = 'lotm-cards', universeId?: string) {
  const params = new URLSearchParams()
  if (partId) params.set('part', partId)
  if (universeId) params.set('universe', universeId)
  const query = params.toString() ? `?${params}` : ''
  const response = await fetch(`/api/cards/export${query}`, { cache: 'no-store' })
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { error?: string } | null
    throw new Error(body?.error ?? `No se pudo exportar el ZIP (HTTP ${response.status}).`)
  }
  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = response.headers.get('Content-Disposition')?.match(/filename="([^"]+)"/)?.[1]
    ?? `${filename}.zip`
  anchor.click()
  URL.revokeObjectURL(url)
}

export function useZipExport() {
  return useCallback(downloadZip, [])
}
