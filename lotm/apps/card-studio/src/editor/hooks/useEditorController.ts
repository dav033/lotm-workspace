/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
'use client'

import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { accentForState } from '../../cards-ui/cardProps'
import { PATH_NAMES } from '../../domain/pathways'
import { fromBuilderCardState, slugify } from '../../domain/schema'
import { DEFAULT_STATE, NEW_CARD_SEEDS, VIDEO_FORMATS } from '../cardSeeds'
import { useImages } from './useImages'
import { useProjects } from './useProjects'
import { downloadVideo } from './useVideoExport'
import { useZipExport } from './useZipExport'
import { useEditorState } from '../state/editorState'
import { sameCardState, useCardSession } from '../session/useCardSession'
import { readEditingCardId, saveEditingCardId } from '../session/viewStorage'
import { imageToPng, fileSafe, labelFor } from '../utils'

export function useEditorController() {
  const session = useCardSession()
  const {
    cards: allCards, sections, projects, images: allImages,
    ready, error: sessionError, saving,
  } = session
  const projectTabs = useProjects(projects)
  const { openIds: openProjectIds, activeId: activeProjectId } = projectTabs
  const [editingId, setEditingId] = useState(null)
  const [editingSelectionRestored, setEditingSelectionRestored] = useState(false)
  const { state, setState } = useEditorState(DEFAULT_STATE)
  const exportZip = useZipExport()
  const [busy, setBusy] = useState(false)
  const [videoError, setVideoError] = useState(null)
  const [seconds, setSeconds] = useState(4)
  const stateRef = useRef(state)
  const editingIdRef = useRef(editingId)
  const pendingEditingId = useRef(null)
  stateRef.current = state
  editingIdRef.current = editingId

  useEffect(() => {
    setEditingId(readEditingCardId())
    setEditingSelectionRestored(true)
  }, [])

  useEffect(() => {
    if (!editingSelectionRestored) return
    saveEditingCardId(editingId)
  }, [editingId, editingSelectionRestored])

  const cards = allCards.filter((card) => card.universe.id === activeProjectId)
  const images = useImages(allImages, activeProjectId)

  // New cards must target active project/section. Without this, API fallback
  // sends them to Editor/Borradores, then active-project filter hides them.
  const targetForNewCard = () => {
    const anchor = cards.find((card) => card.id === editingIdRef.current) ?? cards[cards.length - 1]
    if (anchor) {
      return {
        universe: { name: anchor.universe.name },
        part: { name: anchor.part.name, number: anchor.part.number },
      }
    }
    const project = projects.find((item) => item.id === activeProjectId)
    return project
      ? { universe: { name: project.name }, part: { name: 'Borradores', number: 1 } }
      : undefined
  }

  const onOpenProject = (id) => {
    projectTabs.open(id)
    setEditingId(null)
  }

  const onCloseProject = (id) => {
    projectTabs.close(id)
    setEditingId(null)
  }

  const onCreateProject = async (name) => {
    const project = await session.createProject(name)
    if (project) onOpenProject(project.id)
  }

  const set = (patch) => {
    const next = { ...stateRef.current, ...patch }
    stateRef.current = next
    setState(next)
    if (editingIdRef.current) void session.updateCard(editingIdRef.current, next)
  }

  const onUploadImage = async (file, field = 'image') => {
    if (!file) return
    const url = await session.uploadImage(file)
    if (url) set({ [field]: url })
  }

  useEffect(() => {
    if (!ready) return
    if (editingId && cards.some((card) => card.id === editingId)) {
      if (pendingEditingId.current === editingId) pendingEditingId.current = null
      return
    }
    if (pendingEditingId.current === editingId) return
    const fallback = cards[0] ?? null
    setEditingId(fallback?.id ?? null)
    if (fallback) {
      stateRef.current = fallback.state
      setState(fallback.state)
    }
  }, [cards, editingId, ready, setState])

  useEffect(() => {
    if (!editingId || session.isPending(editingId)) return
    const active = cards.find((card) => card.id === editingId)
    if (!active || sameCardState(active.state, stateRef.current)) return
    stateRef.current = active.state
    setState(active.state)
  }, [cards, editingId, session, setState])

  const captureCard = async (cardState = stateRef.current) => {
    const response = await fetch('/api/cards/render', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ card: fromBuilderCardState(cardState) }),
    })
    if (!response.ok) throw new Error(`No se pudo renderizar la carta (HTTP ${response.status}).`)
    const bytes = new Uint8Array(await response.arrayBuffer())
    let binary = ''
    for (const byte of bytes) binary += String.fromCharCode(byte)
    return `data:image/png;base64,${btoa(binary)}`
  }

  const onNewCard = async () => {
    const fresh = {
      ...stateRef.current,
      name: '', image: null, coverImage1: null, coverImage2: null, fullCoverImage: null,
      tierText: '', tierFooterText: '', tierBackgroundImage: null,
      pathwayCardText: '', pathwayCardFooterText: '', pathwayCardBackgroundImage: null,
      tierExplanationText: '', tierExplanationBackgroundImage: null,
      generalExplanationTitle: '', generalExplanationText: '', generalExplanationBackgroundImage: null,
      simpleExplanationText: '',
      pathwayExplanationTitle: '', pathwayExplanationText: '', pathwayExplanationBackgroundImage: null,
      breakdownKicker: '', breakdownTitle: '', breakdownDoes: '', breakdownDoesNot: '',
      breakdownEdgeText: '', breakdownBackgroundImage: null,
      mapTitle: '', mapEntriesText: '', mapFooterText: '',
      mapTextStyles: { title: {}, label: {}, value: {}, footer: {} },
      mapBackgroundImage: null,
      ...(NEW_CARD_SEEDS[stateRef.current.type] ?? {}),
    }
    const id = await session.createCard(fresh, targetForNewCard())
    if (!id) return
    setEditingId(id)
    stateRef.current = fresh
    setState(fresh)
  }

  const onCreateCardPair = async () => {
    const current = stateRef.current
    if (current.type !== 'Character' && current.type !== 'Artifact') return
    if (current.pairId) return
    const result = await session.createCardPair(current, targetForNewCard(), editingIdRef.current)
    if (!result) return
    pendingEditingId.current = result.explanationId
    setEditingId(result.explanationId)
  }

  const onLoadCard = (id) => {
    const item = cards.find((card) => card.id === id)
    if (!item) return
    setEditingId(id)
    stateRef.current = item.state
    setState(item.state)
  }

  const editingIndex = cards.findIndex((card) => card.id === editingId)
  const onStep = (direction) => {
    if (!cards.length) return
    let index = editingIndex === -1 ? (direction > 0 ? 0 : cards.length - 1) : editingIndex + direction
    index = Math.max(0, Math.min(cards.length - 1, index))
    onLoadCard(cards[index].id)
  }

  const onRemoveFromBatch = (id) => void session.deleteCard(id)
  const onReorder = (fromId, toId) => {
    if (fromId !== toId) void session.reorder(fromId, toId)
  }

  const onDropImages = async (files) => {
    const dropped = [...files].filter((file) => file.type.startsWith('image/'))
    if (!dropped.length) return
    if (dropped.length === 1) return onUploadImage(dropped[0])
    if (busy) return
    setBusy(true)
    try {
      const target = targetForNewCard()
      const urls = (await Promise.all(dropped.map((file) => session.uploadImage(file)))).filter(Boolean)
      if (!urls.length) return
      set({ image: urls[0] })
      for (const image of urls.slice(1)) await session.createCard({ ...stateRef.current, image }, target)
    } finally {
      setBusy(false)
    }
  }

  const onDownload = async () => {
    const url = await captureCard()
    const anchor = document.createElement('a')
    anchor.download = `${fileSafe(labelFor(stateRef.current))}.png`
    anchor.href = url
    anchor.click()
  }

  const onDownloadZip = async (subset = null, zipName = 'lotm-cards') => {
    const chosen = Array.isArray(subset) ? subset : cards
    if (!chosen.length || busy) return
    setBusy(true)
    try {
      const partId = Array.isArray(subset) ? chosen[0].part.id : undefined
      await exportZip(partId, zipName, chosen[0]?.universe.id)
    } finally {
      setBusy(false)
    }
  }

  const onDownloadSection = (partId) => {
    const section = cards.filter((card) => card.part.id === partId)
    if (section.length) void onDownloadZip(section, slugify(section[0].part.name))
  }

  const onDownloadSectionVideo = async (partId, secondsPerCard) => {
    const chosen = cards.filter((card) => card.part.id === partId)
    if (!chosen.length || busy) return
    setBusy(true)
    setVideoError(null)
    const previousState = stateRef.current
    const previousEditingId = editingIdRef.current
    try {
      const form = new FormData()
      form.append('secondsPerCard', String(secondsPerCard))
      form.append('name', slugify(chosen[0].part.name))
      for (const item of chosen) {
        flushSync(() => { setState(item.state); setEditingId(item.id) })
        const data = await captureCard(item.state)
        form.append('frames', await (await fetch(data)).blob(), `${item.id}.png`)
        form.append('durations', String(item.durationSeconds ?? ''))
      }
      await downloadVideo(form, VIDEO_FORMATS)
    } catch {
      setVideoError('Sin conexion con el servidor.')
    } finally {
      flushSync(() => { setState(previousState); setEditingId(previousEditingId) })
      setBusy(false)
    }
  }

  const onExportImagesVideo = async () => {
    if (!images.length || busy) return
    setBusy(true)
    setVideoError(null)
    try {
      const project = projects.find((item) => item.id === activeProjectId)
      const form = new FormData()
      form.append('secondsPerCard', String(seconds))
      form.append('name', `${slugify(project?.name ?? 'proyecto')}-imagenes`)
      for (const image of images) {
        form.append('frames', await imageToPng(image.url), `${image.id}.png`)
        form.append('durations', String(image.durationSeconds ?? ''))
      }
      await downloadVideo(form, VIDEO_FORMATS)
    } catch (error) {
      setVideoError(error?.message ?? 'Sin conexion con el servidor.')
    } finally {
      setBusy(false)
    }
  }

  const onGenerateTierBatch = async () => {
    if (busy) return
    setBusy(true)
    try {
      const target = targetForNewCard()
      let first = null
      for (const path of PATH_NAMES) {
        const cardState = { ...stateRef.current, type: 'Tier', tierPath: path, tierText: '' }
        const id = await session.createCard(cardState, target)
        if (id && !first) first = { id, state: cardState }
      }
      if (first) {
        setEditingId(first.id)
        stateRef.current = first.state
        setState(first.state)
      }
    } finally {
      setBusy(false)
    }
  }

  const onDropBackground = (file) => {
    const field = stateRef.current.type === 'General Explanation'
      ? 'generalExplanationBackgroundImage'
      : stateRef.current.type === 'Pathway Explanation'
        ? 'pathwayExplanationBackgroundImage'
        : stateRef.current.type === 'Breakdown'
          ? 'breakdownBackgroundImage'
      : stateRef.current.type === 'Map'
        ? 'mapBackgroundImage'
        : stateRef.current.type === 'Fraud File'
          ? 'fraudBackgroundImage'
        : 'tarotMemberImage'
    void onUploadImage(file, field)
  }

  const filmstrip = cards.map((card) => {
    const cardState = card.id === editingId ? state : card.state
    return {
      id: card.id, position: card.position, label: labelFor(cardState), state: cardState,
      universe: card.universe, part: card.part, durationSeconds: card.durationSeconds ?? null,
    }
  })

  return {
    session, ready, sessionError, saving, projects, sections, cards, images,
    openProjectIds, activeProjectId, editingId, editingIndex, state, accent: accentForState(state),
    filmstrip, sectionCount: new Set(cards.map((card) => card.part.id)).size,
    busy, videoError, seconds, setSeconds, set, setActiveProjectId: projectTabs.setActiveId,
    onOpenProject, onCloseProject, onCreateProject, onStep, onNewCard, onCreateCardPair, onLoadCard,
    onRemoveFromBatch, onReorder, onUploadImage, onDropImages, onDropBackground,
    onDownload, onDownloadZip, onDownloadSection, onDownloadSectionVideo, onExportImagesVideo,
    onGenerateTierBatch,
  }
}
