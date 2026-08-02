'use client'

import EditorWorkspace from './EditorWorkspace'
import { useEditorController } from './hooks/useEditorController'

export default function EditorApp() {
  return <EditorWorkspace controller={useEditorController()} />
}
