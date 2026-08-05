'use client'

import EditorWorkspace from './EditorWorkspace'
import TikTokTransfer from './components/TikTokTransfer'
import { useEditorController } from './hooks/useEditorController'
import styles from './TikTokTransfer.module.css'

export default function EditorApp() {
  const controller = useEditorController()
  const images = controller.images.map((image) => ({ ...image, name: image.id }))
  return (
    <>
      <EditorWorkspace controller={controller} />
      <div className={`${styles.floating} tiktok-floating`}>
        <TikTokTransfer images={images} />
      </div>
    </>
  )
}
