'use client'

import dynamic from 'next/dynamic'
import '@/cards-ui/styles/index.css'

// El editor usa APIs del navegador y solo tiene sentido en el cliente.
const BuilderApp = dynamic(() => import('@/editor/EditorApp'), {
  ssr: false,
  loading: () => <div className="app-loading">Loading your cards…</div>,
})

export default function CartasPage() {
  return (
    <div className="builder-root">
      <BuilderApp />
    </div>
  )
}
