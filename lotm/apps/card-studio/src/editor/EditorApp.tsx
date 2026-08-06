'use client'

import EditorWorkspace from './EditorWorkspace'
import { useEditorController } from './hooks/useEditorController'

export default function EditorApp() {
  const controller = useEditorController()
  return (
    <>
      <EditorWorkspace
        controller={controller}
        cards={controller.filmstrip}
        currentCardId={controller.editingId}
      />
    </>
  )
}
