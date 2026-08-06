/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
'use client'

import { useCallback, useRef, useState, type KeyboardEvent } from 'react'
import styles from '../TikTokTransfer.module.css'
import { readInspectorTab, saveInspectorTab, type InspectorTab } from '../session/viewStorage'
import Panel from './Panel'
import TikTokTransfer from './TikTokTransfer'

const TAB_ORDER: InspectorTab[] = ['properties', 'publish']

const TAB_LABELS: Record<InspectorTab, string> = {
  properties: 'Properties',
  publish: 'Publish',
}

export default function Inspector(props) {
  const { cards, currentCardId } = props
  const [activeTab, setActiveTab] = useState<InspectorTab>(() => readInspectorTab())
  const [tiktokConnected, setTiktokConnected] = useState(false)
  const tabRefs = useRef<Record<InspectorTab, HTMLButtonElement | null>>({
    properties: null,
    publish: null,
  })

  const activateTab = (tab: InspectorTab) => {
    setActiveTab(tab)
    saveInspectorTab(tab)
  }

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const currentIndex = TAB_ORDER.indexOf(activeTab)
    let nextIndex = currentIndex
    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % TAB_ORDER.length
    if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + TAB_ORDER.length) % TAB_ORDER.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = TAB_ORDER.length - 1
    if (nextIndex === currentIndex) return

    event.preventDefault()
    const nextTab = TAB_ORDER[nextIndex]
    activateTab(nextTab)
    tabRefs.current[nextTab]?.focus()
  }

  const handleConnectionChange = useCallback((connected: boolean) => {
    setTiktokConnected(connected)
  }, [])

  return (
    <aside className="panel inspector">
      <div className="inspector-tabs" role="tablist" aria-label="Editor inspector">
        {TAB_ORDER.map((tab) => {
          const selected = activeTab === tab
          return (
            <button
              key={tab}
              ref={(element) => { tabRefs.current[tab] = element }}
              id={`inspector-tab-${tab}`}
              className="inspector-tab"
              type="button"
              role="tab"
              aria-controls={`inspector-panel-${tab}`}
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => activateTab(tab)}
              onKeyDown={handleTabKeyDown}
            >
              {TAB_LABELS[tab]}
              {tab === 'publish' && tiktokConnected ? (
                <span className="inspector-tab-dot" aria-label="TikTok connected" />
              ) : null}
            </button>
          )
        })}
      </div>

      <div
        id="inspector-panel-properties"
        role="tabpanel"
        aria-labelledby="inspector-tab-properties"
        hidden={activeTab !== 'properties'}
      >
        <Panel {...props} embedded />
      </div>

      <div
        id="inspector-panel-publish"
        role="tabpanel"
        aria-labelledby="inspector-tab-publish"
        hidden={activeTab !== 'publish'}
      >
        <div className={styles.pane}>
          <TikTokTransfer
            cards={cards}
            currentCardId={currentCardId}
            onConnectionChange={handleConnectionChange}
          />
        </div>
      </div>
    </aside>
  )
}
