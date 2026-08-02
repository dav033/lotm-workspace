'use client'
import { IconoElemento } from '@/components/game/IconoElemento'
import type { VistaFases } from '@/shared/adminTree'

export function FichaElemento({
  id,
  elementById,
  onSelect,
}: {
  id: string
  elementById: Map<string, VistaFases['elements'][number]>
  onSelect: (id: string) => void
}) {
  const element = elementById.get(id)
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className="flex items-center gap-1.5 rounded-md border border-line2 bg-black/20 px-2 py-1 text-xs text-parchment transition hover:border-brass hover:text-brass focus-visible:ring-2 focus-visible:ring-brass"
    >
      <IconoElemento iconKey={element?.iconKey ?? ''} className="h-3.5 w-3.5 text-brass" />
      {element?.name ?? '?'}
    </button>
  )
}
