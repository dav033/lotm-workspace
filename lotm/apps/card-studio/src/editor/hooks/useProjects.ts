'use client'

import { useCallback, useEffect, useState } from 'react'

export type EditorProject = { id: string; name: string }

export function useProjects(projects: EditorProject[], maxOpen = 3) {
  const [openIds, setOpenIds] = useState<string[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    if (!projects.length) return
    setOpenIds((current) => {
      const alive = current.filter((id) => projects.some((project) => project.id === id))
      return alive.length ? alive : [projects[0].id]
    })
    setActiveId((current) => (
      current && projects.some((project) => project.id === current) ? current : projects[0].id
    ))
  }, [projects])

  const open = useCallback((id: string) => {
    setOpenIds((current) => current.includes(id) || current.length >= maxOpen ? current : [...current, id])
    setActiveId(id)
  }, [maxOpen])

  const close = useCallback((id: string) => {
    setOpenIds((current) => {
      const next = current.filter((openId) => openId !== id)
      if (id === activeId) setActiveId(next[0] ?? null)
      return next
    })
  }, [activeId])

  return { openIds, activeId, setActiveId, open, close }
}
