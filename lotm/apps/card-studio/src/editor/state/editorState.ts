import { useCallback, useState } from 'react'
import type { BuilderCardState } from '../../domain/schema'

export type EditorPatch = Partial<BuilderCardState>

// Keep the editor's patch contract small and stable. Server session state stays
// in useCardSession; this hook owns only the draft currently on the canvas.
export function useEditorState(initialState: BuilderCardState) {
  const [state, setState] = useState(initialState)
  const patch = useCallback((changes: EditorPatch) => {
    setState((current) => ({ ...current, ...changes }))
  }, [])
  return { state, setState, patch }
}
