'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { readActiveProjectId, readOpenProjectIds, saveViewSelection } from '../session/viewStorage'

export type EditorProject = { id: string; name: string; cardCount?: number }

function defaultProjectId(projects: EditorProject[]): string | null {
  return projects.find((project) => (project.cardCount ?? 0) > 0)?.id ?? projects[0]?.id ?? null
}

export function useProjects(projects: EditorProject[], maxOpen = 3) {
  const [openIds, setOpenIds] = useState<string[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [restored, setRestored] = useState(false)
  const manuallySelected = useRef(false)

  useEffect(() => {
    setOpenIds(readOpenProjectIds())
    setActiveId(readActiveProjectId())
    setRestored(true)
  }, [])

  useEffect(() => {
    if (!projects.length || !restored) return
    const hasCards = projects.some((project) => (project.cardCount ?? 0) > 0)
    const currentProject = projects.find((project) => project.id === activeId)
    const keepCurrent = manuallySelected.current
      ? Boolean(currentProject)
      : Boolean(currentProject && ((currentProject.cardCount ?? 0) > 0 || !hasCards))
    const nextActiveId = keepCurrent ? activeId : defaultProjectId(projects)

    setOpenIds((current) => {
      const alive = current.filter((id) => projects.some((project) => project.id === id))
      const withActive = nextActiveId && !alive.includes(nextActiveId) ? [nextActiveId, ...alive] : alive
      return withActive.slice(0, maxOpen)
    })
    setActiveId(nextActiveId)
  }, [activeId, maxOpen, projects, restored])

  useEffect(() => {
    if (!restored) return
    saveViewSelection(activeId, openIds)
  }, [activeId, openIds, restored])

  const activate = useCallback((id: string | null) => {
    manuallySelected.current = true
    setActiveId(id)
  }, [])

  const open = useCallback((id: string) => {
    setOpenIds((current) => current.includes(id) || current.length >= maxOpen ? current : [...current, id])
    activate(id)
  }, [activate, maxOpen])

  const close = useCallback((id: string) => {
    setOpenIds((current) => {
      const next = current.filter((openId) => openId !== id)
      if (id === activeId) activate(next[0] ?? null)
      return next
    })
  }, [activate, activeId])

  return { openIds, activeId, setActiveId: activate, open, close }
}
