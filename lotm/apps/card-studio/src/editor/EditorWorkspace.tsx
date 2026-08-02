/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
'use client'

import { useEffect, useRef } from 'react'
import CardView from '../cards-ui/CardView'
import Panel from './components/Panel'
import Filmstrip from './components/Filmstrip'
import ProjectTabs from './components/ProjectTabs'
import ImageTray from './components/ImageTray'
import SectionField from './components/SectionField'

const CARD_W = 480
const CARD_H = 640
const CARD_MARGIN = 16
const MIN_FIT = 0.25

export default function EditorWorkspace({ controller }) {
  const canvasRef = useRef(null)
  const {
    ready, session, sessionError, saving, projects, sections, cards, images,
    openProjectIds, activeProjectId, editingId, editingIndex, state, accent,
    filmstrip, sectionCount, busy, videoError, seconds, setSeconds,
    setActiveProjectId, onOpenProject, onCloseProject, onCreateProject, onStep,
    onNewCard, onLoadCard, onRemoveFromBatch, onReorder, onUploadImage,
    onDropImages, onDropBackground, onDownload, onDownloadZip, onDownloadSection,
    onDownloadSectionVideo, onExportImagesVideo, onGenerateTierBatch, set,
  } = controller

  useEffect(() => {
    const stage = canvasRef.current
    if (!stage) return
    const fitToStage = () => {
      const { width, height } = stage.getBoundingClientRect()
      const scale = Math.min((width - CARD_MARGIN) / CARD_W, (height - CARD_MARGIN) / CARD_H)
      stage.style.setProperty('--fit', String(Math.max(MIN_FIT, scale)))
    }
    fitToStage()
    const observer = new ResizeObserver(fitToStage)
    observer.observe(stage)
    return () => observer.disconnect()
  }, [ready])

  if (!ready) return <div className="app-loading">Loading your cards…</div>

  return (
    <div className="app">
      <section className="stage">
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
        <div className="stage-top">
          <div className="stage-nav">
            <button className="nav" onClick={() => onStep(-1)} aria-label="Previous">‹</button>
            <span className="pos">{editingIndex >= 0 ? editingIndex + 1 : '–'} / {cards.length}</span>
            <button className="nav" onClick={() => onStep(1)} aria-label="Next">›</button>
          </div>
          <span
            className={'save-status ' + (sessionError ? 'error' : saving ? 'saving' : 'saved')}
            title={sessionError ?? undefined}
          >
            {sessionError ?? (saving ? 'Saving…' : 'All changes saved')}
          </span>
        </div>

        <SectionField
          section={cards.find((card) => card.id === editingId)?.part ?? null}
          sections={sections.filter((section) => section.universe.id === activeProjectId)}
          onMove={(target) => session.moveCards([editingId], target)}
        />

        <div className="stage-canvas" ref={canvasRef}>
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
          {cards.length === 0 ? (
            <div className="stage-empty">
              <p>La biblioteca del servidor esta vacia.</p>
              <button className="btn-new-card" onClick={onNewCard}>Crear la primera carta</button>
            </div>
          ) : (
            <CardView
              state={state}
              onUploadImage={onUploadImage}
              onDropImages={onDropImages}
              onDropBackground={onDropBackground}
            />
          )}
        </div>

        <div className="stage-dock">
          <div className="stage-dock-panel">
            <div className="stage-dock-handle">
              {filmstrip.length} cartas · {sectionCount} {sectionCount === 1 ? 'sección' : 'secciones'}
              {images.length ? ` · ${images.length} imágenes` : ''}
            </div>
            <div className="stage-dock-body">
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
            </div>
          </div>
        </div>
      </section>

      <Panel
        state={state}
        set={set}
        accent={accent}
        onUploadImage={onUploadImage}
        onDownload={onDownload}
        onGenerateTierBatch={onGenerateTierBatch}
      />
    </div>
  )
}
