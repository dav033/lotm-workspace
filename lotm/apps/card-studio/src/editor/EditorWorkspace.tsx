/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import CardView from '../cards-ui/CardView'
import BottomNav from './components/BottomNav'
import EditorTopBar from './components/EditorTopBar'
import Inspector from './components/Inspector'
import Filmstrip from './components/Filmstrip'
import ProjectTabs from './components/ProjectTabs'
import ImageTray from './components/ImageTray'
import SectionField from './components/SectionField'
import Sheet from './components/Sheet'
import {
  readDockOpen,
  readDockTab,
  saveDockOpen,
  saveDockTab,
} from './session/viewStorage'

const CARD_W = 480
const CARD_H = 640
const CARD_MARGIN = 16
const MIN_FIT = 0.2

function cssPixels(value) {
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export default function EditorWorkspace({ controller, cards: inspectorCards, currentCardId }) {
  const canvasRef = useRef(null)
  const [dockOpen, setDockOpen] = useState(() => readDockOpen())
  const [dockTab, setDockTab] = useState(() => readDockTab())
  const [mobileDestination, setMobileDestination] = useState(null)
  const {
    ready, session, sessionError, saving, projects, sections, cards, images,
    openProjectIds, activeProjectId, editingId, editingIndex, state, accent,
    filmstrip, sectionCount, busy, videoError, seconds, setSeconds,
    setActiveProjectId, onOpenProject, onCloseProject, onCreateProject, onStep,
    onNewCard, onLoadCard, onRemoveFromBatch, onReorder, onUploadImage,
    onDropImages, onDropBackground, onDownload, onDownloadZip, onDownloadSection,
    onDownloadSectionVideo, onExportImagesVideo, onGenerateTierBatch, set,
  } = controller

  const closeMobileSheet = useCallback(() => setMobileDestination(null), [])

  useEffect(() => {
    const stage = canvasRef.current
    if (!stage) return
    const fitToStage = () => {
      const stageShell = stage.parentElement
      const canvasRect = stage.getBoundingClientRect()
      const shellRect = stageShell?.getBoundingClientRect()
      const shellStyle = stageShell ? window.getComputedStyle(stageShell) : null
      const occupied = stageShell
        ? ['.stage-top', '.stage-section', '.stage-dock'].reduce((total, selector) => {
            const element = stageShell.querySelector(selector)
            if (!element) return total
            const rect = element.getBoundingClientRect()
            const style = window.getComputedStyle(element)
            return total + rect.height + cssPixels(style.marginTop) + cssPixels(style.marginBottom)
          }, cssPixels(shellStyle.paddingTop) + cssPixels(shellStyle.paddingBottom))
        : 0
      const width = canvasRect.width
      const height = shellRect && occupied > 0 ? Math.max(0, shellRect.height - occupied) : canvasRect.height
      const scale = Math.min((width - CARD_MARGIN) / CARD_W, (height - CARD_MARGIN) / CARD_H)
      stage.style.setProperty('--fit', String(Math.max(MIN_FIT, scale)))
    }
    fitToStage()
    const observer = new ResizeObserver(fitToStage)
    observer.observe(stage)
    return () => observer.disconnect()
  }, [ready])

  const renderFilmstrip = () => (
    <Filmstrip
      batch={filmstrip}
      editingId={editingId}
      accent={accent}
      busy={busy}
      onLoadCard={onLoadCard}
      onNewCard={onNewCard}
      onRemoveFromBatch={onRemoveFromBatch}
      onReorder={onReorder}
      onDownloadZip={onDownloadZip}
      onRenameSection={(partId, name) => session.renameSection(partId, { name })}
      onDownloadSection={onDownloadSection}
      onDownloadSectionVideo={onDownloadSectionVideo}
      videoError={videoError}
      seconds={seconds}
      onSeconds={setSeconds}
      onCardDuration={(id, value) => session.setDuration('card', id, value)}
    />
  )

  const renderImageTray = () => (
    <ImageTray
      images={images}
      busy={busy}
      seconds={seconds}
      onImport={(files) => session.importImages(activeProjectId, files)}
      onDelete={session.deleteImage}
      onReorder={(imageIds) => session.reorderImages(activeProjectId, imageIds)}
      onExportVideo={onExportImagesVideo}
      onImageDuration={(id, value) => session.setDuration('image', id, value)}
    />
  )

  const inspectorProps = {
    state,
    set,
    accent,
    onUploadImage,
    onDownload,
    onGenerateTierBatch,
    cards: inspectorCards,
    currentCardId,
  }

  const mobileTitle = {
    card: 'Carta',
    cards: 'Cartas',
    images: 'Imágenes',
    publish: 'Publicar',
  }[mobileDestination] ?? ''

  if (!ready) return <div className="app-loading">Loading your cards…</div>

  return (
    <div className="app">
      <div className="editor-main">
        <EditorTopBar
          projectName={projects.find((project) => project.id === activeProjectId)?.name}
          editingIndex={editingIndex}
          cardCount={cards.length}
          saving={saving}
          sessionError={sessionError}
          onStep={onStep}
          onOpenInspector={() => setMobileDestination('card')}
        />
      <main className="stage" id="main-content">
        <ProjectTabs
          projects={projects}
          openIds={openProjectIds}
          activeId={activeProjectId}
          busy={busy}
          onActivate={setActiveProjectId}
          onOpen={onOpenProject}
          onClose={onCloseProject}
          onCreate={onCreateProject}
        />

        <SectionField
          section={cards.find((card) => card.id === editingId)?.part ?? null}
          sections={sections.filter((section) => section.universe.id === activeProjectId)}
          onMove={(target) => session.moveCards([editingId], target)}
        />

        <div className="stage-canvas" ref={canvasRef}>
          {cards.length === 0 ? (
            <div className="stage-empty">
              <p>La biblioteca del servidor esta vacia.</p>
              <button className="btn-new-card" onClick={onNewCard}>Crear la primera carta</button>
            </div>
          ) : (
            <div className="stage-fit">
              {cards.length > 1 && (
                <>
                  <button
                    className="stage-arrow prev"
                    disabled={editingIndex <= 0}
                    aria-label="Carta anterior"
                    title="Carta anterior"
                    onClick={() => onStep(-1)}
                  >‹</button>
                  <button
                    className="stage-arrow next"
                    disabled={editingIndex < 0 || editingIndex >= cards.length - 1}
                    aria-label="Carta siguiente"
                    title="Carta siguiente"
                    onClick={() => onStep(1)}
                  >›</button>
                </>
              )}
              <CardView
                state={state}
                onUploadImage={onUploadImage}
                onDropImages={onDropImages}
                onDropBackground={onDropBackground}
              />
            </div>
          )}
        </div>

        <div className="stage-dock">
          <div className={'stage-dock-panel' + (dockOpen ? ' open' : '')}>
            <button
              className="stage-dock-handle"
              type="button"
              aria-expanded={dockOpen}
              onClick={() => {
                setDockOpen((value) => {
                  saveDockOpen(!value)
                  return !value
                })
              }}
            >
              {filmstrip.length} cartas · {sectionCount} {sectionCount === 1 ? 'sección' : 'secciones'}
              {images.length ? ` · ${images.length} imágenes` : ''}
            </button>
            <div className="stage-dock-tabs" role="tablist" aria-label="Editor dock">
              <button
                type="button"
                role="tab"
                aria-selected={dockTab === 'cards'}
                className={dockTab === 'cards' ? 'active' : ''}
                onClick={() => { setDockTab('cards'); saveDockTab('cards'); setDockOpen(true); saveDockOpen(true) }}
              >Cartas ({filmstrip.length})</button>
              <button
                type="button"
                role="tab"
                aria-selected={dockTab === 'images'}
                className={dockTab === 'images' ? 'active' : ''}
                onClick={() => { setDockTab('images'); saveDockTab('images'); setDockOpen(true); saveDockOpen(true) }}
              >Imágenes ({images.length})</button>
            </div>
            <div className="stage-dock-body">
              {dockTab === 'cards' ? renderFilmstrip() : renderImageTray()}
            </div>
          </div>
        </div>
      </main>
      </div>

      <Inspector {...inspectorProps} />

      <BottomNav active={mobileDestination} onSelect={setMobileDestination} />
      <Sheet open={mobileDestination !== null} title={mobileTitle} onClose={closeMobileSheet}>
        {mobileDestination === 'cards' ? renderFilmstrip() : null}
        {mobileDestination === 'images' ? renderImageTray() : null}
        {mobileDestination === 'card' || mobileDestination === 'publish' ? <Inspector {...inspectorProps} /> : null}
      </Sheet>
    </div>
  )
}
