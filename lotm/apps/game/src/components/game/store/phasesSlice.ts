// Avance de fase y su transicion cinematica.

import type { JuegoState, SliceDeJuego } from './tipos'
import { agregarAperturasBandeja } from './tray'
import { openingSlugsFromResponse } from './phases'
import { TUTORIAL_AVANCE_KEY, feedbackTactil } from './runtime'
import { crearCargaPendientes } from './pendientes'

type PhasesSlice = Pick<
  JuegoState,
  'avanzarFase' | 'cerrarTransicionFase' | 'cerrarTutorialAvance'
>

export const crearPhasesSlice: SliceDeJuego<PhasesSlice> = (set, get) => {
  const { programarCargaPendientes } = crearCargaPendientes(set)

  return {
    avanzarFase: async () => {
      const { estado, faseAvanzando, combinando, reiniciando } = get()
      if (!estado?.phase || !estado.nextPhase || faseAvanzando || combinando || reiniciando) return
      set({ faseAvanzando: true })
      try {
        const response = await fetch('/api/fases/avanzar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ expectedPhaseSlug: estado.phase.slug }),
        })
        const data = await response.json()
        if (!response.ok) {
          get().mostrarAviso(data?.error ?? 'Could not advance phase.', 'peligro')
          if (response.status === 409) await get().cargarEstado()
          return
        }

        await get().cargarEstado()
        const openingElementSlugs = openingSlugsFromResponse(data)
        const openingSet = new Set(openingElementSlugs)
        const openings = get().estado?.elementos.filter(
          (elemento) => elemento.kind === 'ELEMENT' && openingSet.has(elemento.slug),
        ) ?? []
        set((prev) => ({
          bandeja: agregarAperturasBandeja(prev.bandeja, openings),
          aperturasFase: openingElementSlugs,
          recientes: [...new Set([...prev.recientes, ...openingElementSlugs])].slice(-40),
          transicionFase: {
            phase: data.phase,
            celebrationMessage:
              typeof data.celebrationMessage === 'string' ? data.celebrationMessage : '',
            openingElementSlugs,
          },
        }))
        feedbackTactil([18, 35, 24, 35, 36])
        programarCargaPendientes()
        void get().refrescarPotencial()
      } catch {
        get().mostrarAviso('Could not advance phase. Try again.', 'peligro')
      } finally {
        set({ faseAvanzando: false })
      }
    },

    cerrarTransicionFase: () => set({ transicionFase: null }),

    cerrarTutorialAvance: () => {
      window.localStorage.setItem(TUTORIAL_AVANCE_KEY, '1')
      set({ tutorialAvance: false })
    },
  }
}
