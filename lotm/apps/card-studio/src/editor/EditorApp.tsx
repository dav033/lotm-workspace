'use client'

import EditorWorkspace from './EditorWorkspace'
import TikTokTransfer from './components/TikTokTransfer'
import { useEditorController } from './hooks/useEditorController'
import styles from './TikTokTransfer.module.css'

export default function EditorApp() {
  const controller = useEditorController()
  return (
    <>
      <EditorWorkspace controller={controller} />
      <div className={`${styles.floating} tiktok-floating`}>
        <TikTokTransfer cards={controller.filmstrip} currentCardId={controller.editingId} />
      </div>
    </>
  )
}
