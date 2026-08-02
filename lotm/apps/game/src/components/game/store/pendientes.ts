// Carga diferida de recetas pendientes. Solo aplica en modo administrador y es
// deliberadamente silenciosa: es una herramienta auxiliar, no parte del juego.

import type { StoreApi } from 'zustand'
import type { JuegoState } from './tipos'
import { runtime } from './runtime'

type Set = StoreApi<JuegoState>['setState']

export function crearCargaPendientes(set: Set) {
  const cargarPendientes = async () => {
    if (!runtime.esAdminActual) return
    try {
      const res = await fetch('/api/recetas-pendientes')
      if (!res.ok) return
      const data = await res.json()
      set({ pendientes: data.pendientes ?? [] })
    } catch {
      // Silencioso: es una herramienta auxiliar, no afecta al juego normal.
    }
  }

  // El panel admin es costoso (recorre muchas recetas). Durante pruebas
  // rápidas esperamos a que haya una pausa, en lugar de competir con la
  // siguiente combinación por SQLite y por el hilo principal.
  const programarCargaPendientes = () => {
    if (!runtime.esAdminActual) return
    if (runtime.pendientesTimer) clearTimeout(runtime.pendientesTimer)
    runtime.pendientesTimer = setTimeout(() => {
      runtime.pendientesTimer = null
      void cargarPendientes()
    }, 750)
  }

  return { cargarPendientes, programarCargaPendientes }
}
