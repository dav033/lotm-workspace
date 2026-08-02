'use client'

export type EditorImage = {
  id: string
  universeId: string
  url: string
  durationSeconds: number | null
}

export function useImages(images: EditorImage[], universeId: string | null) {
  return images.filter((image) => image.universeId === universeId)
}
