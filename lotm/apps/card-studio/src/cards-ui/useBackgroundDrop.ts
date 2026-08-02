import type { DragEventHandler } from 'react'

export type BackgroundDropHandler = (file: File) => void

export type BackgroundDropProps = {
  onDragOver: DragEventHandler<HTMLElement>
  onDragLeave: DragEventHandler<HTMLElement>
  onDrop: DragEventHandler<HTMLElement>
}

export function useBackgroundDrop(onDropBackground?: BackgroundDropHandler) {
  if (!onDropBackground) return { dragging: false, dropProps: {} }

  const dropProps: BackgroundDropProps = {
    onDragOver: (event) => {
      event.preventDefault()
    },
    onDragLeave: () => undefined,
    onDrop: (event) => {
      event.preventDefault()
      const file = [...(event.dataTransfer?.files ?? [])].find((item) => item.type.startsWith('image/'))
      if (file) onDropBackground(file)
    },
  }

  return { dragging: false, dropProps }
}